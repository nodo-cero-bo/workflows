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
