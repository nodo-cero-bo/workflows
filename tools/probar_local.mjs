#!/usr/bin/env node
// Prueba los workflows en una n8n local de verdad.
//
// Importa todos los workflow.json del repo en una instancia propia, ejecuta los que tienen
// meta.probado = "ejecutado" y empiezan con Manual Trigger, y escribe el resultado en docs/PRUEBAS.md.
// Sale con código 1 si alguno no se pudo importar o si alguna ejecución no terminó bien.
//
// Uso:
//   node tools/probar_local.mjs                         todo el repo
//   node tools/probar_local.mjs <carpeta | workflow.json> ...
//   opciones: --salida <archivo.md> (por defecto docs/PRUEBAS.md), --limpio (borra la instancia antes),
//             --sin-informe (no escribe el .md)
// Variables:
//   N8N_INSTALACION  carpeta que tiene node_modules/n8n (por defecto, workflows/ después de «npm i»)
//   N8N_MODULES      o directamente la carpeta node_modules
//   N8N_CARPETA      datos de la instancia de pruebas (por defecto <tmp>/n8n_probar)
//   N8N_PUERTO       base de puertos (por defecto 5790; las ejecuciones usan N8N_PUERTO+2 para el runner)

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(AQUI, '..');
const IGNORAR = new Set(['node_modules', '.git', 'docs', 'tools', 'assets', '.github']);

// ---------------------------------------------------------------- argumentos
const args = process.argv.slice(2);
const opciones = { salida: path.join(REPO, 'docs', 'PRUEBAS.md'), limpio: false, informe: true };
const rutas = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--salida') opciones.salida = path.resolve(args[++i]);
  else if (a === '--limpio') opciones.limpio = true;
  else if (a === '--sin-informe') opciones.informe = false;
  else if (a === '-h' || a === '--help' || a === '--ayuda') {
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 18).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
    process.exit(0);
  } else rutas.push(path.resolve(a));
}
if (!rutas.length) rutas.push(REPO);

// ---------------------------------------------------------------- n8n
function buscarInstalacion() {
  const candidatos = [];
  if (process.env.N8N_INSTALACION) candidatos.push(path.join(process.env.N8N_INSTALACION, 'node_modules'));
  if (process.env.N8N_MODULES) candidatos.push(process.env.N8N_MODULES);
  candidatos.push(path.join(REPO, 'node_modules'));
  for (const c of candidatos) {
    const bin = path.join(path.resolve(c), 'n8n', 'bin', 'n8n');
    if (fs.existsSync(bin)) return { bin, version: JSON.parse(fs.readFileSync(path.join(path.resolve(c), 'n8n', 'package.json'), 'utf8')).version };
  }
  return null;
}
const INSTALADO = buscarInstalacion();
if (!INSTALADO) {
  console.error('No encuentro n8n. Instalalo con «npm i» en workflows/ o definí N8N_INSTALACION (carpeta con node_modules/n8n).');
  process.exit(2);
}

const CARPETA = path.resolve(process.env.N8N_CARPETA || path.join(os.tmpdir(), 'n8n_probar'));
const PUERTO = Number(process.env.N8N_PUERTO || 5790);
if (opciones.limpio) fs.rmSync(CARPETA, { recursive: true, force: true });
fs.mkdirSync(CARPETA, { recursive: true });

// El mismo entorno que tools/n8n_local.sh: parecido a n8n Cloud, sin telemetría y sin pisar otras instancias.
const ENV = {
  ...process.env,
  N8N_USER_FOLDER: CARPETA,
  N8N_PORT: String(PUERTO),
  N8N_LISTEN_ADDRESS: '127.0.0.1',
  N8N_RUNNERS_MODE: 'internal',
  N8N_RUNNERS_BROKER_PORT: String(PUERTO + 2),
  N8N_PYTHON_ENABLED: 'false',
  NODE_FUNCTION_ALLOW_BUILTIN: process.env.NODE_FUNCTION_ALLOW_BUILTIN || 'crypto',
  NODE_FUNCTION_ALLOW_EXTERNAL: process.env.NODE_FUNCTION_ALLOW_EXTERNAL || 'moment',
  N8N_DIAGNOSTICS_ENABLED: 'false',
  N8N_VERSION_NOTIFICATIONS_ENABLED: 'false',
  N8N_TEMPLATES_ENABLED: 'false',
  N8N_PERSONALIZATION_ENABLED: 'false',
  GENERIC_TIMEZONE: process.env.GENERIC_TIMEZONE || 'America/La_Paz',
  TZ: process.env.TZ || 'America/La_Paz',
  N8N_LOG_LEVEL: 'info',
  N8N_LOG_OUTPUT: 'console',
  EXECUTIONS_MODE: 'regular',
  NODE_NO_WARNINGS: '1',
};

function n8n(argumentos, timeout = 300000) {
  const r = spawnSync(process.execPath, [INSTALADO.bin, ...argumentos], { env: ENV, encoding: 'utf8', timeout, maxBuffer: 256 * 1024 * 1024, windowsHide: true });
  return { codigo: r.status, salida: `${r.stdout ?? ''}${r.stderr ?? ''}`, vencido: r.error?.code === 'ETIMEDOUT' };
}

// ---------------------------------------------------------------- workflows
function buscar(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!IGNORAR.has(e.name)) buscar(path.join(dir, e.name), out);
    } else if (e.name === 'workflow.json') out.push(path.join(dir, e.name));
  }
}
const archivos = [];
for (const r of rutas) {
  if (!fs.existsSync(r)) {
    console.error(`No existe ${r}`);
    process.exit(2);
  }
  if (fs.statSync(r).isFile()) archivos.push(r);
  else buscar(r, archivos);
}
archivos.sort();

// Id estable, igual que tools/n8n_local.sh: «nc» + 14 caracteres del sha1 del nombre de la carpeta.
const idDe = (archivo) => 'nc' + crypto.createHash('sha1').update(path.basename(path.dirname(archivo))).digest('hex').slice(0, 14);
const relativo = (f) => {
  const r = path.relative(REPO, f).split(path.sep).join('/');
  return r.startsWith('..') ? f.split(path.sep).join('/') : r;
};

const casos = archivos.map((archivo) => {
  const c = { archivo, carpeta: path.dirname(relativo(archivo)), id: idDe(archivo), nombre: null, probado: null, manual: false, importado: false, ejecucion: null, nota: '' };
  try {
    const wf = JSON.parse(fs.readFileSync(archivo, 'utf8').replace(/^﻿/, ''));
    c.nombre = wf.name;
    c.manual = (wf.nodes ?? []).some((n) => n?.type === 'n8n-nodes-base.manualTrigger' && !n.disabled);
    c.wf = wf;
  } catch (e) {
    c.nota = `no es un JSON válido: ${e.message}`;
  }
  try {
    c.probado = JSON.parse(fs.readFileSync(path.join(path.dirname(archivo), 'meta.json'), 'utf8').replace(/^﻿/, '')).probado ?? null;
  } catch {
    c.probado = null;
  }
  return c;
});

// ---------------------------------------------------------------- importar (una sola vez para todos)
const dirImportar = path.join(CARPETA, 'probar_importar');
fs.rmSync(dirImportar, { recursive: true, force: true });
fs.mkdirSync(dirImportar, { recursive: true });
const ids = new Set();
for (const c of casos) {
  if (!c.wf) continue;
  if (ids.has(c.id)) {
    c.nota = 'otra carpeta con el mismo nombre ya usa este id';
    continue;
  }
  ids.add(c.id);
  const copia = { ...c.wf, id: c.id };
  delete copia.active;
  fs.writeFileSync(path.join(dirImportar, `${c.id}.json`), JSON.stringify(copia));
}

console.log(`n8n ${INSTALADO.version} · instancia ${CARPETA} · runner en el puerto ${PUERTO + 2}`);
console.log(`Importando ${ids.size} workflow${ids.size === 1 ? '' : 's'}...`);
const imp = ids.size ? n8n(['import:workflow', '--separate', `--input=${dirImportar}`]) : { codigo: 0, salida: '' };
const importoBien = (r) => r.codigo === 0 && !/error occurred|is invalid/i.test(r.salida);
if (importoBien(imp)) {
  for (const c of casos) if (c.wf && ids.has(c.id) && !c.nota) c.importado = true;
} else {
  // Si falla en bloque, se importa de a uno para saber cuál es.
  for (const c of casos) {
    if (!c.wf || c.nota) continue;
    const r = n8n(['import:workflow', `--input=${path.join(dirImportar, `${c.id}.json`)}`]);
    c.importado = importoBien(r);
    if (!c.importado) c.nota = `no se pudo importar: ${ultimaLinea(r.salida.replace(/^.*(?:license SDK|error occurred).*$/gim, ''))}`;
  }
}

function ultimaLinea(t) {
  return String(t).split('\n').map((l) => l.trim()).filter((l) => l && !/migration/i.test(l)).slice(-1)[0] ?? '';
}

// ---------------------------------------------------------------- ejecutar
function leerEjecucion(t) {
  const i = t.search(/^\{/m);
  if (i < 0) return null;
  try {
    return JSON.parse(t.slice(i));
  } catch {
    const k = t.lastIndexOf('\n}');
    try {
      return JSON.parse(t.slice(i, k + 2));
    } catch {
      return null;
    }
  }
}

const dirEjecuciones = path.join(CARPETA, 'ejecuciones');
fs.mkdirSync(dirEjecuciones, { recursive: true });
for (const c of casos) {
  if (!c.importado || c.probado !== 'ejecutado') continue;
  if (!c.manual) {
    c.nota = 'no empieza con Manual Trigger: se prueba con el servidor (tools/n8n_local.sh publicar)';
    continue;
  }
  process.stdout.write(`Ejecutando ${c.carpeta} ... `);
  const t0 = Date.now();
  const r = n8n(['execute', `--id=${c.id}`, '--rawOutput'], 180000);
  const seg = (Date.now() - t0) / 1000;
  fs.writeFileSync(path.join(dirEjecuciones, `${c.id}.txt`), r.salida);
  const j = leerEjecucion(r.salida);
  if (j) fs.writeFileSync(path.join(dirEjecuciones, `${c.id}.json`), JSON.stringify(j, null, 2));
  const rd = j?.data?.resultData?.runData ?? {};
  const nodos = Object.keys(rd);
  const ultimo = j?.data?.resultData?.lastNodeExecuted ?? nodos[nodos.length - 1] ?? null;
  const items = ultimo ? (rd[ultimo]?.at(-1)?.data?.main ?? []).flat().filter(Boolean) : [];
  const err = j?.data?.resultData?.error;
  const errNodo = Object.entries(rd).find(([, corridas]) => corridas.some((x) => x.error));
  c.ejecucion = {
    estado: r.vencido ? 'tiempo agotado' : j?.status ?? 'sin salida',
    segundos: seg,
    nodos: nodos.length,
    ultimo,
    items: items.length,
    muestra: items[0]?.json ?? null,
    error: err ? `${err.node?.name ? `${err.node.name}: ` : ''}${err.message}` : errNodo ? `${errNodo[0]}: ${errNodo[1].find((x) => x.error).error.message}` : j ? null : ultimaLinea(r.salida),
  };
  console.log(`${c.ejecucion.estado} (${seg.toFixed(0)} s)`);
}

// ---------------------------------------------------------------- informe
const fallas = casos.filter((c) => (c.wf && !c.importado) || (c.ejecucion && c.ejecucion.estado !== 'success'));
const ejecutados = casos.filter((c) => c.ejecucion);
const fecha = new Intl.DateTimeFormat('es-BO', { timeZone: 'America/La_Paz', dateStyle: 'long', timeStyle: 'short', hourCycle: 'h23' }).format(new Date());

function recortar(obj, max = 600) {
  const s = JSON.stringify(obj, null, 2) ?? '';
  return s.length > max ? s.slice(0, max) + '\n…' : s;
}

const md = [];
md.push('# Pruebas en una n8n local');
md.push('');
md.push(`Última corrida: ${fecha} (hora de Bolivia) · n8n ${INSTALADO.version} · Node ${process.version} · ${os.platform()}`);
md.push('');
md.push('Cómo se hizo: `npm run probar` (`tools/probar_local.mjs`) importa cada `workflow.json` en una n8n local nueva, sin credenciales, y ejecuta por CLI (`n8n execute`) los que tienen `"probado": "ejecutado"` en su `meta.json` y empiezan con Manual Trigger. Los `"auditado"` se importan y pasan el auditor, pero necesitan cuentas (Gemini, Supabase, Clerk, GitHub) para correr: se prueban en tu n8n después de cargar las credenciales.');
md.push('');
md.push(`Resultado: ${casos.length} workflow${casos.length === 1 ? '' : 's'}, ${casos.filter((c) => c.importado).length} importado${casos.filter((c) => c.importado).length === 1 ? '' : 's'}, ${ejecutados.length} ejecutado${ejecutados.length === 1 ? '' : 's'}, ${fallas.length} con problemas.`);
md.push('');
if (!casos.length) md.push('Todavía no hay ningún `workflow.json` para probar.', '');
if (casos.length) {
  md.push('| workflow | meta.probado | importa | ejecución | tiempo | resultado |');
  md.push('|---|---|---|---|---|---|');
  for (const c of casos) {
    const e = c.ejecucion;
    const res = e ? (e.estado === 'success' ? `${e.nodos} nodos, «${e.ultimo}» devolvió ${e.items} ítem${e.items === 1 ? '' : 's'}` : e.error ?? e.estado) : c.nota || (c.probado === 'auditado' ? 'necesita credenciales' : '');
    md.push(`| \`${c.carpeta}\` | ${c.probado ?? 'sin meta.json'} | ${c.importado ? 'sí' : 'no'} | ${e ? (e.estado === 'success' ? 'success' : `**${e.estado}**`) : '—'} | ${e ? `${e.segundos.toFixed(0)} s` : '—'} | ${String(res).replace(/\|/g, '\\|').replace(/\n/g, ' ')} |`);
  }
  md.push('');
}
if (ejecutados.length) {
  md.push('## Salida de cada ejecución');
  md.push('');
  md.push('El primer ítem que devolvió el último nodo (recortado).');
  md.push('');
  for (const c of ejecutados) {
    md.push(`### ${c.nombre ?? c.carpeta}`);
    md.push('');
    md.push(`\`${c.carpeta}\` · ${c.ejecucion.estado} · último nodo: «${c.ejecucion.ultimo ?? '—'}»`);
    md.push('');
    if (c.ejecucion.error) md.push(`Error: ${c.ejecucion.error}`, '');
    if (c.ejecucion.muestra) md.push('```json', recortar(c.ejecucion.muestra), '```', '');
  }
}
md.push('## Volver a correrlas');
md.push('');
md.push('```bash');
md.push('cd workflows');
md.push('npm i            # n8n 2.48.7, una vez');
md.push('npm run probar   # o: N8N_INSTALACION=<carpeta con node_modules/n8n> node tools/probar_local.mjs');
md.push('```');
md.push('');
md.push('Usa su propia carpeta de datos (`N8N_CARPETA`, por defecto `<tmp>/n8n_probar`) y el puerto `N8N_PUERTO+2` (por defecto 5792) para el task runner, así que puede correr al mismo tiempo que otras instancias de `tools/n8n_local.sh`.');
md.push('');

if (opciones.informe) {
  fs.mkdirSync(path.dirname(opciones.salida), { recursive: true });
  fs.writeFileSync(opciones.salida, md.join('\n'));
  console.log(`Informe: ${opciones.salida}`);
}
console.log(!casos.length ? 'No encontré ningún workflow.json.' : fallas.length ? `FALLAS: ${fallas.length}` : 'APROBADO');
for (const c of fallas) console.log(`  ${c.carpeta}: ${c.ejecucion?.error ?? c.nota ?? 'no se importó'}`);
process.exit(fallas.length || !casos.length ? 1 : 0);
