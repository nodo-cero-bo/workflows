// Valida los parámetros de un nodo contra la descripción de su tipo y versión, con la misma lógica
// de visibilidad que usa el editor de n8n (displayParameter y getNodeParameters de n8n-workflow).
//
// Devuelve una lista de { nivel: 'error' | 'aviso', ruta, mensaje }.
//   error: el parámetro no existe en esa versión, un valor no está entre las opciones, el tipo no encaja,
//          o el parámetro está pero n8n no lo muestra (y por eso lo ignora) con esa configuración.
//   aviso: algo que no se puede asegurar sin ejecutar (expresiones, opciones dinámicas, formas raras).

const TIPOS_FILTRO = {
  string: ['exists', 'notExists', 'empty', 'notEmpty', 'equals', 'notEquals', 'contains', 'notContains', 'startsWith', 'notStartsWith', 'endsWith', 'notEndsWith', 'regex', 'notRegex'],
  number: ['exists', 'notExists', 'empty', 'notEmpty', 'equals', 'notEquals', 'gt', 'lt', 'gte', 'lte'],
  dateTime: ['exists', 'notExists', 'empty', 'notEmpty', 'equals', 'notEquals', 'after', 'before', 'afterOrEquals', 'beforeOrEquals'],
  boolean: ['exists', 'notExists', 'empty', 'notEmpty', 'true', 'false', 'equals', 'notEquals'],
  array: ['exists', 'notExists', 'empty', 'notEmpty', 'contains', 'notContains', 'lengthEquals', 'lengthNotEquals', 'lengthGt', 'lengthLt', 'lengthGte', 'lengthLte'],
  object: ['exists', 'notExists', 'empty', 'notEmpty'],
};
const TIPOS_ASIGNACION = ['string', 'number', 'boolean', 'array', 'object', 'binary'];

const esExpresion = (v) => typeof v === 'string' && v.startsWith('=');
const esObjeto = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const tieneOpcionesDinamicas = (p) => !!(p.typeOptions?.loadOptionsMethod || p.typeOptions?.loadOptions || p.typeOptions?.loadOptionsDependsOn);
const sinMostrar = (p) => p.type === 'notice' || p.type === 'callout';

export function crearValidador(n8nWorkflow) {
  const { NodeHelpers } = n8nWorkflow;
  const displayParameter = n8nWorkflow.displayParameter ?? NodeHelpers.displayParameter;
  const getNodeParameters = n8nWorkflow.getNodeParameters ?? NodeHelpers.getNodeParameters;
  const getNodeParametersIssues = n8nWorkflow.getNodeParametersIssues ?? NodeHelpers.getNodeParametersIssues;

  function mostrado(valores, prop, node, desc, raiz) {
    try {
      return displayParameter(valores, prop, node, desc, raiz);
    } catch {
      return null; // no se pudo decidir
    }
  }

  // Valor de un parámetro según su tipo. ctx: { node, desc, raiz, out }
  function validarValor(prop, valor, ruta, ctx) {
    const { out } = ctx;
    if (valor === null || valor === undefined) return;
    switch (prop.type) {
      case 'options': {
        if (esExpresion(valor) || tieneOpcionesDinamicas(prop) || !Array.isArray(prop.options)) return;
        const validos = prop.options.map((o) => o.value);
        if (!validos.some((v) => v === valor)) {
          out.push({ nivel: 'error', ruta, mensaje: `valor ${JSON.stringify(valor)} no está entre las opciones (${validos.map((v) => JSON.stringify(v)).join(', ')})` });
        }
        return;
      }
      case 'multiOptions': {
        if (esExpresion(valor) || tieneOpcionesDinamicas(prop) || !Array.isArray(prop.options)) return;
        if (!Array.isArray(valor)) {
          out.push({ nivel: 'error', ruta, mensaje: 'tiene que ser una lista de opciones' });
          return;
        }
        const validos = prop.options.map((o) => o.value);
        for (const v of valor) if (!validos.includes(v)) out.push({ nivel: 'error', ruta, mensaje: `valor ${JSON.stringify(v)} no está entre las opciones (${validos.map((x) => JSON.stringify(x)).join(', ')})` });
        return;
      }
      case 'boolean':
        if (typeof valor !== 'boolean' && !esExpresion(valor)) out.push({ nivel: 'error', ruta, mensaje: `tiene que ser true o false (es ${JSON.stringify(valor)})` });
        return;
      case 'number':
        if (typeof valor !== 'number' && !esExpresion(valor)) out.push({ nivel: 'aviso', ruta, mensaje: `se espera un número (es ${JSON.stringify(valor)})` });
        return;
      case 'string':
      case 'json':
        if (typeof valor !== 'string' && typeof valor !== 'number') out.push({ nivel: 'aviso', ruta, mensaje: `se espera texto (es ${Array.isArray(valor) ? 'una lista' : typeof valor})` });
        return;
      case 'collection':
        if (!esObjeto(valor)) {
          out.push({ nivel: 'error', ruta, mensaje: 'tiene que ser un objeto (colección)' });
          return;
        }
        validarHijos(prop.options ?? [], valor, ruta, ctx, true);
        return;
      case 'fixedCollection': {
        if (!esObjeto(valor)) {
          out.push({ nivel: 'error', ruta, mensaje: 'tiene que ser un objeto (fixedCollection)' });
          return;
        }
        const grupos = prop.options ?? [];
        for (const [g, v] of Object.entries(valor)) {
          const grupo = grupos.find((x) => x.name === g);
          if (!grupo) {
            out.push({ nivel: 'error', ruta: `${ruta}.${g}`, mensaje: `grupo desconocido (válidos: ${grupos.map((x) => x.name).join(', ') || 'ninguno'})` });
            continue;
          }
          const items = prop.typeOptions?.multipleValues ? v : [v];
          if (prop.typeOptions?.multipleValues && !Array.isArray(v)) {
            out.push({ nivel: 'error', ruta: `${ruta}.${g}`, mensaje: 'tiene que ser una lista' });
            continue;
          }
          (items ?? []).forEach((item, i) => {
            const r = prop.typeOptions?.multipleValues ? `${ruta}.${g}[${i}]` : `${ruta}.${g}`;
            if (!esObjeto(item)) {
              out.push({ nivel: 'error', ruta: r, mensaje: 'tiene que ser un objeto' });
              return;
            }
            validarHijos(grupo.values ?? [], item, r, ctx, false);
          });
        }
        return;
      }
      case 'filter':
        validarFiltro(valor, ruta, ctx);
        return;
      case 'assignmentCollection':
        validarAsignaciones(valor, ruta, ctx);
        return;
      case 'resourceLocator': {
        if (esExpresion(valor)) return;
        if (typeof valor === 'string') {
          out.push({ nivel: 'aviso', ruta, mensaje: 'resourceLocator como texto: n8n espera { "__rl": true, "mode": "...", "value": "..." }' });
          return;
        }
        if (!esObjeto(valor) || valor.__rl !== true) {
          out.push({ nivel: 'error', ruta, mensaje: 'resourceLocator: tiene que ser { "__rl": true, "mode": "...", "value": "..." }' });
          return;
        }
        const modos = (prop.modes ?? []).map((m) => m.name);
        if (modos.length && !modos.includes(valor.mode)) out.push({ nivel: 'error', ruta, mensaje: `modo ${JSON.stringify(valor.mode)} no existe (válidos: ${modos.join(', ')})` });
        return;
      }
      default:
        return;
    }
  }

  // Hijos de una colección o de un grupo de fixedCollection.
  function validarHijos(props, valores, ruta, ctx, esColeccion) {
    for (const [k, v] of Object.entries(valores)) {
      const candidatos = props.filter((p) => p.name === k && !sinMostrar(p));
      if (!candidatos.length) {
        ctx.out.push({ nivel: 'error', ruta: `${ruta}.${k}`, mensaje: `no existe en ${esColeccion ? 'esta colección' : 'este grupo'} (válidos: ${[...new Set(props.filter((p) => !sinMostrar(p)).map((p) => p.name))].join(', ') || 'ninguno'})` });
        continue;
      }
      const visibles = candidatos.filter((p) => mostrado(valores, p, ctx.node, ctx.desc, ctx.raiz) !== false);
      if (!visibles.length) {
        ctx.out.push({ nivel: 'aviso', ruta: `${ruta}.${k}`, mensaje: 'existe pero el editor no lo muestra con estos valores (revisá de qué depende)' });
        validarValor(candidatos[0], v, `${ruta}.${k}`, ctx);
        continue;
      }
      validarValor(visibles[0], v, `${ruta}.${k}`, ctx);
    }
  }

  function validarFiltro(valor, ruta, { out }) {
    if (esExpresion(valor)) return;
    if (!esObjeto(valor) || !Array.isArray(valor.conditions)) {
      out.push({ nivel: 'error', ruta, mensaje: 'condiciones: tiene que ser { "conditions": [...], "combinator": "and" | "or", "options": {...} }' });
      return;
    }
    if (valor.combinator !== undefined && !['and', 'or'].includes(valor.combinator)) out.push({ nivel: 'error', ruta: `${ruta}.combinator`, mensaje: 'tiene que ser "and" u "or"' });
    valor.conditions.forEach((c, i) => {
      const r = `${ruta}.conditions[${i}]`;
      if (!esObjeto(c) || !esObjeto(c.operator)) {
        out.push({ nivel: 'error', ruta: r, mensaje: 'cada condición necesita leftValue, rightValue y operator { type, operation }' });
        return;
      }
      const ops = TIPOS_FILTRO[c.operator.type];
      if (!ops) out.push({ nivel: 'error', ruta: `${r}.operator.type`, mensaje: `tipo ${JSON.stringify(c.operator.type)} no existe (válidos: ${Object.keys(TIPOS_FILTRO).join(', ')})` });
      else if (!ops.includes(c.operator.operation)) out.push({ nivel: 'error', ruta: `${r}.operator.operation`, mensaje: `operación ${JSON.stringify(c.operator.operation)} no existe para ${c.operator.type} (válidas: ${ops.join(', ')})` });
      if (!('leftValue' in c)) out.push({ nivel: 'error', ruta: r, mensaje: 'falta leftValue' });
      if (!c.id) out.push({ nivel: 'aviso', ruta: r, mensaje: 'falta id (n8n usa un uuid por condición)' });
    });
  }

  function validarAsignaciones(valor, ruta, { out }) {
    if (!esObjeto(valor) || !Array.isArray(valor.assignments)) {
      out.push({ nivel: 'error', ruta, mensaje: 'asignaciones: tiene que ser { "assignments": [ { "id", "name", "value", "type" } ] }' });
      return;
    }
    valor.assignments.forEach((a, i) => {
      const r = `${ruta}.assignments[${i}]`;
      if (!esObjeto(a) || typeof a.name !== 'string') {
        out.push({ nivel: 'error', ruta: r, mensaje: 'cada asignación necesita name, value y type' });
        return;
      }
      if (a.type !== undefined && !TIPOS_ASIGNACION.includes(a.type)) out.push({ nivel: 'error', ruta: `${r}.type`, mensaje: `tipo ${JSON.stringify(a.type)} no existe (válidos: ${TIPOS_ASIGNACION.join(', ')})` });
      if (!a.id) out.push({ nivel: 'aviso', ruta: r, mensaje: 'falta id (n8n usa un id por asignación)' });
    });
  }

  // Valida node.parameters contra desc (la descripción de la versión node.typeVersion).
  return function validarNodo(node, desc) {
    const out = [];
    const params = esObjeto(node.parameters) ? node.parameters : {};
    if (node.parameters !== undefined && !esObjeto(node.parameters)) out.push({ nivel: 'error', ruta: 'parameters', mensaje: 'tiene que ser un objeto' });
    let completos = params;
    try {
      completos = getNodeParameters(desc.properties, params, true, false, node, desc) ?? params;
    } catch (e) {
      out.push({ nivel: 'aviso', ruta: 'parameters', mensaje: `n8n no pudo resolver los parámetros por defecto (${e.message.split('\n')[0]})` });
    }
    const ctx = { node, desc, raiz: completos, out };
    for (const [k, v] of Object.entries(params)) {
      const candidatos = desc.properties.filter((p) => p.name === k && !sinMostrar(p));
      if (!candidatos.length) {
        out.push({ nivel: 'error', ruta: k, mensaje: `no existe en ${node.type} v${node.typeVersion}` });
        continue;
      }
      const decisiones = candidatos.map((p) => [p, mostrado(completos, p, node, desc, completos)]);
      const visibles = decisiones.filter(([, d]) => d === true).map(([p]) => p);
      if (!visibles.length) {
        if (decisiones.some(([, d]) => d === null)) {
          out.push({ nivel: 'aviso', ruta: k, mensaje: 'no se pudo decidir si el editor lo muestra' });
        } else {
          const dep = candidatos[0].displayOptions ? JSON.stringify(candidatos[0].displayOptions).slice(0, 160) : '';
          out.push({ nivel: 'error', ruta: k, mensaje: `existe, pero con esta configuración el editor no lo muestra y n8n lo ignora (depende de ${dep})` });
        }
        continue;
      }
      validarValor(visibles[0], v, k, ctx);
    }
    // Parámetros requeridos sin valor: el editor marca el nodo con un problema y no deja publicar.
    try {
      const issues = getNodeParametersIssues(desc.properties, { ...node, parameters: completos }, desc);
      for (const [k, msgs] of Object.entries(issues?.parameters ?? {})) {
        out.push({ nivel: 'error', ruta: k, mensaje: `n8n marca un problema: ${msgs.join(' ')}` });
      }
    } catch (e) {
      out.push({ nivel: 'aviso', ruta: 'parameters', mensaje: `no se pudieron revisar los requeridos (${e.message.split('\n')[0]})` });
    }
    return out;
  };
}
