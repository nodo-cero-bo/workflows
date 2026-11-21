#!/usr/bin/env node
// Auditor de los workflows de Nodo Cero.
//
// Revisa cada workflows/**/workflow.json contra los paquetes de n8n instalados (tipos de nodo, typeVersion,
// parámetros, credenciales, conexiones) y contra las reglas de la especificación (notas, canvas, textos,
// claves, meta.json y README). Sale con código 1 si encuentra algún error.
//
// Uso:
//   node tools/auditar.mjs                      audita todo el repo
//   node tools/auditar.mjs <carpeta | workflow.json> ...
//   opciones: --estricto (los avisos también cuentan como falla), --sin-avisos (no los muestra),
//             --json <archivo> (guarda el resultado completo)
// Los paquetes de n8n se buscan en N8N_MODULES (carpeta node_modules) o en workflows/node_modules.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { cargarTipos, cargarN8nWorkflow, encontrarModulos } from './lib/n8n_tipos.mjs';
import { crearValidador } from './lib/validar_nodos.mjs';
import { revisarProsa, revisarCodigo, prosaDeMarkdown, codigoDeMarkdown, buscarSecretos, buscarCorreos, buscarTelefonos, buscarN8nMalEscrito, normalizar } from './lib/reglas_texto.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(AQUI, '..');

// ---------------------------------------------------------------- configuración
const ORG = process.env.NODO_CERO_ORG || leerConfig()?.org || 'nodo-cero-bo';
const RAMA = leerConfig()?.rama || 'main';
function leerConfig() {
  for (const f of [path.join(REPO, 'config.json'), path.join(REPO, '..', 'config.json')]) {
    try {
      return JSON.parse(fs.readFileSync(f, 'utf8'));
    } catch {}
  }
  return null;
}

const CATEGORIAS = ['fundamentos', 'ia', 'avalanche', 'clerk', 'supabase', 'proyectos'];
const NIVELES = ['inicial', 'intermedio', 'avanzado'];
const TECNOLOGIAS = ['n8n', 'ia', 'avalanche', 'clerk', 'supabase'];
const PROBADO = ['ejecutado', 'auditado'];
// Carpeta de categoría -> categorías válidas en meta.json.
const CARPETAS = {
  '00-fundamentos': ['fundamentos', 'ia'],
  '10-avalanche-fuji': ['avalanche'],
  '20-clerk': ['clerk'],
  '30-supabase': ['supabase', 'ia'],
  '40-proyectos': ['proyectos'],
};
// Ids fijos de la especificación (la página y las guías los nombran así) y su carpeta.
const IDS = {
  '00-fundamentos': ['01-hola-n8n', '02-mi-primera-api', '03-http-request', '04-formulario', '05-agente-ia'],
  '10-avalanche-fuji': ['10-fuji-estado-de-la-red', '11-fuji-saldo-wallet', '12-fuji-leer-transaccion', '13-fuji-verificar-pago', '14-fuji-monitor-wallet', '15-fuji-token-erc20', '16-fuji-eventos-contrato'],
  '20-clerk': ['20-clerk-webhook-a-supabase', '21-clerk-api-protegida', '22-clerk-invitaciones'],
  '30-supabase': ['30-formulario-a-supabase', '31-api-crud-supabase', '32-cargar-documentos-rag', '33-agente-con-memoria-y-rag', '34-supabase-webhook-ia'],
  '40-proyectos': ['40-agente-web3-fuji', '41-pagos-fuji-con-login', '42-reporte-kpis'],
};
const CONEXIONES = ['main', 'ai_languageModel', 'ai_memory', 'ai_tool', 'ai_embedding', 'ai_document', 'ai_textSplitter', 'ai_vectorStore', 'ai_outputParser', 'ai_retriever', 'ai_reranker'];
const CLAVES_NODO = new Set(['id', 'name', 'type', 'typeVersion', 'position', 'parameters', 'credentials', 'webhookId', 'disabled', 'notes', 'notesInFlow', 'retryOnFail', 'maxTries', 'waitBetweenTries', 'alwaysOutputData', 'executeOnce', 'onError', 'continueOnFail', 'color']);
const CLAVES_WORKFLOW = new Set(['name', 'nodes', 'connections', 'settings', 'pinData', 'meta', 'tags', 'staticData', 'active']);
const STICKY = 'n8n-nodes-base.stickyNote';
const CAMPOS_CODIGO = new Set(['jsCode', 'pythonCode', 'code', 'functionCode', 'query', 'jsonBody', 'jsonHeaders', 'jsonQuery', 'jsonOutput', 'jsonSchemaExample', 'inputSchema', 'schema']);

// ---------------------------------------------------------------- argumentos
const args = process.argv.slice(2);
const opciones = { estricto: false, avisos: true, json: null };
const rutas = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--estricto') opciones.estricto = true;
  else if (a === '--sin-avisos') opciones.avisos = false;
  else if (a === '--json') opciones.json = path.resolve(args[++i]);
  else if (a === '-h' || a === '--help' || a === '--ayuda') {
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 14).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
    process.exit(0);
  } else rutas.push(path.resolve(a));
}
if (!rutas.length) rutas.push(REPO);

// ---------------------------------------------------------------- carga de n8n
const modulos = encontrarModulos();
let T, validarNodo;
try {
  T = await cargarTipos(modulos);
  validarNodo = crearValidador(cargarN8nWorkflow(modulos));
} catch (e) {
  console.error(e.message);
  process.exit(2);
}

// ---------------------------------------------------------------- búsqueda de workflows
const IGNORAR = new Set(['node_modules', '.git', 'docs', 'tools', 'assets', '.github']);
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

// ---------------------------------------------------------------- utilidades
const esObjeto = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const relativo = (f) => {
  const r = path.relative(REPO, f).split(path.sep).join('/');
  return r.startsWith('..') ? f.split(path.sep).join('/') : r;
};

// Entradas y salidas de un nodo: listas fijas o expresiones del paquete de n8n que dependen de los
// parámetros (se evalúan en un contexto aislado con los parámetros del nodo).
function resolverIO(io, params, version) {
  if (Array.isArray(io)) return io.map((x) => (typeof x === 'string' ? { type: x } : x));
  if (typeof io !== 'string') return null;
  const m = io.match(/^=\{\{([\s\S]*)\}\}$/);
  if (!m) return null;
  try {
    const r = vm.runInNewContext(m[1], { $parameter: params, parameters: params, $nodeVersion: version }, { timeout: 500 });
    return Array.isArray(r) ? r.map((x) => (typeof x === 'string' ? { type: x } : x)) : null;
  } catch {
    return null;
  }
}

function parametrosCompletos(node, desc) {
  try {
    const w = cargarN8nWorkflow(modulos);
    return (w.getNodeParameters ?? w.NodeHelpers.getNodeParameters)(desc.properties, node.parameters ?? {}, true, false, node, desc) ?? node.parameters ?? {};
  } catch {
    return node.parameters ?? {};
  }
}

function tamano(node, desc, completos) {
  if (node.type === STICKY) return [Number(node.parameters?.width ?? 240), Number(node.parameters?.height ?? 160)];
  const entradas = desc ? resolverIO(desc.inputs, completos, node.typeVersion) ?? [] : [];
  const salidas = desc ? resolverIO(desc.outputs, completos, node.typeVersion) ?? [] : [];
  const subnodo = salidas.length > 0 && salidas.every((s) => s.type !== 'main') && !entradas.some((e) => e.type === 'main');
  if (subnodo) return [80, 80];
  if (entradas.some((e) => e.type !== 'main')) return [240, 100];
  return [100, 100];
}

// Recorre los parámetros de un nodo: callback(ruta, clave, valor) para cada texto.
function textosDe(obj, ruta, cb) {
  if (typeof obj === 'string') cb(ruta, ruta.split('.').pop().replace(/\[\d+\]$/, ''), obj);
  else if (Array.isArray(obj)) obj.forEach((v, i) => textosDe(v, `${ruta}[${i}]`, cb));
  else if (esObjeto(obj)) for (const [k, v] of Object.entries(obj)) textosDe(v, ruta ? `${ruta}.${k}` : k, cb);
}

// ---------------------------------------------------------------- auditoría de un workflow
const globales = { webhooks: new Map(), webhookIds: new Map(), ids: new Map() };

function auditar(archivo) {
  const P = [];
  const err = (donde, mensaje) => P.push({ nivel: 'error', donde, mensaje });
  const avi = (donde, mensaje) => P.push({ nivel: 'aviso', donde, mensaje });
  const dir = path.dirname(archivo);
  const id = path.basename(dir);
  const carpetaCat = path.basename(path.dirname(dir));
  const res = { archivo: relativo(archivo), id, problemas: P, probado: null, manual: false, nombre: null };

  let texto, wf;
  try {
    texto = fs.readFileSync(archivo, 'utf8');
    if (texto.charCodeAt(0) === 0xfeff) err('archivo', 'tiene BOM al principio: guardalo como UTF-8 sin BOM');
    wf = JSON.parse(texto.replace(/^﻿/, ''));
  } catch (e) {
    err('archivo', `no es un JSON válido: ${e.message}`);
    return res;
  }

  // Forma general
  if (!esObjeto(wf)) {
    err('archivo', 'el JSON tiene que ser un objeto con name, nodes y connections');
    return res;
  }
  for (const k of Object.keys(wf)) {
    if (k === 'id') err('workflow', 'tiene "id": sacalo (n8n crea uno al importar)');
    else if (k === 'versionId') avi('workflow', 'tiene "versionId": sacalo');
    else if (!CLAVES_WORKFLOW.has(k)) avi('workflow', `clave desconocida "${k}"`);
  }
  if (wf.active === true) err('workflow', '"active": true no va: se publica a mano después de cargar las credenciales');
  if (typeof wf.name !== 'string' || !wf.name.trim()) err('workflow', 'falta "name"');
  else {
    res.nombre = wf.name;
    if (!wf.name.startsWith('Nodo Cero · ')) err('workflow', `el nombre tiene que empezar con «Nodo Cero · » (es «${wf.name}»)`);
  }
  if (!Array.isArray(wf.nodes) || !wf.nodes.length) {
    err('workflow', 'falta "nodes" (lista de nodos)');
    return res;
  }
  if (!esObjeto(wf.connections)) err('workflow', 'falta "connections" (objeto)');
  if (!esObjeto(wf.settings) || wf.settings.executionOrder !== 'v1') err('workflow', 'settings.executionOrder tiene que ser "v1"');
  if (wf.pinData !== undefined && (!esObjeto(wf.pinData) || Object.keys(wf.pinData).length)) avi('workflow', 'pinData no está vacío: los datos fijados reemplazan la salida real de esos nodos');
  if (!esObjeto(wf.meta) || wf.meta.templateCredsSetupCompleted !== false) avi('workflow', 'meta.templateCredsSetupCompleted tendría que ser false');
  if (esObjeto(wf.meta) && wf.meta.instanceId) avi('workflow', 'meta.instanceId identifica tu instancia: sacalo');
  if (Array.isArray(wf.tags) && wf.tags.some((t) => esObjeto(t) && t.id)) avi('workflow', 'tags con id: sacalos o dejá nada más el nombre');

  // Nodos
  const porNombre = new Map();
  const idsNodo = new Set();
  const info = new Map(); // nombre -> { node, desc, completos, entradas, salidas }
  const credNecesarias = []; // [nodo, [tipos alternativos]]
  for (const [i, node] of wf.nodes.entries()) {
    const donde = `nodo «${node?.name ?? '#' + i}»`;
    if (!esObjeto(node)) {
      err(`nodo #${i}`, 'no es un objeto');
      continue;
    }
    for (const k of Object.keys(node)) if (!CLAVES_NODO.has(k)) avi(donde, `clave desconocida "${k}"`);
    if (typeof node.name !== 'string' || !node.name.trim()) {
      err(`nodo #${i}`, 'falta "name"');
      continue;
    }
    if (porNombre.has(node.name)) err(donde, 'nombre repetido: cada nodo necesita un nombre único');
    porNombre.set(node.name, node);
    if (!node.id) avi(donde, 'falta "id" (un uuid)');
    else if (idsNodo.has(node.id)) err(donde, `id de nodo repetido (${node.id})`);
    else idsNodo.add(node.id);
    if (!Array.isArray(node.position) || node.position.length !== 2 || !node.position.every((n) => typeof n === 'number' && Number.isFinite(n))) err(donde, '"position" tiene que ser [x, y] con números');

    const t = T.tipo(node.type);
    if (!t) {
      err(donde, `el tipo "${node.type}" no existe en n8n ${T.versionN8n}`);
      continue;
    }
    if (typeof node.typeVersion !== 'number') {
      err(donde, `falta "typeVersion" (la más alta para ${node.type} es ${t.maxima})`);
      continue;
    }
    if (!t.versiones.includes(node.typeVersion)) {
      err(donde, `typeVersion ${node.typeVersion} no existe para ${node.type} (válidas: ${t.versiones.join(', ')})`);
      continue;
    }
    if (node.typeVersion !== t.maxima) avi(donde, `usa ${node.type} v${node.typeVersion}; la más alta en n8n ${T.versionN8n} es ${t.maxima}`);
    const desc = t.descripcion(node.typeVersion);
    const completos = parametrosCompletos(node, desc);
    info.set(node.name, { node, desc, completos, entradas: resolverIO(desc.inputs, completos, node.typeVersion), salidas: resolverIO(desc.outputs, completos, node.typeVersion) });

    // Parámetros
    for (const p of validarNodo(node, desc)) (p.nivel === 'error' ? err : avi)(`${donde} · ${p.ruta}`, p.mensaje);

    // Credenciales. HTTP Request y sus variantes eligen la credencial con un parámetro
    // (authentication = predefinedCredentialType -> nodeCredentialType, genericCredentialType -> genericAuthType).
    const credParametro = [];
    if (completos.authentication === 'predefinedCredentialType' && typeof completos.nodeCredentialType === 'string' && completos.nodeCredentialType) credParametro.push(completos.nodeCredentialType);
    if (completos.authentication === 'genericCredentialType' && typeof completos.genericAuthType === 'string' && completos.genericAuthType) credParametro.push(completos.genericAuthType);
    for (const c of credParametro) if (!T.credenciales.has(c)) err(donde, `la credencial «${c}» no existe en n8n ${T.versionN8n}`);
    const admitidas = [...(desc.credentials ?? []).map((c) => c.name), ...credParametro];
    if (node.credentials !== undefined) {
      if (!esObjeto(node.credentials)) err(donde, '"credentials" tiene que ser un objeto');
      else
        for (const [tipo, c] of Object.entries(node.credentials)) {
          if (!admitidas.includes(tipo)) err(`${donde} · credentials`, `«${tipo}» no es una credencial de este nodo (admite: ${admitidas.join(', ') || 'ninguna'})`);
          if (esObjeto(c) && c.id) err(`${donde} · credentials.${tipo}`, 'tiene "id": sacalo (n8n pide la credencial al importar)');
        }
    }
    const w = cargarN8nWorkflow(modulos);
    const mostrar = w.displayParameter ?? w.NodeHelpers.displayParameter;
    const usadas = (desc.credentials ?? []).filter((c) => {
      try {
        return mostrar(completos, c, node, desc);
      } catch {
        return true;
      }
    });
    if (usadas.some((c) => c.required)) credNecesarias.push([node.name, usadas.map((c) => c.name)]);
    if (credParametro.length) credNecesarias.push([node.name, credParametro]);

    // Webhooks: paths y webhookId únicos en todo el repo
    if (desc.webhooks?.length || ['n8n-nodes-base.form'].includes(node.type)) {
      const pide = ['n8n-nodes-base.formTrigger', '@n8n/n8n-nodes-langchain.chatTrigger', 'n8n-nodes-base.form'].includes(node.type);
      if (!node.webhookId) (pide ? err : avi)(donde, 'falta "webhookId" (un uuid): n8n lo usa para la URL del disparador');
      else {
        const previo = globales.webhookIds.get(node.webhookId);
        if (previo && previo !== res.archivo) err(donde, `webhookId repetido con ${previo}`);
        globales.webhookIds.set(node.webhookId, res.archivo);
      }
      let clave = null;
      if (node.type === 'n8n-nodes-base.webhook') {
        const ruta = String(completos.path ?? '').replace(/^\/+/, '');
        const metodos = completos.multipleMethods ? completos.httpMethod ?? [] : [completos.httpMethod ?? 'GET'];
        clave = (Array.isArray(metodos) ? metodos : [metodos]).map((m) => `${m} /webhook/${ruta}`);
        if (!ruta) err(donde, 'el webhook no tiene "path"');
      } else if (node.type === 'n8n-nodes-base.formTrigger') {
        clave = [`/form/${completos.options?.path || node.webhookId}`];
      }
      for (const c of clave ?? []) {
        const previo = globales.webhooks.get(c);
        if (previo && previo !== res.archivo) err(donde, `la URL ${c} ya la usa ${previo}: con los dos publicados en la misma n8n chocan`);
        globales.webhooks.set(c, res.archivo);
      }
    }

    // Code node: sintaxis de JavaScript
    if (node.type === 'n8n-nodes-base.code') {
      const lenguaje = completos.language ?? 'javaScript';
      if (lenguaje === 'javaScript' && typeof completos.jsCode === 'string') {
        try {
          new vm.Script(`(async function () {\n${completos.jsCode}\n})`);
        } catch (e) {
          err(`${donde} · jsCode`, `JavaScript con error de sintaxis: ${e.message}`);
        }
      } else if (lenguaje !== 'javaScript') avi(donde, `Code en ${lenguaje}: en la n8n local no hay runner de Python; preferí JavaScript`);
    }

    // Textos: nombre del nodo, notas y parámetros
    for (const x of revisarProsa(node.name)) (x.nivel === 'error' ? err : avi)(`${donde} · nombre`, `${x.regla}: ${x.detalle}`);
    if (typeof node.notes === 'string') for (const x of revisarProsa(node.notes)) (x.nivel === 'error' ? err : avi)(`${donde} · notes`, `${x.regla}: ${x.detalle}`);
    textosDe(node.parameters ?? {}, '', (ruta, clave, valor) => {
      if (node.type === STICKY && clave === 'content') return; // se revisa abajo
      const codigo = CAMPOS_CODIGO.has(clave) || valor.startsWith('=') || /^\s*[{[]/.test(valor) || /^https?:\/\//.test(valor);
      const hallazgos = codigo ? revisarCodigo(valor) : revisarProsa(valor);
      if (codigo) for (const m of buscarN8nMalEscrito(valor)) hallazgos.push({ regla: '«n8n» va en minúscula', detalle: m, nivel: 'error' });
      for (const x of hallazgos) (x.nivel === 'error' ? err : avi)(`${donde} · ${ruta}`, `${x.regla}: ${x.detalle}`);
      // Referencias a otros nodos: $('Nombre') y $node["Nombre"]
      for (const m of valor.matchAll(/\$\(\s*(['"`])((?:(?!\1).)+)\1\s*\)|\$node\[\s*(['"])((?:(?!\3).)+)\3\s*\]/g)) {
        const ref = m[2] ?? m[4];
        if (!wf.nodes.some((n) => n?.name === ref)) err(`${donde} · ${ruta}`, `menciona el nodo «${ref}», que no existe en este workflow`);
      }
      const abre = (valor.match(/\{\{/g) ?? []).length;
      const cierra = (valor.match(/\}\}/g) ?? []).length;
      if (valor.startsWith('=') && abre !== cierra) avi(`${donde} · ${ruta}`, `la expresión tiene ${abre} «{{» y ${cierra} «}}»`);
    });
  }

  // Notas adhesivas
  const notas = wf.nodes.filter((n) => n?.type === STICKY);
  const nodos = wf.nodes.filter((n) => n?.type !== STICKY && Array.isArray(n?.position));
  for (const n of notas) {
    const contenido = String(n.parameters?.content ?? '');
    for (const x of revisarProsa(prosaDeMarkdown(contenido))) (x.nivel === 'error' ? err : avi)(`nota «${n.name}»`, `${x.regla}: ${x.detalle}`);
    for (const x of revisarCodigo(codigoDeMarkdown(contenido))) if (!x.regla.startsWith('sin signos')) (x.nivel === 'error' ? err : avi)(`nota «${n.name}»`, `${x.regla} (en código o enlaces): ${x.detalle}`);
    if (!contenido.trim()) avi(`nota «${n.name}»`, 'está vacía');
  }
  const minX = Math.min(...nodos.map((n) => n.position[0]));
  const minY = Math.min(...nodos.map((n) => n.position[1]));
  const grandes = notas.filter((n) => Number(n.parameters?.width ?? 240) >= 320 && Number(n.parameters?.height ?? 160) >= 280);
  const inicial = grandes.filter((n) => Array.isArray(n.position) && (n.position[0] <= minX || n.position[1] + Number(n.parameters?.height ?? 160) <= minY)).sort((a, b) => a.position[0] - b.position[0])[0];
  if (!inicial) err('notas', 'falta la nota grande al inicio (al menos 320 × 280, a la izquierda o arriba del primer nodo) con «Qué hace», «Qué necesitás» y «Cómo probarlo»');
  else {
    const c = normalizar(inicial.parameters?.content);
    const faltan = [['Qué hace', /que hace/], ['Qué necesitás', /que necesit/], ['Cómo probarlo', /como (?:lo )?prob/]].filter(([, re]) => !re.test(c)).map(([t]) => `«${t}»`);
    if (faltan.length) err(`nota «${inicial.name}»`, `a la nota inicial le falta: ${faltan.join(', ')}`);
    for (const [nodo, tipos] of credNecesarias) {
      if (!tipos.some((t) => c.includes(normalizar(t)) || c.includes(normalizar(T.credenciales.get(t)?.displayName ?? '@@')))) avi(`nota «${inicial.name}»`, `no nombra la credencial de «${nodo}» (${tipos.join(' o ')})`);
    }
  }
  if (notas.length < 2 && nodos.length > 3) avi('notas', 'hay una sola nota: sumá notas al lado de los pasos clave');

  // Canvas: nodos encimados
  const cajas = nodos
    .filter((n) => info.has(n.name))
    .map((n) => {
      const i = info.get(n.name);
      const [w, h] = tamano(n, i.desc, i.completos);
      return { n: n.name, x: n.position[0], y: n.position[1], w, h };
    });
  for (let a = 0; a < cajas.length; a++)
    for (let b = a + 1; b < cajas.length; b++) {
      const A = cajas[a];
      const B = cajas[b];
      if (A.x < B.x + B.w && B.x < A.x + A.w && A.y < B.y + B.h && B.y < A.y + A.h) err('canvas', `«${A.n}» y «${B.n}» se enciman (${A.x},${A.y} y ${B.x},${B.y})`);
    }
  const posNotas = notas.filter((n) => Array.isArray(n.position));
  for (let a = 0; a < posNotas.length; a++)
    for (let b = a + 1; b < posNotas.length; b++) {
      const [A, B] = [posNotas[a], posNotas[b]];
      const [aw, ah] = [Number(A.parameters?.width ?? 240), Number(A.parameters?.height ?? 160)];
      const [bw, bh] = [Number(B.parameters?.width ?? 240), Number(B.parameters?.height ?? 160)];
      if (A.position[0] < B.position[0] + bw && B.position[0] < A.position[0] + aw && A.position[1] < B.position[1] + bh && B.position[1] < A.position[1] + ah) avi('canvas', `las notas «${A.name}» y «${B.name}» se enciman`);
    }

  // Conexiones
  const entrantes = new Map(); // nombre -> Map(tipo -> cantidad)
  const conSalida = new Set();
  if (esObjeto(wf.connections)) {
    for (const [origen, porTipo] of Object.entries(wf.connections)) {
      if (!porNombre.has(origen)) {
        err('conexiones', `salen conexiones de «${origen}», que no existe`);
        continue;
      }
      if (!esObjeto(porTipo)) {
        err('conexiones', `«${origen}»: tiene que ser { "main": [[...]] }`);
        continue;
      }
      const io = info.get(origen);
      for (const [tipo, salidas] of Object.entries(porTipo)) {
        if (!CONEXIONES.includes(tipo)) {
          err('conexiones', `«${origen}»: tipo de conexión «${tipo}» no existe (válidos: ${CONEXIONES.join(', ')})`);
          continue;
        }
        if (!Array.isArray(salidas)) {
          err('conexiones', `«${origen}».${tipo} tiene que ser una lista de salidas`);
          continue;
        }
        if (io?.salidas) {
          // onError «continueErrorOutput» suma una salida main de error (NodeHelpers.getNodeOutputs).
          const nodoOrigen = wf.nodes.find((n) => n?.name === origen);
          const deEseTipo = io.salidas.filter((s) => s.type === tipo).length + (tipo === 'main' && nodoOrigen?.onError === 'continueErrorOutput' ? 1 : 0);
          if (!deEseTipo && salidas.some((s) => Array.isArray(s) && s.length)) err('conexiones', `«${origen}» no tiene salidas «${tipo}» (tiene: ${[...new Set(io.salidas.map((s) => s.type))].join(', ') || 'ninguna'})`);
          else if (salidas.length > deEseTipo && salidas.slice(deEseTipo).some((s) => Array.isArray(s) && s.length)) err('conexiones', `«${origen}» tiene ${deEseTipo} salida(s) «${tipo}» y hay conexiones en la salida ${salidas.length - 1}`);
        }
        salidas.forEach((destinos, iSalida) => {
          if (destinos === null) return;
          if (!Array.isArray(destinos)) {
            err('conexiones', `«${origen}».${tipo}[${iSalida}] tiene que ser una lista`);
            return;
          }
          for (const d of destinos) {
            if (!esObjeto(d) || typeof d.node !== 'string') {
              err('conexiones', `«${origen}».${tipo}[${iSalida}]: cada destino es { "node", "type", "index" }`);
              continue;
            }
            if (!porNombre.has(d.node)) {
              err('conexiones', `«${origen}» apunta a «${d.node}», que no existe`);
              continue;
            }
            if (d.type !== tipo) err('conexiones', `«${origen}» → «${d.node}»: el destino dice type «${d.type}» y la conexión es «${tipo}»`);
            if (!Number.isInteger(d.index) || d.index < 0) err('conexiones', `«${origen}» → «${d.node}»: index tiene que ser un entero ≥ 0`);
            const dio = info.get(d.node);
            if (dio?.entradas) {
              const deEseTipo = dio.entradas.filter((e) => e.type === d.type).length;
              if (!deEseTipo) err('conexiones', `«${d.node}» no acepta conexiones «${d.type}» (acepta: ${[...new Set(dio.entradas.map((e) => e.type))].join(', ') || 'ninguna'})`);
              else if (d.type === 'main' && d.index >= deEseTipo) err('conexiones', `«${d.node}» tiene ${deEseTipo} entrada(s) y la conexión usa la ${d.index}`);
            }
            if (!entrantes.has(d.node)) entrantes.set(d.node, new Map());
            entrantes.get(d.node).set(d.type, (entrantes.get(d.node).get(d.type) ?? 0) + 1);
            conSalida.add(origen);
          }
        });
      }
    }
  }
  for (const [nombre, i] of info) {
    if (i.node.type === STICKY || i.node.disabled) continue;
    const llegan = entrantes.get(nombre) ?? new Map();
    for (const e of i.entradas ?? []) {
      if (e.type !== 'main' && e.required && !llegan.get(e.type)) err(`nodo «${nombre}»`, `necesita una conexión «${e.type}»${e.displayName ? ` (${e.displayName})` : ''}`);
    }
    for (const [tipo, cant] of llegan) {
      const max = (i.entradas ?? []).find((e) => e.type === tipo)?.maxConnections;
      if (max && cant > max) err(`nodo «${nombre}»`, `recibe ${cant} conexiones «${tipo}» y admite ${max}`);
    }
    const esDisparador = (i.desc.group ?? []).includes('trigger') || /Trigger$/.test(i.node.type);
    if (!llegan.size && !conSalida.has(nombre) && !(esDisparador && wf.nodes.length === 1)) avi(`nodo «${nombre}»`, 'está suelto: no recibe ni manda conexiones');
    if (!esDisparador && (i.entradas ?? []).some((e) => e.type === 'main') && !llegan.get('main') && conSalida.has(nombre)) avi(`nodo «${nombre}»`, 'no le llega ninguna conexión main: no se va a ejecutar');
  }
  // Webhook y Respond to Webhook: las mismas revisiones que hace n8n al recibir un pedido o al ejecutar.
  const hijos = new Map();
  const padres = new Map();
  if (esObjeto(wf.connections))
    for (const [o, porTipo] of Object.entries(wf.connections))
      for (const salida of esObjeto(porTipo) && Array.isArray(porTipo.main) ? porTipo.main : [])
        for (const d of Array.isArray(salida) ? salida : []) {
          if (!esObjeto(d) || typeof d.node !== 'string') continue;
          if (!hijos.has(o)) hijos.set(o, new Set());
          hijos.get(o).add(d.node);
          if (!padres.has(d.node)) padres.set(d.node, new Set());
          padres.get(d.node).add(o);
        }
  const recorrer = (mapa, nombre) => {
    const vistos = new Set();
    const pila = [nombre];
    while (pila.length) for (const h of mapa.get(pila.pop()) ?? []) if (!vistos.has(h)) vistos.add(h), pila.push(h);
    return [...vistos].map((n) => porNombre.get(n)).filter(Boolean);
  };
  for (const [nombre, i] of info) {
    if (i.node.disabled) continue;
    if (i.node.type === 'n8n-nodes-base.webhook') {
      const modo = i.completos.responseMode ?? 'onReceived';
      const despues = recorrer(hijos, nombre);
      const responden = despues.filter((n) => n.type === 'n8n-nodes-base.respondToWebhook' && !n.disabled);
      const hayWait = despues.some((n) => n.type === 'n8n-nodes-base.wait');
      if (modo === 'responseNode' && !responden.length) err(`nodo «${nombre}»`, 'responseMode es «responseNode» y después no hay ningún Respond to Webhook: n8n falla con «No Respond to Webhook node found in the workflow»');
      if (responden.length && !['responseNode', 'streaming'].includes(modo)) (hayWait ? avi : err)(`nodo «${nombre}»`, `después hay un Respond to Webhook («${responden[0].name}») y responseMode es «${modo}»: n8n falla con «Unused Respond to Webhook node found in the workflow» (poné responseMode «responseNode»)`);
    }
    if (i.node.type === 'n8n-nodes-base.respondToWebhook' && i.node.typeVersion >= 1.1) {
      const web = ['n8n-nodes-base.webhook', 'n8n-nodes-base.formTrigger', '@n8n/n8n-nodes-langchain.chatTrigger', 'n8n-nodes-base.wait'];
      if (!recorrer(padres, nombre).some((n) => web.includes(n.type))) err(`nodo «${nombre}»`, 'antes no hay ningún Webhook, Form Trigger, Chat Trigger ni Wait: n8n falla con «No Webhook node found in the workflow»');
    }
  }

  res.manual = wf.nodes.some((n) => n?.type === 'n8n-nodes-base.manualTrigger' && !n.disabled);
  if (!wf.nodes.some((n) => n && info.get(n.name) && ((info.get(n.name).desc.group ?? []).includes('trigger') || /Trigger$/.test(n.type)))) avi('workflow', 'no tiene disparador');

  // Todo el archivo: claves, correos, marcas
  for (const x of buscarSecretos(texto)) err('archivo', `${x.regla}: ${x.detalle}`);
  for (const c of buscarCorreos(texto)) err('archivo', `correo electrónico: ${c} (usá uno de ejemplo, como persona@example.com)`);

  // meta.json
  const meta = auditarMeta(dir, id, carpetaCat, wf, credNecesarias, err, avi);
  res.probado = meta?.probado ?? null;
  res.meta = meta;

  // README.md
  auditarReadme(dir, id, carpetaCat, meta, err, avi);
  return res;
}

function auditarMeta(dir, id, carpetaCat, wf, credNecesarias, err, avi) {
  const f = path.join(dir, 'meta.json');
  if (!fs.existsSync(f)) {
    err('meta.json', 'falta (lo lee la página)');
    return null;
  }
  let m;
  try {
    m = JSON.parse(fs.readFileSync(f, 'utf8').replace(/^﻿/, ''));
  } catch (e) {
    err('meta.json', `no es un JSON válido: ${e.message}`);
    return null;
  }
  const texto = (k) => typeof m[k] === 'string' && m[k].trim();
  if (m.id !== id) err('meta.json', `"id" tiene que ser el nombre de la carpeta («${id}»); es «${m.id}»`);
  const esperados = IDS[carpetaCat];
  if (esperados && !esperados.includes(id)) {
    const otra = Object.entries(IDS).find(([, v]) => v.includes(id));
    if (otra) err('carpeta', `«${id}» va en ${otra[0]}/, no en ${carpetaCat}/`);
    else avi('carpeta', `«${id}» no es uno de los ids fijos de ${carpetaCat}/ (${esperados.join(', ')})`);
  } else if (!esperados) avi('carpeta', `la carpeta de categoría «${carpetaCat}» no es una de las conocidas (${Object.keys(CARPETAS).join(', ')})`);
  for (const k of ['titulo', 'resumen']) if (!texto(k)) err('meta.json', `falta "${k}"`);
  if (!CATEGORIAS.includes(m.categoria)) err('meta.json', `"categoria" tiene que ser una de: ${CATEGORIAS.join(', ')}`);
  else if (CARPETAS[carpetaCat] && !CARPETAS[carpetaCat].includes(m.categoria)) err('meta.json', `"categoria" «${m.categoria}» no corresponde a la carpeta ${carpetaCat}/ (${CARPETAS[carpetaCat].join(' o ')})`);
  if (!NIVELES.includes(m.nivel)) err('meta.json', `"nivel" tiene que ser uno de: ${NIVELES.join(', ')}`);
  if (!Number.isInteger(m.minutos) || m.minutos < 1 || m.minutos > 240) err('meta.json', '"minutos" tiene que ser un entero entre 1 y 240');
  if (!Array.isArray(m.tecnologias) || !m.tecnologias.length) err('meta.json', '"tecnologias" tiene que ser una lista');
  else {
    for (const t of m.tecnologias) if (!TECNOLOGIAS.includes(t)) err('meta.json', `tecnología «${t}» no es válida (${TECNOLOGIAS.join(', ')})`);
    if (!m.tecnologias.includes('n8n')) avi('meta.json', '"tecnologias" no incluye «n8n»');
    const tipos = wf.nodes.map((n) => String(n?.type ?? ''));
    const todo = JSON.stringify(wf).toLowerCase();
    const usa = {
      ia: tipos.some((t) => t.startsWith('@n8n/n8n-nodes-langchain.') && !t.endsWith('chatTrigger')),
      supabase: tipos.some((t) => /supabase/i.test(t)) || todo.includes('supabase.co'),
      avalanche: todo.includes('avax-test.network') || todo.includes('avax.network'),
      // Clerk: su API, la firma Svix de sus webhooks o la verificación de su JWT (nombrar a Clerk en un texto no cuenta).
      clerk: todo.includes('api.clerk.com') || todo.includes('svix-signature') || (todo.includes('clerk') && (tipos.some((t) => t === 'n8n-nodes-base.jwt') || todo.includes('rs256') || todo.includes('"azp"') || todo.includes('.azp'))),
    };
    for (const [t, si] of Object.entries(usa)) {
      if (si && !m.tecnologias.includes(t)) avi('meta.json', `el workflow usa ${t} y "tecnologias" no lo dice`);
      if (!si && m.tecnologias.includes(t)) avi('meta.json', `"tecnologias" dice ${t} y no encontré nodos ni URLs de ${t}`);
    }
  }
  if (!Array.isArray(m.credenciales)) err('meta.json', '"credenciales" tiene que ser una lista (vacía si no hace falta ninguna)');
  else {
    m.credenciales.forEach((c, i) => {
      if (!esObjeto(c) || !c.nombre || !c.tipo_n8n || !c.como) err('meta.json', `credenciales[${i}] necesita nombre, tipo_n8n y como`);
      else if (!T.credenciales.has(c.tipo_n8n)) err('meta.json', `credenciales[${i}].tipo_n8n «${c.tipo_n8n}» no es un tipo de credencial de n8n ${T.versionN8n}`);
    });
    const declarados = m.credenciales.map((c) => c?.tipo_n8n);
    for (const [nodo, tipos] of credNecesarias) {
      if (!tipos.some((t) => declarados.includes(t))) err('meta.json', `«${nodo}» necesita una credencial ${tipos.join(' o ')} y "credenciales" no la nombra`);
    }
    for (const d of declarados) if (d && !credNecesarias.some(([, tipos]) => tipos.includes(d))) avi('meta.json', `"credenciales" nombra ${d} y ningún nodo la pide`);
  }
  if (!Array.isArray(m.aprendes) || !m.aprendes.length || !m.aprendes.every((x) => typeof x === 'string' && x.trim())) err('meta.json', '"aprendes" tiene que ser una lista de textos');
  if (!PROBADO.includes(m.probado)) err('meta.json', `"probado" tiene que ser ${PROBADO.join(' o ')}`);
  if (typeof m.orden !== 'number') err('meta.json', '"orden" tiene que ser un número');
  else if (Number(id.split('-')[0]) !== m.orden) avi('meta.json', `"orden" (${m.orden}) no coincide con el número del id (${id.split('-')[0]})`);
  const conocidas = new Set(['id', 'titulo', 'resumen', 'categoria', 'nivel', 'minutos', 'tecnologias', 'credenciales', 'aprendes', 'probado', 'orden']);
  for (const k of Object.keys(m)) if (!conocidas.has(k)) avi('meta.json', `campo extra "${k}" (la página no lo usa)`);
  if (texto('titulo') && wf.name && !wf.name.includes(m.titulo)) avi('meta.json', `el workflow se llama «${wf.name}» y el título es «${m.titulo}»`);
  // Textos
  const prosa = [m.titulo, m.resumen, ...(m.aprendes ?? []), ...(Array.isArray(m.credenciales) ? m.credenciales.flatMap((c) => [c?.nombre, c?.como]) : [])].filter((x) => typeof x === 'string');
  for (const p of prosa) for (const x of revisarProsa(p)) (x.nivel === 'error' ? err : avi)('meta.json', `${x.regla}: ${x.detalle}`);
  return m;
}

function auditarReadme(dir, id, carpetaCat, meta, err, avi) {
  const f = path.join(dir, 'README.md');
  if (!fs.existsSync(f)) {
    err('README.md', 'falta');
    return;
  }
  const md = fs.readFileSync(f, 'utf8');
  const prosa = prosaDeMarkdown(md);
  for (const x of revisarProsa(prosa)) (x.nivel === 'error' ? err : avi)('README.md', `${x.regla}: ${x.detalle}`);
  for (const x of revisarCodigo(codigoDeMarkdown(md))) if (!x.regla.startsWith('sin signos')) (x.nivel === 'error' ? err : avi)('README.md', `${x.regla} (en código o enlaces): ${x.detalle}`);
  for (const x of buscarSecretos(md)) err('README.md', `${x.regla}: ${x.detalle}`);
  for (const c of buscarCorreos(md)) err('README.md', `correo electrónico: ${c}`);
  for (const t of buscarTelefonos(prosa)) avi('README.md', `parece un teléfono: ${t}`);
  const crudo = `https://raw.githubusercontent.com/${ORG}/workflows/${RAMA}/${carpetaCat}/${id}/workflow.json`;
  if (!md.includes(crudo)) avi('README.md', `no tiene el enlace crudo para «Import from URL»: ${crudo}`);
  for (const c of meta?.credenciales ?? []) if (c?.tipo_n8n && !md.includes(c.tipo_n8n) && !md.includes(T.credenciales.get(c.tipo_n8n)?.displayName ?? '@@')) avi('README.md', `no nombra la credencial ${c.tipo_n8n}`);
  if (!/^#\s+\S/m.test(md)) avi('README.md', 'no tiene título (# ...)');
}

// ---------------------------------------------------------------- ejecución
const resultados = archivos.map(auditar);
if (resultados.length) {
  // ids repetidos en meta.json
  const vistos = new Map();
  for (const r of resultados) {
    if (!r.meta?.id) continue;
    if (vistos.has(r.meta.id)) r.problemas.push({ nivel: 'error', donde: 'meta.json', mensaje: `el id «${r.meta.id}» también lo usa ${vistos.get(r.meta.id)}` });
    vistos.set(r.meta.id, r.archivo);
  }
}

const C = process.stdout.isTTY && !process.env.NO_COLOR ? { r: '\x1b[31m', a: '\x1b[33m', v: '\x1b[32m', g: '\x1b[2m', x: '\x1b[0m' } : { r: '', a: '', v: '', g: '', x: '' };
console.log(`Auditor de workflows · n8n ${T.versionN8n} (n8n-nodes-base ${T.paquetes['n8n-nodes-base'].version}, @n8n/n8n-nodes-langchain ${T.paquetes['@n8n/n8n-nodes-langchain'].version})`);
console.log(`${C.g}paquetes: ${modulos}${C.x}`);
console.log('');
let totalErrores = 0;
let totalAvisos = 0;
for (const r of resultados) {
  const e = r.problemas.filter((p) => p.nivel === 'error');
  const a = r.problemas.filter((p) => p.nivel === 'aviso');
  totalErrores += e.length;
  totalAvisos += a.length;
  const falla = e.length || (opciones.estricto && a.length);
  const estado = falla ? `${C.r}FALLA${C.x}` : `${C.v}OK${C.x}`;
  const cuenta = [e.length ? `${e.length} error${e.length === 1 ? '' : 'es'}` : '', a.length ? `${a.length} aviso${a.length === 1 ? '' : 's'}` : ''].filter(Boolean).join(', ');
  console.log(`${estado}  ${path.dirname(r.archivo)}${r.probado ? ` ${C.g}[${r.probado}]${C.x}` : ''}${cuenta ? `  (${cuenta})` : ''}`);
  for (const p of e) console.log(`  ${C.r}error${C.x}  ${p.donde}: ${p.mensaje}`);
  if (opciones.avisos) for (const p of a) console.log(`  ${C.a}aviso${C.x}  ${p.donde}: ${p.mensaje}`);
}
const fallas = totalErrores + (opciones.estricto ? totalAvisos : 0);
console.log('');
console.log(`${resultados.length} workflow${resultados.length === 1 ? '' : 's'} · ${totalErrores} error${totalErrores === 1 ? '' : 'es'} · ${totalAvisos} aviso${totalAvisos === 1 ? '' : 's'}`);
if (!resultados.length) console.log('No encontré ningún workflow.json.');
console.log(fallas ? `${C.r}FALLAS: ${fallas}${C.x}` : `${C.v}APROBADO${C.x}`);
if (opciones.json) {
  fs.writeFileSync(opciones.json, JSON.stringify({ n8n: T.versionN8n, fecha: new Date().toISOString(), errores: totalErrores, avisos: totalAvisos, resultados }, null, 2));
}
process.exit(fallas || !resultados.length ? 1 : 0);
