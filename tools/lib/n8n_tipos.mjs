// Carga los tipos de nodo y de credencial de una instalación de n8n, igual que lo hace n8n al arrancar:
// lee dist/types/nodes.json y dist/known/nodes.json de cada paquete de nodos (la «carga perezosa» de n8n)
// y después genera las variantes «...Tool» de los nodos usableAsTool con el mismo código de n8n
// (n8n/dist/tool-generation). No ejecuta el código de los nodos.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

export const PAQUETES = ['n8n-nodes-base', '@n8n/n8n-nodes-langchain'];

// Busca la carpeta node_modules que tiene los paquetes de n8n.
// Orden: variable N8N_MODULES, node_modules del repo de workflows, y subiendo desde la carpeta actual.
export function encontrarModulos() {
  const candidatos = [];
  if (process.env.N8N_MODULES) candidatos.push(path.resolve(process.env.N8N_MODULES));
  const aqui = path.dirname(fileURLToPath(import.meta.url));
  candidatos.push(path.resolve(aqui, '..', '..', 'node_modules'));
  let d = process.cwd();
  for (let i = 0; i < 6; i++) {
    candidatos.push(path.join(d, 'node_modules'));
    const p = path.dirname(d);
    if (p === d) break;
    d = p;
  }
  for (const c of candidatos) {
    if (fs.existsSync(path.join(c, 'n8n-nodes-base', 'dist', 'types', 'nodes.json'))) return c;
  }
  return null;
}

function leerJSON(f) {
  return JSON.parse(fs.readFileSync(f, 'utf8'));
}

export function versionesDe(desc) {
  return Array.isArray(desc.version) ? desc.version : [desc.version];
}

export async function cargarTipos(modulos) {
  if (!modulos) throw new Error('No encontré los paquetes de n8n. Instalalos con «npm i» en workflows/ o pasá la carpeta node_modules en N8N_MODULES.');
  const types = { nodes: [], credentials: [] };
  const known = { nodes: {}, credentials: {} };
  const paquetes = {};
  for (const pkg of PAQUETES) {
    const dir = path.join(modulos, pkg);
    if (!fs.existsSync(path.join(dir, 'package.json'))) throw new Error(`Falta el paquete ${pkg} en ${modulos}`);
    const pj = leerJSON(path.join(dir, 'package.json'));
    paquetes[pkg] = { version: pj.version, dir };
    const tNodes = leerJSON(path.join(dir, 'dist', 'types', 'nodes.json'));
    const tCreds = leerJSON(path.join(dir, 'dist', 'types', 'credentials.json'));
    const kNodes = leerJSON(path.join(dir, 'dist', 'known', 'nodes.json'));
    const kCreds = leerJSON(path.join(dir, 'dist', 'known', 'credentials.json'));
    for (const n of tNodes) types.nodes.push({ ...n, name: `${pkg}.${n.name}` });
    for (const [k, v] of Object.entries(kNodes)) known.nodes[`${pkg}.${k}`] = v;
    for (const c of tCreds) types.credentials.push(c);
    for (const [k, v] of Object.entries(kCreds)) {
      known.credentials[k] = { ...v, supportedNodes: v.supportedNodes?.map((n) => `${pkg}.${n}`) };
    }
  }

  // Variantes «Tool» (por ejemplo httpRequestTool, supabaseTool): las crea n8n al cargar.
  let herramientas = 'n8n/dist/tool-generation';
  const n8nPj = path.join(modulos, 'n8n', 'package.json');
  let versionInstalada = null;
  if (fs.existsSync(n8nPj)) {
    versionInstalada = leerJSON(n8nPj).version;
    const req = createRequire(n8nPj);
    try {
      const tg = req('./dist/tool-generation/index.js');
      tg.createAiTools(types, known);
      if (tg.createHitlTools) tg.createHitlTools(types, known);
    } catch (e) {
      herramientas = `no se pudieron generar (${e.message})`;
    }
  } else {
    herramientas = 'no generadas: falta el paquete n8n';
  }

  const nodos = new Map();
  for (const d of types.nodes) {
    if (!nodos.has(d.name)) nodos.set(d.name, []);
    nodos.get(d.name).push(d);
  }
  const credenciales = new Map(types.credentials.map((c) => [c.name, c]));

  return {
    modulos,
    versionInstalada,
    paquetes,
    herramientas,
    nodos,
    credenciales,
    tipo(nombre) {
      const descs = nodos.get(nombre);
      if (!descs) return null;
      const versiones = [...new Set(descs.flatMap(versionesDe))].sort((a, b) => a - b);
      const defaultVersion = descs.find((d) => d.defaultVersion !== undefined)?.defaultVersion ?? Math.max(...versiones);
      return {
        nombre,
        versiones,
        maxima: Math.max(...versiones),
        defaultVersion,
        descripcion(v) {
          return descs.find((d) => versionesDe(d).includes(v)) ?? null;
        },
      };
    },
  };
}

// n8n-workflow de la misma instalación (para displayParameter, getNodeParameters, etc.).
export function cargarPaqueteWorkflow(modulos) {
  const base = fs.existsSync(path.join(modulos, 'n8n', 'package.json'))
    ? path.join(modulos, 'n8n', 'package.json')
    : path.join(modulos, 'n8n-nodes-base', 'package.json');
  const req = createRequire(base);
  return req('n8n-workflow');
}
