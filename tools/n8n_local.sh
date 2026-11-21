#!/usr/bin/env bash
# n8n local para probar los workflows de este repo, sin pisarse con otras instancias.
#
# Uso:
#   tools/n8n_local.sh importar   <workflow.json> [id]   importa y muestra el id (fijo para cada workflow)
#   tools/n8n_local.sh ejecutar   <id | workflow.json> [--completo]   corre un workflow que empieza con Manual Trigger
#   tools/n8n_local.sh servir                            levanta el servidor en segundo plano
#   tools/n8n_local.sh publicar   <id | workflow.json>   publica (activa) el workflow: webhooks y formularios quedan en línea
#   tools/n8n_local.sh despublicar <id | workflow.json>
#   tools/n8n_local.sh urls       [id | workflow.json]   URLs de producción de los webhooks y formularios publicados
#   tools/n8n_local.sh parar                             baja el servidor
#   tools/n8n_local.sh estado | listar | id <workflow.json> | config
#
# Variables (cada instancia usa las suyas):
#   N8N_INSTALACION    carpeta donde instalaste n8n (la que tiene node_modules/n8n).
#                      Si no la definís, se usa workflows/node_modules (después de «npm i» en workflows/).
#   N8N_CARPETA        datos de esta instancia (base SQLite, claves, registros). Por defecto: <tmp>/n8n_nodo_cero
#   N8N_PUERTO         puerto del editor y de los webhooks. Por defecto 5678.
#   N8N_PUERTO_RUNNER  puerto del task runner del servidor. Por defecto N8N_PUERTO+1.
#                      Las ejecuciones por CLI usan N8N_PUERTO+2, así no chocan con el servidor de la misma carpeta.
#
# Para correr varias instancias a la vez, cada una necesita su propia N8N_CARPETA y su propio bloque de puertos
# (por ejemplo 5710, 5720, 5730...: cada instancia ocupa N8N_PUERTO, +1 y +2).
#
# En n8n 2.x «activar» se llama «publicar». Con el servidor andando, «publicar» no lo reinicia: n8n aplica
# el cambio por su cuenta (servicio de publicación) y el script espera a que termine. Importar de nuevo un workflow
# publicado lo despublica: después de cada «importar» hay que «publicar» otra vez.

set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$AQUI/.." && pwd)"

ruta_nativa() {
  # En Windows (Git Bash) convierte /c/... a C:/... para node y n8n.
  if command -v cygpath >/dev/null 2>&1; then cygpath -m "$1"; else printf '%s\n' "$1"; fi
}

INSTALACION="${N8N_INSTALACION:-$REPO}"
N8N_JS="$INSTALACION/node_modules/n8n/bin/n8n"
if [ ! -f "$N8N_JS" ]; then
  echo "No encuentro n8n en $INSTALACION/node_modules/n8n." >&2
  echo "Instalalo con:  cd \"$REPO\" && npm i   (o definí N8N_INSTALACION con la carpeta donde lo instalaste)" >&2
  exit 2
fi

TMP_BASE="${TMPDIR:-${TEMP:-/tmp}}"
CARPETA="${N8N_CARPETA:-$TMP_BASE/n8n_nodo_cero}"
PUERTO="${N8N_PUERTO:-5678}"
PUERTO_RUNNER="${N8N_PUERTO_RUNNER:-$((PUERTO + 1))}"
PUERTO_RUNNER_CLI="$((PUERTO + 2))"
mkdir -p "$CARPETA"
CARPETA="$(cd "$CARPETA" && pwd)"

# Entorno de la instancia. Se parece a n8n Cloud: el Code node puede usar crypto y moment.
export N8N_USER_FOLDER="$(ruta_nativa "$CARPETA")"
export N8N_PORT="$PUERTO"
export N8N_LISTEN_ADDRESS="127.0.0.1"
export N8N_HOST="localhost"
export N8N_PROTOCOL="http"
export N8N_WEBHOOK_URL="http://localhost:$PUERTO/"
export N8N_EDITOR_BASE_URL="http://localhost:$PUERTO/"
export N8N_RUNNERS_MODE="internal"
export N8N_RUNNERS_BROKER_PORT="$PUERTO_RUNNER"
export N8N_PYTHON_ENABLED="${N8N_PYTHON_ENABLED:-false}"
export NODE_FUNCTION_ALLOW_BUILTIN="${NODE_FUNCTION_ALLOW_BUILTIN:-crypto}"
export NODE_FUNCTION_ALLOW_EXTERNAL="${NODE_FUNCTION_ALLOW_EXTERNAL:-moment}"
export N8N_DIAGNOSTICS_ENABLED="false"
export N8N_VERSION_NOTIFICATIONS_ENABLED="false"
export N8N_TEMPLATES_ENABLED="false"
export N8N_PERSONALIZATION_ENABLED="false"
export N8N_HIRING_BANNER_ENABLED="false"
export N8N_SECURE_COOKIE="false"
export GENERIC_TIMEZONE="${GENERIC_TIMEZONE:-America/La_Paz}"
export TZ="${TZ:-America/La_Paz}"
export N8N_LOG_LEVEL="${N8N_LOG_LEVEL:-info}"
export N8N_LOG_OUTPUT="console"
export EXECUTIONS_MODE="regular"
# El servicio de publicación revisa su cola cada 15 s por defecto; acá, cada segundo.
export N8N_WORKFLOW_PUBLICATION_OUTBOX_POLL_INTERVAL_MS="${N8N_WORKFLOW_PUBLICATION_OUTBOX_POLL_INTERVAL_MS:-1000}"
export NODE_NO_WARNINGS="1"

N8N_JS_NATIVO="$(ruta_nativa "$N8N_JS")"
n8n_cli() { node "$N8N_JS_NATIVO" "$@"; }

PID_FILE="$CARPETA/servidor.pid"
LOG_FILE="$CARPETA/servidor.log"
URL="http://127.0.0.1:$PUERTO"
DB_NATIVA="$(ruta_nativa "$CARPETA")/.n8n/database.sqlite"

# Consulta de lectura a la base SQLite de la instancia (node:sqlite viene con Node 22.5 o más nuevo).
# Devuelve una fila por línea, columnas separadas por «|».
sql() {
  node -e '
    const { DatabaseSync } = require("node:sqlite");
    const [db, q, ...args] = process.argv.slice(1);
    const filas = new DatabaseSync(db, { readOnly: true }).prepare(q).all(...args);
    for (const f of filas) console.log(Object.values(f).map((v) => (v === null ? "" : v)).join("|"));
  ' "$DB_NATIVA" "$@"
}

# Id estable para cada workflow: «nc» + 14 caracteres del sha1 de la carpeta del workflow
# (o del nombre del archivo si no está en workflows/<categoria>/<id>/). Máximo de n8n: 21.
id_de() {
  local archivo="$1" nombre
  if [ "$(basename "$archivo")" = "workflow.json" ]; then
    nombre="$(basename "$(dirname "$archivo")")"
  else
    nombre="$(basename "$archivo" .json)"
  fi
  printf 'nc%s' "$(node -e 'process.stdout.write(require("crypto").createHash("sha1").update(process.argv[1]).digest("hex").slice(0, 14))' "$nombre")"
}

resolver_id() {
  local x="$1"
  if [ -f "$x" ]; then id_de "$x"; else printf '%s' "$x"; fi
}

servidor_corriendo() {
  curl -s -o /dev/null -m 3 "$URL/healthz" 2>/dev/null
}

pid_en_puerto() {
  # Devuelve el PID que escucha en el puerto (Windows: netstat; Linux/macOS: lsof o ss).
  if command -v netstat >/dev/null 2>&1 && [ -n "${WINDIR:-}" ]; then
    netstat -ano 2>/dev/null | tr -d '\r' | awk -v p=":$1" '$2 ~ p"$" && $4 == "LISTENING" {print $5; exit}'
  elif command -v lsof >/dev/null 2>&1; then
    lsof -ti "tcp:$1" -sTCP:LISTEN 2>/dev/null | head -1
  elif command -v ss >/dev/null 2>&1; then
    ss -ltnp 2>/dev/null | awk -v p=":$1" '$4 ~ p"$" {match($0, /pid=[0-9]+/); print substr($0, RSTART + 4, RLENGTH - 4); exit}'
  fi
}

matar_pid() {
  local pid="$1"
  [ -z "$pid" ] && return 0
  if [ -n "${WINDIR:-}" ]; then
    taskkill //PID "$pid" //T //F >/dev/null 2>&1 || true
  else
    kill -TERM "$pid" 2>/dev/null || true
  fi
}

cmd_importar() {
  local archivo="${1:?Falta el workflow.json}" id="${2:-}"
  [ -f "$archivo" ] || { echo "No existe $archivo" >&2; exit 2; }
  [ -n "$id" ] || id="$(id_de "$archivo")"
  mkdir -p "$CARPETA/importar"
  local copia="$CARPETA/importar/$id.json"
  node -e '
    const fs = require("fs");
    const [src, dst, id] = process.argv.slice(1);
    const wf = JSON.parse(fs.readFileSync(src, "utf8"));
    wf.id = id;
    delete wf.active;
    fs.writeFileSync(dst, JSON.stringify(wf));
  ' "$(ruta_nativa "$archivo")" "$(ruta_nativa "$copia")" "$id"
  # ¿Estaba publicado? Importar lo despublica (n8n 2.x, --activeState=false por defecto).
  local antes=""
  if [ -f "$CARPETA/.n8n/database.sqlite" ]; then antes="$(sql "select active from workflow_entity where id = ?" "$id" 2>/dev/null || true)"; fi
  local salida
  if ! salida="$(n8n_cli import:workflow --input="$(ruta_nativa "$copia")" 2>&1)"; then
    printf '%s\n' "$salida" | tail -20 >&2
    echo "No se pudo importar $archivo" >&2
    exit 1
  fi
  if ! printf '%s' "$salida" | grep -q "Successfully imported 1 workflow"; then
    printf '%s\n' "$salida" | grep -v "migration" | tail -20 >&2
    echo "n8n no confirmó la importación de $archivo" >&2
    exit 1
  fi
  if [ "$antes" = "1" ]; then
    echo "Ojo: estaba publicado y n8n lo despublicó al importarlo. Publicalo de nuevo." >&2
  fi
  echo "$id"
}

cmd_ejecutar() {
  local x="${1:?Falta el id o el workflow.json}" completo="${2:-}" id
  if [ -f "$x" ]; then id="$(cmd_importar "$x")"; else id="$x"; fi
  mkdir -p "$CARPETA/ejecuciones"
  local crudo="$CARPETA/ejecuciones/$id.txt" json="$CARPETA/ejecuciones/$id.json"
  set +e
  N8N_RUNNERS_BROKER_PORT="$PUERTO_RUNNER_CLI" n8n_cli execute --id="$id" --rawOutput >"$crudo" 2>&1
  local codigo=$?
  set -e
  node -e '
    const fs = require("fs");
    const [crudo, destino, completo] = process.argv.slice(1);
    const t = fs.readFileSync(crudo, "utf8");
    const i = t.search(/^\{/m);
    if (i < 0) { console.error(t.split("\n").slice(-25).join("\n")); console.error("No hubo salida JSON de la ejecución."); process.exit(1); }
    let j;
    try { j = JSON.parse(t.slice(i)); } catch (e) {
      // Cuando falla, n8n imprime el JSON y después el error: se corta en la última llave.
      const k = t.lastIndexOf("\n}");
      j = JSON.parse(t.slice(i, k + 2));
    }
    fs.writeFileSync(destino, JSON.stringify(j, null, 2));
    if (completo === "--completo") { console.log(JSON.stringify(j, null, 2)); }
    else {
      const rd = j.data?.resultData?.runData ?? {};
      const res = { estado: j.status, nodos: {} };
      for (const [nombre, corridas] of Object.entries(rd)) {
        const c = corridas[corridas.length - 1];
        res.nodos[nombre] = c.error ? { error: c.error.message } : (c.data?.main ?? []).map((s) => (s ?? []).map((x) => x.json));
      }
      const err = j.data?.resultData?.error;
      if (err) res.error = { mensaje: err.message, nodo: err.node?.name, descripcion: err.description };
      console.log(JSON.stringify(res, null, 2));
    }
    process.exit(j.status === "success" ? 0 : 1);
  ' "$(ruta_nativa "$crudo")" "$(ruta_nativa "$json")" "$completo" || { echo "La ejecución terminó con error (código n8n $codigo). Detalle: $json" >&2; exit 1; }
}

cmd_servir() {
  if servidor_corriendo; then echo "Ya hay un n8n respondiendo en $URL"; return 0; fi
  local ocupado; ocupado="$(pid_en_puerto "$PUERTO_RUNNER" || true)"
  if [ -n "$ocupado" ]; then echo "El puerto del runner $PUERTO_RUNNER está ocupado (PID $ocupado). Elegí otro N8N_PUERTO." >&2; exit 1; fi
  : >"$LOG_FILE"
  nohup node "$N8N_JS_NATIVO" start >>"$LOG_FILE" 2>&1 &
  echo $! >"$PID_FILE"
  local i
  for i in $(seq 1 180); do
    if curl -s -m 2 "$URL/healthz/readiness" 2>/dev/null | grep -q '"ok"'; then
      echo "n8n listo en $URL  (editor: http://localhost:$PUERTO , registro: $(ruta_nativa "$LOG_FILE"))"
      return 0
    fi
    if grep -q "There was an error\|EADDRINUSE\|Error: listen" "$LOG_FILE" 2>/dev/null; then break; fi
    sleep 1
  done
  tail -30 "$LOG_FILE" >&2
  echo "n8n no arrancó en $URL" >&2
  exit 1
}

cmd_parar() {
  local pid
  pid="$(pid_en_puerto "$PUERTO" || true)"
  if [ -z "$pid" ] && [ -f "$PID_FILE" ]; then
    pid="$(cat "$PID_FILE")"
    if [ -n "${WINDIR:-}" ] && [ -f "/proc/$pid/winpid" ]; then pid="$(cat "/proc/$pid/winpid")"; fi
  fi
  if [ -z "$pid" ]; then echo "No hay servidor en el puerto $PUERTO."; rm -f "$PID_FILE"; return 0; fi
  matar_pid "$pid"
  local r; r="$(pid_en_puerto "$PUERTO_RUNNER" || true)"; matar_pid "$r"
  local i
  for i in $(seq 1 20); do
    servidor_corriendo || break
    sleep 1
  done
  rm -f "$PID_FILE"
  if servidor_corriendo; then echo "El servidor sigue respondiendo en $URL" >&2; exit 1; fi
  echo "n8n detenido (puerto $PUERTO)."
}

# Espera a que el servidor aplique la última publicación o despublicación del workflow (tabla de la cola
# de publicación de n8n 2.x). Si el servidor no corre, n8n la aplica cuando arranca.
ultimo_outbox() {
  local u; u="$(sql "select ifnull(max(id), 0) as m from workflow_publication_outbox" 2>/dev/null || true)"
  printf '%s' "${u:-0}"
}

esperar_publicacion() {
  local id="$1" desde="$2" i fila
  if ! servidor_corriendo; then
    echo "El servidor no está corriendo: el cambio se aplica cuando lo levantes con «servir»."
    return 0
  fi
  for i in $(seq 1 90); do
    fila="$(sql "select status, ifnull(errorMessage, '') as e from workflow_publication_outbox where workflowId = ? and id > ? order by id desc limit 1" "$id" "$desde" 2>/dev/null || true)"
    case "$fila" in
      completed*) return 0 ;;
      failed*) echo "n8n no pudo aplicar el cambio: ${fila#failed|}" >&2; return 1 ;;
    esac
    sleep 1
  done
  echo "El servidor no aplicó el cambio en 90 s. Mirá el registro: $(ruta_nativa "$LOG_FILE")" >&2
  return 1
}

cmd_publicar() {
  local id; id="$(resolver_id "${1:?Falta el id o el workflow.json}")"
  local salida desde; desde="$(ultimo_outbox)"
  salida="$(n8n_cli publish:workflow --id="$id" 2>&1)" || { printf '%s\n' "$salida" | grep -v migration | tail -15 >&2; exit 1; }
  if printf '%s' "$salida" | grep -qi "error\|not found\|not supported"; then
    printf '%s\n' "$salida" | grep -v migration | tail -15 >&2
    exit 1
  fi
  esperar_publicacion "$id" "$desde" || exit 1
  local err
  err="$(sql "select errorMessage from workflow_publication_trigger_status where workflowId = ? and status <> 'activated' and errorMessage is not null" "$id" 2>/dev/null || true)"
  if [ -n "$err" ]; then echo "Un disparador no se activó: $err" >&2; exit 1; fi
  echo "Publicado $id."
  cmd_urls "$id"
}

cmd_despublicar() {
  local id; id="$(resolver_id "${1:?Falta el id o el workflow.json}")"
  local desde; desde="$(ultimo_outbox)"
  n8n_cli unpublish:workflow --id="$id" 2>&1 | grep -v migration | tail -3
  esperar_publicacion "$id" "$desde" || true
}

# URLs de producción de lo publicado (tabla webhook_entity), con el tipo de disparador.
cmd_urls() {
  local id=""
  [ -n "${1:-}" ] && id="$(resolver_id "$1")"
  node -e '
    const { DatabaseSync } = require("node:sqlite");
    const [db, base, id] = process.argv.slice(1);
    const d = new DatabaseSync(db, { readOnly: true });
    const ws = d.prepare("select w.method, w.webhookPath, w.node, e.name, e.nodes from webhook_entity w join workflow_entity e on e.id = w.workflowId where (length(?) = 0 or w.workflowId = ?) order by e.name, w.webhookPath").all(id, id);
    if (!ws.length) { console.log("(sin webhooks ni formularios publicados)"); process.exit(0); }
    for (const w of ws) {
      const nodo = JSON.parse(w.nodes).find((n) => n.name === w.node) ?? {};
      const t = String(nodo.type ?? "");
      if (t.endsWith("formTrigger")) { if (w.method === "GET") console.log(`formulario  ${base}/form/${w.webhookPath}   (${w.name} · ${w.node})`); }
      else if (t.endsWith("chatTrigger")) console.log(`chat        ${w.method} ${base}/webhook/${w.webhookPath}   (${w.name} · ${w.node})`);
      else console.log(`webhook     ${w.method} ${base}/webhook/${w.webhookPath}   (${w.name} · ${w.node})`);
    }
  ' "$DB_NATIVA" "$URL" "$id"
}

cmd_estado() {
  if servidor_corriendo; then echo "corriendo en $URL (carpeta $(ruta_nativa "$CARPETA"))"; else echo "detenido (carpeta $(ruta_nativa "$CARPETA"), puerto $PUERTO)"; fi
}

cmd_config() {
  echo "instalación:   $INSTALACION"
  echo "carpeta:       $(ruta_nativa "$CARPETA")"
  echo "puerto:        $PUERTO   (webhooks: $URL/webhook/<path>, formularios: $URL/form/<path>)"
  echo "runner:        $PUERTO_RUNNER (servidor), $PUERTO_RUNNER_CLI (ejecuciones por CLI)"
  echo "base:          $DB_NATIVA"
  echo "n8n:           $(n8n_cli --version 2>/dev/null | tail -1)"
}

sub="${1:-}"; shift || true
case "$sub" in
  importar) cmd_importar "$@" ;;
  ejecutar) cmd_ejecutar "$@" ;;
  servir) cmd_servir ;;
  publicar) cmd_publicar "$@" ;;
  despublicar) cmd_despublicar "$@" ;;
  urls) cmd_urls "$@" ;;
  parar) cmd_parar ;;
  estado) cmd_estado ;;
  listar) n8n_cli list:workflow 2>/dev/null | grep '|' ;;
  id) id_de "${1:?Falta el workflow.json}"; echo ;;
  config) cmd_config ;;
  *) sed -n '2,29p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 2 ;;
esac
