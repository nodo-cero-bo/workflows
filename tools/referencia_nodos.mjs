#!/usr/bin/env node
// Genera docs/REFERENCIA_NODOS.md a partir del código de n8n instalado (no de la memoria).
// Uso: N8N_MODULES=<carpeta node_modules con n8n> node tools/referencia_nodos.mjs [--salida docs/REFERENCIA_NODOS.md]
//
// Para cada tipo de nodo: nombre exacto, typeVersion más alta, versiones aceptadas, credenciales,
// entradas y salidas, y los parámetros de la versión más alta (con sus opciones y de qué dependen).
// Las versiones se cruzan con las clases de nodo cargadas con Node (description.version,
// defaultVersion y nodeVersions de los VersionedNodeType).

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { cargarTipos, encontrarModulos } from './lib/n8n_tipos.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const salida = args.includes('--salida') ? path.resolve(args[args.indexOf('--salida') + 1]) : path.resolve(aqui, '..', 'docs', 'REFERENCIA_NODOS.md');
const anexo = path.resolve(aqui, 'referencia_anexo.md');

const BASE = 'n8n-nodes-base';
const LC = '@n8n/n8n-nodes-langchain';
const LISTA = [
  ['Disparadores', [`${BASE}.manualTrigger`, `${BASE}.webhook`, `${BASE}.formTrigger`, `${BASE}.scheduleTrigger`, `${LC}.chatTrigger`]],
  ['Datos y lógica', [`${BASE}.set`, `${BASE}.code`, `${BASE}.if`, `${BASE}.switch`, `${BASE}.filter`, `${BASE}.merge`, `${BASE}.aggregate`, `${BASE}.splitOut`, `${BASE}.noOp`, `${BASE}.stickyNote`]],
  ['Respuestas y formularios', [`${BASE}.respondToWebhook`, `${BASE}.form`]],
  ['HTTP y seguridad', [`${BASE}.httpRequest`, `${BASE}.httpRequestTool`, `${LC}.toolHttpRequest`, `${BASE}.jwt`, `${BASE}.crypto`]],
  ['Supabase y Postgres', [`${BASE}.supabase`, `${BASE}.supabaseTool`, `${BASE}.postgres`]],
  ['Servicios', [`${BASE}.github`, `${BASE}.gmail`, `${BASE}.telegram`]],
  ['IA: agente y cadenas', [`${LC}.agent`, `${LC}.chainLlm`, `${LC}.textClassifier`, `${LC}.informationExtractor`, `${LC}.outputParserStructured`]],
  ['IA: modelos y embeddings', [`${LC}.lmChatGoogleGemini`, `${LC}.lmChatOpenAi`, `${LC}.embeddingsGoogleGemini`, `${LC}.embeddingsOpenAi`]],
  ['IA: memoria, documentos y vectores', [`${LC}.memoryBufferWindow`, `${LC}.memoryPostgresChat`, `${LC}.vectorStoreSupabase`, `${LC}.documentDefaultDataLoader`, `${LC}.textSplitterRecursiveCharacterTextSplitter`]],
];

const modulos = encontrarModulos();
const T = await cargarTipos(modulos);

// Versiones según las clases de nodo (código ejecutable), para cruzar con los tipos.
function versionesDeClase(nombre) {
  const [pkg, corto] = nombre.startsWith(LC) ? [LC, nombre.slice(LC.length + 1)] : [BASE, nombre.slice(BASE.length + 1)];
  const esTool = corto.endsWith('Tool');
  const dir = T.paquetes[pkg].dir;
  const known = JSON.parse(fs.readFileSync(path.join(dir, 'dist', 'known', 'nodes.json'), 'utf8'));
  let clave = corto;
  if (!known[clave] && esTool) clave = corto.slice(0, -4);
  const k = known[clave];
  if (!k) return { error: 'no está en known/nodes.json' };
  try {
    const req = createRequire(path.join(dir, 'package.json'));
    const mod = req(path.join(dir, k.sourcePath));
    const Clase = mod[k.className];
    const inst = new Clase();
    if (inst.nodeVersions) {
      return {
        versionada: true,
        defaultVersion: inst.description.defaultVersion,
        versiones: Object.keys(inst.nodeVersions).map(Number).sort((a, b) => a - b),
        derivadaDe: clave !== corto ? clave : null,
      };
    }
    const v = inst.description.version;
    return { versionada: false, versiones: (Array.isArray(v) ? v : [v]).sort((a, b) => a - b), derivadaDe: clave !== corto ? clave : null };
  } catch (e) {
    return { error: `no se pudo cargar la clase (${e.message.split('\n')[0]})` };
  }
}

const cod = (v) => '`' + String(v).replace(/`/g, "'").replace(/\|/g, '\\|') + '`';
// Los textos por defecto de n8n (en inglés) a veces traen emojis o signos de exclamación:
// en esta referencia se describen en vez de copiarse.
function valor(v) {
  if (v === undefined) return '—';
  if (typeof v === 'string') {
    if (/^\s*<!--/.test(v)) return '(un comentario HTML de ejemplo)';
    if (/\p{Extended_Pictographic}/u.test(v) || (/[\u00A1!]/.test(v) && !v.startsWith('='))) return '(un texto de ejemplo de n8n, en inglés)';
    const t = v.replace(/\s+/g, ' ');
    return t.length > 60 ? cod(t.slice(0, 57) + '...') : cod(t === '' ? '""' : t);
  }
  const s = JSON.stringify(v);
  return cod(s.length > 70 ? s.slice(0, 67) + '...' : s);
}

function condicion(c) {
  if (c && typeof c === 'object' && c._cnd) {
    const [op, val] = Object.entries(c._cnd)[0];
    const sim = { gte: '≥', lte: '≤', gt: '>', lt: '<', eq: '=', not: '≠' }[op];
    return sim ? `${sim}${JSON.stringify(val)}` : `${op} ${JSON.stringify(val)}`;
  }
  return JSON.stringify(c);
}

function mostrarSi(dop) {
  if (!dop) return '';
  const partes = [];
  for (const [k, vals] of Object.entries(dop.show ?? {})) partes.push(`${k}=${(vals ?? []).map(condicion).join('|')}`);
  for (const [k, vals] of Object.entries(dop.hide ?? {})) partes.push(`${k}≠${(vals ?? []).map(condicion).join('|')}`);
  return partes.join('; ');
}

function opciones(p) {
  if (!Array.isArray(p.options) || !['options', 'multiOptions'].includes(p.type)) {
    if (p.typeOptions?.loadOptionsMethod || p.typeOptions?.loadOptions) return 'opciones dinámicas (se cargan desde la cuenta)';
    return '';
  }
  const vals = p.options.map((o) => o.value);
  const max = 14;
  const txt = vals.slice(0, max).map(cod).join(' \\| ');
  return vals.length > max ? `${txt} (+${vals.length - max})` : txt;
}

function lineaProp(p, nivel) {
  const sangria = '  '.repeat(nivel);
  const bits = [`${sangria}- ${cod(p.name)} · ${p.type}`];
  if (!['notice', 'callout', 'fixedCollection', 'collection'].includes(p.type) && p.default !== undefined) bits.push(`por defecto ${valor(p.default)}`);
  if (p.required) bits.push('requerido');
  if (p.noDataExpression) bits.push('sin expresiones');
  const op = opciones(p);
  if (op) bits.push(`opciones: ${op}`);
  if (p.type === 'resourceLocator' && p.modes) bits.push(`modos: ${p.modes.map((m) => cod(m.name)).join(' \\| ')}`);
  if (p.typeOptions?.multipleValues) bits.push('varios valores');
  const ms = mostrarSi(p.displayOptions);
  if (ms) bits.push(`se muestra si ${ms}`);
  return bits.join(' · ');
}

function listarProps(props, nivel, out, profundidad = 3) {
  for (const p of props) {
    if (p.type === 'notice' || p.type === 'callout') continue;
    out.push(lineaProp(p, nivel));
    if (nivel + 1 >= profundidad) continue;
    if (p.type === 'collection' && Array.isArray(p.options)) {
      listarProps(p.options, nivel + 1, out, profundidad);
    } else if (p.type === 'fixedCollection' && Array.isArray(p.options)) {
      for (const g of p.options) {
        out.push(`${'  '.repeat(nivel + 1)}- grupo ${cod(g.name)}${p.typeOptions?.multipleValues ? ' (lista)' : ''}:`);
        listarProps(g.values ?? [], nivel + 2, out, profundidad + 1);
      }
    }
  }
}

function conexiones(io) {
  if (typeof io === 'string') return 'dinámicas: dependen de los parámetros (mirá «Forma de las conexiones»)';
  if (!Array.isArray(io) || io.length === 0) return 'ninguna';
  return io.map((x) => (typeof x === 'string' ? x : `${x.type}${x.required ? ' (requerida)' : ''}${x.maxConnections ? ` (máx. ${x.maxConnections})` : ''}${x.displayName ? ` «${x.displayName}»` : ''}`)).join(', ');
}

const out = [];
out.push('# Referencia de nodos de n8n 2.48.7');
out.push('');
out.push(`Sacada del paquete instalado (n8n ${T.versionN8n}, n8n-nodes-base ${T.paquetes[BASE].version}, @n8n/n8n-nodes-langchain ${T.paquetes[LC].version}), no de la memoria. La regenerás con \`npm run referencia\` dentro de \`workflows/\` (con n8n instalado ahí o con \`N8N_MODULES\` apuntando a otra instalación).`);
out.push('');
out.push('Cómo leerla: el tipo va tal cual en `"type"` del nodo; la versión más alta va en `"typeVersion"`. Los parámetros son los de esa versión: nombre exacto, tipo, valor por defecto, opciones válidas y «se muestra si», que es la condición (displayOptions) para que el parámetro exista en el editor. Si un parámetro no se muestra con los valores que pusiste, n8n lo ignora. `@version` es la typeVersion del nodo. Un valor que empieza con `=` es una expresión (por ejemplo `={{ $json.campo }}`).');
out.push('');

// Índice
out.push('## Índice');
out.push('');
out.push('| tipo | typeVersion más alta | versiones aceptadas | credenciales |');
out.push('|---|---|---|---|');
const fichas = [];
for (const [, tipos] of LISTA) {
  for (const nombre of tipos) {
    const t = T.tipo(nombre);
    if (!t) {
      out.push(`| ${cod(nombre)} | no existe en esta versión | — | — |`);
      continue;
    }
    const d = t.descripcion(t.maxima);
    let creds = (d.credentials ?? []).map((c) => cod(c.name)).join(', ') || '—';
    if (d.properties.some((p) => p.name === 'genericAuthType')) creds += ' y cualquiera elegida con `authentication`';
    out.push(`| ${cod(nombre)} | **${t.maxima}** | ${t.versiones.join(', ')} | ${creds} |`);
    fichas.push([nombre, t, d]);
  }
}
out.push('');

// Anexo escrito a mano (ejemplos verificados, conexiones de IA, Code node).
if (fs.existsSync(anexo)) {
  out.push(fs.readFileSync(anexo, 'utf8').trim());
  out.push('');
}

out.push('## Ficha de cada nodo');
out.push('');
const diferencias = [];
for (const [grupo, tipos] of LISTA) {
  out.push(`### ${grupo}`);
  out.push('');
  for (const nombre of tipos) {
    const f = fichas.find((x) => x[0] === nombre);
    if (!f) {
      out.push(`#### ${cod(nombre)}`);
      out.push('');
      out.push('No existe en n8n 2.48.7.');
      out.push('');
      continue;
    }
    const [, t, d] = f;
    const clase = versionesDeClase(nombre);
    out.push(`#### ${cod(nombre)} · ${d.displayName}`);
    out.push('');
    out.push(`- typeVersion más alta: **${t.maxima}** · versión por defecto al crear el nodo: ${t.defaultVersion}`);
    out.push(`- versiones aceptadas: ${t.versiones.join(', ')}`);
    if (clase.error) {
      out.push(`- clase: ${clase.error}`);
    } else {
      const iguales = JSON.stringify(clase.versiones) === JSON.stringify(t.versiones);
      if (!iguales) diferencias.push(`${nombre}: tipos ${t.versiones.join(',')} / clase ${clase.versiones.join(',')}`);
      out.push(`- clase: ${clase.versionada ? `VersionedNodeType (nodeVersions ${clase.versiones.join(', ')}, defaultVersion ${clase.defaultVersion})` : `INodeType (description.version ${clase.versiones.join(', ')})`}${clase.derivadaDe ? `; n8n la genera desde ${cod(clase.derivadaDe)} al cargar (usableAsTool)` : ''}${iguales ? '' : ' · ojo: no coincide con los tipos'}`);
    }
    const creds = d.credentials ?? [];
    out.push(`- credenciales: ${creds.length ? creds.map((c) => `${cod(c.name)}${c.required ? ' (requerida)' : ''}${c.displayOptions ? ` si ${mostrarSi(c.displayOptions)}` : ''}`).join('; ') : 'ninguna'}`);
    for (const c of creds) {
      const ct = T.credenciales.get(c.name);
      if (ct) out.push(`  - ${cod(c.name)} se llama «${ct.displayName}» en el editor`);
    }
    if (d.properties.some((p) => p.name === 'genericAuthType')) {
      out.push('  - además, cualquier credencial elegida con `authentication`: `predefinedCredentialType` + `nodeCredentialType` (por ejemplo `githubApi`) o `genericCredentialType` + `genericAuthType` (por ejemplo `httpHeaderAuth`)');
    }
    out.push(`- entradas: ${conexiones(d.inputs)}`);
    out.push(`- salidas: ${conexiones(d.outputs)}${Array.isArray(d.outputNames) ? ` (nombres: ${d.outputNames.join(', ')})` : ''}`);
    if (d.webhooks?.length) out.push(`- webhooks: ${d.webhooks.map((w) => `${w.name} ${typeof w.httpMethod === 'string' ? w.httpMethod : ''}`.trim()).join(', ')}`);
    out.push('');
    out.push(`Parámetros (typeVersion ${t.maxima}):`);
    out.push('');
    const lineas = [];
    const grande = d.properties.length > 70;
    listarProps(d.properties, 0, lineas, grande ? 2 : 3);
    out.push(...lineas);
    out.push('');
  }
}

if (diferencias.length) {
  out.push('## Diferencias entre tipos y clases');
  out.push('');
  out.push('Las versiones que valen para el JSON son las de los tipos (las que ofrece el editor y las que acepta el auditor). Algunas clases cargan además versiones viejas u ocultas: no las uses.');
  out.push('');
  for (const x of diferencias) out.push(`- ${x}`);
  out.push('');
}

fs.mkdirSync(path.dirname(salida), { recursive: true });
fs.writeFileSync(salida, out.join('\n') + '\n');
console.log(`Escribí ${salida} (${out.length} líneas, ${fichas.length} tipos).`);
if (diferencias.length) console.log('Diferencias tipos/clases:', diferencias);
