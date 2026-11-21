# Referencia de nodos de n8n 2.48.7

Sacada del paquete instalado (n8n 2.48.7, n8n-nodes-base 2.48.4, @n8n/n8n-nodes-langchain 2.48.5), no de la memoria. La regenerás con `npm run referencia` dentro de `workflows/` (con n8n instalado ahí o con `N8N_MODULES` apuntando a otra instalación).

Cómo leerla: el tipo va tal cual en `"type"` del nodo; la versión más alta va en `"typeVersion"`. Los parámetros son los de esa versión: nombre exacto, tipo, valor por defecto, opciones válidas y «se muestra si», que es la condición (displayOptions) para que el parámetro exista en el editor. Si un parámetro no se muestra con los valores que pusiste, n8n lo ignora. `@version` es la typeVersion del nodo. Un valor que empieza con `=` es una expresión (por ejemplo `={{ $json.campo }}`).

## Índice

| tipo | typeVersion más alta | versiones aceptadas | credenciales |
|---|---|---|---|
| `n8n-nodes-base.manualTrigger` | **1** | 1 | — |
| `n8n-nodes-base.webhook` | **2.2** | 1, 1.1, 2, 2.1, 2.2 | `httpBasicAuth`, `httpHeaderAuth`, `jwtAuth` |
| `n8n-nodes-base.formTrigger` | **2.6** | 1, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6 | `httpBasicAuth` |
| `n8n-nodes-base.scheduleTrigger` | **1.4** | 1, 1.1, 1.2, 1.3, 1.4 | — |
| `@n8n/n8n-nodes-langchain.chatTrigger` | **1.5** | 1, 1.1, 1.2, 1.3, 1.4, 1.5 | `httpBasicAuth` |
| `n8n-nodes-base.set` | **3.5** | 1, 2, 3, 3.1, 3.2, 3.3, 3.4, 3.5 | — |
| `n8n-nodes-base.code` | **2** | 1, 2 | — |
| `n8n-nodes-base.if` | **2.4** | 1, 2, 2.1, 2.2, 2.3, 2.4 | — |
| `n8n-nodes-base.switch` | **3.5** | 1, 2, 3, 3.1, 3.2, 3.3, 3.4, 3.5 | — |
| `n8n-nodes-base.filter` | **2.4** | 1, 2, 2.1, 2.2, 2.3, 2.4 | — |
| `n8n-nodes-base.merge` | **3.2** | 1, 2, 2.1, 3, 3.1, 3.2 | — |
| `n8n-nodes-base.aggregate` | **1** | 1 | — |
| `n8n-nodes-base.splitOut` | **1.1** | 1, 1.1 | — |
| `n8n-nodes-base.noOp` | **1** | 1 | — |
| `n8n-nodes-base.stickyNote` | **1** | 1 | — |
| `n8n-nodes-base.respondToWebhook` | **1.5** | 1, 1.1, 1.2, 1.3, 1.4, 1.5 | `jwtAuth` |
| `n8n-nodes-base.form` | **2.5** | 1, 2.3, 2.4, 2.5 | — |
| `n8n-nodes-base.httpRequest` | **4.5** | 1, 2, 3, 4, 4.1, 4.2, 4.3, 4.4, 4.5 | `httpSslAuth` y cualquiera elegida con `authentication` |
| `n8n-nodes-base.httpRequestTool` | **4.5** | 3, 4, 4.1, 4.2, 4.3, 4.4, 4.5 | `httpSslAuth` y cualquiera elegida con `authentication` |
| `@n8n/n8n-nodes-langchain.toolHttpRequest` | **1.1** | 1, 1.1 | — y cualquiera elegida con `authentication` |
| `n8n-nodes-base.jwt` | **1** | 1 | `jwtAuth` |
| `n8n-nodes-base.crypto` | **2** | 1, 2 | `crypto` |
| `n8n-nodes-base.supabase` | **1** | 1 | `supabaseApi`, `supabaseOAuth2Api` |
| `n8n-nodes-base.supabaseTool` | **1** | 1 | `supabaseApi`, `supabaseOAuth2Api` |
| `n8n-nodes-base.postgres` | **2.8** | 1, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8 | `postgres` |
| `n8n-nodes-base.github` | **1.1** | 1, 1.1 | `githubApi`, `githubOAuth2Api`, `githubAppApi` |
| `n8n-nodes-base.gmail` | **2.2** | 1, 2, 2.1, 2.2 | `googleApi`, `gmailOAuth2` |
| `n8n-nodes-base.telegram` | **1.2** | 1, 1.1, 1.2 | `telegramApi` |
| `@n8n/n8n-nodes-langchain.agent` | **3.1** | 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 3, 3.1 | — |
| `@n8n/n8n-nodes-langchain.chainLlm` | **1.9** | 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9 | — |
| `@n8n/n8n-nodes-langchain.textClassifier` | **1.1** | 1, 1.1 | — |
| `@n8n/n8n-nodes-langchain.informationExtractor` | **1.2** | 1, 1.1, 1.2 | — |
| `@n8n/n8n-nodes-langchain.outputParserStructured` | **1.3** | 1, 1.1, 1.2, 1.3 | — |
| `@n8n/n8n-nodes-langchain.lmChatGoogleGemini` | **1.2** | 1, 1.1, 1.2 | `googlePalmApi` |
| `@n8n/n8n-nodes-langchain.lmChatOpenAi` | **1.3** | 1, 1.1, 1.2, 1.3 | `openAiApi` |
| `@n8n/n8n-nodes-langchain.embeddingsGoogleGemini` | **1** | 1 | `googlePalmApi` |
| `@n8n/n8n-nodes-langchain.embeddingsOpenAi` | **1.2** | 1, 1.1, 1.2 | `openAiApi` |
| `@n8n/n8n-nodes-langchain.memoryBufferWindow` | **1.4** | 1, 1.1, 1.2, 1.3, 1.4 | — |
| `@n8n/n8n-nodes-langchain.memoryPostgresChat` | **1.4** | 1, 1.1, 1.2, 1.3, 1.4 | `postgres` |
| `@n8n/n8n-nodes-langchain.vectorStoreSupabase` | **1.4** | 1, 1.1, 1.2, 1.3, 1.4 | `supabaseApi` |
| `@n8n/n8n-nodes-langchain.documentDefaultDataLoader` | **1.1** | 1, 1.1 | — |
| `@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter` | **1** | 1 | — |

## Lo que conviene saber antes de escribir un workflow

Todo lo de esta sección se probó en n8n 2.48.7 instalada con npm: los ejemplos de abajo pasan el auditor (`npm run auditar`) y se importan sin errores; los de Manual Trigger, Webhook, Code, IF, HTTP Request y Formulario también se ejecutaron (por CLI y con el servidor publicado, llamándolos con curl).

### Diferencias de n8n 2.x que cambian cómo se escribe el JSON

- **«Activar» ahora es «Publicar».** En el editor es el botón «Publish»; en la CLI, `publish:workflow` y `unpublish:workflow`. Un workflow con Webhook, Form Trigger, Chat Trigger o Schedule Trigger responde en la URL de producción (`/webhook/...`, `/form/...`) cuando está publicado. El JSON del repo nunca lleva `"active": true`.
- **Importar valida la estructura.** `import:workflow` rechaza el archivo entero si hay ids de nodo repetidos, nombres de nodo repetidos o conexiones a nodos que no existen («Workflow structure is invalid»). No revisa tipos de nodo ni parámetros: eso lo hace el auditor. Importar también deja el workflow despublicado.
- **Respond to Webhook (1.1 o más) exige un disparador web antes.** Entre los nodos anteriores tiene que haber un Webhook, Form Trigger, Chat Trigger o Wait; si no, falla con «No Webhook node found in the workflow». Si una rama de prueba con Manual Trigger llega al mismo Respond to Webhook y el Webhook también está conectado a esa cadena, la ejecución manual pasa los datos sin responder nada (probado en `02-mi-primera-api` de ejemplo).
- **Webhook 2.2:** el código de respuesta va en `options.responseCode` (una fixedCollection `{ "values": { "responseCode": 200 } }`) cuando `responseMode` no es `responseNode`. `responseMode` acepta `onReceived`, `lastNode`, `responseNode` y `streaming`. Lo que llega está en `$json.body`, `$json.query`, `$json.headers` y `$json.params`.
- **Form Trigger 2.6:** la ruta va en `options.path` (desde 2.2). Cada campo tiene `fieldLabel` (lo que ve la persona) y, desde 2.5, `fieldName` opcional: si lo ponés, es la clave en la salida (`$json.archivo`); si no, la clave es el `fieldLabel` (`$json['Nombre del equipo']`). Al enviar el formulario por POST, los campos se llaman `field-0`, `field-1`... en el orden de `formFields`. La página final se arma con un nodo `n8n-nodes-base.form` en `operation: "completion"` y el Form Trigger con `responseMode: "lastNode"`.
- **Chat Trigger 1.5:** con `public: false` (por defecto) el chat se usa desde el editor, con «Open chat». Con `public: true` y el workflow publicado, n8n sirve un chat propio en `/webhook/<webhookId>/chat` (`mode: "hostedChat"`) o lo deja como API para tu página (`mode: "webhook"`, con el paquete `@n8n/chat`).
- **AI Agent 3.1:** no hay que elegir tipo de agente (es el de herramientas). `promptType: "auto"` toma `$json.chatInput` del Chat Trigger; con otro disparador usá `promptType: "define"` y `text`. El mensaje de sistema va en `options.systemMessage`. Para conectar un Structured Output Parser poné `hasOutputParser: true`; para un modelo de respaldo, `needsFallback: true`.
- **Vector store como herramienta:** desde 1.3, `mode: "retrieve-as-tool"` ya no lleva `toolName` (el nombre de la herramienta sale del nombre del nodo) y necesita `toolDescription`.
- **Herramientas HTTP:** `n8n-nodes-base.httpRequestTool` 4.5 es el HTTP Request de siempre usado como herramienta del agente, con `toolDescription`. Para que el modelo complete un valor, usá `{{ $fromAI('clave', 'descripción', 'string') }}` (tipos: `string`, `number`, `boolean`, `json`). `@n8n/n8n-nodes-langchain.toolHttpRequest` 1.1 también existe, pero es el modelo anterior.
- **Credenciales:** no pongas `credentials` en el JSON. n8n marca el nodo y pide elegir o crear la credencial al abrirlo. Si alguna vez aparece, nunca con `id`. Los tipos exactos están en el índice de arriba y en cada ficha. Los que más se usan: `googlePalmApi` («Google Gemini(PaLM) Api»), `openAiApi` («OpenAI»), `supabaseApi` («Supabase API»: campos Host, la URL del proyecto sin `/rest/v1`, y Secret Key, que acepta la clave secreta nueva `sb_secret_...` o la service_role de antes), `postgres` («Postgres»), `githubApi` («GitHub API»), `httpHeaderAuth` («Header Auth»).
- **HTTP Request con credencial:** la credencial no figura en la lista fija del nodo. Se elige con `authentication`: `predefinedCredentialType` + `nodeCredentialType` (por ejemplo `githubApi`) o `genericCredentialType` + `genericAuthType` (por ejemplo `httpHeaderAuth`). El auditor entiende las dos formas.
- **Sticky notes:** `content` (Markdown), `width`, `height` y `color` (número del 1 al 7). No tienen conexiones.

### Forma de las conexiones

`connections` es un objeto cuya clave es el nombre del nodo **de origen**. Dentro, cada tipo de conexión tiene una lista por salida, y cada salida una lista de destinos `{ "node", "type", "index" }`:

```json
"connections": {
  "¿Es mayor de edad?": {
    "main": [
      [ { "node": "Mensaje para mayores", "type": "main", "index": 0 } ],
      [ { "node": "Mensaje para menores", "type": "main", "index": 0 } ]
    ]
  }
}
```

La salida 0 del IF es «true» y la 1 es «false». En Switch, cada regla es una salida, en orden. En Merge, `index` indica a qué entrada llega (0 o 1).

**Conexiones de IA:** salen del sub-nodo (modelo, memoria, herramienta, embeddings, cargador, separador, parser) y llegan al nodo raíz. El `type` se repite afuera y adentro:

```json
"connections": {
  "Modelo Gemini": {
    "ai_languageModel": [
      [
        {
          "node": "Agente",
          "type": "ai_languageModel",
          "index": 0
        }
      ]
    ]
  },
  "Memoria simple": {
    "ai_memory": [
      [
        {
          "node": "Agente",
          "type": "ai_memory",
          "index": 0
        }
      ]
    ]
  },
  "Último bloque de Fuji": {
    "ai_tool": [
      [
        {
          "node": "Agente",
          "type": "ai_tool",
          "index": 0
        }
      ]
    ]
  },
  "Buscar en documentos": {
    "ai_tool": [
      [
        {
          "node": "Agente",
          "type": "ai_tool",
          "index": 0
        }
      ]
    ]
  },
  "Embeddings Gemini": {
    "ai_embedding": [
      [
        {
          "node": "Buscar en documentos",
          "type": "ai_embedding",
          "index": 0
        }
      ]
    ]
  }
}
```

Entradas y salidas de los nodos de IA, calculadas con el código de n8n 2.48.7 (`*` = obligatoria, `máx. 1` = acepta una sola conexión de ese tipo):

| nodo y configuración | entradas | salidas |
|---|---|---|
| `agent` 3.1 | `main`, `ai_languageModel`* máx. 1, `ai_memory` máx. 1, `ai_tool` (varias) | `main` |
| `agent` 3.1 con `hasOutputParser: true` | lo de arriba + `ai_outputParser` máx. 1 | `main` |
| `agent` 3.1 con `needsFallback: true` | dos `ai_languageModel`* (principal y respaldo) | `main` |
| `chainLlm` 1.9 | `main`, `ai_languageModel`* máx. 1 (+ `ai_outputParser` con `hasOutputParser`) | `main` |
| `textClassifier` 1.1 | `main`, `ai_languageModel`* máx. 1 | una `main` por categoría |
| `informationExtractor` 1.2 | `main`, `ai_languageModel`* máx. 1 | `main` |
| `vectorStoreSupabase` 1.4 `insert` | `main`, `ai_embedding`* máx. 1, `ai_document`* máx. 1 | `main` |
| `vectorStoreSupabase` 1.4 `load` | `main`, `ai_embedding`* máx. 1 | `main` |
| `vectorStoreSupabase` 1.4 `retrieve-as-tool` | `ai_embedding`* máx. 1 | `ai_tool` |
| `vectorStoreSupabase` 1.4 `retrieve` | `ai_embedding`* máx. 1 | `ai_vectorStore` |
| `documentDefaultDataLoader` 1.1 `textSplittingMode: "simple"` | ninguna | `ai_document` |
| `documentDefaultDataLoader` 1.1 `textSplittingMode: "custom"` | `ai_textSplitter`* máx. 1 | `ai_document` |
| `lmChatGoogleGemini`, `lmChatOpenAi` | ninguna | `ai_languageModel` |
| `embeddingsGoogleGemini`, `embeddingsOpenAi` | ninguna | `ai_embedding` |
| `memoryBufferWindow`, `memoryPostgresChat` | ninguna | `ai_memory` |
| `httpRequestTool`, `toolHttpRequest`, `supabaseTool` | ninguna | `ai_tool` |
| `textSplitterRecursiveCharacterTextSplitter` | ninguna | `ai_textSplitter` |
| `outputParserStructured` | ninguna | `ai_outputParser` |
| `chatTrigger` 1.5 | ninguna | `main` |
| `webhook` 2.2 | ninguna | `main` (dos salidas si `multipleMethods: true`) |

### Ejemplos mínimos

Copiados de workflows que pasan el auditor y se importan en n8n 2.48.7. Cambiá los `id` (uuid) y `webhookId` por otros nuevos en cada workflow: dos nodos con el mismo `webhookId` publicados en la misma n8n chocan.

**Sticky note grande al inicio** (la que pide la especificación):

```json
{
  "parameters": {
    "content": "## Hola n8n\n\n### Qué hace\nArma un dato de ejemplo, lo transforma con una expresión y con JavaScript, y decide un camino con un IF.\n\n### Qué necesitás\nNada más que tu cuenta de n8n. No usa credenciales.\n\n### Cómo probarlo\nHacé clic en **Execute workflow** y abrí cada nodo para ver qué entra y qué sale.",
    "height": 480,
    "width": 440,
    "color": 7
  },
  "id": "17af75e6-51a2-4694-84d0-953d7c551647",
  "name": "Nota de inicio",
  "type": "n8n-nodes-base.stickyNote",
  "typeVersion": 1,
  "position": [
    -520,
    -200
  ]
}
```

**Manual Trigger y Set 3.5** (modo manual, con tipos):

```json
{
  "parameters": {},
  "id": "f13b1f72-6236-4a0d-8043-9463c0eddfff",
  "name": "Al hacer clic en Probar",
  "type": "n8n-nodes-base.manualTrigger",
  "typeVersion": 1,
  "position": [
    0,
    0
  ]
}
```

```json
{
  "parameters": {
    "mode": "manual",
    "assignments": {
      "assignments": [
        {
          "id": "385539e2-8a08-4518-8d5b-25c9eb81254d",
          "name": "nombre",
          "value": "Ada",
          "type": "string"
        },
        {
          "id": "a6d53cfb-679f-40f5-8283-7887e83352f1",
          "name": "edad",
          "value": 36,
          "type": "number"
        },
        {
          "id": "befd20c0-0147-45b5-883b-15dcdd7aac11",
          "name": "saludo",
          "value": "={{ 'Hola, ' + 'Ada' }}",
          "type": "string"
        }
      ]
    },
    "options": {}
  },
  "id": "dc9e2117-5c60-4df0-8287-d6838dc524b3",
  "name": "Datos de ejemplo",
  "type": "n8n-nodes-base.set",
  "typeVersion": 3.5,
  "position": [
    220,
    0
  ]
}
```

**Set 3.5 en modo JSON** (útil para armar un pedido de ejemplo con la misma forma que llega a un Webhook):

```json
{
  "parameters": {
    "mode": "raw",
    "jsonOutput": "={\n  \"body\": { \"nombre\": \"Ada\" }\n}",
    "options": {}
  },
  "id": "1b9bc432-bf2e-432d-8264-c574cc1c074b",
  "name": "Pedido de ejemplo",
  "type": "n8n-nodes-base.set",
  "typeVersion": 3.5,
  "position": [
    220,
    100
  ]
}
```

**Code 2 en JavaScript** (todos los ítems a la vez, con `require('crypto')`):

```json
{
  "parameters": {
    "mode": "runOnceForAllItems",
    "language": "javaScript",
    "jsCode": "// Recorre los ítems que llegan y suma campos nuevos.\nconst crypto = require('crypto');\nreturn $input.all().map((item) => ({\n  json: {\n    ...item.json,\n    mayor: item.json.edad >= 18,\n    huella: crypto.createHash('sha256').update(item.json.nombre).digest('hex').slice(0, 12),\n    avax: (Number(BigInt('1500000000000000000')) / 1e18).toString(),\n  },\n}));"
  },
  "id": "9bae4057-2bc8-4d9e-8ecf-63dc6fed24ee",
  "name": "Calcular con JavaScript",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [
    440,
    0
  ]
}
```

**IF 2.4** (filtro versión 4; `rightValue` con el tipo que corresponde al operador):

```json
{
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "leftValue": "",
        "typeValidation": "strict",
        "version": 4
      },
      "conditions": [
        {
          "id": "29c67300-9536-482c-84bf-b9e1999f47e4",
          "leftValue": "={{ $json.edad }}",
          "rightValue": 18,
          "operator": {
            "type": "number",
            "operation": "gte"
          }
        }
      ],
      "combinator": "and"
    },
    "looseTypeValidation": false,
    "options": {}
  },
  "id": "bd0e1069-d509-4f9f-8976-1802887a98c4",
  "name": "¿Es mayor de edad?",
  "type": "n8n-nodes-base.if",
  "typeVersion": 2.4,
  "position": [
    660,
    0
  ]
}
```

Para operadores sin valor a la derecha (`exists`, `empty`, `true`, `false`...) agregá `"singleValue": true` en `operator`, por ejemplo `{ "type": "boolean", "operation": "true", "singleValue": true }`. Operaciones válidas por tipo: string `equals`, `notEquals`, `contains`, `notContains`, `startsWith`, `notStartsWith`, `endsWith`, `notEndsWith`, `regex`, `notRegex`; number `equals`, `notEquals`, `gt`, `lt`, `gte`, `lte`; dateTime `equals`, `notEquals`, `after`, `before`, `afterOrEquals`, `beforeOrEquals`; boolean `true`, `false`, `equals`, `notEquals`; array `contains`, `notContains`, `lengthEquals`, `lengthNotEquals`, `lengthGt`, `lengthLt`, `lengthGte`, `lengthLte`; object y todos los anteriores: `exists`, `notExists`, `empty`, `notEmpty`.

**Webhook 2.2 que responde con Respond to Webhook:**

```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "nc-prueba-api",
    "responseMode": "responseNode",
    "options": {}
  },
  "id": "f7f96407-7088-4615-86ce-dab49c1c7728",
  "name": "Recibir pedido",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2.2,
  "position": [
    0,
    -100
  ],
  "webhookId": "aed1e877-bce2-4df9-8f5a-2d637c04695a"
}
```

```json
{
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ JSON.stringify($json) }}",
    "options": {
      "responseCode": 200
    }
  },
  "id": "c2795065-390e-43cd-8247-59739f86c1a4",
  "name": "Responder JSON",
  "type": "n8n-nodes-base.respondToWebhook",
  "typeVersion": 1.5,
  "position": [
    880,
    0
  ]
}
```

**HTTP Request 4.5 con cuerpo JSON** (JSON-RPC a Avalanche Fuji):

```json
{
  "parameters": {
    "method": "POST",
    "url": "https://api.avax-test.network/ext/bc/C/rpc",
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={\n  \"jsonrpc\": \"2.0\",\n  \"id\": 1,\n  \"method\": \"eth_blockNumber\",\n  \"params\": []\n}",
    "options": {}
  },
  "id": "07c99632-a636-4f66-81df-7d67ca24df1e",
  "name": "Leer último bloque",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.5,
  "position": [
    440,
    0
  ]
}
```

**Code que lee otro nodo por nombre** (`$('Nombre').isExecuted` dice si esa rama corrió):

```json
{
  "parameters": {
    "mode": "runOnceForAllItems",
    "language": "javaScript",
    "jsCode": "// El RPC devuelve el bloque en hexadecimal: lo pasamos a número.\nconst pedido = $('Recibir pedido').isExecuted ? $('Recibir pedido').first().json : $('Pedido de ejemplo').first().json;\nconst hex = $input.first().json.result;\nreturn [{ json: { hola: pedido.body?.nombre ?? 'sin nombre', bloque: Number(BigInt(hex)), hex } }];"
  },
  "id": "7b018458-67e0-4b25-8d4a-a17d14101286",
  "name": "Armar respuesta",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [
    660,
    0
  ]
}
```

**Form Trigger 2.6 con campos, y página final con Form 2.5:**

```json
{
  "parameters": {
    "formTitle": "Subí un documento",
    "formDescription": "PDF o texto: se parte en pedazos y se guarda en Supabase.",
    "formFields": {
      "values": [
        {
          "fieldLabel": "Archivo",
          "fieldName": "archivo",
          "fieldType": "file",
          "multipleFiles": false,
          "acceptFileTypes": ".pdf,.txt,.md",
          "requiredField": true
        }
      ]
    },
    "responseMode": "lastNode",
    "options": {
      "path": "nc-prueba-subir"
    }
  },
  "id": "cd69cfcd-232c-4dec-8d88-23932fe19a7b",
  "name": "Subir documento",
  "type": "n8n-nodes-base.formTrigger",
  "typeVersion": 2.6,
  "position": [
    0,
    700
  ],
  "webhookId": "cdae9aed-d517-4ab1-88b0-aa5b2ed23629"
}
```

```json
{
  "parameters": {
    "operation": "completion",
    "respondWith": "text",
    "completionTitle": "Listo",
    "completionMessage": "Guardamos tu documento.",
    "options": {}
  },
  "id": "4a3684a0-21f9-41dd-864e-38dd173a672b",
  "name": "Página final",
  "type": "n8n-nodes-base.form",
  "typeVersion": 2.5,
  "position": [
    600,
    700
  ],
  "webhookId": "1fa43468-3e73-46f3-8fcd-3ca6a5994115"
}
```

Otros tipos de campo: `text`, `textarea`, `email`, `number`, `date`, `password`, `dropdown`, `radio` y `checkbox` (estos tres con `fieldOptions: { "values": [ { "option": "..." } ] }`), `file` (con `multipleFiles` y `acceptFileTypes`), `hiddenField` (con `fieldName` y `fieldValue`) y `html` (con `html`).

**Chat Trigger, AI Agent, Gemini y memoria simple:**

```json
{
  "parameters": {
    "options": {}
  },
  "id": "cba872ea-1ee7-4e77-817c-51cb0758cb0c",
  "name": "Chat",
  "type": "@n8n/n8n-nodes-langchain.chatTrigger",
  "typeVersion": 1.5,
  "position": [
    0,
    0
  ],
  "webhookId": "4b85aeef-8532-4dad-8ba7-d39a9d43036e"
}
```

```json
{
  "parameters": {
    "promptType": "auto",
    "options": {
      "systemMessage": "Sos una asistente de la hackathon. Respondé en español, claro y breve."
    }
  },
  "id": "463c4d91-434e-4674-85b0-361ad10598ab",
  "name": "Agente",
  "type": "@n8n/n8n-nodes-langchain.agent",
  "typeVersion": 3.1,
  "position": [
    300,
    0
  ]
}
```

```json
{
  "parameters": {
    "options": {
      "temperature": 0.4
    }
  },
  "id": "c167c298-4125-499a-8108-d225dca36258",
  "name": "Modelo Gemini",
  "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
  "typeVersion": 1.2,
  "position": [
    160,
    260
  ]
}
```

```json
{
  "parameters": {
    "contextWindowLength": 10
  },
  "id": "cf2431e9-e50a-4619-8947-8de23f1a898b",
  "name": "Memoria simple",
  "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
  "typeVersion": 1.4,
  "position": [
    320,
    260
  ]
}
```

`modelName` no hace falta: sin él, `lmChatGoogleGemini` 1.2 usa `models/gemini-3-flash-preview`, y la lista de modelos se carga desde tu cuenta al abrir el nodo. Si lo ponés, va con el prefijo `models/` (por ejemplo `models/gemini-2.5-flash`). Con OpenAI, `lmChatOpenAi` 1.3 usa `model` como resourceLocator: `{ "__rl": true, "mode": "list", "value": "gpt-5-mini" }`.

**HTTP Request como herramienta del agente:**

```json
{
  "parameters": {
    "toolDescription": "Devuelve el número del último bloque de Avalanche Fuji en hexadecimal.",
    "method": "POST",
    "url": "https://api.avax-test.network/ext/bc/C/rpc",
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"eth_blockNumber\",\"params\":[]}",
    "options": {}
  },
  "id": "ca5d5481-ce41-4e74-8265-a032555cc5fc",
  "name": "Último bloque de Fuji",
  "type": "n8n-nodes-base.httpRequestTool",
  "typeVersion": 4.5,
  "position": [
    480,
    260
  ]
}
```

**Supabase Vector Store como herramienta (retrieve-as-tool), con sus embeddings:**

```json
{
  "parameters": {
    "mode": "retrieve-as-tool",
    "toolDescription": "Busca en los documentos de la hackathon cargados en Supabase.",
    "tableName": {
      "__rl": true,
      "mode": "id",
      "value": "documentos"
    },
    "topK": 4,
    "options": {
      "queryName": "buscar_documentos"
    }
  },
  "id": "47f6122a-a801-4f21-850a-f3338d63e109",
  "name": "Buscar en documentos",
  "type": "@n8n/n8n-nodes-langchain.vectorStoreSupabase",
  "typeVersion": 1.4,
  "position": [
    640,
    260
  ]
}
```

```json
{
  "parameters": {
    "modelName": "models/gemini-embedding-001"
  },
  "id": "0bedf056-871e-4d15-8aa2-2fa5b487a051",
  "name": "Embeddings Gemini",
  "type": "@n8n/n8n-nodes-langchain.embeddingsGoogleGemini",
  "typeVersion": 1,
  "position": [
    640,
    460
  ]
}
```

`tableName` es un resourceLocator: `{ "__rl": true, "mode": "id", "value": "<tabla>" }` (o `"mode": "list"`, que el editor completa al elegir de la lista). `options.queryName` es la función de búsqueda de Postgres (por defecto `match_documents`).

**Supabase Vector Store en modo insert**, con cargador de documentos, separador de texto y embeddings:

```json
{
  "parameters": {
    "mode": "insert",
    "tableName": {
      "__rl": true,
      "mode": "id",
      "value": "documentos"
    },
    "options": {
      "queryName": "buscar_documentos"
    }
  },
  "id": "ff15b734-4ec9-43b2-86c8-3725e3024d98",
  "name": "Guardar en Supabase",
  "type": "@n8n/n8n-nodes-langchain.vectorStoreSupabase",
  "typeVersion": 1.4,
  "position": [
    300,
    700
  ]
}
```

```json
{
  "parameters": {
    "dataType": "binary",
    "binaryMode": "specificField",
    "binaryDataKey": "archivo",
    "loader": "auto",
    "textSplittingMode": "custom",
    "options": {}
  },
  "id": "a1011bed-42b9-4c5f-8d4a-b2c1997385b9",
  "name": "Leer el archivo",
  "type": "@n8n/n8n-nodes-langchain.documentDefaultDataLoader",
  "typeVersion": 1.1,
  "position": [
    420,
    940
  ]
}
```

```json
{
  "parameters": {
    "chunkSize": 1000,
    "chunkOverlap": 100,
    "options": {}
  },
  "id": "201a366c-f8fc-4dce-8aae-76bc952daefd",
  "name": "Partir en pedazos",
  "type": "@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter",
  "typeVersion": 1,
  "position": [
    420,
    1140
  ]
}
```

```json
"connections": {
  "Subir documento": {
    "main": [
      [
        {
          "node": "Guardar en Supabase",
          "type": "main",
          "index": 0
        }
      ]
    ]
  },
  "Embeddings para guardar": {
    "ai_embedding": [
      [
        {
          "node": "Guardar en Supabase",
          "type": "ai_embedding",
          "index": 0
        }
      ]
    ]
  },
  "Leer el archivo": {
    "ai_document": [
      [
        {
          "node": "Guardar en Supabase",
          "type": "ai_document",
          "index": 0
        }
      ]
    ]
  },
  "Partir en pedazos": {
    "ai_textSplitter": [
      [
        {
          "node": "Leer el archivo",
          "type": "ai_textSplitter",
          "index": 0
        }
      ]
    ]
  },
  "Guardar en Supabase": {
    "main": [
      [
        {
          "node": "Página final",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

### Code node (JavaScript) en n8n 2.48.7

- **Corre en el task runner**, un proceso aparte (en una instalación con npm, en modo `internal`: n8n lo arranca y lo comunica por el puerto `N8N_RUNNERS_BROKER_PORT`, 5679 por defecto). El código no ve el proceso de n8n (`process` no existe).
- **Qué hay disponible** (probado con un Code node en esta versión):

| disponible | no disponible |
|---|---|
| `$input.all()`, `$input.first()`, `$input.item` (modo por ítem), `$('Nombre').first()`, `$('Nombre').all()`, `$('Nombre').isExecuted`, `$node`, `$prevNode`, `$runIndex`, `$workflow`, `$execution`, `$now`, `$today`, `$vars`, `$env`, `$jmespath`, `$getWorkflowStaticData('global')` | `fetch` |
| `DateTime`, `Duration`, `Interval` (Luxon), `Buffer`, `TextEncoder`, `TextDecoder`, `atob`, `btoa`, `BigInt`, `setTimeout`, `console.log` | el `crypto` global (usá `require('crypto')`) |
| `require('crypto')`: `createHash`, `createHmac`, `createVerify`, `createPublicKey`, `timingSafeEqual`, `randomUUID`, `webcrypto.subtle` (verificar un RS256 funciona) | `URL`, `URLSearchParams`, `structuredClone` |
| `require('moment')` | `require('fs')`, `require('axios')` y cualquier otro módulo |

- **`require('crypto')`:** n8n Cloud deja usar `crypto` y `moment` ([docs](https://docs.n8n.io/code/code-node/)). En una n8n propia vienen bloqueados hasta que se habilitan con `NODE_FUNCTION_ALLOW_BUILTIN=crypto` y `NODE_FUNCTION_ALLOW_EXTERNAL=moment`; `tools/n8n_local.sh` y `tools/probar_local.mjs` ya lo hacen, para que lo local se comporte como Cloud.
- **`this.helpers`** tiene: `httpRequest`, `httpRequestWithAuthentication`, `requestWithAuthenticationPaginated`, `request`, `getBinaryDataBuffer`, `prepareBinaryData`, `setBinaryDataBuffer`, `binaryToBuffer`, `binaryToString`, `getBinaryMetadata`, `getBinaryStream`, `getBinaryPath`, `createReadStream`, `copyBinaryFile`, `writeContentToFile`, `getStoragePath`, `assertBinaryData`, `copyInputItems`, `returnJsonArray`, `normalizeItems`, `constructExecutionMetaData`, `createDeferredPromise`, `getSSHClient`. También está como `helpers`, sin `this`.
- **Llamar una API desde el Code** (no hay `fetch`):

```js
const res = await this.helpers.httpRequest({
  method: 'POST',
  url: 'https://api.avax-test.network/ext/bc/C/rpc',
  body: { jsonrpc: '2.0', id: 1, method: 'eth_chainId', params: [] },
  json: true,
});
return [{ json: { chainId: Number(BigInt(res.result)) } }]; // 43113
```

- **Archivos (binarios):**

```js
// Crear un archivo
const bin = await this.helpers.prepareBinaryData(Buffer.from('hola', 'utf8'), 'saludo.txt', 'text/plain');
return [{ json: {}, binary: { data: bin } }];

// Leerlo en el nodo siguiente (i = índice del ítem, 'data' = nombre del campo binario)
const buf = await this.helpers.getBinaryDataBuffer(i, 'data');
```

- **Lo que devuelve** tiene que ser una lista de ítems `{ json: {...}, binary?: {...} }` en modo `runOnceForAllItems`, o un ítem (u objeto) en `runOnceForEachItem`.
- **`$getWorkflowStaticData('global')`** guarda datos entre ejecuciones de un workflow publicado; en las ejecuciones manuales no se guarda.
- **Python:** el nodo acepta `language: "pythonNative"`, pero en la n8n local no hay runner de Python (falta su entorno virtual) y en Cloud no se pueden importar librerías. Para el evento, JavaScript.

## Ficha de cada nodo

### Disparadores

#### `n8n-nodes-base.manualTrigger` · Manual Trigger

- typeVersion más alta: **1** · versión por defecto al crear el nodo: 1
- versiones aceptadas: 1
- clase: INodeType (description.version 1)
- credenciales: ninguna
- entradas: ninguna
- salidas: main

Parámetros (typeVersion 1):


#### `n8n-nodes-base.webhook` · Webhook

- typeVersion más alta: **2.2** · versión por defecto al crear el nodo: 2.2
- versiones aceptadas: 1, 1.1, 2, 2.1, 2.2
- clase: INodeType (description.version 1, 1.1, 2, 2.1, 2.2)
- credenciales: `httpBasicAuth` (requerida) si authentication="basicAuth"; `httpHeaderAuth` (requerida) si authentication="headerAuth"; `jwtAuth` (requerida) si authentication="jwtAuth"
  - `httpBasicAuth` se llama «Basic Auth» en el editor
  - `httpHeaderAuth` se llama «Header Auth» en el editor
  - `jwtAuth` se llama «JWT Auth» en el editor
- entradas: ninguna
- salidas: dinámicas: dependen de los parámetros (mirá «Forma de las conexiones»)
- webhooks: default ={{$parameter["httpMethod"] || "GET"}}

Parámetros (typeVersion 2.2):

- `multipleMethods` · boolean · por defecto `false`
- `httpMethod` · options · por defecto `GET` · opciones: `DELETE` \| `GET` \| `HEAD` \| `PATCH` \| `POST` \| `PUT` · se muestra si multipleMethods=false
- `httpMethod` · multiOptions · por defecto `["GET","POST"]` · opciones: `DELETE` \| `GET` \| `HEAD` \| `PATCH` \| `POST` \| `PUT` · se muestra si multipleMethods=true
- `path` · string · por defecto `""`
- `authentication` · options · por defecto `none` · sin expresiones · opciones: `basicAuth` \| `headerAuth` \| `jwtAuth` \| `n8nOAuth2` \| `none`
- `requireExecuteAccess` · boolean · por defecto `true` · se muestra si authentication="n8nOAuth2"
- `trustedSource` · options · por defecto `n8n-internal` · sin expresiones · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si authentication="n8nOAuth2"
- `responseMode` · options · por defecto `onReceived` · opciones: `onReceived` \| `lastNode` \| `responseNode` · se muestra si @version=1|1.1|2
- `responseMode` · options · por defecto `onReceived` · opciones: `onReceived` \| `lastNode` \| `responseNode` \| `streaming` · se muestra si @version≠1|1.1|2
- `responseCode` · number · por defecto `200` · se muestra si @version=1|1.1; responseMode≠"responseNode"
- `responseData` · options · por defecto `firstEntryJson` · opciones: `allEntries` \| `firstEntryJson` \| `firstEntryBinary` \| `noData` · se muestra si responseMode="lastNode"
- `responseBinaryPropertyName` · string · por defecto `data` · requerido · se muestra si responseData="firstEntryBinary"
- `options` · collection
  - `allowedOrigins` · string · por defecto `*`
  - `binaryData` · boolean · por defecto `false` · se muestra si /httpMethod="PATCH"|"PUT"|"POST"; @version=1
  - `binaryPropertyName` · string · por defecto `data` · se muestra si @version≠1
  - `ignoreBots` · boolean · por defecto `false`
  - `ipWhitelist` · string · por defecto `""`
  - `noResponseBody` · boolean · por defecto `false` · se muestra si /responseMode="onReceived"; rawBody≠true
  - `oauthClient` · options · por defecto `auto` · sin expresiones · opciones: `auto` \| `bearer` \| `browser` · se muestra si /authentication="n8nOAuth2"
  - `onlyRunIf` · string · por defecto `""`
  - `responsePropertyName` · string · por defecto `data` · se muestra si /responseData="firstEntryJson"; /responseMode="lastNode"
  - `binaryPropertyName` · string · por defecto `data` · se muestra si binaryData=true; @version=1
  - `rawBody` · boolean · por defecto `false` · se muestra si @version=1; binaryData≠true; noResponseBody≠true
  - `rawBody` · boolean · por defecto `false` · se muestra si noResponseBody≠true; @version≠1
  - `responseCode` · fixedCollection · se muestra si @version=≥2; /responseMode≠"responseNode"
    - grupo `values`:
      - `responseCode` · options · por defecto `200` · opciones: `200` \| `201` \| `204` \| `301` \| `302` \| `304` \| `400` \| `401` \| `403` \| `404` \| `customCode`
      - `customCode` · number · por defecto `200` · se muestra si responseCode="customCode"
  - `responseContentType` · string · por defecto `""` · se muestra si /responseData="firstEntryJson"; /responseMode="lastNode"
  - `responseData` · string · por defecto `""` · se muestra si /responseMode="onReceived"; noResponseBody≠true
  - `responseHeaders` · fixedCollection · varios valores
    - grupo `entries` (lista):
      - `name` · string · por defecto `""`
      - `value` · string · por defecto `""`

#### `n8n-nodes-base.formTrigger` · n8n Form Trigger

- typeVersion más alta: **2.6** · versión por defecto al crear el nodo: 2.6
- versiones aceptadas: 1, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
- clase: VersionedNodeType (nodeVersions 1, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, defaultVersion 2.6)
- credenciales: `httpBasicAuth` (requerida) si authentication="basicAuth"
  - `httpBasicAuth` se llama «Basic Auth» en el editor
- entradas: ninguna
- salidas: main
- webhooks: setup GET, default POST

Parámetros (typeVersion 2.6):

- `authentication` · options · por defecto `none` · opciones: `basicAuth` \| `none` · se muestra si @version=≤2.5
- `authentication` · options · por defecto `none` · opciones: `basicAuth` \| `n8nUserAuth` \| `none` · se muestra si @version=≥2.6
- `requireExecuteAccess` · boolean · por defecto `false` · se muestra si authentication="n8nUserAuth"; @version=≥2.6
- `trustedSource` · options · por defecto `n8n-internal` · sin expresiones · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si authentication="n8nUserAuth"; @version=≥2.6
- `path` · string · por defecto `""` · requerido · se muestra si @version=≤2.1
- `formTitle` · string · por defecto `""` · requerido
- `formDescription` · string · por defecto `""`
- `formFields` · fixedCollection · varios valores · se muestra si @version=<2.5
  - grupo `values` (lista):
    - `fieldName` · string · por defecto `""` · requerido · se muestra si @version=2.4; fieldType≠"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=≥2.4; fieldType≠"hiddenField"|"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=<2.4; fieldType≠"hiddenField"|"html"
    - `fieldName` · string · por defecto `""` · se muestra si fieldType="hiddenField"; @version=<2.4
    - `fieldType` · options · por defecto `text` · requerido · opciones: `checkbox` \| `html` \| `date` \| `dropdown` \| `email` \| `file` \| `hiddenField` \| `number` \| `password` \| `radio` \| `text` \| `textarea`
    - `elementName` · string · por defecto `""` · se muestra si fieldType="html"
    - `fieldName` · string · por defecto `""` · se muestra si @version=≥2.5; fieldType≠"html"
    - `placeholder` · string · por defecto `""` · se muestra si fieldType≠"dropdown"|"date"|"file"|"html"|"hiddenField"|"radio"|"checkbox"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="text"|"number"|"email"|"textarea"
    - `defaultValue` · dateTime · por defecto `""` · se muestra si fieldType="date"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="dropdown"|"radio"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="checkbox"
    - `fieldValue` · string · por defecto `""` · se muestra si fieldType="hiddenField"
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="dropdown"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="checkbox"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="radio"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `multiselect` · boolean · por defecto `false` · se muestra si fieldType="dropdown"; @version=<2.3
    - `limitSelection` · options · por defecto `unlimited` · opciones: `exact` \| `range` \| `unlimited` · se muestra si fieldType="checkbox"
    - `numberOfSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="exact"
    - `minSelections` · number · por defecto `0` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `maxSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `html` · string · por defecto (un comentario HTML de ejemplo) · sin expresiones · se muestra si fieldType="html"
    - `multipleFiles` · boolean · por defecto `true` · se muestra si fieldType="file"
    - `acceptFileTypes` · string · por defecto `""` · se muestra si fieldType="file"
    - `requiredField` · boolean · por defecto `false` · se muestra si fieldType≠"html"|"hiddenField"
- `formFields` · fixedCollection · varios valores · se muestra si @version=≥2.5
  - grupo `values` (lista):
    - `fieldName` · string · por defecto `""` · requerido · se muestra si @version=2.4; fieldType≠"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=≥2.4; fieldType≠"hiddenField"|"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=<2.4; fieldType≠"hiddenField"|"html"
    - `fieldName` · string · por defecto `""` · se muestra si fieldType="hiddenField"; @version=<2.4
    - `fieldType` · options · por defecto `text` · requerido · opciones: `checkbox` \| `html` \| `date` \| `dropdown` \| `email` \| `file` \| `hiddenField` \| `number` \| `password` \| `radio` \| `text` \| `textarea`
    - `elementName` · string · por defecto `""` · se muestra si fieldType="html"
    - `fieldName` · string · por defecto `""` · se muestra si @version=≥2.5; fieldType≠"html"
    - `placeholder` · string · por defecto `""` · se muestra si fieldType≠"dropdown"|"date"|"file"|"html"|"hiddenField"|"radio"|"checkbox"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="text"|"number"|"email"|"textarea"
    - `defaultValue` · dateTime · por defecto `""` · se muestra si fieldType="date"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="dropdown"|"radio"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="checkbox"
    - `fieldValue` · string · por defecto `""` · se muestra si fieldType="hiddenField"
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="dropdown"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="checkbox"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="radio"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `multiselect` · boolean · por defecto `false` · se muestra si fieldType="dropdown"; @version=<2.3
    - `limitSelection` · options · por defecto `unlimited` · opciones: `exact` \| `range` \| `unlimited` · se muestra si fieldType="checkbox"
    - `numberOfSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="exact"
    - `minSelections` · number · por defecto `0` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `maxSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `html` · string · por defecto (un comentario HTML de ejemplo) · sin expresiones · se muestra si fieldType="html"
    - `multipleFiles` · boolean · por defecto `true` · se muestra si fieldType="file"
    - `acceptFileTypes` · string · por defecto `""` · se muestra si fieldType="file"
    - `requiredField` · boolean · por defecto `false` · se muestra si fieldType≠"html"|"hiddenField"
- `responseMode` · options · por defecto `onReceived` · opciones: `onReceived` \| `lastNode` \| `responseNode` · se muestra si @version=≤2.1
- `responseMode` · options · por defecto `onReceived` · opciones: `onReceived` \| `lastNode` · se muestra si @version=≥2.2
- `options` · collection
  - `appendAttribution` · boolean · por defecto `true`
  - `ipWhitelist` · string · por defecto `""`
  - `buttonLabel` · string · por defecto `Submit`
  - `path` · string · por defecto `""` · se muestra si @version=≥2.2
  - `respondWithOptions` · fixedCollection · se muestra si /responseMode≠"responseNode"
    - grupo `values`:
      - `respondWith` · options · por defecto `text` · opciones: `text` \| `redirect`
      - `formSubmittedText` · string · por defecto `Your response has been recorded` · se muestra si respondWith="text"
      - `redirectUrl` · string · por defecto `""` · se muestra si respondWith="redirect"
  - `ignoreBots` · boolean · por defecto `false`
  - `includeUserInOutput` · boolean · por defecto `true` · se muestra si /authentication="n8nUserAuth"; @version=≥2.6
  - `useWorkflowTimezone` · boolean · por defecto `false` · se muestra si @version=2
  - `useWorkflowTimezone` · boolean · por defecto `true` · se muestra si @version=>2
  - `customCss` · string · por defecto `:root { --font-family: 'Open Sans', sans-serif; --font-we...` · se muestra si @version=>2
  - `showHeaders` · boolean · por defecto `false`

#### `n8n-nodes-base.scheduleTrigger` · Schedule Trigger

- typeVersion más alta: **1.4** · versión por defecto al crear el nodo: 1.4
- versiones aceptadas: 1, 1.1, 1.2, 1.3, 1.4
- clase: INodeType (description.version 1, 1.1, 1.2, 1.3, 1.4)
- credenciales: ninguna
- entradas: ninguna
- salidas: main

Parámetros (typeVersion 1.4):

- `rule` · fixedCollection · varios valores
  - grupo `interval` (lista):
    - `field` · options · por defecto `days` · opciones: `seconds` \| `minutes` \| `hours` \| `days` \| `weeks` \| `months` \| `cronExpression`
    - `secondsInterval` · number · por defecto `30` · se muestra si field="seconds"
    - `minutesInterval` · number · por defecto `5` · se muestra si field="minutes"
    - `hoursInterval` · number · por defecto `1` · se muestra si field="hours"
    - `daysInterval` · number · por defecto `1` · se muestra si field="days"
    - `weeksInterval` · number · por defecto `1` · se muestra si field="weeks"
    - `monthsInterval` · number · por defecto `1` · se muestra si field="months"
    - `triggerAtDayOfMonth` · number · por defecto `1` · se muestra si field="months"
    - `triggerAtDay` · multiOptions · por defecto `[0]` · opciones: `1` \| `2` \| `3` \| `4` \| `5` \| `6` \| `0` · se muestra si field="weeks"
    - `triggerAtHour` · options · por defecto `0` · opciones: `0` \| `1` \| `2` \| `3` \| `4` \| `5` \| `6` \| `7` \| `8` \| `9` \| `10` \| `11` \| `12` \| `13` (+10) · se muestra si field="days"|"weeks"|"months"
    - `triggerAtMinute` · number · por defecto `0` · se muestra si field="hours"|"days"|"weeks"|"months"
    - `expression` · string · por defecto `""` · se muestra si field="cronExpression"
- `misfirePolicy` · options · por defecto `skip` · sin expresiones · opciones: `coalesce` \| `coalesce_owner` \| `skip` · se muestra si @version=≥1.4
- `misfireGraceSeconds` · number · por defecto `0` · sin expresiones · se muestra si @version=≥1.4

#### `@n8n/n8n-nodes-langchain.chatTrigger` · Chat Trigger

- typeVersion más alta: **1.5** · versión por defecto al crear el nodo: 1.5
- versiones aceptadas: 1, 1.1, 1.2, 1.3, 1.4, 1.5
- clase: INodeType (description.version 1, 1.1, 1.2, 1.3, 1.4, 1.5)
- credenciales: `httpBasicAuth` (requerida) si authentication="basicAuth"
  - `httpBasicAuth` se llama «Basic Auth» en el editor
- entradas: dinámicas: dependen de los parámetros (mirá «Forma de las conexiones»)
- salidas: main
- webhooks: setup GET, default POST

Parámetros (typeVersion 1.5):

- `public` · boolean · por defecto `false`
- `mode` · options · por defecto `hostedChat` · opciones: `hostedChat` \| `webhook` · se muestra si public=true
- `authentication` · options · por defecto `none` · opciones: `basicAuth` \| `n8nUserAuth` \| `none` · se muestra si public=true
- `requireExecuteAccess` · boolean · por defecto `false` · se muestra si authentication="n8nUserAuth"; mode="hostedChat"; public=true
- `trustedSource` · options · por defecto `n8n-internal` · sin expresiones · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si authentication="n8nUserAuth"; mode="hostedChat"; public=true
- `includeUserInOutput` · boolean · por defecto `true` · se muestra si authentication="n8nUserAuth"; public=true; @version=≥1.5
- `includeUserInOutput` · boolean · por defecto `false` · se muestra si authentication="n8nUserAuth"; public=true; @version=<1.5
- `initialMessages` · string · por defecto (un texto de ejemplo de n8n, en inglés) · se muestra si mode="hostedChat"; public=true
- `availableInChat` · boolean · por defecto `false` · sin expresiones
- `agentIcon` · icon · por defecto `{"type":"icon","value":"bot"}` · sin expresiones · se muestra si availableInChat=true; @version=≥1.2
- `agentName` · string · por defecto `""` · sin expresiones · se muestra si availableInChat=true; @version=≥1.2
- `agentDescription` · string · por defecto `""` · sin expresiones · se muestra si availableInChat=true; @version=≥1.2
- `suggestedPrompts` · fixedCollection · sin expresiones · varios valores · se muestra si availableInChat=true; @version=≥1.2
  - grupo `prompts` (lista):
    - `icon` · icon · por defecto `{"type":"icon","value":"comment"}` · sin expresiones
    - `text` · string · por defecto `""` · requerido · sin expresiones
- `options` · collection · se muestra si public=false; @version=1|1.1
  - `allowFileUploads` · boolean · por defecto `false`
  - `allowedFilesMimeTypes` · string · por defecto `*`
- `options` · collection · se muestra si mode="hostedChat"|"webhook"; public=true; @version=1|1.1
  - `allowedOrigins` · string · por defecto `*` · se muestra si /mode="hostedChat"|"webhook"
  - `allowFileUploads` · boolean · por defecto `false` · se muestra si /mode="hostedChat"
  - `allowedFilesMimeTypes` · string · por defecto `*` · se muestra si /mode="hostedChat"
  - `inputPlaceholder` · string · por defecto `Type your question..` · se muestra si /mode="hostedChat"
  - `loadPreviousSession` · options · por defecto `notSupported` · opciones: `notSupported` \| `memory` \| `manually`
  - `showWelcomeScreen` · boolean · por defecto `false` · se muestra si /mode="hostedChat"
  - `getStarted` · string · por defecto `New Conversation` · se muestra si showWelcomeScreen=true; /mode="hostedChat"
  - `subtitle` · string · por defecto `Start a chat. We're here to help you 24/7.` · se muestra si /mode="hostedChat"
  - `title` · string · por defecto (un texto de ejemplo de n8n, en inglés) · se muestra si /mode="hostedChat"
  - `customCss` · string · por defecto `:root { /* Colors */ --chat--color--primary: #e74266; --c...` · se muestra si /mode="hostedChat"
  - `responseMode` · options · por defecto `lastNode` · opciones: `lastNode` \| `responseNode`
  - `autoSaveHighlightedData` · boolean · por defecto `true`
- `options` · collection · se muestra si mode="hostedChat"|"webhook"; public=true; @version=1.2
  - `allowedOrigins` · string · por defecto `*` · se muestra si /mode="hostedChat"|"webhook"
  - `allowFileUploads` · boolean · por defecto `false` · se muestra si /mode="hostedChat"
  - `allowedFilesMimeTypes` · string · por defecto `*` · se muestra si /mode="hostedChat"
  - `inputPlaceholder` · string · por defecto `Type your question..` · se muestra si /mode="hostedChat"
  - `loadPreviousSession` · options · por defecto `notSupported` · opciones: `notSupported` \| `memory` \| `manually`
  - `showWelcomeScreen` · boolean · por defecto `false` · se muestra si /mode="hostedChat"
  - `getStarted` · string · por defecto `New Conversation` · se muestra si showWelcomeScreen=true; /mode="hostedChat"
  - `subtitle` · string · por defecto `Start a chat. We're here to help you 24/7.` · se muestra si /mode="hostedChat"
  - `title` · string · por defecto (un texto de ejemplo de n8n, en inglés) · se muestra si /mode="hostedChat"
  - `customCss` · string · por defecto `:root { /* Colors */ --chat--color--primary: #e74266; --c...` · se muestra si /mode="hostedChat"
  - `responseMode` · options · por defecto `lastNode` · opciones: `lastNode` \| `responseNode` \| `streaming` · se muestra si /availableInChat=false
  - `responseMode` · options · por defecto `streaming` · opciones: `streaming` \| `lastNode` · se muestra si /availableInChat=true
  - `autoSaveHighlightedData` · boolean · por defecto `true`
- `options` · collection · se muestra si public=false; @version=≥1.3
  - `allowFileUploads` · boolean · por defecto `false`
  - `allowedFilesMimeTypes` · string · por defecto `*`
  - `responseMode` · options · por defecto `lastNode` · opciones: `lastNode` \| `responseNodes` \| `streaming` · se muestra si /availableInChat=false
  - `responseMode` · options · por defecto `streaming` · opciones: `streaming` \| `lastNode` \| `responseNodes` · se muestra si /availableInChat=true
  - `autoSaveHighlightedData` · boolean · por defecto `true`
- `options` · collection · se muestra si mode="hostedChat"|"webhook"; public=true; @version=≥1.3
  - `allowedOrigins` · string · por defecto `*` · se muestra si /mode="hostedChat"|"webhook"
  - `allowFileUploads` · boolean · por defecto `false` · se muestra si /mode="hostedChat"
  - `allowedFilesMimeTypes` · string · por defecto `*` · se muestra si /mode="hostedChat"
  - `inputPlaceholder` · string · por defecto `Type your question..` · se muestra si /mode="hostedChat"
  - `loadPreviousSession` · options · por defecto `notSupported` · opciones: `notSupported` \| `memory` \| `manually`
  - `showWelcomeScreen` · boolean · por defecto `false` · se muestra si /mode="hostedChat"
  - `getStarted` · string · por defecto `New Conversation` · se muestra si showWelcomeScreen=true; /mode="hostedChat"
  - `subtitle` · string · por defecto `Start a chat. We're here to help you 24/7.` · se muestra si /mode="hostedChat"
  - `title` · string · por defecto (un texto de ejemplo de n8n, en inglés) · se muestra si /mode="hostedChat"
  - `customCss` · string · por defecto `:root { /* Colors */ --chat--color--primary: #e74266; --c...` · se muestra si /mode="hostedChat"
  - `responseMode` · options · por defecto `lastNode` · opciones: `lastNode` \| `streaming` \| `responseNode` \| `responseNodes` · se muestra si /mode="webhook"; /availableInChat=false
  - `responseMode` · options · por defecto `streaming` · opciones: `streaming` \| `lastNode` \| `responseNodes` · se muestra si /mode="webhook"; /availableInChat=true
  - `responseMode` · options · por defecto `lastNode` · opciones: `lastNode` \| `streaming` \| `responseNodes` · se muestra si /mode="hostedChat"; /availableInChat=false
  - `responseMode` · options · por defecto `streaming` · opciones: `streaming` \| `lastNode` \| `responseNodes` · se muestra si /mode="hostedChat"; /availableInChat=true
  - `autoSaveHighlightedData` · boolean · por defecto `true`

### Datos y lógica

#### `n8n-nodes-base.set` · Edit Fields (Set)

- typeVersion más alta: **3.5** · versión por defecto al crear el nodo: 3.5
- versiones aceptadas: 1, 2, 3, 3.1, 3.2, 3.3, 3.4, 3.5
- clase: VersionedNodeType (nodeVersions 1, 2, 3, 3.1, 3.2, 3.3, 3.4, 3.5, defaultVersion 3.5)
- credenciales: ninguna
- entradas: main
- salidas: main

Parámetros (typeVersion 3.5):

- `mode` · options · por defecto `manual` · sin expresiones · opciones: `manual` \| `raw`
- `duplicateItem` · boolean · por defecto `false`
- `duplicateCount` · number · por defecto `0` · se muestra si duplicateItem=true
- `jsonOutput` · json · por defecto `{ "my_field_1": "value", "my_field_2": 1 } ` · se muestra si mode="raw"
- `fields` · fixedCollection · varios valores · se muestra si @version=3|3.1|3.2; mode="manual"
  - grupo `values` (lista):
    - `name` · string · por defecto `""`
    - `type` · options · por defecto `stringValue` · opciones: `stringValue` \| `numberValue` \| `booleanValue` \| `arrayValue` \| `objectValue`
    - `stringValue` · string · por defecto `""` · se muestra si type="stringValue"
    - `numberValue` · string · por defecto `""` · se muestra si type="numberValue"
    - `booleanValue` · options · por defecto `true` · opciones: `true` \| `false` · se muestra si type="booleanValue"
    - `arrayValue` · string · por defecto `""` · se muestra si type="arrayValue"
    - `objectValue` · json · por defecto `={}` · se muestra si type="objectValue"
- `assignments` · assignmentCollection · por defecto `{}` · se muestra si mode="manual"; @version≠3|3.1|3.2
- `include` · options · por defecto `all` · opciones: `all` \| `none` \| `selected` \| `except` · se muestra si @version=3|3.1|3.2
- `includeOtherFields` · boolean · por defecto `false` · se muestra si @version≠3|3.1|3.2
- `include` · options · por defecto `all` · opciones: `all` \| `selected` \| `except` · se muestra si @version≠3|3.1|3.2; /includeOtherFields≠false
- `includeFields` · string · por defecto `""` · se muestra si include="selected"; @version=3|3.1|3.2
- `excludeFields` · string · por defecto `""` · se muestra si include="except"; @version=3|3.1|3.2
- `includeFields` · string · por defecto `""` · se muestra si include="selected"; /includeOtherFields=true; @version≠3|3.1|3.2
- `excludeFields` · string · por defecto `""` · se muestra si include="except"; /includeOtherFields=true; @version≠3|3.1|3.2
- `options` · collection
  - `includeBinary` · boolean · por defecto `true` · se muestra si @version≠≥3.4
  - `stripBinary` · boolean · por defecto `true` · se muestra si @version=≥3.4; /includeOtherFields=true
  - `ignoreConversionErrors` · boolean · por defecto `false` · se muestra si /mode="manual"
  - `dotNotation` · boolean · por defecto `true`

#### `n8n-nodes-base.code` · Code

- typeVersion más alta: **2** · versión por defecto al crear el nodo: 2
- versiones aceptadas: 1, 2
- clase: INodeType (description.version 1, 2)
- credenciales: ninguna
- entradas: main
- salidas: main

Parámetros (typeVersion 2):

- `mode` · options · por defecto `runOnceForAllItems` · sin expresiones · opciones: `runOnceForAllItems` \| `runOnceForEachItem`
- `language` · options · por defecto `javaScript` · sin expresiones · opciones: `javaScript` \| `pythonNative` · se muestra si @version=2
- `language` · hidden · por defecto `javaScript` · se muestra si @version=1
- `jsCode` · string · por defecto `""` · sin expresiones · se muestra si @version=1; mode="runOnceForAllItems"
- `jsCode` · string · por defecto `""` · sin expresiones · se muestra si @version=1; mode="runOnceForEachItem"
- `jsCode` · string · por defecto `""` · sin expresiones · se muestra si @version=2; language="javaScript"; mode="runOnceForAllItems"
- `jsCode` · string · por defecto `""` · sin expresiones · se muestra si @version=2; language="javaScript"; mode="runOnceForEachItem"
- `pythonCode` · string · por defecto `""` · sin expresiones · se muestra si language="python"|"pythonNative"; mode="runOnceForAllItems"
- `pythonCode` · string · por defecto `""` · sin expresiones · se muestra si language="python"|"pythonNative"; mode="runOnceForEachItem"

#### `n8n-nodes-base.if` · If

- typeVersion más alta: **2.4** · versión por defecto al crear el nodo: 2.4
- versiones aceptadas: 1, 2, 2.1, 2.2, 2.3, 2.4
- clase: VersionedNodeType (nodeVersions 1, 2, 2.1, 2.2, 2.3, 2.4, defaultVersion 2.4)
- credenciales: ninguna
- entradas: main
- salidas: main, main (nombres: true, false)

Parámetros (typeVersion 2.4):

- `conditions` · filter · por defecto `{}`
- `looseTypeValidation` · boolean · por defecto `false` · se muestra si @version=≥2.1
- `options` · collection
  - `ignoreCase` · boolean · por defecto `true`
  - `looseTypeValidation` · boolean · por defecto `true` · se muestra si @version=<2.1

#### `n8n-nodes-base.switch` · Switch

- typeVersion más alta: **3.5** · versión por defecto al crear el nodo: 3.5
- versiones aceptadas: 1, 2, 3, 3.1, 3.2, 3.3, 3.4, 3.5
- clase: VersionedNodeType (nodeVersions 1, 2, 3, 3.1, 3.2, 3.3, 3.4, 3.5, defaultVersion 3.5)
- credenciales: ninguna
- entradas: main
- salidas: dinámicas: dependen de los parámetros (mirá «Forma de las conexiones»)

Parámetros (typeVersion 3.5):

- `mode` · options · por defecto `rules` · sin expresiones · opciones: `rules` \| `expression`
- `numberOutputs` · number · por defecto `4` · sin expresiones · se muestra si mode="expression"; @version=≥3.3
- `numberOutputs` · number · por defecto `4` · se muestra si mode="expression"; @version=<3.3
- `output` · number · por defecto `={{}}` · se muestra si mode="expression"
- `rules` · fixedCollection · varios valores · se muestra si mode="rules"
  - grupo `values` (lista):
    - `conditions` · filter · por defecto `{}`
    - `renameOutput` · boolean · por defecto `false`
    - `outputKey` · string · por defecto `""` · se muestra si renameOutput=true
- `looseTypeValidation` · boolean · por defecto `false` · se muestra si @version=≥3.1
- `options` · collection · se muestra si mode="rules"
  - `fallbackOutput` · options · por defecto `none` · opciones: opciones dinámicas (se cargan desde la cuenta)
  - `ignoreCase` · boolean · por defecto `true`
  - `looseTypeValidation` · boolean · por defecto `true` · se muestra si @version=<3.1
  - `renameFallbackOutput` · string · por defecto `""` · se muestra si fallbackOutput="extra"
  - `allMatchingOutputs` · boolean · por defecto `false`

#### `n8n-nodes-base.filter` · Filter

- typeVersion más alta: **2.4** · versión por defecto al crear el nodo: 2.4
- versiones aceptadas: 1, 2, 2.1, 2.2, 2.3, 2.4
- clase: VersionedNodeType (nodeVersions 1, 2, 2.1, 2.2, 2.3, 2.4, defaultVersion 2.4)
- credenciales: ninguna
- entradas: main
- salidas: main (nombres: Kept, Discarded)

Parámetros (typeVersion 2.4):

- `conditions` · filter · por defecto `{}`
- `looseTypeValidation` · boolean · por defecto `false` · se muestra si @version=≥2.1
- `options` · collection
  - `ignoreCase` · boolean · por defecto `true`
  - `looseTypeValidation` · boolean · por defecto `true` · se muestra si @version=<2.1

#### `n8n-nodes-base.merge` · Merge

- typeVersion más alta: **3.2** · versión por defecto al crear el nodo: 3.2
- versiones aceptadas: 1, 2, 2.1, 3, 3.1, 3.2
- clase: VersionedNodeType (nodeVersions 1, 2, 2.1, 3, 3.1, 3.2, defaultVersion 3.2)
- credenciales: ninguna
- entradas: dinámicas: dependen de los parámetros (mirá «Forma de las conexiones»)
- salidas: main

Parámetros (typeVersion 3.2):

- `mode` · options · por defecto `append` · sin expresiones · opciones: `append` \| `combine` \| `combineBySql` \| `chooseBranch`
- `combineBy` · options · por defecto `combineByFields` · sin expresiones · opciones: `combineByFields` \| `combineByPosition` \| `combineAll` · se muestra si mode="combine"
- `numberInputs` · options · por defecto `2` · sin expresiones · opciones: `2` \| `3` \| `4` \| `5` \| `6` \| `7` \| `8` \| `9` \| `10` · se muestra si mode="append"
- `options` · collection · se muestra si mode="combine"; combineBy="combineAll"
  - `clashHandling` · fixedCollection
    - grupo `values`:
      - `resolveClash` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
      - `mergeMode` · options · por defecto `deepMerge` · opciones: `deepMerge` \| `shallowMerge` · se muestra si resolveClash=≠"addSuffix"
      - `overrideEmpty` · boolean · por defecto `false` · se muestra si resolveClash=≠"addSuffix"
  - `fuzzyCompare` · boolean · por defecto `false`
- `advanced` · boolean · por defecto `false` · se muestra si mode="combine"; combineBy="combineByFields"
- `fieldsToMatchString` · string · por defecto `""` · se muestra si advanced=false; mode="combine"; combineBy="combineByFields"
- `mergeByFields` · fixedCollection · varios valores · se muestra si advanced=true; mode="combine"; combineBy="combineByFields"
  - grupo `values` (lista):
    - `field1` · string · por defecto `""`
    - `field2` · string · por defecto `""`
- `joinMode` · options · por defecto `keepMatches` · opciones: `keepMatches` \| `keepNonMatches` \| `keepEverything` \| `enrichInput1` \| `enrichInput2` · se muestra si mode="combine"; combineBy="combineByFields"
- `outputDataFrom` · options · por defecto `both` · opciones: `both` \| `input1` \| `input2` · se muestra si joinMode="keepMatches"; mode="combine"; combineBy="combineByFields"
- `outputDataFrom` · options · por defecto `both` · opciones: `both` \| `input1` \| `input2` · se muestra si joinMode="keepNonMatches"; mode="combine"; combineBy="combineByFields"
- `options` · collection · se muestra si mode="combine"; combineBy="combineByFields"
  - `clashHandling` · fixedCollection · se muestra si /joinMode≠"keepMatches"|"keepNonMatches"
    - grupo `values`:
      - `resolveClash` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
      - `mergeMode` · options · por defecto `deepMerge` · opciones: `deepMerge` \| `shallowMerge` · se muestra si resolveClash=≠"addSuffix"
      - `overrideEmpty` · boolean · por defecto `false` · se muestra si resolveClash=≠"addSuffix"
  - `clashHandling` · fixedCollection · se muestra si /joinMode="keepMatches"; /outputDataFrom="both"
    - grupo `values`:
      - `resolveClash` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
      - `mergeMode` · options · por defecto `deepMerge` · opciones: `deepMerge` \| `shallowMerge` · se muestra si resolveClash=≠"addSuffix"
      - `overrideEmpty` · boolean · por defecto `false` · se muestra si resolveClash=≠"addSuffix"
  - `disableDotNotation` · boolean · por defecto `false`
  - `fuzzyCompare` · boolean · por defecto `false`
  - `multipleMatches` · options · por defecto `all` · opciones: `all` \| `first` · se muestra si /joinMode="keepMatches"; /outputDataFrom="both"
  - `multipleMatches` · options · por defecto `all` · opciones: `all` \| `first` · se muestra si /joinMode="enrichInput1"|"enrichInput2"|"keepEverything"
- `numberInputs` · options · por defecto `2` · sin expresiones · opciones: `2` \| `3` \| `4` \| `5` \| `6` \| `7` \| `8` \| `9` \| `10` · se muestra si mode="combineBySql"
- `query` · string · por defecto `SELECT * FROM input1 LEFT JOIN input2 ON input1.name = in...` · requerido · sin expresiones · se muestra si mode="combineBySql"
- `options` · collection · se muestra si mode="combineBySql"
  - `emptyQueryResult` · options · por defecto `empty` · opciones: `success` \| `empty` · se muestra si @version=3.2
  - `queryParameters` · string · por defecto `""`
- `numberInputs` · options · por defecto `2` · sin expresiones · opciones: `2` \| `3` \| `4` \| `5` \| `6` \| `7` \| `8` \| `9` \| `10` · se muestra si mode="combine"; combineBy="combineByPosition"
- `options` · collection · se muestra si mode="combine"; combineBy="combineByPosition"
  - `clashHandling` · fixedCollection
    - grupo `values`:
      - `resolveClash` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
      - `mergeMode` · options · por defecto `deepMerge` · opciones: `deepMerge` \| `shallowMerge` · se muestra si resolveClash=≠"addSuffix"
      - `overrideEmpty` · boolean · por defecto `false` · se muestra si resolveClash=≠"addSuffix"
  - `includeUnpaired` · boolean · por defecto `false`
- `numberInputs` · options · por defecto `2` · sin expresiones · opciones: `2` \| `3` \| `4` \| `5` \| `6` \| `7` \| `8` \| `9` \| `10` · se muestra si mode="chooseBranch"
- `chooseBranchMode` · options · por defecto `waitForAll` · opciones: `waitForAll` · se muestra si mode="chooseBranch"
- `output` · options · por defecto `specifiedInput` · opciones: `specifiedInput` \| `empty` · se muestra si chooseBranchMode="waitForAll"; mode="chooseBranch"
- `useDataOfInput` · options · por defecto `1` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si output="specifiedInput"; mode="chooseBranch"

#### `n8n-nodes-base.aggregate` · Aggregate

- typeVersion más alta: **1** · versión por defecto al crear el nodo: 1
- versiones aceptadas: 1
- clase: INodeType (description.version 1)
- credenciales: ninguna
- entradas: main
- salidas: main

Parámetros (typeVersion 1):

- `aggregate` · options · por defecto `aggregateIndividualFields` · opciones: `aggregateIndividualFields` \| `aggregateAllItemData`
- `fieldsToAggregate` · fixedCollection · varios valores · se muestra si aggregate="aggregateIndividualFields"
  - grupo `fieldToAggregate` (lista):
    - `fieldToAggregate` · string · por defecto `""`
    - `renameField` · boolean · por defecto `false`
    - `outputFieldName` · string · por defecto `""` · se muestra si renameField=true
- `destinationFieldName` · string · por defecto `data` · se muestra si aggregate="aggregateAllItemData"
- `include` · options · por defecto `allFields` · opciones: `allFields` \| `specifiedFields` \| `allFieldsExcept` · se muestra si aggregate="aggregateAllItemData"
- `fieldsToExclude` · string · por defecto `""` · se muestra si aggregate="aggregateAllItemData"; include="allFieldsExcept"
- `fieldsToInclude` · string · por defecto `""` · se muestra si aggregate="aggregateAllItemData"; include="specifiedFields"
- `options` · collection
  - `disableDotNotation` · boolean · por defecto `false` · se muestra si /aggregate≠"aggregateAllItemData"
  - `mergeLists` · boolean · por defecto `false` · se muestra si /aggregate≠"aggregateAllItemData"
  - `includeBinaries` · boolean · por defecto `false`
  - `keepOnlyUnique` · boolean · por defecto `false` · se muestra si includeBinaries=true
  - `keepMissing` · boolean · por defecto `false` · se muestra si /aggregate≠"aggregateAllItemData"

#### `n8n-nodes-base.splitOut` · Split Out

- typeVersion más alta: **1.1** · versión por defecto al crear el nodo: 1.1
- versiones aceptadas: 1, 1.1
- clase: INodeType (description.version 1, 1.1)
- credenciales: ninguna
- entradas: main
- salidas: main

Parámetros (typeVersion 1.1):

- `fieldToSplitOut` · string · por defecto `""` · requerido
- `include` · options · por defecto `noOtherFields` · opciones: `noOtherFields` \| `allOtherFields` \| `selectedOtherFields`
- `fieldsToInclude` · string · por defecto `""` · se muestra si include="selectedOtherFields"
- `options` · collection
  - `disableDotNotation` · boolean · por defecto `false`
  - `destinationFieldName` · string · por defecto `""`
  - `includeBinary` · boolean · por defecto `false`

#### `n8n-nodes-base.noOp` · No Operation, do nothing

- typeVersion más alta: **1** · versión por defecto al crear el nodo: 1
- versiones aceptadas: 1
- clase: INodeType (description.version 1)
- credenciales: ninguna
- entradas: main
- salidas: main

Parámetros (typeVersion 1):

- `emptyGroupAnchor` · hidden · por defecto `false`

#### `n8n-nodes-base.stickyNote` · Sticky Note

- typeVersion más alta: **1** · versión por defecto al crear el nodo: 1
- versiones aceptadas: 1
- clase: INodeType (description.version 1)
- credenciales: ninguna
- entradas: ninguna
- salidas: ninguna

Parámetros (typeVersion 1):

- `content` · string · por defecto `## I'm a note **Double click** to edit me. [Guide](https:...`
- `height` · number · por defecto `160` · requerido
- `width` · number · por defecto `240` · requerido
- `color` · number · por defecto `1` · requerido

### Respuestas y formularios

#### `n8n-nodes-base.respondToWebhook` · Respond to Webhook

- typeVersion más alta: **1.5** · versión por defecto al crear el nodo: 1.5
- versiones aceptadas: 1, 1.1, 1.2, 1.3, 1.4, 1.5
- clase: INodeType (description.version 1, 1.1, 1.2, 1.3, 1.4, 1.5)
- credenciales: `jwtAuth` (requerida) si respondWith="jwt"
  - `jwtAuth` se llama «JWT Auth» en el editor
- entradas: main
- salidas: dinámicas: dependen de los parámetros (mirá «Forma de las conexiones»)

Parámetros (typeVersion 1.5):

- `enableResponseOutput` · boolean · por defecto `false` · se muestra si @version=≥1.4
- `respondWith` · options · por defecto `firstIncomingItem` · opciones: `allIncomingItems` \| `binary` \| `firstIncomingItem` \| `json` \| `jwt` \| `noData` \| `redirect` \| `text` · se muestra si @version=1|1.1
- `respondWith` · options · por defecto `firstIncomingItem` · sin expresiones · opciones: `allIncomingItems` \| `binary` \| `firstIncomingItem` \| `json` \| `jwt` \| `noData` \| `redirect` \| `text` · se muestra si @version=≥1.2
- `credentials` · credentials · por defecto `""` · se muestra si respondWith="jwt"
- `redirectURL` · string · por defecto `""` · requerido · se muestra si respondWith="redirect"
- `responseBody` · json · por defecto `{ "myField": "value" }` · se muestra si respondWith="json"
- `payload` · json · por defecto `{ "myField": "value" }` · se muestra si respondWith="jwt"
- `responseBody` · string · por defecto `""` · se muestra si respondWith="text"
- `responseDataSource` · options · por defecto `automatically` · opciones: `automatically` \| `set` · se muestra si respondWith="binary"
- `inputFieldName` · string · por defecto `data` · requerido · se muestra si respondWith="binary"; responseDataSource="set"
- `options` · collection
  - `responseCode` · number · por defecto `200`
  - `responseHeaders` · fixedCollection · varios valores
    - grupo `entries` (lista):
      - `name` · string · por defecto `""`
      - `value` · string · por defecto `""`
  - `responseKey` · string · por defecto `""` · se muestra si /respondWith="allIncomingItems"|"firstIncomingItem"
  - `enableStreaming` · boolean · por defecto `true` · se muestra si /respondWith="allIncomingItems"|"firstIncomingItem"|"text"|"json"|"jwt"; @version=≥1.5

#### `n8n-nodes-base.form` · n8n Form

- typeVersion más alta: **2.5** · versión por defecto al crear el nodo: 2.5
- versiones aceptadas: 1, 2.3, 2.4, 2.5
- clase: INodeType (description.version 1, 2.3, 2.4, 2.5)
- credenciales: ninguna
- entradas: main
- salidas: main
- webhooks: default GET, default POST

Parámetros (typeVersion 2.5):

- `operation` · options · por defecto `page` · sin expresiones · opciones: `page` \| `completion`
- `defineForm` · options · por defecto `fields` · sin expresiones · opciones: `fields` \| `json` · se muestra si operation="page"
- `jsonOutput` · json · por defecto `[ { "fieldLabel": "Name", "placeholder": "enter your name...` · se muestra si defineForm="json"; operation="page"
- `formFields` · fixedCollection · varios valores · se muestra si @version=<2.5; defineForm="fields"; operation="page"
  - grupo `values` (lista):
    - `fieldName` · string · por defecto `""` · requerido · se muestra si @version=2.4; fieldType≠"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=≥2.4; fieldType≠"hiddenField"|"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=<2.4; fieldType≠"hiddenField"|"html"
    - `fieldName` · string · por defecto `""` · se muestra si fieldType="hiddenField"; @version=<2.4
    - `fieldType` · options · por defecto `text` · requerido · opciones: `checkbox` \| `html` \| `date` \| `dropdown` \| `email` \| `file` \| `hiddenField` \| `number` \| `password` \| `radio` \| `text` \| `textarea`
    - `elementName` · string · por defecto `""` · se muestra si fieldType="html"
    - `fieldName` · string · por defecto `""` · se muestra si @version=≥2.5; fieldType≠"html"
    - `placeholder` · string · por defecto `""` · se muestra si fieldType≠"dropdown"|"date"|"file"|"html"|"hiddenField"|"radio"|"checkbox"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="text"|"number"|"email"|"textarea"
    - `defaultValue` · dateTime · por defecto `""` · se muestra si fieldType="date"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="dropdown"|"radio"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="checkbox"
    - `fieldValue` · string · por defecto `""` · se muestra si fieldType="hiddenField"
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="dropdown"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="checkbox"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="radio"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `multiselect` · boolean · por defecto `false` · se muestra si fieldType="dropdown"; @version=<2.3
    - `limitSelection` · options · por defecto `unlimited` · opciones: `exact` \| `range` \| `unlimited` · se muestra si fieldType="checkbox"
    - `numberOfSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="exact"
    - `minSelections` · number · por defecto `0` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `maxSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `html` · string · por defecto (un comentario HTML de ejemplo) · sin expresiones · se muestra si fieldType="html"
    - `multipleFiles` · boolean · por defecto `true` · se muestra si fieldType="file"
    - `acceptFileTypes` · string · por defecto `""` · se muestra si fieldType="file"
    - `requiredField` · boolean · por defecto `false` · se muestra si fieldType≠"html"|"hiddenField"
- `formFields` · fixedCollection · varios valores · se muestra si @version=≥2.5; defineForm="fields"; operation="page"
  - grupo `values` (lista):
    - `fieldName` · string · por defecto `""` · requerido · se muestra si @version=2.4; fieldType≠"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=≥2.4; fieldType≠"hiddenField"|"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=<2.4; fieldType≠"hiddenField"|"html"
    - `fieldName` · string · por defecto `""` · se muestra si fieldType="hiddenField"; @version=<2.4
    - `fieldType` · options · por defecto `text` · requerido · opciones: `checkbox` \| `html` \| `date` \| `dropdown` \| `email` \| `file` \| `hiddenField` \| `number` \| `password` \| `radio` \| `text` \| `textarea`
    - `elementName` · string · por defecto `""` · se muestra si fieldType="html"
    - `fieldName` · string · por defecto `""` · se muestra si @version=≥2.5; fieldType≠"html"
    - `placeholder` · string · por defecto `""` · se muestra si fieldType≠"dropdown"|"date"|"file"|"html"|"hiddenField"|"radio"|"checkbox"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="text"|"number"|"email"|"textarea"
    - `defaultValue` · dateTime · por defecto `""` · se muestra si fieldType="date"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="dropdown"|"radio"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="checkbox"
    - `fieldValue` · string · por defecto `""` · se muestra si fieldType="hiddenField"
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="dropdown"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="checkbox"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="radio"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `multiselect` · boolean · por defecto `false` · se muestra si fieldType="dropdown"; @version=<2.3
    - `limitSelection` · options · por defecto `unlimited` · opciones: `exact` \| `range` \| `unlimited` · se muestra si fieldType="checkbox"
    - `numberOfSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="exact"
    - `minSelections` · number · por defecto `0` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `maxSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `html` · string · por defecto (un comentario HTML de ejemplo) · sin expresiones · se muestra si fieldType="html"
    - `multipleFiles` · boolean · por defecto `true` · se muestra si fieldType="file"
    - `acceptFileTypes` · string · por defecto `""` · se muestra si fieldType="file"
    - `requiredField` · boolean · por defecto `false` · se muestra si fieldType≠"html"|"hiddenField"
- `limitWaitTime` · boolean · por defecto `false` · se muestra si operation="page"
- `limitType` · options · por defecto `afterTimeInterval` · opciones: `afterTimeInterval` \| `atSpecifiedTime` · se muestra si limitWaitTime=true; operation="page"
- `resumeAmount` · number · por defecto `1` · se muestra si limitType="afterTimeInterval"; limitWaitTime=true; operation="page"
- `resumeUnit` · options · por defecto `hours` · opciones: `minutes` \| `hours` \| `days` · se muestra si limitType="afterTimeInterval"; limitWaitTime=true; operation="page"
- `maxDateAndTime` · dateTime · por defecto `""` · se muestra si limitType="atSpecifiedTime"; limitWaitTime=true; operation="page"
- `options` · collection · se muestra si operation="page"
  - `formTitle` · string · por defecto `""`
  - `formDescription` · string · por defecto `""`
  - `buttonLabel` · string · por defecto `Submit`
  - `customCss` · string · por defecto `:root { --font-family: 'Open Sans', sans-serif; --font-we...`
- `respondWith` · options · por defecto `text` · opciones: `text` \| `redirect` \| `showText` \| `returnBinary` · se muestra si operation="completion"
- `redirectUrl` · string · por defecto `""` · requerido · se muestra si respondWith="redirect"; operation="completion"
- `completionTitle` · string · por defecto `""` · requerido · se muestra si respondWith="text"|"returnBinary"; operation="completion"
- `completionMessage` · string · por defecto `""` · se muestra si respondWith="text"|"returnBinary"; operation="completion"
- `responseText` · string · por defecto `""` · se muestra si respondWith="showText"; operation="completion"
- `inputDataFieldName` · string · por defecto `data` · se muestra si respondWith="returnBinary"; operation="completion"
- `limitWaitTime` · boolean · por defecto `false` · se muestra si operation="completion"
- `limitType` · options · por defecto `afterTimeInterval` · opciones: `afterTimeInterval` \| `atSpecifiedTime` · se muestra si limitWaitTime=true; operation="completion"
- `resumeAmount` · number · por defecto `1` · se muestra si limitType="afterTimeInterval"; limitWaitTime=true; operation="completion"
- `resumeUnit` · options · por defecto `hours` · opciones: `minutes` \| `hours` \| `days` · se muestra si limitType="afterTimeInterval"; limitWaitTime=true; operation="completion"
- `maxDateAndTime` · dateTime · por defecto `""` · se muestra si limitType="atSpecifiedTime"; limitWaitTime=true; operation="completion"
- `options` · collection · se muestra si respondWith="text"|"returnBinary"|"redirect"; operation="completion"
  - `formTitle` · string · por defecto `""`
  - `appendAttribution` · boolean · por defecto `true`
  - `customCss` · string · por defecto `:root { --font-family: 'Open Sans', sans-serif; --font-we...`

### HTTP y seguridad

#### `n8n-nodes-base.httpRequest` · HTTP Request

- typeVersion más alta: **4.5** · versión por defecto al crear el nodo: 4.5
- versiones aceptadas: 1, 2, 3, 4, 4.1, 4.2, 4.3, 4.4, 4.5
- clase: VersionedNodeType (nodeVersions 1, 2, 3, 4, 4.1, 4.2, 4.3, 4.4, 4.5, defaultVersion 4.5)
- credenciales: `httpSslAuth` (requerida) si provideSslCertificates=true
  - `httpSslAuth` se llama «SSL Certificates» en el editor
  - además, cualquier credencial elegida con `authentication`: `predefinedCredentialType` + `nodeCredentialType` (por ejemplo `githubApi`) o `genericCredentialType` + `genericAuthType` (por ejemplo `httpHeaderAuth`)
- entradas: main
- salidas: main

Parámetros (typeVersion 4.5):

- `curlImport` · curlImport · por defecto `""`
- `method` · options · por defecto `GET` · opciones: `DELETE` \| `GET` \| `HEAD` \| `OPTIONS` \| `PATCH` \| `POST` \| `PUT` \| `COPY` \| `COPY` \| `MKCOL` \| `MKCOL` \| `MOVE` \| `MOVE` \| `PROPFIND` (+3)
- `url` · string · por defecto `""` · requerido
- `authentication` · options · por defecto `none` · sin expresiones · opciones: `none` \| `predefinedCredentialType` \| `genericCredentialType`
- `nodeCredentialType` · credentialsSelect · por defecto `""` · requerido · sin expresiones · se muestra si authentication="predefinedCredentialType"
- `genericAuthType` · credentialsSelect · por defecto `""` · requerido · se muestra si authentication="genericCredentialType"
- `provideSslCertificates` · boolean · por defecto `false`
- `sslCertificate` · credentials · por defecto `""` · se muestra si provideSslCertificates=true
- `sendQuery` · boolean · por defecto `false` · sin expresiones
- `specifyQuery` · options · por defecto `keypair` · opciones: `keypair` \| `json` · se muestra si sendQuery=true
- `queryParameters` · fixedCollection · varios valores · se muestra si sendQuery=true; specifyQuery="keypair"
  - grupo `parameters` (lista):
    - `name` · string · por defecto `""`
    - `value` · string · por defecto `""`
- `jsonQuery` · json · por defecto `""` · se muestra si sendQuery=true; specifyQuery="json"
- `sendHeaders` · boolean · por defecto `false` · sin expresiones
- `specifyHeaders` · options · por defecto `keypair` · opciones: `keypair` \| `json` · se muestra si sendHeaders=true
- `headerParameters` · fixedCollection · varios valores · se muestra si sendHeaders=true; specifyHeaders="keypair"
  - grupo `parameters` (lista):
    - `name` · string · por defecto `""`
    - `value` · string · por defecto `""`
- `jsonHeaders` · json · por defecto `""` · se muestra si sendHeaders=true; specifyHeaders="json"
- `sendBody` · boolean · por defecto `false` · sin expresiones
- `contentType` · options · por defecto `json` · opciones: `form-urlencoded` \| `multipart-form-data` \| `json` \| `binaryData` \| `raw` · se muestra si sendBody=true
- `specifyBody` · options · por defecto `keypair` · opciones: `keypair` \| `json` · se muestra si sendBody=true; contentType="json"
- `bodyParameters` · fixedCollection · varios valores · se muestra si sendBody=true; contentType="json"; specifyBody="keypair"
  - grupo `parameters` (lista):
    - `name` · string · por defecto `""`
    - `value` · string · por defecto `""`
- `jsonBody` · json · por defecto `""` · se muestra si sendBody=true; contentType="json"; specifyBody="json"
- `bodyParameters` · fixedCollection · varios valores · se muestra si sendBody=true; contentType="multipart-form-data"
  - grupo `parameters` (lista):
    - `parameterType` · options · por defecto `formData` · opciones: `formBinaryData` \| `formData`
    - `name` · string · por defecto `""`
    - `value` · string · por defecto `""` · se muestra si parameterType="formData"
    - `inputDataFieldName` · string · por defecto `""` · se muestra si parameterType="formBinaryData"
- `specifyBody` · options · por defecto `keypair` · opciones: `keypair` \| `string` · se muestra si sendBody=true; contentType="form-urlencoded"
- `bodyParameters` · fixedCollection · varios valores · se muestra si sendBody=true; contentType="form-urlencoded"; specifyBody="keypair"
  - grupo `parameters` (lista):
    - `name` · string · por defecto `""`
    - `value` · string · por defecto `""`
- `body` · string · por defecto `""` · se muestra si sendBody=true; specifyBody="string"
- `inputDataFieldName` · string · por defecto `""` · se muestra si sendBody=true; contentType="binaryData"
- `rawContentType` · string · por defecto `""` · se muestra si sendBody=true; contentType="raw"
- `body` · string · por defecto `""` · se muestra si sendBody=true; contentType="raw"
- `options` · collection
  - `batching` · fixedCollection
    - grupo `batch`:
      - `batchSize` · number · por defecto `50`
      - `batchInterval` · number · por defecto `1000`
  - `allowUnauthorizedCerts` · boolean · por defecto `false` · sin expresiones
  - `queryParameterArrays` · options · por defecto `brackets` · opciones: `repeat` \| `brackets` \| `indices` · se muestra si /sendQuery=true
  - `lowercaseHeaders` · boolean · por defecto `true`
  - `redirect` · fixedCollection · se muestra si @version=1|2|3
    - grupo `redirect`:
      - `followRedirects` · boolean · por defecto `false` · sin expresiones
      - `maxRedirects` · number · por defecto `21` · se muestra si followRedirects=true
  - `redirect` · fixedCollection · se muestra si @version≠1|2|3
    - grupo `redirect`:
      - `followRedirects` · boolean · por defecto `true` · sin expresiones
      - `maxRedirects` · number · por defecto `21` · se muestra si followRedirects=true
  - `response` · fixedCollection
    - grupo `response`:
      - `fullResponse` · boolean · por defecto `false`
      - `neverError` · boolean · por defecto `false`
      - `responseFormat` · options · por defecto `autodetect` · sin expresiones · opciones: `autodetect` \| `file` \| `json` \| `text`
      - `outputPropertyName` · string · por defecto `data` · requerido · se muestra si responseFormat="file"|"text"
  - `pagination` · fixedCollection
    - grupo `pagination`:
      - `paginationMode` · options · por defecto `updateAParameterInEachRequest` · opciones: `off` \| `updateAParameterInEachRequest` \| `responseContainsNextURL`
      - `nextURL` · string · por defecto `""` · se muestra si paginationMode="responseContainsNextURL"
      - `parameters` · fixedCollection · varios valores · se muestra si paginationMode="updateAParameterInEachRequest"
      - `paginationCompleteWhen` · options · por defecto `responseIsEmpty` · opciones: `responseIsEmpty` \| `receiveSpecificStatusCodes` \| `other` · se muestra si paginationMode≠"off"
      - `statusCodesWhenComplete` · string · por defecto `""` · se muestra si paginationCompleteWhen="receiveSpecificStatusCodes"
      - `completeExpression` · string · por defecto `""` · se muestra si paginationCompleteWhen="other"
      - `limitPagesFetched` · boolean · por defecto `false` · sin expresiones · se muestra si paginationMode≠"off"
      - `maxRequests` · number · por defecto `100` · se muestra si limitPagesFetched=true
      - `requestInterval` · number · por defecto `0` · se muestra si paginationMode≠"off"
  - `proxy` · string · por defecto `""`
  - `timeout` · number · por defecto `10000`
  - `sendCredentialsOnCrossOriginRedirect` · boolean · por defecto `false`
  - `webdavMethods` · boolean · por defecto `false`
- `optimizeResponse` · boolean · por defecto `false` · sin expresiones · se muestra si @tool=true
- `responseType` · options · por defecto `json` · opciones: `json` \| `html` \| `text` · se muestra si optimizeResponse=true; @tool=true
- `dataField` · string · por defecto `""` · se muestra si optimizeResponse=true; responseType="json"; @tool=true
- `fieldsToInclude` · options · por defecto `all` · opciones: `all` \| `selected` \| `except` · se muestra si optimizeResponse=true; responseType="json"; @tool=true
- `fields` · string · por defecto `""` · se muestra si optimizeResponse=true; responseType="json"; @tool=true; fieldsToInclude≠"all"
- `cssSelector` · string · por defecto `body` · se muestra si optimizeResponse=true; responseType="html"; @tool=true
- `onlyContent` · boolean · por defecto `false` · se muestra si optimizeResponse=true; responseType="html"; @tool=true
- `elementsToOmit` · string · por defecto `""` · se muestra si optimizeResponse=true; responseType="html"; onlyContent=true; @tool=true
- `truncateResponse` · boolean · por defecto `false` · se muestra si optimizeResponse=true; responseType="text"|"html"; @tool=true
- `maxLength` · number · por defecto `1000` · se muestra si optimizeResponse=true; responseType="text"|"html"; truncateResponse=true; @tool=true

#### `n8n-nodes-base.httpRequestTool` · HTTP Request Tool

- typeVersion más alta: **4.5** · versión por defecto al crear el nodo: 4.5
- versiones aceptadas: 3, 4, 4.1, 4.2, 4.3, 4.4, 4.5
- clase: VersionedNodeType (nodeVersions 1, 2, 3, 4, 4.1, 4.2, 4.3, 4.4, 4.5, defaultVersion 4.5); n8n la genera desde `httpRequest` al cargar (usableAsTool) · ojo: no coincide con los tipos
- credenciales: `httpSslAuth` (requerida) si provideSslCertificates=true
  - `httpSslAuth` se llama «SSL Certificates» en el editor
  - además, cualquier credencial elegida con `authentication`: `predefinedCredentialType` + `nodeCredentialType` (por ejemplo `githubApi`) o `genericCredentialType` + `genericAuthType` (por ejemplo `httpHeaderAuth`)
- entradas: ninguna
- salidas: ai_tool

Parámetros (typeVersion 4.5):

- `toolDescription` · string · por defecto `Makes an HTTP request and returns the response data` · requerido
- `curlImport` · curlImport · por defecto `""`
- `method` · options · por defecto `GET` · opciones: `DELETE` \| `GET` \| `HEAD` \| `OPTIONS` \| `PATCH` \| `POST` \| `PUT` \| `COPY` \| `COPY` \| `MKCOL` \| `MKCOL` \| `MOVE` \| `MOVE` \| `PROPFIND` (+3)
- `url` · string · por defecto `""` · requerido
- `authentication` · options · por defecto `none` · sin expresiones · opciones: `none` \| `predefinedCredentialType` \| `genericCredentialType`
- `nodeCredentialType` · credentialsSelect · por defecto `""` · requerido · sin expresiones · se muestra si authentication="predefinedCredentialType"
- `genericAuthType` · credentialsSelect · por defecto `""` · requerido · se muestra si authentication="genericCredentialType"
- `provideSslCertificates` · boolean · por defecto `false`
- `sslCertificate` · credentials · por defecto `""` · se muestra si provideSslCertificates=true
- `sendQuery` · boolean · por defecto `false` · sin expresiones
- `specifyQuery` · options · por defecto `keypair` · opciones: `keypair` \| `json` · se muestra si sendQuery=true
- `queryParameters` · fixedCollection · varios valores · se muestra si sendQuery=true; specifyQuery="keypair"
  - grupo `parameters` (lista):
    - `name` · string · por defecto `""`
    - `value` · string · por defecto `""`
- `jsonQuery` · json · por defecto `""` · se muestra si sendQuery=true; specifyQuery="json"
- `sendHeaders` · boolean · por defecto `false` · sin expresiones
- `specifyHeaders` · options · por defecto `keypair` · opciones: `keypair` \| `json` · se muestra si sendHeaders=true
- `headerParameters` · fixedCollection · varios valores · se muestra si sendHeaders=true; specifyHeaders="keypair"
  - grupo `parameters` (lista):
    - `name` · string · por defecto `""`
    - `value` · string · por defecto `""`
- `jsonHeaders` · json · por defecto `""` · se muestra si sendHeaders=true; specifyHeaders="json"
- `sendBody` · boolean · por defecto `false` · sin expresiones
- `contentType` · options · por defecto `json` · opciones: `form-urlencoded` \| `multipart-form-data` \| `json` \| `binaryData` \| `raw` · se muestra si sendBody=true
- `specifyBody` · options · por defecto `keypair` · opciones: `keypair` \| `json` · se muestra si sendBody=true; contentType="json"
- `bodyParameters` · fixedCollection · varios valores · se muestra si sendBody=true; contentType="json"; specifyBody="keypair"
  - grupo `parameters` (lista):
    - `name` · string · por defecto `""`
    - `value` · string · por defecto `""`
- `jsonBody` · json · por defecto `""` · se muestra si sendBody=true; contentType="json"; specifyBody="json"
- `bodyParameters` · fixedCollection · varios valores · se muestra si sendBody=true; contentType="multipart-form-data"
  - grupo `parameters` (lista):
    - `parameterType` · options · por defecto `formData` · opciones: `formBinaryData` \| `formData`
    - `name` · string · por defecto `""`
    - `value` · string · por defecto `""` · se muestra si parameterType="formData"
    - `inputDataFieldName` · string · por defecto `""` · se muestra si parameterType="formBinaryData"
- `specifyBody` · options · por defecto `keypair` · opciones: `keypair` \| `string` · se muestra si sendBody=true; contentType="form-urlencoded"
- `bodyParameters` · fixedCollection · varios valores · se muestra si sendBody=true; contentType="form-urlencoded"; specifyBody="keypair"
  - grupo `parameters` (lista):
    - `name` · string · por defecto `""`
    - `value` · string · por defecto `""`
- `body` · string · por defecto `""` · se muestra si sendBody=true; specifyBody="string"
- `inputDataFieldName` · string · por defecto `""` · se muestra si sendBody=true; contentType="binaryData"
- `rawContentType` · string · por defecto `""` · se muestra si sendBody=true; contentType="raw"
- `body` · string · por defecto `""` · se muestra si sendBody=true; contentType="raw"
- `options` · collection
  - `batching` · fixedCollection
    - grupo `batch`:
      - `batchSize` · number · por defecto `50`
      - `batchInterval` · number · por defecto `1000`
  - `allowUnauthorizedCerts` · boolean · por defecto `false` · sin expresiones
  - `queryParameterArrays` · options · por defecto `brackets` · opciones: `repeat` \| `brackets` \| `indices` · se muestra si /sendQuery=true
  - `lowercaseHeaders` · boolean · por defecto `true`
  - `redirect` · fixedCollection · se muestra si @version=1|2|3
    - grupo `redirect`:
      - `followRedirects` · boolean · por defecto `false` · sin expresiones
      - `maxRedirects` · number · por defecto `21` · se muestra si followRedirects=true
  - `redirect` · fixedCollection · se muestra si @version≠1|2|3
    - grupo `redirect`:
      - `followRedirects` · boolean · por defecto `true` · sin expresiones
      - `maxRedirects` · number · por defecto `21` · se muestra si followRedirects=true
  - `response` · fixedCollection
    - grupo `response`:
      - `fullResponse` · boolean · por defecto `false`
      - `neverError` · boolean · por defecto `false`
      - `responseFormat` · options · por defecto `autodetect` · sin expresiones · opciones: `autodetect` \| `file` \| `json` \| `text`
      - `outputPropertyName` · string · por defecto `data` · requerido · se muestra si responseFormat="file"|"text"
  - `pagination` · fixedCollection
    - grupo `pagination`:
      - `paginationMode` · options · por defecto `updateAParameterInEachRequest` · opciones: `off` \| `updateAParameterInEachRequest` \| `responseContainsNextURL`
      - `nextURL` · string · por defecto `""` · se muestra si paginationMode="responseContainsNextURL"
      - `parameters` · fixedCollection · varios valores · se muestra si paginationMode="updateAParameterInEachRequest"
      - `paginationCompleteWhen` · options · por defecto `responseIsEmpty` · opciones: `responseIsEmpty` \| `receiveSpecificStatusCodes` \| `other` · se muestra si paginationMode≠"off"
      - `statusCodesWhenComplete` · string · por defecto `""` · se muestra si paginationCompleteWhen="receiveSpecificStatusCodes"
      - `completeExpression` · string · por defecto `""` · se muestra si paginationCompleteWhen="other"
      - `limitPagesFetched` · boolean · por defecto `false` · sin expresiones · se muestra si paginationMode≠"off"
      - `maxRequests` · number · por defecto `100` · se muestra si limitPagesFetched=true
      - `requestInterval` · number · por defecto `0` · se muestra si paginationMode≠"off"
  - `proxy` · string · por defecto `""`
  - `timeout` · number · por defecto `10000`
  - `sendCredentialsOnCrossOriginRedirect` · boolean · por defecto `false`
  - `webdavMethods` · boolean · por defecto `false`
- `optimizeResponse` · boolean · por defecto `false` · sin expresiones · se muestra si @tool=true
- `responseType` · options · por defecto `json` · opciones: `json` \| `html` \| `text` · se muestra si optimizeResponse=true; @tool=true
- `dataField` · string · por defecto `""` · se muestra si optimizeResponse=true; responseType="json"; @tool=true
- `fieldsToInclude` · options · por defecto `all` · opciones: `all` \| `selected` \| `except` · se muestra si optimizeResponse=true; responseType="json"; @tool=true
- `fields` · string · por defecto `""` · se muestra si optimizeResponse=true; responseType="json"; @tool=true; fieldsToInclude≠"all"
- `cssSelector` · string · por defecto `body` · se muestra si optimizeResponse=true; responseType="html"; @tool=true
- `onlyContent` · boolean · por defecto `false` · se muestra si optimizeResponse=true; responseType="html"; @tool=true
- `elementsToOmit` · string · por defecto `""` · se muestra si optimizeResponse=true; responseType="html"; onlyContent=true; @tool=true
- `truncateResponse` · boolean · por defecto `false` · se muestra si optimizeResponse=true; responseType="text"|"html"; @tool=true
- `maxLength` · number · por defecto `1000` · se muestra si optimizeResponse=true; responseType="text"|"html"; truncateResponse=true; @tool=true

#### `@n8n/n8n-nodes-langchain.toolHttpRequest` · HTTP Request Tool

- typeVersion más alta: **1.1** · versión por defecto al crear el nodo: 1.1
- versiones aceptadas: 1, 1.1
- clase: INodeType (description.version 1, 1.1)
- credenciales: ninguna
  - además, cualquier credencial elegida con `authentication`: `predefinedCredentialType` + `nodeCredentialType` (por ejemplo `githubApi`) o `genericCredentialType` + `genericAuthType` (por ejemplo `httpHeaderAuth`)
- entradas: ninguna
- salidas: ai_tool (nombres: Tool)

Parámetros (typeVersion 1.1):

- `toolDescription` · string · por defecto `""`
- `method` · options · por defecto `GET` · opciones: `DELETE` \| `GET` \| `PATCH` \| `POST` \| `PUT`
- `url` · string · por defecto `""` · requerido
- `authentication` · options · por defecto `none` · sin expresiones · opciones: `none` \| `predefinedCredentialType` \| `genericCredentialType`
- `nodeCredentialType` · credentialsSelect · por defecto `""` · requerido · sin expresiones · se muestra si authentication="predefinedCredentialType"
- `genericAuthType` · credentialsSelect · por defecto `""` · requerido · se muestra si authentication="genericCredentialType"
- `sendQuery` · boolean · por defecto `false` · sin expresiones
- `specifyQuery` · options · por defecto `keypair` · opciones: `keypair` \| `json` \| `model` · se muestra si sendQuery=true
- `parametersQuery` · fixedCollection · varios valores · se muestra si sendQuery=true; specifyQuery="keypair"
  - grupo `values` (lista):
    - `name` · string · por defecto `""`
    - `valueProvider` · options · por defecto `modelRequired` · opciones: `modelRequired` \| `modelOptional` \| `fieldValue`
    - `value` · string · por defecto `""` · se muestra si valueProvider="fieldValue"
- `jsonQuery` · string · por defecto `""` · se muestra si sendQuery=true; specifyQuery="json"
- `sendHeaders` · boolean · por defecto `false` · sin expresiones
- `specifyHeaders` · options · por defecto `keypair` · opciones: `keypair` \| `json` \| `model` · se muestra si sendHeaders=true
- `parametersHeaders` · fixedCollection · varios valores · se muestra si sendHeaders=true; specifyHeaders="keypair"
  - grupo `values` (lista):
    - `name` · string · por defecto `""`
    - `valueProvider` · options · por defecto `modelRequired` · opciones: `modelRequired` \| `modelOptional` \| `fieldValue`
    - `value` · string · por defecto `""` · se muestra si valueProvider="fieldValue"
- `jsonHeaders` · string · por defecto `""` · se muestra si sendHeaders=true; specifyHeaders="json"
- `sendBody` · boolean · por defecto `false` · sin expresiones
- `specifyBody` · options · por defecto `keypair` · opciones: `keypair` \| `json` \| `model` · se muestra si sendBody=true
- `parametersBody` · fixedCollection · varios valores · se muestra si sendBody=true; specifyBody="keypair"
  - grupo `values` (lista):
    - `name` · string · por defecto `""`
    - `valueProvider` · options · por defecto `modelRequired` · opciones: `modelRequired` \| `modelOptional` \| `fieldValue`
    - `value` · string · por defecto `""` · se muestra si valueProvider="fieldValue"
- `jsonBody` · string · por defecto `""` · se muestra si sendBody=true; specifyBody="json"
- `placeholderDefinitions` · fixedCollection · varios valores
  - grupo `values` (lista):
    - `name` · string · por defecto `""`
    - `description` · string · por defecto `""`
    - `type` · options · por defecto `not specified` · opciones: `not specified` \| `string` \| `number` \| `boolean` \| `json`
- `optimizeResponse` · boolean · por defecto `false` · sin expresiones
- `responseType` · options · por defecto `json` · opciones: `json` \| `html` \| `text` · se muestra si optimizeResponse=true
- `dataField` · string · por defecto `""` · se muestra si optimizeResponse=true; responseType="json"
- `fieldsToInclude` · options · por defecto `all` · opciones: `all` \| `selected` \| `except` · se muestra si optimizeResponse=true; responseType="json"
- `fields` · string · por defecto `""` · se muestra si optimizeResponse=true; responseType="json"; fieldsToInclude≠"all"
- `cssSelector` · string · por defecto `body` · se muestra si optimizeResponse=true; responseType="html"
- `onlyContent` · boolean · por defecto `false` · se muestra si optimizeResponse=true; responseType="html"
- `elementsToOmit` · string · por defecto `""` · se muestra si optimizeResponse=true; responseType="html"; onlyContent=true
- `truncateResponse` · boolean · por defecto `false` · se muestra si optimizeResponse=true; responseType="text"|"html"
- `maxLength` · number · por defecto `1000` · se muestra si optimizeResponse=true; responseType="text"|"html"; truncateResponse=true

#### `n8n-nodes-base.jwt` · JWT

- typeVersion más alta: **1** · versión por defecto al crear el nodo: 1
- versiones aceptadas: 1
- clase: INodeType (description.version 1)
- credenciales: `jwtAuth` (requerida)
  - `jwtAuth` se llama «JWT Auth» en el editor
- entradas: main
- salidas: main

Parámetros (typeVersion 1):

- `operation` · options · por defecto `sign` · sin expresiones · opciones: `decode` \| `sign` \| `verify`
- `useJson` · boolean · por defecto `false` · se muestra si operation="sign"
- `claims` · collection · se muestra si operation="sign"; useJson=false
  - `audience` · string · por defecto `""`
  - `expiresIn` · number · por defecto `3600`
  - `issuer` · string · por defecto `""`
  - `jwtid` · string · por defecto `""`
  - `notBefore` · number · por defecto `0`
  - `subject` · string · por defecto `""`
- `claimsJson` · json · por defecto `{ "my_field_1": "value 1", "my_field_2": "value 2" } ` · se muestra si operation="sign"; useJson=true
- `headerClaims` · json · por defecto `{}` · se muestra si operation="sign"
- `token` · string · por defecto `""` · requerido · se muestra si operation="verify"|"decode"
- `options` · collection
  - `complete` · boolean · por defecto `false` · se muestra si /operation="verify"|"decode"
  - `ignoreExpiration` · boolean · por defecto `false` · se muestra si /operation="verify"
  - `ignoreNotBefore` · boolean · por defecto `false` · se muestra si /operation="verify"
  - `clockTolerance` · number · por defecto `0` · se muestra si /operation="verify"
  - `kid` · string · por defecto `""` · se muestra si /operation="sign"
  - `algorithm` · options · por defecto `HS256` · opciones: `ES256` \| `ES384` \| `ES512` \| `HS256` \| `HS384` \| `HS512` \| `PS256` \| `PS384` \| `PS512` \| `RS256` \| `RS384` \| `RS512` · se muestra si /operation="sign"|"verify"

#### `n8n-nodes-base.crypto` · Crypto

- typeVersion más alta: **2** · versión por defecto al crear el nodo: 2
- versiones aceptadas: 1, 2
- clase: VersionedNodeType (nodeVersions 1, 2, defaultVersion 2)
- credenciales: `crypto` (requerida) si action="hmac"|"sign"|"encrypt"|"decrypt"
  - `crypto` se llama «Crypto» en el editor
- entradas: main
- salidas: main

Parámetros (typeVersion 2):

- `action` · options · por defecto `hash` · opciones: `decrypt` \| `encrypt` \| `generate` \| `hash` \| `hmac` \| `sign`
- `binaryData` · boolean · por defecto `false` · requerido · se muestra si action="hash"|"hmac"
- `binaryPropertyName` · string · por defecto `data` · requerido · se muestra si action="hash"|"hmac"; binaryData=true
- `type` · options · por defecto `SHA256` · requerido · opciones: `MD5` \| `SHA1` \| `SHA256` \| `SHA3-256` \| `SHA3-384` \| `SHA3-512` \| `SHA384` \| `SHA512` · se muestra si action="hash"
- `value` · string · por defecto `""` · requerido · se muestra si action="hash"; binaryData=false
- `dataPropertyName` · string · por defecto `data` · requerido · se muestra si action="hash"
- `encoding` · options · por defecto `hex` · requerido · opciones: `base64` \| `hex` · se muestra si action="hash"
- `type` · options · por defecto `SHA256` · requerido · opciones: `MD5` \| `SHA1` \| `SHA256` \| `SHA3-256` \| `SHA3-384` \| `SHA3-512` \| `SHA384` \| `SHA512` · se muestra si action="hmac"
- `value` · string · por defecto `""` · requerido · se muestra si action="hmac"; binaryData=false
- `dataPropertyName` · string · por defecto `data` · requerido · se muestra si action="hmac"
- `encoding` · options · por defecto `hex` · requerido · opciones: `base64` \| `hex` · se muestra si action="hmac"
- `value` · string · por defecto `""` · requerido · se muestra si action="sign"
- `dataPropertyName` · string · por defecto `data` · requerido · se muestra si action="sign"
- `algorithm` · options · por defecto `""` · requerido · opciones: `RSA-MD5` \| `RSA-RIPEMD160` \| `RSA-SHA1` \| `RSA-SHA1-2` \| `RSA-SHA224` \| `RSA-SHA256` \| `RSA-SHA3-224` \| `RSA-SHA3-256` \| `RSA-SHA3-384` \| `RSA-SHA3-512` \| `RSA-SHA384` \| `RSA-SHA512` \| `RSA-SHA512/224` \| `RSA-SHA512/256` (+67) · se muestra si action="sign"
- `encoding` · options · por defecto `hex` · requerido · opciones: `base64` \| `hex` · se muestra si action="sign"
- `dataPropertyName` · string · por defecto `data` · requerido · se muestra si action="generate"
- `encodingType` · options · por defecto `uuid` · requerido · opciones: `ascii` \| `base64` \| `hex` \| `uuid` · se muestra si action="generate"
- `stringLength` · number · por defecto `32` · se muestra si action="generate"; encodingType="ascii"|"base64"|"hex"
- `mode` · options · por defecto `symmetric` · requerido · opciones: `symmetric` \| `asymmetric` · se muestra si action="encrypt"|"decrypt"
- `cipher` · options · por defecto `aes-256-gcm` · requerido · opciones: `aes-256-gcm` \| `aes-192-gcm` \| `aes-128-gcm` \| `chacha20-poly1305` · se muestra si action="encrypt"|"decrypt"; mode="symmetric"
- `oaepHash` · options · por defecto `sha256` · requerido · opciones: `sha256` \| `sha1` · se muestra si action="encrypt"|"decrypt"; mode="asymmetric"
- `value` · string · por defecto `""` · requerido · se muestra si action="encrypt"|"decrypt"
- `dataPropertyName` · string · por defecto `data` · requerido · se muestra si action="encrypt"|"decrypt"

### Supabase y Postgres

#### `n8n-nodes-base.supabase` · Supabase

- typeVersion más alta: **1** · versión por defecto al crear el nodo: 1
- versiones aceptadas: 1
- clase: INodeType (description.version 1)
- credenciales: `supabaseApi` (requerida) si authentication="secretKey"; `supabaseOAuth2Api` (requerida) si authentication="oAuth2"
  - `supabaseApi` se llama «Supabase API» en el editor
  - `supabaseOAuth2Api` se llama «Supabase OAuth2 API» en el editor
- entradas: main
- salidas: main

Parámetros (typeVersion 1):

- `authentication` · options · por defecto `secretKey` · opciones: `secretKey` \| `oAuth2`
- `resource` · options · por defecto `row` · sin expresiones · opciones: `row`
- `operation` · options · por defecto `create` · sin expresiones · opciones: `create` \| `delete` \| `get` \| `getAll` \| `update` · se muestra si resource="row"
- `projectRef` · options · por defecto `""` · requerido · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si authentication="oAuth2"
- `useCustomSchema` · boolean · por defecto `false` · sin expresiones
- `schema` · string · por defecto `public` · se muestra si useCustomSchema=true
- `tableId` · options · por defecto `""` · requerido · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si resource="row"; operation="create"|"delete"|"get"|"getAll"|"update"
- `filterType` · options · por defecto `manual` · opciones: `manual` \| `string` · se muestra si resource="row"; operation="update"
- `matchType` · options · por defecto `anyFilter` · opciones: `anyFilter` \| `allFilters` · se muestra si resource="row"; operation="update"; filterType="manual"
- `filters` · fixedCollection · varios valores · se muestra si resource="row"; operation="update"; filterType="manual"
  - grupo `conditions` (lista):
    - `keyName` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `condition` · options · por defecto `""` · opciones: `eq` \| `fullText` \| `gt` \| `gte` \| `ilike` \| `is` \| `lt` \| `lte` \| `like` \| `neq`
    - `searchFunction` · options · por defecto `""` · opciones: `fts` \| `plfts` \| `phfts` \| `wfts` · se muestra si condition="fullText"
    - `keyValue` · string · por defecto `""`
- `filterString` · string · por defecto `""` · se muestra si resource="row"; operation="update"; filterType="string"
- `filterStringParameters` · fixedCollection · varios valores · se muestra si resource="row"; operation="update"; filterType="string"
  - grupo `values` (lista):
    - `value` · string · por defecto `""`
- `dataToSend` · options · por defecto `defineBelow` · opciones: `autoMapInputData` \| `defineBelow` · se muestra si resource="row"; operation="create"|"update"
- `inputsToIgnore` · string · por defecto `""` · se muestra si resource="row"; operation="create"|"update"; dataToSend="autoMapInputData"
- `fieldsUi` · fixedCollection · varios valores · se muestra si resource="row"; operation="create"|"update"; dataToSend="defineBelow"
  - grupo `fieldValues` (lista):
    - `fieldId` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `fieldValue` · string · por defecto `""`
- `filterType` · options · por defecto `manual` · opciones: `manual` \| `string` · se muestra si resource="row"; operation="delete"
- `matchType` · options · por defecto `anyFilter` · opciones: `anyFilter` \| `allFilters` · se muestra si resource="row"; operation="delete"; filterType="manual"
- `filters` · fixedCollection · varios valores · se muestra si resource="row"; operation="delete"; filterType="manual"
  - grupo `conditions` (lista):
    - `keyName` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `condition` · options · por defecto `""` · opciones: `eq` \| `fullText` \| `gt` \| `gte` \| `ilike` \| `is` \| `lt` \| `lte` \| `like` \| `neq`
    - `searchFunction` · options · por defecto `""` · opciones: `fts` \| `plfts` \| `phfts` \| `wfts` · se muestra si condition="fullText"
    - `keyValue` · string · por defecto `""`
- `filterString` · string · por defecto `""` · se muestra si resource="row"; operation="delete"; filterType="string"
- `filterStringParameters` · fixedCollection · varios valores · se muestra si resource="row"; operation="delete"; filterType="string"
  - grupo `values` (lista):
    - `value` · string · por defecto `""`
- `filters` · fixedCollection · varios valores · se muestra si resource="row"; operation="get"
  - grupo `conditions` (lista):
    - `keyName` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `keyValue` · string · por defecto `""`
- `returnAll` · boolean · por defecto `false` · sin expresiones · se muestra si resource="row"; operation="getAll"
- `limit` · number · por defecto `50` · se muestra si resource="row"; operation="getAll"; returnAll=false
- `orderBy` · string · por defecto `""` · se muestra si resource="row"; operation="getAll"
- `filterType` · options · por defecto `manual` · opciones: `none` \| `manual` \| `string` · se muestra si resource="row"; operation="getAll"
- `matchType` · options · por defecto `anyFilter` · opciones: `anyFilter` \| `allFilters` · se muestra si resource="row"; operation="getAll"; filterType="manual"
- `filters` · fixedCollection · varios valores · se muestra si resource="row"; operation="getAll"; filterType="manual"
  - grupo `conditions` (lista):
    - `keyName` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `condition` · options · por defecto `""` · opciones: `eq` \| `fullText` \| `gt` \| `gte` \| `ilike` \| `is` \| `lt` \| `lte` \| `like` \| `neq`
    - `searchFunction` · options · por defecto `""` · opciones: `fts` \| `plfts` \| `phfts` \| `wfts` · se muestra si condition="fullText"
    - `keyValue` · string · por defecto `""`
- `filterString` · string · por defecto `""` · se muestra si resource="row"; operation="getAll"; filterType="string"
- `filterStringParameters` · fixedCollection · varios valores · se muestra si resource="row"; operation="getAll"; filterType="string"
  - grupo `values` (lista):
    - `value` · string · por defecto `""`

#### `n8n-nodes-base.supabaseTool` · Supabase Tool

- typeVersion más alta: **1** · versión por defecto al crear el nodo: 1
- versiones aceptadas: 1
- clase: INodeType (description.version 1); n8n la genera desde `supabase` al cargar (usableAsTool)
- credenciales: `supabaseApi` (requerida) si authentication="secretKey"; `supabaseOAuth2Api` (requerida) si authentication="oAuth2"
  - `supabaseApi` se llama «Supabase API» en el editor
  - `supabaseOAuth2Api` se llama «Supabase OAuth2 API» en el editor
- entradas: ninguna
- salidas: ai_tool

Parámetros (typeVersion 1):

- `descriptionType` · options · por defecto `auto` · sin expresiones · opciones: `auto` \| `manual`
- `toolDescription` · string · por defecto `Add, get, delete and update data in a table` · requerido · se muestra si descriptionType="manual"
- `authentication` · options · por defecto `secretKey` · opciones: `secretKey` \| `oAuth2`
- `resource` · options · por defecto `row` · sin expresiones · opciones: `row`
- `operation` · options · por defecto `create` · sin expresiones · opciones: `create` \| `delete` \| `get` \| `getAll` \| `update` · se muestra si resource="row"
- `projectRef` · options · por defecto `""` · requerido · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si authentication="oAuth2"
- `useCustomSchema` · boolean · por defecto `false` · sin expresiones
- `schema` · string · por defecto `public` · se muestra si useCustomSchema=true
- `tableId` · options · por defecto `""` · requerido · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si resource="row"; operation="create"|"delete"|"get"|"getAll"|"update"
- `filterType` · options · por defecto `manual` · opciones: `manual` \| `string` · se muestra si resource="row"; operation="update"
- `matchType` · options · por defecto `anyFilter` · opciones: `anyFilter` \| `allFilters` · se muestra si resource="row"; operation="update"; filterType="manual"
- `filters` · fixedCollection · varios valores · se muestra si resource="row"; operation="update"; filterType="manual"
  - grupo `conditions` (lista):
    - `keyName` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `condition` · options · por defecto `""` · opciones: `eq` \| `fullText` \| `gt` \| `gte` \| `ilike` \| `is` \| `lt` \| `lte` \| `like` \| `neq`
    - `searchFunction` · options · por defecto `""` · opciones: `fts` \| `plfts` \| `phfts` \| `wfts` · se muestra si condition="fullText"
    - `keyValue` · string · por defecto `""`
- `filterString` · string · por defecto `""` · se muestra si resource="row"; operation="update"; filterType="string"
- `filterStringParameters` · fixedCollection · varios valores · se muestra si resource="row"; operation="update"; filterType="string"
  - grupo `values` (lista):
    - `value` · string · por defecto `""`
- `dataToSend` · options · por defecto `defineBelow` · opciones: `autoMapInputData` \| `defineBelow` · se muestra si resource="row"; operation="create"|"update"
- `inputsToIgnore` · string · por defecto `""` · se muestra si resource="row"; operation="create"|"update"; dataToSend="autoMapInputData"
- `fieldsUi` · fixedCollection · varios valores · se muestra si resource="row"; operation="create"|"update"; dataToSend="defineBelow"
  - grupo `fieldValues` (lista):
    - `fieldId` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `fieldValue` · string · por defecto `""`
- `filterType` · options · por defecto `manual` · opciones: `manual` \| `string` · se muestra si resource="row"; operation="delete"
- `matchType` · options · por defecto `anyFilter` · opciones: `anyFilter` \| `allFilters` · se muestra si resource="row"; operation="delete"; filterType="manual"
- `filters` · fixedCollection · varios valores · se muestra si resource="row"; operation="delete"; filterType="manual"
  - grupo `conditions` (lista):
    - `keyName` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `condition` · options · por defecto `""` · opciones: `eq` \| `fullText` \| `gt` \| `gte` \| `ilike` \| `is` \| `lt` \| `lte` \| `like` \| `neq`
    - `searchFunction` · options · por defecto `""` · opciones: `fts` \| `plfts` \| `phfts` \| `wfts` · se muestra si condition="fullText"
    - `keyValue` · string · por defecto `""`
- `filterString` · string · por defecto `""` · se muestra si resource="row"; operation="delete"; filterType="string"
- `filterStringParameters` · fixedCollection · varios valores · se muestra si resource="row"; operation="delete"; filterType="string"
  - grupo `values` (lista):
    - `value` · string · por defecto `""`
- `filters` · fixedCollection · varios valores · se muestra si resource="row"; operation="get"
  - grupo `conditions` (lista):
    - `keyName` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `keyValue` · string · por defecto `""`
- `returnAll` · boolean · por defecto `false` · sin expresiones · se muestra si resource="row"; operation="getAll"
- `limit` · number · por defecto `50` · se muestra si resource="row"; operation="getAll"; returnAll=false
- `orderBy` · string · por defecto `""` · se muestra si resource="row"; operation="getAll"
- `filterType` · options · por defecto `manual` · opciones: `none` \| `manual` \| `string` · se muestra si resource="row"; operation="getAll"
- `matchType` · options · por defecto `anyFilter` · opciones: `anyFilter` \| `allFilters` · se muestra si resource="row"; operation="getAll"; filterType="manual"
- `filters` · fixedCollection · varios valores · se muestra si resource="row"; operation="getAll"; filterType="manual"
  - grupo `conditions` (lista):
    - `keyName` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `condition` · options · por defecto `""` · opciones: `eq` \| `fullText` \| `gt` \| `gte` \| `ilike` \| `is` \| `lt` \| `lte` \| `like` \| `neq`
    - `searchFunction` · options · por defecto `""` · opciones: `fts` \| `plfts` \| `phfts` \| `wfts` · se muestra si condition="fullText"
    - `keyValue` · string · por defecto `""`
- `filterString` · string · por defecto `""` · se muestra si resource="row"; operation="getAll"; filterType="string"
- `filterStringParameters` · fixedCollection · varios valores · se muestra si resource="row"; operation="getAll"; filterType="string"
  - grupo `values` (lista):
    - `value` · string · por defecto `""`

#### `n8n-nodes-base.postgres` · Postgres

- typeVersion más alta: **2.8** · versión por defecto al crear el nodo: 2.8
- versiones aceptadas: 1, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8
- clase: VersionedNodeType (nodeVersions 1, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, defaultVersion 2.8)
- credenciales: `postgres` (requerida)
  - `postgres` se llama «Postgres» en el editor
- entradas: main
- salidas: main

Parámetros (typeVersion 2.8):

- `resource` · hidden · por defecto `database` · sin expresiones
- `operation` · options · por defecto `insert` · sin expresiones · opciones: `deleteTable` \| `executeQuery` \| `insert` \| `upsert` \| `select` \| `update` · se muestra si resource="database"
- `schema` · resourceLocator · por defecto `{"mode":"list","value":"public"}` · requerido · modos: `list` \| `name` · se muestra si operation≠"executeQuery"
- `table` · resourceLocator · por defecto `{"mode":"list","value":""}` · requerido · modos: `list` \| `name` · se muestra si operation≠"executeQuery"
- `deleteCommand` · options · por defecto `truncate` · opciones: `truncate` \| `delete` \| `drop` · se muestra si resource="database"; operation="deleteTable"; table≠""
- `restartSequences` · boolean · por defecto `false` · se muestra si deleteCommand="truncate"; resource="database"; operation="deleteTable"; table≠""
- `where` · fixedCollection · varios valores · se muestra si deleteCommand="delete"; resource="database"; operation="deleteTable"; table≠""
  - grupo `values` (lista):
    - `column` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `condition` · options · por defecto `equal` · opciones: `equal` \| `!=` \| `LIKE` \| `>` \| `<` \| `>=` \| `<=` \| `IS NULL` \| `IS NOT NULL`
    - `value` · string · por defecto `""` · se muestra si condition≠"IS NULL"|"IS NOT NULL"
- `combineConditions` · options · por defecto `AND` · opciones: `AND` \| `OR` · se muestra si deleteCommand="delete"; resource="database"; operation="deleteTable"; table≠""
- `options` · collection · se muestra si resource="database"; operation="deleteTable"; table≠""
  - `cascade` · boolean · por defecto `false` · se muestra si /operation="deleteTable"; /deleteCommand≠"delete"
  - `connectionTimeout` · number · por defecto `30`
  - `delayClosingIdleConnection` · number · por defecto `0`
  - `queryBatching` · options · por defecto `single` · sin expresiones · opciones: `single` \| `independently` \| `transaction`
  - `queryReplacement` · string · por defecto `""` · se muestra si /operation="executeQuery"; @version=<2.8
  - `queryReplacement` · string · por defecto `""` · se muestra si /operation="executeQuery"; @version=≥2.8
  - `treatQueryParametersInSingleQuotesAsText` · boolean · por defecto `false` · se muestra si queryReplacement=exists true
  - `outputColumns` · multiOptions · por defecto `[]` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si /operation="select"|"insert"|"update"|"upsert"
  - `largeNumbersOutput` · options · por defecto `text` · opciones: `numbers` \| `text`
  - `skipOnConflict` · boolean · por defecto `false` · se muestra si /operation="insert"
  - `replaceEmptyStrings` · boolean · por defecto `false` · se muestra si /operation="insert"|"update"|"upsert"|"executeQuery"
- `query` · string · por defecto `""` · requerido · sin expresiones · se muestra si resource="database"; operation="executeQuery"
- `options` · collection · se muestra si resource="database"; operation="executeQuery"
  - `cascade` · boolean · por defecto `false` · se muestra si /operation="deleteTable"; /deleteCommand≠"delete"
  - `connectionTimeout` · number · por defecto `30`
  - `delayClosingIdleConnection` · number · por defecto `0`
  - `queryBatching` · options · por defecto `single` · sin expresiones · opciones: `single` \| `independently` \| `transaction`
  - `queryReplacement` · string · por defecto `""` · se muestra si /operation="executeQuery"; @version=<2.8
  - `queryReplacement` · string · por defecto `""` · se muestra si /operation="executeQuery"; @version=≥2.8
  - `treatQueryParametersInSingleQuotesAsText` · boolean · por defecto `false` · se muestra si queryReplacement=exists true
  - `outputColumns` · multiOptions · por defecto `[]` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si /operation="select"|"insert"|"update"|"upsert"
  - `largeNumbersOutput` · options · por defecto `text` · opciones: `numbers` \| `text`
  - `skipOnConflict` · boolean · por defecto `false` · se muestra si /operation="insert"
  - `replaceEmptyStrings` · boolean · por defecto `false` · se muestra si /operation="insert"|"update"|"upsert"|"executeQuery"
- `dataMode` · options · por defecto `autoMapInputData` · opciones: `autoMapInputData` \| `defineBelow` · se muestra si @version=2|2.1; resource="database"; operation="insert"; table≠""
- `valuesToSend` · fixedCollection · varios valores · se muestra si dataMode="defineBelow"; @version=2|2.1; resource="database"; operation="insert"; table≠""
  - grupo `values` (lista):
    - `column` · options · por defecto `[]` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `value` · string · por defecto `""`
- `columns` · resourceMapper · por defecto `{"mappingMode":"defineBelow","value":null}` · requerido · sin expresiones · se muestra si @version=≥2.2; resource="database"; operation="insert"; table≠""
- `options` · collection · se muestra si resource="database"; operation="insert"; table≠""
  - `cascade` · boolean · por defecto `false` · se muestra si /operation="deleteTable"; /deleteCommand≠"delete"
  - `connectionTimeout` · number · por defecto `30`
  - `delayClosingIdleConnection` · number · por defecto `0`
  - `queryBatching` · options · por defecto `single` · sin expresiones · opciones: `single` \| `independently` \| `transaction`
  - `queryReplacement` · string · por defecto `""` · se muestra si /operation="executeQuery"; @version=<2.8
  - `queryReplacement` · string · por defecto `""` · se muestra si /operation="executeQuery"; @version=≥2.8
  - `treatQueryParametersInSingleQuotesAsText` · boolean · por defecto `false` · se muestra si queryReplacement=exists true
  - `outputColumns` · multiOptions · por defecto `[]` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si /operation="select"|"insert"|"update"|"upsert"
  - `largeNumbersOutput` · options · por defecto `text` · opciones: `numbers` \| `text`
  - `skipOnConflict` · boolean · por defecto `false` · se muestra si /operation="insert"
  - `replaceEmptyStrings` · boolean · por defecto `false` · se muestra si /operation="insert"|"update"|"upsert"|"executeQuery"
- `returnAll` · boolean · por defecto `false` · se muestra si resource="database"; operation="select"; table≠""
- `limit` · number · por defecto `50` · se muestra si returnAll=false; resource="database"; operation="select"; table≠""
- `where` · fixedCollection · varios valores · se muestra si resource="database"; operation="select"; table≠""
  - grupo `values` (lista):
    - `column` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `condition` · options · por defecto `equal` · opciones: `equal` \| `!=` \| `LIKE` \| `>` \| `<` \| `>=` \| `<=` \| `IS NULL` \| `IS NOT NULL`
    - `value` · string · por defecto `""` · se muestra si condition≠"IS NULL"|"IS NOT NULL"
- `combineConditions` · options · por defecto `AND` · opciones: `AND` \| `OR` · se muestra si resource="database"; operation="select"; table≠""
- `sort` · fixedCollection · varios valores · se muestra si resource="database"; operation="select"; table≠""
  - grupo `values` (lista):
    - `column` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `direction` · options · por defecto `ASC` · opciones: `ASC` \| `DESC`
- `options` · collection · se muestra si resource="database"; operation="select"; table≠""
  - `cascade` · boolean · por defecto `false` · se muestra si /operation="deleteTable"; /deleteCommand≠"delete"
  - `connectionTimeout` · number · por defecto `30`
  - `delayClosingIdleConnection` · number · por defecto `0`
  - `queryBatching` · options · por defecto `single` · sin expresiones · opciones: `single` \| `independently` \| `transaction`
  - `queryReplacement` · string · por defecto `""` · se muestra si /operation="executeQuery"; @version=<2.8
  - `queryReplacement` · string · por defecto `""` · se muestra si /operation="executeQuery"; @version=≥2.8
  - `treatQueryParametersInSingleQuotesAsText` · boolean · por defecto `false` · se muestra si queryReplacement=exists true
  - `outputColumns` · multiOptions · por defecto `[]` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si /operation="select"|"insert"|"update"|"upsert"
  - `largeNumbersOutput` · options · por defecto `text` · opciones: `numbers` \| `text`
  - `skipOnConflict` · boolean · por defecto `false` · se muestra si /operation="insert"
  - `replaceEmptyStrings` · boolean · por defecto `false` · se muestra si /operation="insert"|"update"|"upsert"|"executeQuery"
- `dataMode` · options · por defecto `autoMapInputData` · opciones: `autoMapInputData` \| `defineBelow` · se muestra si @version=2|2.1; resource="database"; operation="update"; table≠""
- `columnToMatchOn` · options · por defecto `""` · requerido · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si @version=2|2.1; resource="database"; operation="update"; table≠""
- `valueToMatchOn` · string · por defecto `""` · se muestra si dataMode="defineBelow"; @version=2|2.1; resource="database"; operation="update"; table≠""
- `valuesToSend` · fixedCollection · varios valores · se muestra si dataMode="defineBelow"; @version=2|2.1; resource="database"; operation="update"; table≠""
  - grupo `values` (lista):
    - `column` · options · por defecto `[]` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `value` · string · por defecto `""`
- `columns` · resourceMapper · por defecto `{"mappingMode":"defineBelow","value":null}` · requerido · sin expresiones · se muestra si @version=≥2.2; resource="database"; operation="update"; table≠""
- `options` · collection · se muestra si resource="database"; operation="update"; table≠""
  - `cascade` · boolean · por defecto `false` · se muestra si /operation="deleteTable"; /deleteCommand≠"delete"
  - `connectionTimeout` · number · por defecto `30`
  - `delayClosingIdleConnection` · number · por defecto `0`
  - `queryBatching` · options · por defecto `single` · sin expresiones · opciones: `single` \| `independently` \| `transaction`
  - `queryReplacement` · string · por defecto `""` · se muestra si /operation="executeQuery"; @version=<2.8
  - `queryReplacement` · string · por defecto `""` · se muestra si /operation="executeQuery"; @version=≥2.8
  - `treatQueryParametersInSingleQuotesAsText` · boolean · por defecto `false` · se muestra si queryReplacement=exists true
  - `outputColumns` · multiOptions · por defecto `[]` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si /operation="select"|"insert"|"update"|"upsert"
  - `largeNumbersOutput` · options · por defecto `text` · opciones: `numbers` \| `text`
  - `skipOnConflict` · boolean · por defecto `false` · se muestra si /operation="insert"
  - `replaceEmptyStrings` · boolean · por defecto `false` · se muestra si /operation="insert"|"update"|"upsert"|"executeQuery"
- `dataMode` · options · por defecto `autoMapInputData` · opciones: `autoMapInputData` \| `defineBelow` · se muestra si @version=2|2.1; resource="database"; operation="upsert"; table≠""
- `columnToMatchOn` · options · por defecto `""` · requerido · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si @version=2|2.1; resource="database"; operation="upsert"; table≠""
- `valueToMatchOn` · string · por defecto `""` · se muestra si dataMode="defineBelow"; @version=2|2.1; resource="database"; operation="upsert"; table≠""
- `valuesToSend` · fixedCollection · varios valores · se muestra si dataMode="defineBelow"; @version=2|2.1; resource="database"; operation="upsert"; table≠""
  - grupo `values` (lista):
    - `column` · options · por defecto `[]` · opciones: opciones dinámicas (se cargan desde la cuenta)
    - `value` · string · por defecto `""`
- `columns` · resourceMapper · por defecto `{"mappingMode":"defineBelow","value":null}` · requerido · sin expresiones · se muestra si @version=≥2.2; resource="database"; operation="upsert"; table≠""
- `options` · collection · se muestra si resource="database"; operation="upsert"; table≠""
  - `cascade` · boolean · por defecto `false` · se muestra si /operation="deleteTable"; /deleteCommand≠"delete"
  - `connectionTimeout` · number · por defecto `30`
  - `delayClosingIdleConnection` · number · por defecto `0`
  - `queryBatching` · options · por defecto `single` · sin expresiones · opciones: `single` \| `independently` \| `transaction`
  - `queryReplacement` · string · por defecto `""` · se muestra si /operation="executeQuery"; @version=<2.8
  - `queryReplacement` · string · por defecto `""` · se muestra si /operation="executeQuery"; @version=≥2.8
  - `treatQueryParametersInSingleQuotesAsText` · boolean · por defecto `false` · se muestra si queryReplacement=exists true
  - `outputColumns` · multiOptions · por defecto `[]` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si /operation="select"|"insert"|"update"|"upsert"
  - `largeNumbersOutput` · options · por defecto `text` · opciones: `numbers` \| `text`
  - `skipOnConflict` · boolean · por defecto `false` · se muestra si /operation="insert"
  - `replaceEmptyStrings` · boolean · por defecto `false` · se muestra si /operation="insert"|"update"|"upsert"|"executeQuery"

### Servicios

#### `n8n-nodes-base.github` · GitHub

- typeVersion más alta: **1.1** · versión por defecto al crear el nodo: 1.1
- versiones aceptadas: 1, 1.1
- clase: INodeType (description.version 1, 1.1)
- credenciales: `githubApi` (requerida) si authentication="accessToken"; `githubOAuth2Api` (requerida) si authentication="oAuth2"; `githubAppApi` (requerida) si authentication="githubAppApi"
  - `githubApi` se llama «GitHub API» en el editor
  - `githubOAuth2Api` se llama «GitHub OAuth2 API» en el editor
  - `githubAppApi` se llama «GitHub App API» en el editor
- entradas: main
- salidas: main
- webhooks: default POST

Parámetros (typeVersion 1.1):

- `authentication` · options · por defecto `accessToken` · opciones: `accessToken` \| `oAuth2` \| `githubAppApi`
- `resource` · options · por defecto `issue` · sin expresiones · opciones: `file` \| `issue` \| `organization` \| `pullRequest` \| `release` \| `repository` \| `review` \| `user` \| `workflow`
- `operation` · options · por defecto `getRepositories` · sin expresiones · opciones: `getRepositories` \| `getMembers` · se muestra si resource="organization"
- `operation` · options · por defecto `create` · sin expresiones · opciones: `create` \| `update` \| `close` \| `reopen` \| `get` \| `createComment` \| `editComment` \| `getDiff` \| `getPatch` \| `merge` · se muestra si resource="pullRequest"
- `base` · string · por defecto `""` · requerido · se muestra si resource="pullRequest"; operation="create"
- `head` · string · por defecto `""` · requerido · se muestra si resource="pullRequest"; operation="create"
- `title` · string · por defecto `""` · requerido · se muestra si resource="pullRequest"; operation="create"
- `body` · string · por defecto `""` · se muestra si resource="pullRequest"; operation="create"
- `draft` · boolean · por defecto `false` · se muestra si resource="pullRequest"; operation="create"
- `pullRequestNumber` · number · por defecto `0` · requerido · se muestra si resource="pullRequest"; operation="update"|"close"|"reopen"|"get"|"createComment"|"getDiff"|"getPatch"|"merge"
- `editFields` · collection · se muestra si resource="pullRequest"; operation="update"
  - `title` · string · por defecto `""`
  - `body` · string · por defecto `""`
  - `state` · options · por defecto `""` · opciones: `open` \| `closed`
  - `base` · string · por defecto `""`
- `body` · string · por defecto `""` · requerido · se muestra si operation="createComment"; resource="pullRequest"
- `commentId` · number · por defecto `0` · requerido · se muestra si operation="editComment"; resource="pullRequest"
- `body` · string · por defecto `""` · requerido · se muestra si operation="editComment"; resource="pullRequest"
- `mergeMethod` · options · por defecto `merge` · opciones: `merge` \| `squash` \| `rebase` · se muestra si resource="pullRequest"; operation="merge"
- `commitTitle` · string · por defecto `""` · se muestra si resource="pullRequest"; operation="merge"
- `commitMessage` · string · por defecto `""` · se muestra si resource="pullRequest"; operation="merge"
- `operation` · options · por defecto `create` · sin expresiones · opciones: `create` \| `createComment` \| `edit` \| `get` \| `lock` · se muestra si resource="issue"
- `operation` · options · por defecto `create` · sin expresiones · opciones: `create` \| `delete` \| `edit` \| `get` \| `list` · se muestra si resource="file"
- `operation` · options · por defecto `getIssues` · sin expresiones · opciones: `get` \| `getIssues` \| `getLicense` \| `getProfile` \| `getPullRequests` \| `listPopularPaths` \| `listReferrers` · se muestra si resource="repository"
- `operation` · options · por defecto `getRepositories` · sin expresiones · opciones: `getRepositories` \| `getUserIssues` \| `invite` · se muestra si resource="user"
- `operation` · options · por defecto `create` · sin expresiones · opciones: `create` \| `delete` \| `get` \| `getAll` \| `update` · se muestra si resource="release"
- `operation` · options · por defecto `create` · sin expresiones · opciones: `create` \| `get` \| `getAll` \| `update` · se muestra si resource="review"
- `operation` · options · por defecto `dispatch` · sin expresiones · opciones: `disable` \| `dispatch` \| `dispatchAndWait` \| `enable` \| `get` \| `getUsage` \| `list` · se muestra si resource="workflow"
- `owner` · resourceLocator · por defecto `{"mode":"list","value":""}` · requerido · modos: `list` \| `url` \| `name` · se muestra si operation≠"invite"|"getUserIssues"
- `repository` · resourceLocator · por defecto `{"mode":"list","value":""}` · requerido · modos: `list` \| `url` \| `name` · se muestra si resource≠"user"|"organization"; operation≠"getRepositories"
- `workflowId` · resourceLocator · por defecto `{"mode":"list","value":""}` · requerido · modos: `list` \| `filename` \| `name` · se muestra si resource="workflow"; operation="disable"|"dispatch"|"dispatchAndWait"|"get"|"getUsage"|"enable"
- `ref` · string · por defecto `main` · requerido · se muestra si resource="workflow"; operation="dispatch"|"dispatchAndWait"; @version=≤1
- `ref` · resourceLocator · por defecto `{"mode":"list","value":""}` · requerido · modos: `list` \| `name` · se muestra si resource="workflow"; operation="dispatch"|"dispatchAndWait"; @version=≥1.1
- `inputs` · json · por defecto `{}` · se muestra si resource="workflow"; operation="dispatch"|"dispatchAndWait"
- `options` · collection · se muestra si resource="workflow"; operation="dispatchAndWait"
  - `limitWaitTime` · fixedCollection
- `filePath` · string · por defecto `""` · requerido · se muestra si resource="file"; operation≠"list"
- `filePath` · string · por defecto `""` · se muestra si resource="file"; operation="list"
- `binaryData` · boolean · por defecto `false` · requerido · se muestra si operation="create"|"edit"; resource="file"
- `fileContent` · string · por defecto `""` · requerido · se muestra si binaryData=false; operation="create"|"edit"; resource="file"
- `binaryPropertyName` · string · por defecto `data` · requerido · se muestra si binaryData=true; operation="create"|"edit"; resource="file"
- `commitMessage` · string · por defecto `""` · requerido · se muestra si operation="create"|"delete"|"edit"; resource="file"
- `additionalParameters` · fixedCollection · se muestra si operation="create"|"delete"|"edit"; resource="file"
  - grupo `author`:
    - `name` · string · por defecto `""`
    - `email` · string · por defecto `""`
  - grupo `branch`:
    - `branch` · string · por defecto `""`
  - grupo `committer`:
    - `name` · string · por defecto `""`
    - `email` · string · por defecto `""`
- `asBinaryProperty` · boolean · por defecto `true` · se muestra si operation="get"; resource="file"
- `binaryPropertyName` · string · por defecto `data` · requerido · se muestra si asBinaryProperty=true; operation="get"; resource="file"
- `additionalParameters` · collection · se muestra si operation="get"; resource="file"
  - `reference` · string · por defecto `""`
- `title` · string · por defecto `""` · requerido · se muestra si operation="create"; resource="issue"
- `body` · string · por defecto `""` · se muestra si operation="create"; resource="issue"
- `labels` · collection · varios valores · se muestra si operation="create"; resource="issue"
  - `label` · string · por defecto `""`
- `assignees` · collection · varios valores · se muestra si operation="create"; resource="issue"
  - `assignee` · string · por defecto `""`
- `issueNumber` · number · por defecto `0` · requerido · se muestra si operation="createComment"; resource="issue"
- `body` · string · por defecto `""` · se muestra si operation="createComment"; resource="issue"
- `issueNumber` · number · por defecto `0` · requerido · se muestra si operation="edit"; resource="issue"
- `editFields` · collection · se muestra si operation="edit"; resource="issue"
  - `assignees` · collection · varios valores
  - `body` · string · por defecto `""`
  - `labels` · collection · varios valores
  - `state` · options · por defecto `open` · opciones: `closed` \| `open`
  - `state_reason` · options · por defecto `completed` · opciones: `completed` \| `not_planned` \| `reopened`
  - `title` · string · por defecto `""`
- `issueNumber` · number · por defecto `0` · requerido · se muestra si operation="get"; resource="issue"
- `issueNumber` · number · por defecto `0` · requerido · se muestra si operation="lock"; resource="issue"
- `lockReason` · options · por defecto `resolved` · opciones: `off-topic` \| `too heated` \| `resolved` \| `spam` · se muestra si operation="lock"; resource="issue"
- `releaseTag` · string · por defecto `""` · requerido · se muestra si operation="create"; resource="release"
- `additionalFields` · collection · se muestra si operation="create"; resource="release"
  - `name` · string · por defecto `""`
  - `body` · string · por defecto `""`
  - `draft` · boolean · por defecto `false`
  - `prerelease` · boolean · por defecto `false`
  - `target_commitish` · string · por defecto `""`
- `release_id` · string · por defecto `""` · requerido · se muestra si resource="release"; operation="get"|"delete"|"update"
- `additionalFields` · collection · se muestra si operation="update"; resource="release"
  - `body` · string · por defecto `""`
  - `draft` · boolean · por defecto `false`
  - `name` · string · por defecto `""`
  - `prerelease` · boolean · por defecto `false`
  - `tag_name` · string · por defecto `""`
  - `target_commitish` · string · por defecto `""`
- `returnAll` · boolean · por defecto `false` · se muestra si resource="release"; operation="getAll"
- `limit` · number · por defecto `50` · se muestra si resource="release"; operation="getAll"; returnAll=false
- `returnAll` · boolean · por defecto `false` · se muestra si resource="repository"; operation="getIssues"
- `limit` · number · por defecto `50` · se muestra si resource="repository"; operation="getIssues"; returnAll=false
- `getRepositoryIssuesFilters` · collection · se muestra si operation="getIssues"; resource="repository"
  - `assignee` · string · por defecto `""`
  - `creator` · string · por defecto `""`
  - `mentioned` · string · por defecto `""`
  - `labels` · string · por defecto `""`
  - `since` · dateTime · por defecto `""`
  - `state` · options · por defecto `open` · opciones: `all` \| `closed` \| `open`
  - `sort` · options · por defecto `created` · opciones: `created` \| `updated` \| `comments`
  - `direction` · options · por defecto `desc` · opciones: `asc` \| `desc`
- `returnAll` · boolean · por defecto `false` · se muestra si resource="repository"; operation="getPullRequests"
- `limit` · number · por defecto `50` · se muestra si resource="repository"; operation="getPullRequests"; returnAll=false
- `getRepositoryPullRequestsFilters` · collection · se muestra si operation="getPullRequests"; resource="repository"
  - `state` · options · por defecto `open` · opciones: `all` \| `closed` \| `open`
  - `sort` · options · por defecto `created` · opciones: `created` \| `updated` \| `popularity` \| `long-running`
  - `direction` · options · por defecto `desc` · opciones: `asc` \| `desc`
- `pullRequestNumber` · number · por defecto `0` · requerido · se muestra si operation="get"|"update"; resource="review"
- `reviewId` · string · por defecto `""` · requerido · se muestra si operation="get"|"update"; resource="review"
- `pullRequestNumber` · number · por defecto `0` · requerido · se muestra si operation="getAll"; resource="review"
- `returnAll` · boolean · por defecto `false` · se muestra si resource="review"; operation="getAll"
- `limit` · number · por defecto `50` · se muestra si resource="review"; operation="getAll"; returnAll=false
- `pullRequestNumber` · number · por defecto `0` · requerido · se muestra si operation="create"; resource="review"
- `event` · options · por defecto `approve` · opciones: `approve` \| `requestChanges` \| `comment` \| `pending` · se muestra si operation="create"; resource="review"
- `body` · string · por defecto `""` · se muestra si operation="create"; resource="review"; event="requestChanges"|"comment"
- `additionalFields` · collection · se muestra si operation="create"; resource="review"
  - `commitId` · string · por defecto `""`
- `body` · string · por defecto `""` · se muestra si operation="update"; resource="review"
- `returnAll` · boolean · por defecto `false` · se muestra si resource="user"; operation="getRepositories"
- `limit` · number · por defecto `50` · se muestra si resource="user"; operation="getRepositories"; returnAll=false
- `organization` · string · por defecto `""` · requerido · se muestra si operation="invite"; resource="user"
- `email` · string · por defecto `""` · requerido · se muestra si operation="invite"; resource="user"
- `returnAll` · boolean · por defecto `false` · se muestra si resource="organization"; operation="getRepositories"
- `limit` · number · por defecto `50` · se muestra si resource="organization"; operation="getRepositories"; returnAll=false
- `returnAll` · boolean · por defecto `false` · se muestra si resource="organization"; operation="getMembers"
- `limit` · number · por defecto `50` · se muestra si resource="organization"; operation="getMembers"; returnAll=false
- `returnAll` · boolean · por defecto `false` · se muestra si operation="getUserIssues"
- `limit` · number · por defecto `50` · se muestra si operation="getUserIssues"; returnAll=false
- `getUserIssuesFilters` · collection · se muestra si operation="getUserIssues"
  - `mentioned` · string · por defecto `""`
  - `labels` · string · por defecto `""`
  - `since` · dateTime · por defecto `""`
  - `state` · options · por defecto `open` · opciones: `all` \| `closed` \| `open`
  - `sort` · options · por defecto `created` · opciones: `created` \| `updated` \| `comments`
  - `direction` · options · por defecto `desc` · opciones: `asc` \| `desc`

#### `n8n-nodes-base.gmail` · Gmail

- typeVersion más alta: **2.2** · versión por defecto al crear el nodo: 2.2
- versiones aceptadas: 1, 2, 2.1, 2.2
- clase: VersionedNodeType (nodeVersions 1, 2, 2.1, 2.2, defaultVersion 2.2)
- credenciales: `googleApi` (requerida) si authentication="serviceAccount"; `gmailOAuth2` (requerida) si authentication="oAuth2"
  - `googleApi` se llama «Google Service Account API» en el editor
  - `gmailOAuth2` se llama «Gmail OAuth2 API» en el editor
- entradas: main
- salidas: main
- webhooks: default GET, default POST

Parámetros (typeVersion 2.2):

- `authentication` · options · por defecto `oAuth2` · opciones: `oAuth2` \| `serviceAccount`
- `resource` · options · por defecto `message` · sin expresiones · opciones: `message` \| `label` \| `draft` \| `thread`
- `operation` · options · por defecto `create` · sin expresiones · opciones: `create` \| `delete` \| `get` \| `getAll` · se muestra si resource="draft"
- `messageId` · string · por defecto `""` · requerido · se muestra si resource="draft"; operation="delete"|"get"
- `subject` · string · por defecto `""` · requerido · se muestra si resource="draft"; operation="create"
- `emailType` · options · por defecto `text` · requerido · sin expresiones · opciones: `html` \| `text` · se muestra si resource="draft"; operation="create"
- `message` · string · por defecto `""` · requerido · se muestra si resource="draft"; operation="create"
- `options` · collection · se muestra si resource="draft"; operation="create"
  - `attachmentsUi` · fixedCollection · varios valores
    - grupo `attachmentsBinary` (lista):
      - `property` · string · por defecto `""`
  - `bccList` · string · por defecto `""`
  - `ccList` · string · por defecto `""`
  - `fromAlias` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta)
  - `replyTo` · string · por defecto `""`
  - `threadId` · string · por defecto `""`
  - `sendTo` · string · por defecto `""`
- `options` · collection · se muestra si resource="draft"; operation="get"
  - `dataPropertyAttachmentsPrefixName` · string · por defecto `attachment_`
  - `downloadAttachments` · boolean · por defecto `false`
- `returnAll` · boolean · por defecto `false` · se muestra si operation="getAll"; resource="draft"
- `limit` · number · por defecto `50` · se muestra si operation="getAll"; resource="draft"; returnAll=false
- `options` · collection · se muestra si operation="getAll"; resource="draft"
  - `dataPropertyAttachmentsPrefixName` · string · por defecto `attachment_`
  - `downloadAttachments` · boolean · por defecto `false`
  - `includeSpamTrash` · boolean · por defecto `false`
- `operation` · options · por defecto `getAll` · sin expresiones · opciones: `create` \| `delete` \| `get` \| `getAll` · se muestra si resource="label"
- `name` · string · por defecto `""` · requerido · se muestra si resource="label"; operation="create"
- `labelId` · string · por defecto `""` · requerido · se muestra si resource="label"; operation="get"|"delete"
- `options` · collection · se muestra si resource="label"; operation="create"
  - `labelListVisibility` · options · por defecto `labelShow` · opciones: `labelHide` \| `labelShow` \| `labelShowIfUnread`
  - `messageListVisibility` · options · por defecto `show` · opciones: `hide` \| `show`
- `returnAll` · boolean · por defecto `false` · se muestra si operation="getAll"; resource="label"
- `limit` · number · por defecto `50` · se muestra si operation="getAll"; resource="label"; returnAll=false
- `operation` · options · por defecto `send` · sin expresiones · opciones: `addLabels` \| `delete` \| `get` \| `getAll` \| `markAsRead` \| `markAsUnread` \| `removeLabels` \| `reply` \| `send` \| `sendAndWait` · se muestra si resource="message"
- `messageId` · string · por defecto `""` · requerido · se muestra si resource="message"; operation="get"|"delete"|"markAsRead"|"markAsUnread"
- `messageId` · string · por defecto `""` · requerido · se muestra si resource="message"; operation="reply"
- `sendTo` · string · por defecto `""` · requerido · se muestra si resource="message"; operation="send"
- `subject` · string · por defecto `""` · requerido · se muestra si resource="message"; operation="send"
- `emailType` · options · por defecto `html` · requerido · sin expresiones · opciones: `text` \| `html` · se muestra si resource="message"; operation="send"|"reply"; @version≠2
- `emailType` · options · por defecto `html` · requerido · sin expresiones · opciones: `text` \| `html` · se muestra si resource="message"; operation="send"|"reply"; @version=2
- `message` · string · por defecto `""` · requerido · se muestra si resource="message"; operation="reply"|"send"
- `options` · collection · se muestra si resource="message"; operation="send"|"reply"
  - `appendAttribution` · boolean · por defecto `true`
  - `attachmentsUi` · fixedCollection · varios valores
    - grupo `attachmentsBinary` (lista):
      - `property` · string · por defecto `data`
  - `bccList` · string · por defecto `""`
  - `ccList` · string · por defecto `""`
  - `senderName` · string · por defecto `""`
  - `replyTo` · string · por defecto `""` · se muestra si /operation≠"reply"
  - `replyToSenderOnly` · boolean · por defecto `false`
- `simple` · boolean · por defecto `true` · se muestra si operation="get"; resource="message"
- `options` · collection · se muestra si resource="message"; operation="get"; simple≠true
  - `dataPropertyAttachmentsPrefixName` · string · por defecto `attachment_`
  - `downloadAttachments` · boolean · por defecto `false`
- `returnAll` · boolean · por defecto `false` · se muestra si operation="getAll"; resource="message"
- `limit` · number · por defecto `50` · se muestra si operation="getAll"; resource="message"; returnAll=false
- `simple` · boolean · por defecto `true` · se muestra si operation="getAll"; resource="message"
- `filters` · collection · se muestra si operation="getAll"; resource="message"
  - `includeSpamTrash` · boolean · por defecto `false`
  - `labelIds` · multiOptions · por defecto `[]` · opciones: opciones dinámicas (se cargan desde la cuenta)
  - `q` · string · por defecto `""`
  - `readStatus` · options · por defecto `unread` · opciones: `both` \| `unread` \| `read`
  - `receivedAfter` · dateTime · por defecto `""`
  - `receivedBefore` · dateTime · por defecto `""`
  - `sender` · string · por defecto `""`
- `options` · collection · se muestra si operation="getAll"; resource="message"; simple≠true
  - `dataPropertyAttachmentsPrefixName` · string · por defecto `attachment_`
  - `downloadAttachments` · boolean · por defecto `false`
- `messageId` · string · por defecto `""` · requerido · se muestra si resource="message"; operation="addLabels"|"removeLabels"
- `labelIds` · multiOptions · por defecto `[]` · requerido · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si resource="message"; operation="addLabels"|"removeLabels"
- `sendTo` · string · por defecto `""` · requerido · se muestra si resource="message"; operation="sendAndWait"
- `subject` · string · por defecto `""` · requerido · se muestra si resource="message"; operation="sendAndWait"
- `message` · string · por defecto `""` · requerido · se muestra si resource="message"; operation="sendAndWait"
- `responseType` · options · por defecto `approval` · opciones: `approval` \| `freeText` \| `customForm` · se muestra si resource="message"; operation="sendAndWait"
- `defineForm` · options · por defecto `fields` · sin expresiones · opciones: `fields` \| `json` · se muestra si responseType="customForm"; resource="message"; operation="sendAndWait"
- `jsonOutput` · json · por defecto `[ { "fieldLabel": "Name", "placeholder": "enter your name...` · se muestra si defineForm="json"; responseType="customForm"; resource="message"; operation="sendAndWait"
- `formFields` · fixedCollection · varios valores · se muestra si @version=<2.5; defineForm="fields"; responseType="customForm"; resource="message"; operation="sendAndWait"
  - grupo `values` (lista):
    - `fieldName` · string · por defecto `""` · requerido · se muestra si @version=2.4; fieldType≠"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=≥2.4; fieldType≠"hiddenField"|"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=<2.4; fieldType≠"hiddenField"|"html"
    - `fieldName` · string · por defecto `""` · se muestra si fieldType="hiddenField"; @version=<2.4
    - `fieldType` · options · por defecto `text` · requerido · opciones: `checkbox` \| `html` \| `date` \| `dropdown` \| `email` \| `file` \| `hiddenField` \| `number` \| `password` \| `radio` \| `text` \| `textarea`
    - `elementName` · string · por defecto `""` · se muestra si fieldType="html"
    - `fieldName` · string · por defecto `""` · se muestra si @version=≥2.5; fieldType≠"html"
    - `placeholder` · string · por defecto `""` · se muestra si fieldType≠"dropdown"|"date"|"file"|"html"|"hiddenField"|"radio"|"checkbox"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="text"|"number"|"email"|"textarea"
    - `defaultValue` · dateTime · por defecto `""` · se muestra si fieldType="date"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="dropdown"|"radio"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="checkbox"
    - `fieldValue` · string · por defecto `""` · se muestra si fieldType="hiddenField"
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="dropdown"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="checkbox"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="radio"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `multiselect` · boolean · por defecto `false` · se muestra si fieldType="dropdown"; @version=<2.3
    - `limitSelection` · options · por defecto `unlimited` · opciones: `exact` \| `range` \| `unlimited` · se muestra si fieldType="checkbox"
    - `numberOfSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="exact"
    - `minSelections` · number · por defecto `0` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `maxSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `html` · string · por defecto (un comentario HTML de ejemplo) · sin expresiones · se muestra si fieldType="html"
    - `multipleFiles` · boolean · por defecto `true` · se muestra si fieldType="file"
    - `acceptFileTypes` · string · por defecto `""` · se muestra si fieldType="file"
    - `requiredField` · boolean · por defecto `false` · se muestra si fieldType≠"html"|"hiddenField"
- `formFields` · fixedCollection · varios valores · se muestra si @version=≥2.5; defineForm="fields"; responseType="customForm"; resource="message"; operation="sendAndWait"
  - grupo `values` (lista):
    - `fieldName` · string · por defecto `""` · requerido · se muestra si @version=2.4; fieldType≠"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=≥2.4; fieldType≠"hiddenField"|"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=<2.4; fieldType≠"hiddenField"|"html"
    - `fieldName` · string · por defecto `""` · se muestra si fieldType="hiddenField"; @version=<2.4
    - `fieldType` · options · por defecto `text` · requerido · opciones: `checkbox` \| `html` \| `date` \| `dropdown` \| `email` \| `file` \| `hiddenField` \| `number` \| `password` \| `radio` \| `text` \| `textarea`
    - `elementName` · string · por defecto `""` · se muestra si fieldType="html"
    - `fieldName` · string · por defecto `""` · se muestra si @version=≥2.5; fieldType≠"html"
    - `placeholder` · string · por defecto `""` · se muestra si fieldType≠"dropdown"|"date"|"file"|"html"|"hiddenField"|"radio"|"checkbox"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="text"|"number"|"email"|"textarea"
    - `defaultValue` · dateTime · por defecto `""` · se muestra si fieldType="date"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="dropdown"|"radio"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="checkbox"
    - `fieldValue` · string · por defecto `""` · se muestra si fieldType="hiddenField"
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="dropdown"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="checkbox"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="radio"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `multiselect` · boolean · por defecto `false` · se muestra si fieldType="dropdown"; @version=<2.3
    - `limitSelection` · options · por defecto `unlimited` · opciones: `exact` \| `range` \| `unlimited` · se muestra si fieldType="checkbox"
    - `numberOfSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="exact"
    - `minSelections` · number · por defecto `0` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `maxSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `html` · string · por defecto (un comentario HTML de ejemplo) · sin expresiones · se muestra si fieldType="html"
    - `multipleFiles` · boolean · por defecto `true` · se muestra si fieldType="file"
    - `acceptFileTypes` · string · por defecto `""` · se muestra si fieldType="file"
    - `requiredField` · boolean · por defecto `false` · se muestra si fieldType≠"html"|"hiddenField"
- `approvalOptions` · fixedCollection · se muestra si responseType="approval"; resource="message"; operation="sendAndWait"
  - grupo `values`:
    - `approvalType` · options · por defecto `single` · opciones: `single` \| `double`
    - `approveLabel` · string · por defecto `Approve` · se muestra si approvalType="single"|"double"
    - `buttonApprovalStyle` · options · por defecto `primary` · opciones: `primary` \| `secondary` · se muestra si approvalType="single"|"double"
    - `disapproveLabel` · string · por defecto `Decline` · se muestra si approvalType="double"
    - `buttonDisapprovalStyle` · options · por defecto `secondary` · opciones: `primary` \| `secondary` · se muestra si approvalType="double"
- `options` · collection · se muestra si responseType="approval"; resource="message"; operation="sendAndWait"
  - `limitWaitTime` · fixedCollection
    - grupo `values`:
      - `limitType` · options · por defecto `afterTimeInterval` · opciones: `afterTimeInterval` \| `atSpecifiedTime`
      - `resumeAmount` · number · por defecto `1` · se muestra si limitType="afterTimeInterval"
      - `resumeUnit` · options · por defecto `hours` · opciones: `minutes` \| `hours` \| `days` · se muestra si limitType="afterTimeInterval"
      - `maxDateAndTime` · dateTime · por defecto `""` · se muestra si limitType="atSpecifiedTime"
  - `appendAttribution` · boolean · por defecto `true`
- `options` · collection · se muestra si responseType="freeText"|"customForm"; resource="message"; operation="sendAndWait"
  - `messageButtonLabel` · string · por defecto `Respond`
  - `responseFormTitle` · string · por defecto `""`
  - `responseFormDescription` · string · por defecto `""`
  - `responseFormButtonLabel` · string · por defecto `Submit`
  - `responseFormCustomCss` · string · por defecto `:root { --font-family: 'Open Sans', sans-serif; --font-we...`
  - `limitWaitTime` · fixedCollection
    - grupo `values`:
      - `limitType` · options · por defecto `afterTimeInterval` · opciones: `afterTimeInterval` \| `atSpecifiedTime`
      - `resumeAmount` · number · por defecto `1` · se muestra si limitType="afterTimeInterval"
      - `resumeUnit` · options · por defecto `hours` · opciones: `minutes` \| `hours` \| `days` · se muestra si limitType="afterTimeInterval"
      - `maxDateAndTime` · dateTime · por defecto `""` · se muestra si limitType="atSpecifiedTime"
  - `appendAttribution` · boolean · por defecto `true`
- `operation` · options · por defecto `getAll` · sin expresiones · opciones: `addLabels` \| `delete` \| `get` \| `getAll` \| `removeLabels` \| `reply` \| `trash` \| `untrash` · se muestra si resource="thread"
- `threadId` · string · por defecto `""` · requerido · se muestra si resource="thread"; operation="get"|"delete"|"reply"|"trash"|"untrash"
- `messageId` · options · por defecto `""` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si resource="thread"; operation="reply"
- `emailType` · options · por defecto `text` · requerido · sin expresiones · opciones: `text` \| `html` · se muestra si resource="thread"; operation="reply"
- `message` · string · por defecto `""` · requerido · se muestra si resource="thread"; operation="reply"
- `options` · collection · se muestra si resource="thread"; operation="reply"
  - `attachmentsUi` · fixedCollection · varios valores
    - grupo `attachmentsBinary` (lista):
      - `property` · string · por defecto `""`
  - `bccList` · string · por defecto `""`
  - `ccList` · string · por defecto `""`
  - `senderName` · string · por defecto `""`
  - `replyToSenderOnly` · boolean · por defecto `false` · se muestra si replyToRecipientsOnly≠true
  - `replyToRecipientsOnly` · boolean · por defecto `false` · se muestra si replyToSenderOnly≠true
- `simple` · boolean · por defecto `true` · se muestra si operation="get"; resource="thread"
- `options` · collection · se muestra si resource="thread"; operation="get"
  - `returnOnlyMessages` · boolean · por defecto `true`
- `returnAll` · boolean · por defecto `false` · se muestra si operation="getAll"; resource="thread"
- `limit` · number · por defecto `50` · se muestra si operation="getAll"; resource="thread"; returnAll=false
- `filters` · collection · se muestra si operation="getAll"; resource="thread"
  - `includeSpamTrash` · boolean · por defecto `false`
  - `labelIds` · multiOptions · por defecto `[]` · opciones: opciones dinámicas (se cargan desde la cuenta)
  - `q` · string · por defecto `""`
  - `readStatus` · options · por defecto `unread` · opciones: `both` \| `unread` \| `read`
  - `receivedAfter` · dateTime · por defecto `""`
  - `receivedBefore` · dateTime · por defecto `""`
- `threadId` · string · por defecto `""` · requerido · se muestra si resource="thread"; operation="addLabels"|"removeLabels"
- `labelIds` · multiOptions · por defecto `[]` · requerido · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si resource="thread"; operation="addLabels"|"removeLabels"

#### `n8n-nodes-base.telegram` · Telegram

- typeVersion más alta: **1.2** · versión por defecto al crear el nodo: 1.2
- versiones aceptadas: 1, 1.1, 1.2
- clase: INodeType (description.version 1, 1.1, 1.2)
- credenciales: `telegramApi` (requerida)
  - `telegramApi` se llama «Telegram API» en el editor
- entradas: main
- salidas: main
- webhooks: default GET, default POST

Parámetros (typeVersion 1.2):

- `resource` · options · por defecto `message` · sin expresiones · opciones: `chat` \| `callback` \| `file` \| `message`
- `operation` · options · por defecto `get` · sin expresiones · opciones: `get` \| `administrators` \| `member` \| `leave` \| `setDescription` \| `setTitle` · se muestra si resource="chat"
- `operation` · options · por defecto `answerQuery` · sin expresiones · opciones: `answerQuery` \| `answerInlineQuery` · se muestra si resource="callback"
- `operation` · options · por defecto `get` · sin expresiones · opciones: `get` · se muestra si resource="file"
- `operation` · options · por defecto `sendMessage` · sin expresiones · opciones: `deleteMessage` \| `editMessageText` \| `pinChatMessage` \| `sendAnimation` \| `sendAudio` \| `sendChatAction` \| `sendDocument` \| `sendLocation` \| `sendMediaGroup` \| `sendMessage` \| `sendMessageDraft` \| `sendRichMessage` \| `sendRichMessageDraft` \| `sendAndWait` (+4) · se muestra si resource="message"
- `chatId` · string · por defecto `""` · requerido · se muestra si operation="administrators"|"deleteMessage"|"get"|"leave"|"member"|"pinChatMessage"|"setDescription"|"setTitle"|"sendAnimation"|"sendAudio"|"sendChatAction"|"sendDocument"|"sendLocation"|"sendMessage"|"sendMessageDraft"|"sendMediaGroup"|"sendPhoto"|"sendRichMessage"|"sendRichMessageDraft"|"sendSticker"|"sendVideo"|"unpinChatMessage"; resource="chat"|"message"
- `messageId` · string · por defecto `""` · requerido · se muestra si operation="deleteMessage"; resource="message"
- `messageId` · string · por defecto `""` · requerido · se muestra si operation="pinChatMessage"|"unpinChatMessage"; resource="message"
- `additionalFields` · collection · se muestra si operation="pinChatMessage"; resource="message"
  - `disable_notification` · boolean · por defecto `false`
- `userId` · string · por defecto `""` · requerido · se muestra si operation="member"; resource="chat"
- `description` · string · por defecto `""` · requerido · se muestra si operation="setDescription"; resource="chat"
- `title` · string · por defecto `""` · requerido · se muestra si operation="setTitle"; resource="chat"
- `queryId` · string · por defecto `""` · requerido · se muestra si operation="answerQuery"; resource="callback"
- `additionalFields` · collection · se muestra si operation="answerQuery"; resource="callback"
  - `cache_time` · number · por defecto `0`
  - `show_alert` · boolean · por defecto `false`
  - `text` · string · por defecto `""`
  - `url` · string · por defecto `""`
- `queryId` · string · por defecto `""` · requerido · se muestra si operation="answerInlineQuery"; resource="callback"
- `results` · string · por defecto `""` · requerido · se muestra si operation="answerInlineQuery"; resource="callback"
- `additionalFields` · collection · se muestra si operation="answerInlineQuery"; resource="callback"
  - `cache_time` · number · por defecto `0`
  - `show_alert` · boolean · por defecto `false`
  - `text` · string · por defecto `""`
  - `url` · string · por defecto `""`
- `fileId` · string · por defecto `""` · requerido · se muestra si operation="get"; resource="file"
- `download` · boolean · por defecto `true` · se muestra si operation="get"; resource="file"
- `additionalFields` · collection · se muestra si operation="get"; resource="file"; download=true
  - `mimeType` · string · por defecto `""`
- `messageType` · options · por defecto `message` · opciones: `inlineMessage` \| `message` · se muestra si operation="editMessageText"; resource="message"
- `chatId` · string · por defecto `""` · requerido · se muestra si messageType="message"; operation="editMessageText"; resource="message"
- `binaryData` · boolean · por defecto `false` · requerido · se muestra si operation="sendAnimation"|"sendAudio"|"sendDocument"|"sendPhoto"|"sendVideo"|"sendSticker"; resource="message"
- `binaryPropertyName` · string · por defecto `data` · requerido · se muestra si operation="sendAnimation"|"sendAudio"|"sendDocument"|"sendPhoto"|"sendVideo"|"sendSticker"; resource="message"; binaryData=true
- `messageId` · string · por defecto `""` · requerido · se muestra si messageType="message"; operation="editMessageText"; resource="message"
- `inlineMessageId` · string · por defecto `""` · requerido · se muestra si messageType="inlineMessage"; operation="editMessageText"; resource="message"
- `replyMarkup` · options · por defecto `none` · opciones: `none` \| `inlineKeyboard` · se muestra si operation="editMessageText"; resource="message"
- `file` · string · por defecto `""` · se muestra si operation="sendAnimation"; resource="message"; binaryData=false
- `file` · string · por defecto `""` · se muestra si operation="sendAudio"; resource="message"; binaryData=false
- `action` · options · por defecto `typing` · opciones: `find_location` \| `record_audio` \| `record_video` \| `record_video_note` \| `typing` \| `upload_audio` \| `upload_document` \| `upload_photo` \| `upload_video` \| `upload_video_note` · se muestra si operation="sendChatAction"; resource="message"
- `file` · string · por defecto `""` · se muestra si operation="sendDocument"; resource="message"; binaryData=false
- `latitude` · number · por defecto `0` · se muestra si operation="sendLocation"; resource="message"
- `longitude` · number · por defecto `0` · se muestra si operation="sendLocation"; resource="message"
- `media` · fixedCollection · varios valores · se muestra si operation="sendMediaGroup"; resource="message"
  - grupo `media` (lista):
    - `type` · options · por defecto `photo` · opciones: `photo` \| `video`
    - `media` · string · por defecto `""`
    - `additionalFields` · collection
      - `caption` · string · por defecto `""`
      - `parse_mode` · options · por defecto `HTML` · opciones: `Markdown` \| `MarkdownV2` \| `HTML`
- `text` · string · por defecto `""` · requerido · se muestra si operation="editMessageText"|"sendMessage"; resource="message"
- `file` · string · por defecto `""` · se muestra si operation="sendPhoto"; resource="message"; binaryData=false
- `file` · string · por defecto `""` · se muestra si operation="sendSticker"; resource="message"; binaryData=false
- `file` · string · por defecto `""` · se muestra si operation="sendVideo"; resource="message"; binaryData=false
- `richFormat` · options · por defecto `html` · opciones: `markdown` \| `html` · se muestra si operation="sendRichMessage"|"sendRichMessageDraft"; resource="message"
- `richMessageText` · string · por defecto `""` · requerido · se muestra si operation="sendRichMessage"|"sendRichMessageDraft"; resource="message"
- `replyMarkup` · options · por defecto `none` · opciones: `forceReply` \| `inlineKeyboard` \| `none` \| `replyKeyboard` \| `replyKeyboardRemove` · se muestra si operation="sendAnimation"|"sendDocument"|"sendMessage"|"sendPhoto"|"sendRichMessage"|"sendSticker"|"sendVideo"|"sendAudio"|"sendLocation"; resource="message"
- `forceReply` · collection · se muestra si replyMarkup="forceReply"; resource="message"
  - `force_reply` · boolean · por defecto `false`
  - `selective` · boolean · por defecto `false`
- `inlineKeyboard` · fixedCollection · varios valores · se muestra si replyMarkup="inlineKeyboard"; resource="message"
  - grupo `rows` (lista):
    - `row` · fixedCollection · varios valores
      - grupo `buttons` (lista):
        - `text` · string · por defecto `""`
        - `additionalFields` · collection
- `replyKeyboard` · fixedCollection · varios valores · se muestra si replyMarkup="replyKeyboard"
  - grupo `rows` (lista):
    - `row` · fixedCollection · varios valores
      - grupo `buttons` (lista):
        - `text` · string · por defecto `""`
        - `additionalFields` · collection
- `replyKeyboardOptions` · collection · se muestra si replyMarkup="replyKeyboard"
  - `resize_keyboard` · boolean · por defecto `false`
  - `one_time_keyboard` · boolean · por defecto `false`
  - `selective` · boolean · por defecto `false`
- `replyKeyboardRemove` · collection · se muestra si replyMarkup="replyKeyboardRemove"
  - `remove_keyboard` · boolean · por defecto `false`
  - `selective` · boolean · por defecto `false`
- `additionalFields` · collection · se muestra si operation="editMessageText"|"sendAnimation"|"sendAudio"|"sendDocument"|"sendLocation"|"sendMessage"|"sendMediaGroup"|"sendPhoto"|"sendSticker"|"sendVideo"; resource="message"
  - `appendAttribution` · boolean · por defecto `true` · se muestra si /operation="sendMessage"
  - `caption` · string · por defecto `""` · se muestra si /operation="sendAnimation"|"sendAudio"|"sendDocument"|"sendPhoto"|"sendVideo"
  - `disable_notification` · boolean · por defecto `false` · se muestra si /operation≠"editMessageText"
  - `disable_web_page_preview` · boolean · por defecto `false` · se muestra si /operation="editMessageText"|"sendMessage"
  - `duration` · number · por defecto `0` · se muestra si /operation="sendAnimation"|"sendAudio"|"sendVideo"
  - `fileName` · string · por defecto `""` · se muestra si /operation="sendAnimation"|"sendAudio"|"sendDocument"|"sendPhoto"|"sendVideo"|"sendSticker"; /resource="message"; /binaryData=true
  - `height` · number · por defecto `0` · se muestra si /operation="sendAnimation"|"sendVideo"
  - `parse_mode` · options · por defecto `HTML` · opciones: `Markdown` \| `MarkdownV2` \| `HTML` · se muestra si /operation="editMessageText"|"sendAnimation"|"sendAudio"|"sendMessage"|"sendPhoto"|"sendVideo"|"sendDocument"
  - `performer` · string · por defecto `""` · se muestra si /operation="sendAudio"
  - `reply_to_message_id` · number · por defecto `0` · se muestra si /operation≠"editMessageText"
  - `message_thread_id` · number · por defecto `0` · se muestra si /operation="sendAnimation"|"sendAudio"|"sendChatAction"|"sendDocument"|"sendLocation"|"sendMediaGroup"|"sendMessage"|"sendPhoto"|"sendSticker"|"sendVideo"
  - `title` · string · por defecto `""` · se muestra si /operation="sendAudio"
  - `thumb` · string · por defecto `""` · se muestra si /operation="sendAnimation"|"sendAudio"|"sendDocument"|"sendVideo"
  - `width` · number · por defecto `0` · se muestra si /operation="sendAnimation"|"sendVideo"
- `draftId` · number · por defecto `1` · requerido · se muestra si operation="sendMessageDraft"|"sendRichMessageDraft"; resource="message"
- `text` · string · por defecto `""` · se muestra si operation="sendMessageDraft"; resource="message"
- `additionalFields` · collection · se muestra si operation="sendMessageDraft"; resource="message"
  - `message_thread_id` · number · por defecto `0`
  - `parse_mode` · options · por defecto `HTML` · opciones: `Markdown` \| `MarkdownV2` \| `HTML`
- `additionalFields` · collection · se muestra si operation="sendRichMessage"|"sendRichMessageDraft"; resource="message"
  - `disable_notification` · boolean · por defecto `false` · se muestra si /operation="sendRichMessage"
  - `message_effect_id` · string · por defecto `""` · se muestra si /operation="sendRichMessage"
  - `message_thread_id` · number · por defecto `0`
  - `protect_content` · boolean · por defecto `false` · se muestra si /operation="sendRichMessage"
  - `is_rtl` · boolean · por defecto `false`
  - `skip_entity_detection` · boolean · por defecto `false`
- `chatId` · string · por defecto `""` · requerido · se muestra si resource="message"; operation="sendAndWait"
- `message` · string · por defecto `""` · requerido · se muestra si resource="message"; operation="sendAndWait"
- `responseType` · options · por defecto `approval` · opciones: `approval` \| `freeText` \| `customForm` · se muestra si resource="message"; operation="sendAndWait"
- `defineForm` · options · por defecto `fields` · sin expresiones · opciones: `fields` \| `json` · se muestra si responseType="customForm"; resource="message"; operation="sendAndWait"
- `jsonOutput` · json · por defecto `[ { "fieldLabel": "Name", "placeholder": "enter your name...` · se muestra si defineForm="json"; responseType="customForm"; resource="message"; operation="sendAndWait"
- `formFields` · fixedCollection · varios valores · se muestra si @version=<2.5; defineForm="fields"; responseType="customForm"; resource="message"; operation="sendAndWait"
  - grupo `values` (lista):
    - `fieldName` · string · por defecto `""` · requerido · se muestra si @version=2.4; fieldType≠"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=≥2.4; fieldType≠"hiddenField"|"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=<2.4; fieldType≠"hiddenField"|"html"
    - `fieldName` · string · por defecto `""` · se muestra si fieldType="hiddenField"; @version=<2.4
    - `fieldType` · options · por defecto `text` · requerido · opciones: `checkbox` \| `html` \| `date` \| `dropdown` \| `email` \| `file` \| `hiddenField` \| `number` \| `password` \| `radio` \| `text` \| `textarea`
    - `elementName` · string · por defecto `""` · se muestra si fieldType="html"
    - `fieldName` · string · por defecto `""` · se muestra si @version=≥2.5; fieldType≠"html"
    - `placeholder` · string · por defecto `""` · se muestra si fieldType≠"dropdown"|"date"|"file"|"html"|"hiddenField"|"radio"|"checkbox"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="text"|"number"|"email"|"textarea"
    - `defaultValue` · dateTime · por defecto `""` · se muestra si fieldType="date"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="dropdown"|"radio"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="checkbox"
    - `fieldValue` · string · por defecto `""` · se muestra si fieldType="hiddenField"
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="dropdown"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="checkbox"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="radio"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `multiselect` · boolean · por defecto `false` · se muestra si fieldType="dropdown"; @version=<2.3
    - `limitSelection` · options · por defecto `unlimited` · opciones: `exact` \| `range` \| `unlimited` · se muestra si fieldType="checkbox"
    - `numberOfSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="exact"
    - `minSelections` · number · por defecto `0` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `maxSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `html` · string · por defecto (un comentario HTML de ejemplo) · sin expresiones · se muestra si fieldType="html"
    - `multipleFiles` · boolean · por defecto `true` · se muestra si fieldType="file"
    - `acceptFileTypes` · string · por defecto `""` · se muestra si fieldType="file"
    - `requiredField` · boolean · por defecto `false` · se muestra si fieldType≠"html"|"hiddenField"
- `formFields` · fixedCollection · varios valores · se muestra si @version=≥2.5; defineForm="fields"; responseType="customForm"; resource="message"; operation="sendAndWait"
  - grupo `values` (lista):
    - `fieldName` · string · por defecto `""` · requerido · se muestra si @version=2.4; fieldType≠"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=≥2.4; fieldType≠"hiddenField"|"html"
    - `fieldLabel` · string · por defecto `""` · requerido · se muestra si @version=<2.4; fieldType≠"hiddenField"|"html"
    - `fieldName` · string · por defecto `""` · se muestra si fieldType="hiddenField"; @version=<2.4
    - `fieldType` · options · por defecto `text` · requerido · opciones: `checkbox` \| `html` \| `date` \| `dropdown` \| `email` \| `file` \| `hiddenField` \| `number` \| `password` \| `radio` \| `text` \| `textarea`
    - `elementName` · string · por defecto `""` · se muestra si fieldType="html"
    - `fieldName` · string · por defecto `""` · se muestra si @version=≥2.5; fieldType≠"html"
    - `placeholder` · string · por defecto `""` · se muestra si fieldType≠"dropdown"|"date"|"file"|"html"|"hiddenField"|"radio"|"checkbox"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="text"|"number"|"email"|"textarea"
    - `defaultValue` · dateTime · por defecto `""` · se muestra si fieldType="date"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="dropdown"|"radio"
    - `defaultValue` · string · por defecto `""` · se muestra si fieldType="checkbox"
    - `fieldValue` · string · por defecto `""` · se muestra si fieldType="hiddenField"
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="dropdown"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="checkbox"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `fieldOptions` · fixedCollection · requerido · varios valores · se muestra si fieldType="radio"
      - grupo `values` (lista):
        - `option` · string · por defecto `""`
    - `multiselect` · boolean · por defecto `false` · se muestra si fieldType="dropdown"; @version=<2.3
    - `limitSelection` · options · por defecto `unlimited` · opciones: `exact` \| `range` \| `unlimited` · se muestra si fieldType="checkbox"
    - `numberOfSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="exact"
    - `minSelections` · number · por defecto `0` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `maxSelections` · number · por defecto `1` · se muestra si fieldType="checkbox"; limitSelection="range"
    - `html` · string · por defecto (un comentario HTML de ejemplo) · sin expresiones · se muestra si fieldType="html"
    - `multipleFiles` · boolean · por defecto `true` · se muestra si fieldType="file"
    - `acceptFileTypes` · string · por defecto `""` · se muestra si fieldType="file"
    - `requiredField` · boolean · por defecto `false` · se muestra si fieldType≠"html"|"hiddenField"
- `approvalOptions` · fixedCollection · se muestra si responseType="approval"; resource="message"; operation="sendAndWait"
  - grupo `values`:
    - `approvalType` · options · por defecto `single` · opciones: `single` \| `double`
    - `approveLabel` · string · por defecto (un texto de ejemplo de n8n, en inglés) · se muestra si approvalType="single"|"double"
    - `disapproveLabel` · string · por defecto (un texto de ejemplo de n8n, en inglés) · se muestra si approvalType="double"
- `chatApproval` · boolean · por defecto `false` · se muestra si responseType="approval"; resource="message"; operation="sendAndWait"
- `approverIds` · string · por defecto `""` · se muestra si responseType="approval"; chatApproval=true; resource="message"; operation="sendAndWait"
- `unauthorizedReplyText` · string · por defecto `You are not authorized to respond to this request.` · se muestra si responseType="approval"; chatApproval=true; resource="message"; operation="sendAndWait"
- `postDecisionBehavior` · options · por defecto `showOutcome` · opciones: `showOutcome` \| `removeButtons` \| `keepMessage` · se muestra si responseType="approval"; chatApproval=true; resource="message"; operation="sendAndWait"
- `options` · collection · se muestra si responseType="approval"; resource="message"; operation="sendAndWait"
  - `limitWaitTime` · fixedCollection
    - grupo `values`:
      - `limitType` · options · por defecto `afterTimeInterval` · opciones: `afterTimeInterval` \| `atSpecifiedTime`
      - `resumeAmount` · number · por defecto `1` · se muestra si limitType="afterTimeInterval"
      - `resumeUnit` · options · por defecto `hours` · opciones: `minutes` \| `hours` \| `days` · se muestra si limitType="afterTimeInterval"
      - `maxDateAndTime` · dateTime · por defecto `""` · se muestra si limitType="atSpecifiedTime"
  - `appendAttribution` · boolean · por defecto `true`
- `options` · collection · se muestra si responseType="freeText"|"customForm"; resource="message"; operation="sendAndWait"
  - `messageButtonLabel` · string · por defecto `Respond`
  - `responseFormTitle` · string · por defecto `""`
  - `responseFormDescription` · string · por defecto `""`
  - `responseFormButtonLabel` · string · por defecto `Submit`
  - `responseFormCustomCss` · string · por defecto `:root { --font-family: 'Open Sans', sans-serif; --font-we...`
  - `limitWaitTime` · fixedCollection
    - grupo `values`:
      - `limitType` · options · por defecto `afterTimeInterval` · opciones: `afterTimeInterval` \| `atSpecifiedTime`
      - `resumeAmount` · number · por defecto `1` · se muestra si limitType="afterTimeInterval"
      - `resumeUnit` · options · por defecto `hours` · opciones: `minutes` \| `hours` \| `days` · se muestra si limitType="afterTimeInterval"
      - `maxDateAndTime` · dateTime · por defecto `""` · se muestra si limitType="atSpecifiedTime"
  - `appendAttribution` · boolean · por defecto `true`

### IA: agente y cadenas

#### `@n8n/n8n-nodes-langchain.agent` · AI Agent

- typeVersion más alta: **3.1** · versión por defecto al crear el nodo: 3.1
- versiones aceptadas: 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 3, 3.1
- clase: VersionedNodeType (nodeVersions 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 3, 3.1, defaultVersion 3.1) · ojo: no coincide con los tipos
- credenciales: ninguna
- entradas: dinámicas: dependen de los parámetros (mirá «Forma de las conexiones»)
- salidas: main

Parámetros (typeVersion 3.1):

- `promptType` · options · por defecto `auto` · opciones: `auto` \| `guardrails` \| `define` · se muestra si @version=<3.1
- `promptType` · options · por defecto `auto` · opciones: `auto` \| `define` · se muestra si @version=≥3.1
- `text` · string · por defecto `={{ $json.guardrailsInput }}` · requerido · se muestra si promptType="guardrails"
- `text` · string · por defecto `={{ $json.chatInput }}` · requerido · se muestra si promptType="auto"
- `text` · string · por defecto `""` · requerido · se muestra si promptType="define"
- `hasOutputParser` · boolean · por defecto `false` · sin expresiones
- `needsFallback` · boolean · por defecto `false` · sin expresiones
- `options` · collection
  - `systemMessage` · string · por defecto `You are a helpful assistant`
  - `maxIterations` · number · por defecto `10`
  - `returnIntermediateSteps` · boolean · por defecto `false`
  - `passthroughBinaryImages` · boolean · por defecto `true`
  - `passthroughBinaryPdfs` · boolean · por defecto `false`
  - `tracingMetadata` · fixedCollection · varios valores
    - grupo `values` (lista):
      - `key` · string · por defecto `""`
      - `type` · options · por defecto `stringValue` · opciones: `arrayValue` \| `booleanValue` \| `numberValue` \| `objectValue` \| `stringValue`
      - `stringValue` · string · por defecto `""` · se muestra si type="stringValue"
      - `numberValue` · string · por defecto `""` · se muestra si type="numberValue"
      - `booleanValue` · options · por defecto `true` · opciones: `true` \| `false` · se muestra si type="booleanValue"
      - `arrayValue` · string · por defecto `""` · se muestra si type="arrayValue"
      - `objectValue` · json · por defecto `={}` · se muestra si type="objectValue"
  - `autoSaveHighlightedData` · boolean · por defecto `true`
  - `enableStreaming` · boolean · por defecto `true`
  - `batching` · collection
    - `batchSize` · number · por defecto `1`
    - `delayBetweenBatches` · number · por defecto `0`
  - `maxTokensFromMemory` · hidden · por defecto `0`
  - `forceToolCallOnFirstIteration` · boolean · por defecto `false`

#### `@n8n/n8n-nodes-langchain.chainLlm` · Basic LLM Chain

- typeVersion más alta: **1.9** · versión por defecto al crear el nodo: 1.9
- versiones aceptadas: 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9
- clase: INodeType (description.version 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9)
- credenciales: ninguna
- entradas: dinámicas: dependen de los parámetros (mirá «Forma de las conexiones»)
- salidas: main

Parámetros (typeVersion 1.9):

- `prompt` · string · por defecto `={{ $json.input }}` · requerido · se muestra si @version=1
- `prompt` · string · por defecto `={{ $json.chat_input }}` · requerido · se muestra si @version=1.1|1.2
- `prompt` · string · por defecto `={{ $json.chatInput }}` · requerido · se muestra si @version=1.3
- `promptType` · options · por defecto `auto` · opciones: `auto` \| `guardrails` \| `define` · se muestra si @version≠≤1.3|≥1.8
- `promptType` · options · por defecto `auto` · opciones: `auto` \| `define` · se muestra si @version=≥1.8
- `text` · string · por defecto `={{ $json.guardrailsInput }}` · requerido · se muestra si promptType="guardrails"; @version=≥1.5
- `text` · string · por defecto `={{ $json.chatInput }}` · requerido · se muestra si promptType="auto"; @version=≥1.5
- `text` · string · por defecto `""` · requerido · se muestra si promptType="define"
- `hasOutputParser` · boolean · por defecto `false` · sin expresiones · se muestra si @version≠1|1.1|1.3
- `needsFallback` · boolean · por defecto `false` · sin expresiones · se muestra si @version≠1|1.1|1.3
- `messages` · fixedCollection · varios valores
  - grupo `messageValues` (lista):
    - `type` · options · por defecto `SystemMessagePromptTemplate` · opciones: `AIMessagePromptTemplate` \| `SystemMessagePromptTemplate` \| `HumanMessagePromptTemplate`
    - `messageType` · options · por defecto `text` · opciones: `text` \| `imageBinary` \| `imageUrl` · se muestra si type="HumanMessagePromptTemplate"
    - `binaryImageDataKey` · string · por defecto `data` · requerido · se muestra si messageType="imageBinary"
    - `imageUrl` · string · por defecto `""` · requerido · se muestra si messageType="imageUrl"
    - `imageDetail` · options · por defecto `auto` · opciones: `auto` \| `low` \| `high` · se muestra si type="HumanMessagePromptTemplate"; messageType="imageBinary"|"imageUrl"
    - `message` · string · por defecto `""` · requerido · se muestra si messageType≠"imageBinary"|"imageUrl"
- `batching` · collection · se muestra si @version=≥1.7
  - `batchSize` · number · por defecto `5`
  - `delayBetweenBatches` · number · por defecto `0`

#### `@n8n/n8n-nodes-langchain.textClassifier` · Text Classifier

- typeVersion más alta: **1.1** · versión por defecto al crear el nodo: 1.1
- versiones aceptadas: 1, 1.1
- clase: INodeType (description.version 1, 1.1)
- credenciales: ninguna
- entradas: main, ai_languageModel (requerida) (máx. 1) «Model»
- salidas: dinámicas: dependen de los parámetros (mirá «Forma de las conexiones»)

Parámetros (typeVersion 1.1):

- `inputText` · string · por defecto `""` · requerido
- `categories` · fixedCollection · varios valores
  - grupo `categories` (lista):
    - `category` · string · por defecto `""` · requerido
    - `description` · string · por defecto `""`
- `options` · collection
  - `multiClass` · boolean · por defecto `false`
  - `fallback` · options · por defecto `discard` · opciones: `discard` \| `other`
  - `includeConfidenceScores` · boolean · por defecto `false`
  - `systemPromptTemplate` · string · por defecto `Please classify the text provided by the user into one of...`
  - `enableAutoFixing` · boolean · por defecto `true`
  - `batching` · collection · se muestra si @version=≥1.1
    - `batchSize` · number · por defecto `5`
    - `delayBetweenBatches` · number · por defecto `0`

#### `@n8n/n8n-nodes-langchain.informationExtractor` · Information Extractor

- typeVersion más alta: **1.2** · versión por defecto al crear el nodo: 1.2
- versiones aceptadas: 1, 1.1, 1.2
- clase: INodeType (description.version 1, 1.1, 1.2)
- credenciales: ninguna
- entradas: main, ai_languageModel (requerida) (máx. 1) «Model»
- salidas: main

Parámetros (typeVersion 1.2):

- `text` · string · por defecto `""`
- `schemaType` · options · por defecto `fromAttributes` · sin expresiones · opciones: `fromAttributes` \| `fromJson` \| `manual`
- `jsonSchemaExample` · json · por defecto `{ "state": "California", "cities": ["Los Angeles", "San F...` · sin expresiones · se muestra si schemaType="fromJson"
- `inputSchema` · json · por defecto `{ "type": "object", "properties": { "state": { "type": "s...` · se muestra si schemaType="manual"
- `attributes` · fixedCollection · varios valores · se muestra si schemaType="fromAttributes"
  - grupo `attributes` (lista):
    - `name` · string · por defecto `""` · requerido
    - `type` · options · por defecto `string` · requerido · opciones: `boolean` \| `date` \| `number` \| `string`
    - `description` · string · por defecto `""` · requerido
    - `required` · boolean · por defecto `false` · requerido
- `options` · collection
  - `systemPromptTemplate` · string · por defecto `You are an expert extraction algorithm. Only extract rele...`
  - `batching` · collection · se muestra si @version=≥1.1
    - `batchSize` · number · por defecto `5`
    - `delayBetweenBatches` · number · por defecto `0`

#### `@n8n/n8n-nodes-langchain.outputParserStructured` · Structured Output Parser

- typeVersion más alta: **1.3** · versión por defecto al crear el nodo: 1.3
- versiones aceptadas: 1, 1.1, 1.2, 1.3
- clase: INodeType (description.version 1, 1.1, 1.2, 1.3)
- credenciales: ninguna
- entradas: dinámicas: dependen de los parámetros (mirá «Forma de las conexiones»)
- salidas: ai_outputParser (nombres: Output Parser)

Parámetros (typeVersion 1.3):

- `schemaType` · options · por defecto `fromJson` · sin expresiones · opciones: `fromJson` \| `manual` · se muestra si @version=≥1.2
- `jsonSchemaExample` · json · por defecto `{ "state": "California", "cities": ["Los Angeles", "San F...` · sin expresiones · se muestra si schemaType="fromJson"
- `inputSchema` · json · por defecto `{ "type": "object", "properties": { "state": { "type": "s...` · se muestra si schemaType="manual"
- `jsonSchema` · json · por defecto `{ "type": "object", "properties": { "state": { "type": "s...` · requerido · se muestra si @version=≤1.1
- `autoFix` · boolean · por defecto `false`
- `customizeRetryPrompt` · boolean · por defecto `false` · se muestra si autoFix=true
- `prompt` · string · por defecto `Instructions: -------------- {instructions} -------------...` · se muestra si autoFix=true; customizeRetryPrompt=true

### IA: modelos y embeddings

#### `@n8n/n8n-nodes-langchain.lmChatGoogleGemini` · Google Gemini Chat Model

- typeVersion más alta: **1.2** · versión por defecto al crear el nodo: 1.2
- versiones aceptadas: 1, 1.1, 1.2
- clase: INodeType (description.version 1, 1.1, 1.2)
- credenciales: `googlePalmApi` (requerida)
  - `googlePalmApi` se llama «Google Gemini(PaLM) Api» en el editor
- entradas: ninguna
- salidas: ai_languageModel (nombres: Model)

Parámetros (typeVersion 1.2):

- `modelName` · options · por defecto `models/gemini-2.5-flash` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si @version==1
- `modelName` · options · por defecto `models/gemini-3-flash-preview` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si @version==1.1
- `modelName` · options · por defecto `models/gemini-3-flash-preview` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si @version=≥1.2
- `options` · collection
  - `maxOutputTokens` · number · por defecto `2048`
  - `temperature` · number · por defecto `0.4`
  - `topK` · number · por defecto `32`
  - `topP` · number · por defecto `1`
  - `safetySettings` · fixedCollection · varios valores
    - grupo `values` (lista):
      - `category` · options · por defecto `HARM_CATEGORY_UNSPECIFIED` · opciones: `HARM_CATEGORY_HARASSMENT` \| `HARM_CATEGORY_HATE_SPEECH` \| `HARM_CATEGORY_SEXUALLY_EXPLICIT` \| `HARM_CATEGORY_DANGEROUS_CONTENT`
      - `threshold` · options · por defecto `HARM_BLOCK_THRESHOLD_UNSPECIFIED` · opciones: `HARM_BLOCK_THRESHOLD_UNSPECIFIED` \| `BLOCK_LOW_AND_ABOVE` \| `BLOCK_MEDIUM_AND_ABOVE` \| `BLOCK_ONLY_HIGH` \| `BLOCK_NONE`

#### `@n8n/n8n-nodes-langchain.lmChatOpenAi` · OpenAI Chat Model

- typeVersion más alta: **1.3** · versión por defecto al crear el nodo: 1.3
- versiones aceptadas: 1, 1.1, 1.2, 1.3
- clase: INodeType (description.version 1, 1.1, 1.2, 1.3)
- credenciales: `openAiApi` (requerida)
  - `openAiApi` se llama «OpenAI» en el editor
- entradas: ninguna
- salidas: ai_languageModel (nombres: Model)

Parámetros (typeVersion 1.3):

- `model` · options · por defecto `gpt-5-mini` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si @version≠≥1.2
- `model` · resourceLocator · por defecto `{"mode":"list","value":"gpt-5-mini"}` · requerido · modos: `list` \| `id` · se muestra si @version≠≤1.1
- `responsesApiEnabled` · boolean · por defecto `true` · se muestra si @version=≥1.3
- `builtInTools` · collection · se muestra si @version=≥1.3; /responsesApiEnabled=true
  - `webSearch` · collection
    - `searchContextSize` · options · por defecto `medium` · opciones: `low` \| `medium` \| `high`
    - `allowedDomains` · string · por defecto `""`
    - `country` · string · por defecto `""`
    - `city` · string · por defecto `""`
    - `region` · string · por defecto `""`
  - `fileSearch` · collection
    - `vectorStoreIds` · json · por defecto `[]` · requerido
    - `filters` · json · por defecto `{}`
    - `maxResults` · number · por defecto `1`
  - `codeInterpreter` · boolean · por defecto `true`
- `options` · collection
  - `baseURL` · string · por defecto `https://api.openai.com/v1` · se muestra si @version≠≥1.1
  - `frequencyPenalty` · number · por defecto `0`
  - `maxTokens` · number · por defecto `-1`
  - `responseFormat` · options · por defecto `text` · opciones: `text` \| `json_object` · se muestra si @version=<1.3
  - `responseFormat` · options · por defecto `text` · opciones: `text` \| `json_object` · se muestra si @version=≥1.3; /responsesApiEnabled=false
  - `textFormat` · fixedCollection · se muestra si @version=≥1.3; /responsesApiEnabled=true
    - grupo `textOptions`:
      - `type` · options · por defecto `""` · opciones: `text` \| `json_schema` \| `json_object`
      - `verbosity` · options · por defecto `medium` · opciones: `low` \| `medium` \| `high`
      - `name` · string · por defecto `my_schema` · se muestra si type="json_schema"
      - `schema` · json · por defecto `{ "type": "object", "properties": { "message": { "type": ...` · se muestra si type="json_schema"
      - `description` · string · por defecto `""` · se muestra si type="json_schema"
      - `strict` · boolean · por defecto `false` · se muestra si type="json_schema"
  - `presencePenalty` · number · por defecto `0`
  - `temperature` · number · por defecto `0.7`
  - `reasoningEffort` · options · por defecto `medium` · opciones: `low` \| `medium` \| `high` · se muestra si /model=regex "(^o1([-\\d]+)?$)|(^o[3-9].*)|(^gpt-5.*)"
  - `timeout` · number · por defecto `60000`
  - `maxRetries` · number · por defecto `2`
  - `topP` · number · por defecto `1`
  - `extraBody` · json · por defecto `{}`
  - `conversationId` · string · por defecto `""` · se muestra si @version=≥1.3; /responsesApiEnabled=true
  - `promptCacheKey` · string · por defecto `""` · se muestra si @version=≥1.3; /responsesApiEnabled=true
  - `safetyIdentifier` · string · por defecto `""` · se muestra si @version=≥1.3; /responsesApiEnabled=true
  - `serviceTier` · options · por defecto `auto` · opciones: `auto` \| `flex` \| `default` \| `priority` · se muestra si @version=≥1.3; /responsesApiEnabled=true
  - `metadata` · json · por defecto `{}` · se muestra si @version=≥1.3; /responsesApiEnabled=true
  - `topLogprobs` · number · por defecto `0` · se muestra si @version=≥1.3; /responsesApiEnabled=true
  - `promptConfig` · fixedCollection · se muestra si @version=≥1.3; /responsesApiEnabled=true
    - grupo `promptOptions`:
      - `promptId` · string · por defecto `""`
      - `version` · string · por defecto `""`
      - `variables` · json · por defecto `{}`

#### `@n8n/n8n-nodes-langchain.embeddingsGoogleGemini` · Embeddings Google Gemini

- typeVersion más alta: **1** · versión por defecto al crear el nodo: 1
- versiones aceptadas: 1
- clase: INodeType (description.version 1)
- credenciales: `googlePalmApi` (requerida)
  - `googlePalmApi` se llama «Google Gemini(PaLM) Api» en el editor
- entradas: ninguna
- salidas: ai_embedding (nombres: Embeddings)

Parámetros (typeVersion 1):

- `modelName` · options · por defecto `models/gemini-embedding-001` · opciones: opciones dinámicas (se cargan desde la cuenta)

#### `@n8n/n8n-nodes-langchain.embeddingsOpenAi` · Embeddings OpenAI

- typeVersion más alta: **1.2** · versión por defecto al crear el nodo: 1.2
- versiones aceptadas: 1, 1.1, 1.2
- clase: INodeType (description.version 1, 1.1, 1.2)
- credenciales: `openAiApi` (requerida)
  - `openAiApi` se llama «OpenAI» en el editor
- entradas: ninguna
- salidas: ai_embedding (nombres: Embeddings)

Parámetros (typeVersion 1.2):

- `model` · options · por defecto `text-embedding-ada-002` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si @version=1
- `model` · options · por defecto `text-embedding-3-small` · opciones: opciones dinámicas (se cargan desde la cuenta) · se muestra si @version≠1
- `options` · collection
  - `dimensions` · options · por defecto `1536` · opciones: `256` \| `512` \| `1024` \| `1536` \| `3072`
  - `baseURL` · string · por defecto `https://api.openai.com/v1` · se muestra si @version≠≥1.2
  - `batchSize` · number · por defecto `512`
  - `stripNewLines` · boolean · por defecto `true`
  - `timeout` · number · por defecto `-1`
  - `encodingFormat` · options · por defecto `float` · opciones: `float` \| `base64`

### IA: memoria, documentos y vectores

#### `@n8n/n8n-nodes-langchain.memoryBufferWindow` · Simple Memory

- typeVersion más alta: **1.4** · versión por defecto al crear el nodo: 1.4
- versiones aceptadas: 1, 1.1, 1.2, 1.3, 1.4
- clase: INodeType (description.version 1, 1.1, 1.2, 1.3, 1.4)
- credenciales: ninguna
- entradas: ninguna
- salidas: ai_memory (nombres: Memory)

Parámetros (typeVersion 1.4):

- `sessionKey` · string · por defecto `chat_history` · se muestra si @version=1
- `sessionKey` · string · por defecto `={{ $json.sessionId }}` · se muestra si @version=1.1
- `sessionIdType` · options · por defecto `fromInput` · opciones: `fromInput` \| `customKey` · se muestra si @version=≥1.2
- `sessionKey` · string · por defecto `={{ $json.sessionId }}` · se muestra si sessionIdType="fromInput"; @version=≥1.3
- `sessionKey` · string · por defecto `""` · se muestra si sessionIdType="customKey"
- `contextWindowLength` · number · por defecto `5`

#### `@n8n/n8n-nodes-langchain.memoryPostgresChat` · Postgres Chat Memory

- typeVersion más alta: **1.4** · versión por defecto al crear el nodo: 1.4
- versiones aceptadas: 1, 1.1, 1.2, 1.3, 1.4
- clase: INodeType (description.version 1, 1.1, 1.2, 1.3, 1.4)
- credenciales: `postgres` (requerida)
  - `postgres` se llama «Postgres» en el editor
- entradas: ninguna
- salidas: ai_memory (nombres: Memory)

Parámetros (typeVersion 1.4):

- `sessionIdType` · options · por defecto `fromInput` · opciones: `fromInput` \| `customKey`
- `sessionKey` · string · por defecto `={{ $json.sessionId }}` · se muestra si sessionIdType="fromInput"; @version=≥1.2
- `sessionKey` · string · por defecto `""` · se muestra si sessionIdType="customKey"
- `tableName` · string · por defecto `n8n_chat_histories`
- `contextWindowLength` · number · por defecto `5` · se muestra si @version≠<1.1

#### `@n8n/n8n-nodes-langchain.vectorStoreSupabase` · Supabase Vector Store

- typeVersion más alta: **1.4** · versión por defecto al crear el nodo: 1.4
- versiones aceptadas: 1, 1.1, 1.2, 1.3, 1.4
- clase: INodeType (description.version 1, 1.1, 1.2, 1.3, 1.4)
- credenciales: `supabaseApi` (requerida)
  - `supabaseApi` se llama «Supabase API» en el editor
- entradas: dinámicas: dependen de los parámetros (mirá «Forma de las conexiones»)
- salidas: dinámicas: dependen de los parámetros (mirá «Forma de las conexiones»)

Parámetros (typeVersion 1.4):

- `mode` · options · por defecto `retrieve` · sin expresiones · opciones: `load` \| `insert` \| `retrieve` \| `retrieve-as-tool` \| `update`
- `toolName` · string · por defecto `""` · requerido · se muestra si @version=≤1.2; mode="retrieve-as-tool"
- `toolDescription` · string · por defecto `""` · requerido · se muestra si mode="retrieve-as-tool"
- `tableName` · resourceLocator · por defecto `{"mode":"list","value":""}` · requerido · modos: `list` \| `id`
- `embeddingBatchSize` · number · por defecto `200` · se muestra si mode="insert"; @version=≥1.1
- `options` · collection · se muestra si mode="insert"
  - `queryName` · string · por defecto `match_documents`
- `prompt` · string · por defecto `""` · requerido · se muestra si mode="load"
- `topK` · number · por defecto `4` · se muestra si mode="load"|"retrieve-as-tool"
- `includeDocumentMetadata` · boolean · por defecto `true` · se muestra si mode="load"|"retrieve-as-tool"
- `useReranker` · boolean · por defecto `false` · se muestra si mode="load"|"retrieve"|"retrieve-as-tool"
- `id` · string · por defecto `""` · requerido · se muestra si mode="update"
- `options` · collection · se muestra si mode="load"|"retrieve-as-tool"
  - `queryName` · string · por defecto `match_documents`
  - `metadata` · fixedCollection · varios valores
    - grupo `metadataValues` (lista):
      - `name` · string · por defecto `""` · requerido
      - `value` · string · por defecto `""`
- `options` · collection · se muestra si mode="retrieve"
  - `queryName` · string · por defecto `match_documents`
  - `metadata` · fixedCollection · varios valores
    - grupo `metadataValues` (lista):
      - `name` · string · por defecto `""` · requerido
      - `value` · string · por defecto `""`
- `options` · collection · se muestra si mode="update"
  - `queryName` · string · por defecto `match_documents`

#### `@n8n/n8n-nodes-langchain.documentDefaultDataLoader` · Default Data Loader

- typeVersion más alta: **1.1** · versión por defecto al crear el nodo: 1.1
- versiones aceptadas: 1, 1.1
- clase: INodeType (description.version 1, 1.1)
- credenciales: ninguna
- entradas: dinámicas: dependen de los parámetros (mirá «Forma de las conexiones»)
- salidas: ai_document (nombres: Document)

Parámetros (typeVersion 1.1):

- `dataType` · options · por defecto `json` · requerido · sin expresiones · opciones: `json` \| `binary`
- `jsonMode` · options · por defecto `allInputData` · requerido · opciones: `allInputData` \| `expressionData` · se muestra si dataType="json"
- `binaryMode` · options · por defecto `allInputData` · requerido · opciones: `allInputData` \| `specificField` · se muestra si dataType="binary"
- `loader` · options · por defecto `auto` · requerido · opciones: `auto` \| `csvLoader` \| `docxLoader` \| `epubLoader` \| `jsonLoader` \| `pdfLoader` \| `textLoader` · se muestra si dataType="binary"
- `jsonData` · string · por defecto `""` · requerido · se muestra si dataType="json"; jsonMode="expressionData"
- `binaryDataKey` · string · por defecto `data` · requerido · se muestra si dataType="binary"; binaryMode≠"allInputData"
- `textSplittingMode` · options · por defecto `simple` · requerido · sin expresiones · opciones: `simple` \| `custom` · se muestra si @version=1.1
- `options` · collection
  - `pointers` · string · por defecto `""` · se muestra si /loader="jsonLoader"|"auto"
  - `separator` · string · por defecto `,` · se muestra si /loader="csvLoader"|"auto"
  - `column` · string · por defecto `""` · se muestra si /loader="csvLoader"|"auto"
  - `splitPages` · boolean · por defecto `true` · se muestra si /loader="pdfLoader"|"auto"
  - `metadata` · fixedCollection · varios valores
    - grupo `metadataValues` (lista):
      - `name` · string · por defecto `""` · requerido
      - `value` · string · por defecto `""`

#### `@n8n/n8n-nodes-langchain.textSplitterRecursiveCharacterTextSplitter` · Recursive Character Text Splitter

- typeVersion más alta: **1** · versión por defecto al crear el nodo: 1
- versiones aceptadas: 1
- clase: INodeType (description.version 1)
- credenciales: ninguna
- entradas: ninguna
- salidas: ai_textSplitter (nombres: Text Splitter)

Parámetros (typeVersion 1):

- `chunkSize` · number · por defecto `1000`
- `chunkOverlap` · number · por defecto `0`
- `options` · collection
  - `splitCode` · options · por defecto `markdown` · opciones: `cpp` \| `go` \| `java` \| `js` \| `php` \| `proto` \| `python` \| `rst` \| `ruby` \| `rust` \| `scala` \| `swift` \| `markdown` \| `latex` (+1)

## Diferencias entre tipos y clases

Las versiones que valen para el JSON son las de los tipos (las que ofrece el editor y las que acepta el auditor). Algunas clases cargan además versiones viejas u ocultas: no las uses.

- n8n-nodes-base.httpRequestTool: tipos 3,4,4.1,4.2,4.3,4.4,4.5 / clase 1,2,3,4,4.1,4.2,4.3,4.4,4.5
- @n8n/n8n-nodes-langchain.agent: tipos 1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.1,2.2,3,3.1 / clase 1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.1,2.2,2.3,3,3.1

