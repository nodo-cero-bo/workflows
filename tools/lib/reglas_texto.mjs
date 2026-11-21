// Reglas de texto de la especificación de Nodo Cero.
// Se aplican a nombres, notas adhesivas, README y meta.json (prosa), y una parte también al JSON
// completo (código incluido).
//
// Las palabras y marcas que no pueden aparecer se guardan como huellas (sha256 truncado) para que
// este archivo no las nombre: el auditor compara la huella de cada palabra del texto revisado.

import crypto from 'node:crypto';

const huella = (s) => crypto.createHash('sha256').update('nodo-cero:' + s).digest('hex').slice(0, 16);

// Grupos de palabras no permitidas: [descripción para el informe, huellas, nivel en prosa, nivel en código].
const GRUPOS = [
  {
    regla: 'marca o nombre que no va en este proyecto',
    huellas: ['bef57a52c7153437', 'a69fdbd92849539c', '05581e694452edab', 'd0855b6ad0c3e939', '4065ba290e5bf459', '081e191af4220d4f', 'ecb9249bb49d1e20', '9baa2d81954daf33', 'fc5cfff1f4195241'],
    codigo: true,
  },
  { regla: 'adverbio de exclusividad: usá «nada más» o «apenas»', huellas: ['667ca3579c4db7e5', '633ccffea48c97d6'], codigo: true },
  { regla: 'el evento es «enfocada en mujeres», sin palabras de exclusividad', huellas: ['d8b91886b7a36068', 'ab3493881231809f', '4b4ce99fe9d7feb8', 'fc35b2881e709898', 'a1e32a1f48eff5d0'], codigo: true },
  { regla: 'no se nombran recompensas que no están confirmadas', huellas: ['cdab44ac2a315f50', '6955fc83693a7fa4'], codigo: true },
  { regla: 'nombre de comunidad que no corresponde (se invita a «seguir construyendo»)', huellas: ['7fd94d6b1110f6e3'], codigo: true },
  { regla: 'línea de coautoría de una herramienta', huellas: ['31ff361305d342cc'], codigo: true },
];
const HERRAMIENTAS = new Set(['6f835b50b3dd962c', 'adaaa3cf49c80c9e', '4907597a8fc33fa6', '66136b2790ec2248', '9647924a44dcc124']);

export function normalizar(t) {
  return String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// Palabras del texto con su posición (letras y números; el resto separa).
function palabras(texto) {
  const t = normalizar(texto);
  const out = [];
  for (const m of t.matchAll(/[\p{L}\p{N}]+/gu)) out.push({ p: m[0], i: m.index });
  return out;
}

function recorte(t, i) {
  const a = Math.max(0, i - 30);
  const b = Math.min(t.length, i + 40);
  return (a > 0 ? '…' : '') + t.slice(a, b).replace(/\s+/g, ' ').trim() + (b < t.length ? '…' : '');
}

// Busca las palabras no permitidas, sueltas o pegando 2 o 3 seguidas (así se encuentran también los nombres escritos con espacios o guiones).
function buscarPalabras(texto, { codigo = false } = {}) {
  const t = String(texto ?? '');
  const ps = palabras(t);
  const out = [];
  const vistas = new Set();
  for (let k = 0; k < ps.length; k++) {
    const candidatas = [ps[k].p];
    if (k + 1 < ps.length) candidatas.push(ps[k].p + ps[k + 1].p);
    if (k + 2 < ps.length) candidatas.push(ps[k].p + ps[k + 1].p + ps[k + 2].p);
    for (const c of candidatas) {
      const h = huella(c);
      for (const g of GRUPOS) {
        if (codigo && !g.codigo) continue;
        if (g.huellas.includes(h) && !vistas.has(g.regla + ps[k].i)) {
          vistas.add(g.regla + ps[k].i);
          out.push({ regla: g.regla, detalle: recorte(t, ps[k].i) });
        }
      }
    }
  }
  return out;
}

// Atribución del trabajo a una herramienta («hecho con ...», «generado por ...»). Es aviso: un workflow
// puede contar con razón que una respuesta la genera un modelo.
export function buscarAtribucion(texto) {
  const t = String(texto ?? '');
  const ps = palabras(t);
  const out = [];
  for (let k = 0; k + 2 < ps.length; k++) {
    if (!/^(?:generad|hech|escrit|cread|redactad)[oa]s?$/.test(ps[k].p)) continue;
    if (!['con', 'por'].includes(ps[k + 1].p)) continue;
    let j = k + 2;
    if (['una', 'la', 'el', 'un'].includes(ps[j]?.p)) j++;
    const x = ps[j]?.p ?? '';
    const xy = x + (ps[j + 1]?.p ?? '');
    if (x === 'ia' || xy === 'inteligenciaartificial' || HERRAMIENTAS.has(huella(x))) {
      out.push({ regla: 'parece atribuir el trabajo a una herramienta', detalle: recorte(t, ps[k].i) });
    }
  }
  return out;
}

// Saca de un texto Markdown lo que es código o sintaxis (no es prosa):
// bloques ```, código en línea, imágenes, comentarios HTML y URLs.
export function prosaDeMarkdown(md) {
  return String(md ?? '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/g, ' ')
    .replace(/<img\b[^>]*>/gi, ' ')
    .replace(/\]\([^)]*\)/g, '] ')
    .replace(/https?:\/\/[^\s)>"']+/g, ' ');
}

// Lo contrario de prosaDeMarkdown: junta lo que es código, URLs y comentarios de un Markdown, para revisarlo
// con las reglas de código sin repetir los hallazgos de la prosa.
export function codigoDeMarkdown(md) {
  const partes = [];
  const t = String(md ?? '');
  for (const re of [/```[\s\S]*?```/g, /~~~[\s\S]*?~~~/g, /<!--[\s\S]*?-->/g]) for (const m of t.matchAll(re)) partes.push(m[0]);
  const sinBloques = t.replace(/```[\s\S]*?```/g, ' ').replace(/~~~[\s\S]*?~~~/g, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  for (const re of [/`[^`\n]*`/g, /\]\([^)]*\)/g, /<img\b[^>]*>/gi, /https?:\/\/[^\s)>"']+/g]) for (const m of sinBloques.matchAll(re)) partes.push(m[0]);
  return partes.join('\n');
}

// Emojis y pictogramas (se dejan pasar ©, ® y ™).
const EMOJI = /(?![©®™])[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{20E3}]/gu;

export function buscarEmojis(texto) {
  const m = String(texto ?? '').match(EMOJI);
  return m ? [...new Set(m)] : [];
}

// «n8n» va siempre en minúscula. Se ignoran variables de entorno (N8N_ALGO) y paquetes
// (@n8n/..., n8n-nodes-base), que son código.
export function buscarMarcaMalEscrita(texto) {
  const res = [];
  const re = /(?<![\p{L}\p{N}_@/.-])n8n(?![\p{L}\p{N}_])/giu;
  for (const m of String(texto ?? '').matchAll(re)) {
    if (m[0] !== 'n8n') res.push(m[0]);
  }
  return [...new Set(res)];
}

// Revisa un texto en prosa. Devuelve una lista de { regla, detalle, nivel }.
export function revisarProsa(texto, { exclamaciones = true } = {}) {
  const t = String(texto ?? '');
  const out = [];
  if (exclamaciones && /[\u00A1!]/.test(t)) out.push({ regla: 'sin signos de exclamación', detalle: recorte(t, t.search(/[\u00A1!]/)), nivel: 'error' });
  const emo = buscarEmojis(t);
  if (emo.length) out.push({ regla: 'sin emojis', detalle: emo.join(' '), nivel: 'error' });
  const n8n = buscarMarcaMalEscrita(t);
  if (n8n.length) out.push({ regla: '«n8n» va en minúscula', detalle: n8n.join(', '), nivel: 'error' });
  for (const x of buscarPalabras(t)) out.push({ ...x, nivel: 'error' });
  for (const x of buscarAtribucion(t)) out.push({ ...x, nivel: 'aviso' });
  return out;
}

// Revisa texto que es código (Code node, expresiones, JSON): marcas y palabras no permitidas,
// emojis y el signo de apertura (\u00A1). El cierre suelto es un operador de JavaScript, así que no se marca.
export function revisarCodigo(texto) {
  const t = String(texto ?? '');
  const out = [];
  const emo = buscarEmojis(t);
  if (emo.length) out.push({ regla: 'sin emojis (tampoco en código)', detalle: emo.join(' '), nivel: 'error' });
  if (t.includes('\u00A1')) out.push({ regla: 'sin signos de exclamación', detalle: recorte(t, t.indexOf('\u00A1')), nivel: 'error' });
  for (const x of buscarPalabras(t, { codigo: true })) out.push({ ...x, nivel: 'error' });
  return out;
}

// Cosas que parecen claves. Cada regla: [nombre, regex].
export const SECRETOS = [
  ['clave secreta de Clerk (sk_test_ / sk_live_)', /\bsk_(?:test|live)_[A-Za-z0-9]{16,}/g],
  ['clave de OpenAI (sk-...)', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{24,}/g],
  ['secreto de webhook Svix (whsec_)', /\bwhsec_[A-Za-z0-9+/=]{16,}/g],
  ['token JWT (eyJ...), por ejemplo una service_role de Supabase', /\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g],
  ['clave secreta de Supabase (sb_secret_)', /\bsb_secret_[A-Za-z0-9_-]{16,}/g],
  ['clave de Google (AIza...)', /\bAIza[0-9A-Za-z_-]{30,}/g],
  ['token de GitHub', /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}|\bgithub_pat_[A-Za-z0-9_]{40,}/g],
  ['token de bot de Telegram', /\b\d{8,10}:AA[A-Za-z0-9_-]{30,}/g],
  ['clave privada PEM', /-----BEGIN (?:RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g],
  ['clave de AWS', /\bAKIA[0-9A-Z]{16}\b/g],
];

export function buscarSecretos(texto) {
  const t = String(texto ?? '');
  const out = [];
  for (const [nombre, re] of SECRETOS) {
    re.lastIndex = 0;
    const m = re.exec(t);
    if (m) out.push({ regla: `parece una clave: ${nombre}`, detalle: m[0].slice(0, 12) + '…', nivel: 'error' });
  }
  // 0x + 64 hex es un hash de transacción o un topic (legítimos) o una clave privada.
  // Es error si cerca hay palabras de clave privada.
  for (const m of t.matchAll(/(?<![0-9a-fA-F])(?:0x)?[0-9a-fA-F]{64}(?![0-9a-fA-F])/g)) {
    const antes = t.slice(Math.max(0, m.index - 80), m.index);
    if (/priv|secret|mnemonic|seed|clave|signer|\bpk\b|private_?key/i.test(antes)) {
      out.push({ regla: 'parece una clave privada (0x + 64 hex junto a «clave», «private» o parecido)', detalle: m[0].slice(0, 10) + '…', nivel: 'error' });
    }
  }
  return out;
}

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const EMAIL_PERMITIDO = /@(?:example\.(?:com|org|net)|ejemplo\.(?:com|org)|test\.com|correo\.com|tudominio\.com|users\.noreply\.github\.com)$/i;

export function buscarCorreos(texto) {
  const res = [];
  for (const m of String(texto ?? '').matchAll(EMAIL)) {
    if (!EMAIL_PERMITIDO.test(m[0]) && !/\.(?:png|jpe?g|svg|webp|gif)$/i.test(m[0].split('@')[0])) res.push(m[0]);
  }
  return [...new Set(res)];
}

export function buscarTelefonos(prosa) {
  const res = [];
  for (const m of String(prosa ?? '').matchAll(/\+\d{2,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}|(?<![\d.,])[67]\d{7}(?![\d.,])/g)) res.push(m[0]);
  return [...new Set(res)];
}
