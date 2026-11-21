# n8n local para probar los workflows

Cómo importar, ejecutar, publicar y llamar los workflows de este repo en una n8n 2.48.7 propia, en tu compu, sin cuenta y sin pisarte con otras instancias que corran al mismo tiempo. Todo se hace con `tools/n8n_local.sh` (Bash; en Windows, Git Bash). Cada comando de esta página se probó en Windows 11 con Node 24 y n8n 2.48.7, con dos instancias andando a la vez.

## 1. Instalación (una vez)

Dentro de `workflows/`:

```bash
npm i            # instala n8n 2.48.7 (está en devDependencies); tarda varios minutos
npx n8n --version   # 2.48.7
```

O en cualquier otra carpeta, y después la indicás con `N8N_INSTALACION`:

```bash
mkdir -p ~/n8n_local && cd ~/n8n_local && npm init -y && npm i n8n@2.48.7 --no-audit --no-fund
```

## 2. Una instancia por persona o por tarea

Cada instancia necesita **su propia carpeta de datos** (base SQLite, claves, registros) y **su propio bloque de tres puertos**: `N8N_PUERTO` (editor y webhooks), `N8N_PUERTO+1` (task runner del servidor) y `N8N_PUERTO+2` (task runner de las ejecuciones por CLI). Con eso, dos o más instancias corren a la vez sin chocar.

| quién | `N8N_CARPETA` | `N8N_PUERTO` (usa también +1 y +2) |
|---|---|---|
| fundamentos e IA | `<tmp>/n8n_fundamentos` | 5710 |
| Avalanche Fuji | `<tmp>/n8n_avalanche` | 5720 |
| Clerk | `<tmp>/n8n_clerk` | 5730 |
| Supabase | `<tmp>/n8n_supabase` | 5740 |
| proyectos | `<tmp>/n8n_proyectos` | 5750 |
| pruebas de todo el repo (`npm run probar`) | `<tmp>/n8n_probar` | 5790 |

Variables del script:

| variable | para qué | por defecto |
|---|---|---|
| `N8N_INSTALACION` | carpeta que tiene `node_modules/n8n` | `workflows/` (después de `npm i`) |
| `N8N_CARPETA` | datos de esta instancia | `<tmp>/n8n_nodo_cero` |
| `N8N_PUERTO` | editor y webhooks | `5678` |
| `N8N_PUERTO_RUNNER` | runner del servidor | `N8N_PUERTO+1` |

Definilas una vez por terminal. Ejemplo para la instancia de Avalanche, con la instalación de referencia de este proyecto:

```bash
export N8N_INSTALACION="C:/Users/ASUS/AppData/Local/Temp/claude/7acfd8abc56a2606/a02a921c-6ede-4707-af48-de17f9512df7/scratchpad/n8n_local"
export N8N_CARPETA="C:/Users/ASUS/AppData/Local/Temp/claude/7acfd8abc56a2606/a02a921c-6ede-4707-af48-de17f9512df7/scratchpad/n8n_avalanche"
export N8N_PUERTO=5720
NL="c:/Users/ASUS/Desktop/Nueva carpeta/github_nodo_cero/workflows/tools/n8n_local.sh"
bash "$NL" config      # muestra carpeta, puertos, base y versión
```

Si tu herramienta no conserva las variables entre comandos, ponelas delante de cada uno: `N8N_INSTALACION=... N8N_CARPETA=... N8N_PUERTO=5720 bash "$NL" ...`.

El script prepara un entorno parecido a n8n Cloud: el Code node puede usar `require('crypto')` (en n8n Cloud también está permitido, junto con `moment`), zona horaria `America/La_Paz`, sin telemetría, escuchando nada más en `127.0.0.1`.

## 3. Importar

```bash
bash "$NL" importar "c:/.../workflows/10-avalanche-fuji/10-fuji-estado-de-la-red/workflow.json"
# imprime el id con el que quedó, por ejemplo nc1f0e5a3b2c4d6e
```

- El id es fijo para cada workflow (`nc` + 14 caracteres del sha1 del nombre de su carpeta), así que importar de nuevo **reemplaza** la versión anterior en vez de duplicarla. `bash "$NL" id <workflow.json>` lo muestra sin importar.
- El archivo del repo no se toca: el script le agrega el `id` en una copia (`<carpeta>/importar/<id>.json`).
- **Importar despublica.** En n8n 2.x `import:workflow` deja todo despublicado (flag `--activeState=false` por defecto). Si el workflow tenía webhook o formulario publicado, después de importar hay que volver a `publicar`.
- Al importar, n8n 2.48.7 revisa la estructura y rechaza el archivo si hay ids de nodo repetidos, nombres de nodo repetidos o conexiones a nodos que no existen («Workflow structure is invalid»). No revisa tipos de nodo ni parámetros: para eso está el auditor (`npm run auditar`).
- `bash "$NL" listar` muestra `id|nombre` de todo lo importado.

## 4. Ejecutar por CLI (workflows con Manual Trigger que no necesitan credenciales)

```bash
bash "$NL" ejecutar "c:/.../workflows/00-fundamentos/01-hola-n8n/workflow.json"      # importa y ejecuta
bash "$NL" ejecutar nc1f0e5a3b2c4d6e                                              # ya importado
bash "$NL" ejecutar nc1f0e5a3b2c4d6e --completo                                   # todo el JSON de la ejecución
```

Salida (resumen): `{ "estado": "success", "nodos": { "<nodo>": [[ <json de cada ítem por salida> ]] }, "error"?: {...} }`. Código de salida 0 si la ejecución terminó en `success`, 1 si no. La ejecución completa queda en `<carpeta>/ejecuciones/<id>.json` y lo que imprimió n8n en `<carpeta>/ejecuciones/<id>.txt`.

- Por debajo es `n8n execute --id=<id> --rawOutput`, con el runner en `N8N_PUERTO+2`: se puede ejecutar aunque el servidor de la misma carpeta esté corriendo.
- Cada ejecución arranca n8n entero: tarda entre 5 y 30 segundos (más si la compu está ocupada).
- Si un nodo falla, el resumen trae `error.mensaje`, `error.nodo` y `error.descripcion`.
- Los nodos con salida vacía aparecen como `[]` (por ejemplo, la rama «false» de un IF que no recibió nada).

## 5. Servir, publicar y llamar con curl

```bash
bash "$NL" servir                 # levanta el servidor en segundo plano y espera a que responda
bash "$NL" importar ".../02-mi-primera-api/workflow.json"
bash "$NL" publicar ".../02-mi-primera-api/workflow.json"   # o el id
# Publicado nc....
# webhook     POST http://127.0.0.1:5710/webhook/hola   (Nodo Cero · ... · Recibir pedido)
bash "$NL" urls                   # URLs de producción de todo lo publicado
```

- **Arranque:** la primera vez crea la base y tarda alrededor de 1 minuto; con la compu cargada puede pasar de 2. El editor queda en `http://localhost:<N8N_PUERTO>` (te pide crear una cuenta de dueña local la primera vez; para los webhooks no hace falta). Registro: `<carpeta>/servidor.log`.
- **En n8n 2.x «activar» se llama «publicar»** (`publish:workflow` / `unpublish:workflow` en la CLI; el botón «Publish» en el editor). El servidor aplica la publicación por su cuenta, sin reiniciar (servicio de publicación con una cola en la base). El script baja el intervalo de esa cola de 15 s a 1 s (`N8N_WORKFLOW_PUBLICATION_OUTBOX_POLL_INTERVAL_MS=1000`) y espera a que quede `completed`: en la práctica, 5 segundos. Si un disparador no se puede activar (por ejemplo, un path de webhook repetido) lo informa y sale con error.
- Si publicás con el servidor apagado, se aplica cuando lo levantás (probado). `parar` no despublica: lo que estaba publicado vuelve a estar en línea en el próximo `servir`.
- `bash "$NL" despublicar <id>` lo saca de línea.

Llamadas típicas:

```bash
# Webhook POST con JSON (responseMode «responseNode» + Respond to Webhook)
curl -s -X POST -H 'Content-Type: application/json' -d '{"hola":"mundo"}' http://127.0.0.1:5710/webhook/hola

# Webhook GET con parámetros (llegan en $json.query)
curl -s "http://127.0.0.1:5720/webhook/fuji-saldo?address=0x0000000000000000000000000000000000000000"

# Formulario: la página
curl -s http://127.0.0.1:5710/form/mi-formulario | grep -o '<title>[^<]*'

# Formulario: enviarlo. Los campos se llaman field-0, field-1... en el orden de formFields (aunque tengan fieldName).
# Si el formulario termina en un nodo Form «completion», n8n responde {"formWaitingUrl": "..."} y la página final está en esa URL.
u=$(curl -s -X POST --form-string 'field-0=Las Fujinas' --form-string 'field-1=n8n' http://127.0.0.1:5710/form/mi-formulario \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).formWaitingUrl))')
curl -s "$u" | grep -o 'Gracias[^<"]*'
```

- Usá siempre la URL de producción (`/webhook/...`, `/form/...`) con el workflow publicado. Las URLs de prueba (`/webhook-test/...`, `/form-test/...`) necesitan el editor abierto escuchando.
- Para ver qué pasó en una ejecución de webhook, abrí el editor (pestaña Executions). También quedan en la base de la instancia.

## 6. Parar

```bash
bash "$NL" parar      # baja el servidor de esta instancia (y su runner)
bash "$NL" estado     # corriendo / detenido
```

`parar` busca el proceso que escucha en `N8N_PUERTO` (en Windows con `netstat` y `taskkill`): no toca las otras instancias.

## 7. Auditar y probar todo el repo

```bash
cd "c:/Users/ASUS/Desktop/Nueva carpeta/github_nodo_cero/workflows"
# con n8n instalado en workflows/ (npm i), o apuntando a otra instalación:
export N8N_MODULES="C:/Users/ASUS/AppData/Local/Temp/claude/7acfd8abc56a2606/a02a921c-6ede-4707-af48-de17f9512df7/scratchpad/n8n_local/node_modules"
node tools/auditar.mjs                                   # todo el repo; o: npm run auditar
node tools/auditar.mjs 10-avalanche-fuji/12-fuji-leer-transaccion   # una carpeta o un workflow.json
node tools/auditar.mjs --estricto                        # los avisos también cuentan como falla

export N8N_INSTALACION="C:/Users/ASUS/AppData/Local/Temp/claude/7acfd8abc56a2606/a02a921c-6ede-4707-af48-de17f9512df7/scratchpad/n8n_local"
node tools/probar_local.mjs                              # o: npm run probar; escribe docs/PRUEBAS.md
node tools/probar_local.mjs 00-fundamentos --sin-informe # una parte, sin tocar PRUEBAS.md
```

- El auditor tarda unos segundos y termina con `APROBADO` (código 0) o `FALLAS: n` (código 1). Errores: lo que rompe la importación, la ejecución o una regla de la especificación. Avisos: lo que conviene mirar.
- `probar_local.mjs` importa todo de una vez en su propia instancia (`N8N_CARPETA`, por defecto `<tmp>/n8n_probar`; runner en `N8N_PUERTO+2`, por defecto 5792), ejecuta por CLI los que tienen `"probado": "ejecutado"` en `meta.json` y empiezan con Manual Trigger, y escribe `docs/PRUEBAS.md`. Cada ejecución tarda entre 5 y 30 segundos. Sale con código 1 si algo no se importa o no termina en `success`.

## 8. Credenciales

Los workflows del repo no traen credenciales. Los que necesitan cuentas (Gemini, Supabase, Clerk, GitHub) se importan y se auditan igual, pero para ejecutarlos hay que crear la credencial en el editor de tu instancia (Credentials, el tipo exacto figura en `REFERENCIA_NODOS.md` y en el README del workflow) y elegirla en cada nodo. Nunca exportes ni subas credenciales al repo.

## 9. Cosas de n8n 2.48.7 que conviene saber

- Avisos que aparecen al arrancar y se pueden ignorar en local: el runner de Python no arranca (falta su entorno virtual; el Code node en Python no está disponible localmente: usá JavaScript), el modo «internal» del task runner está marcado como obsoleto, y «Running n8n outside a container is deprecated».
- El Code node corre en el task runner (proceso aparte). Ahí no existen `fetch` ni el `crypto` global: usá `require('crypto')` o `this.helpers.httpRequest(...)`. Detalle en `REFERENCIA_NODOS.md`.
- `n8n execute` arranca desde el primer nodo habilitado de tipo Execute Workflow Trigger y, si no hay, desde el primer Manual Trigger; sin ninguno de los dos falla con «Missing node to start execution». Un workflow con Webhook o Formulario puede sumar un Manual Trigger con datos de ejemplo (un Set con la misma forma que el pedido) para probar la lógica por CLI.
- Dos instancias con el mismo `N8N_PUERTO` o la misma `N8N_CARPETA` sí chocan: usá la tabla de arriba.
- No corras `n8n` a mano sin `N8N_USER_FOLDER`: crea `~/.n8n` en tu carpeta de usuario (con una clave de cifrado nueva) y mezcla datos entre pruebas. El script y `probar_local.mjs` siempre lo definen.
- Respond to Webhook (1.1 o más) falla con «No Webhook node found in the workflow» si no hay un Webhook, Form Trigger, Chat Trigger o Wait entre sus nodos anteriores. Si la rama de prueba con Manual Trigger llega a la misma cadena que el Webhook, la ejecución por CLI pasa los datos sin responder (probado).

## Referencia rápida de subcomandos

| subcomando | qué hace |
|---|---|
| `importar <workflow.json> [id]` | importa (o reemplaza) y muestra el id |
| `ejecutar <id \| workflow.json> [--completo]` | corre por CLI un workflow con Manual Trigger |
| `servir` | levanta el servidor en segundo plano |
| `publicar <id \| workflow.json>` | publica y espera a que webhooks y formularios queden en línea |
| `despublicar <id \| workflow.json>` | lo saca de línea |
| `urls [id \| workflow.json]` | URLs de producción publicadas |
| `parar` | baja el servidor |
| `estado`, `listar`, `id <workflow.json>`, `config` | información |
