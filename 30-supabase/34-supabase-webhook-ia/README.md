# 34 · La IA clasifica cada fila nueva

Cada vez que entra una idea nueva en la tabla `ideas` (por el formulario del [workflow 30](../30-formulario-a-supabase), la API del [31](../31-api-crud-supabase) o a mano en el Table Editor), Supabase avisa a n8n con un **Database Webhook**. n8n le pide a Gemini que elija una categoría y la guarda en la misma fila. La base avisa, n8n piensa y la fila se completa sola.

```text
Supabase (INSERT en ideas) ──► Evento de Supabase → Leer el evento → ¿Es una idea nueva?
                                                                     ├ sí → Clasificar con IA → Elegir la categoría → Guardar la categoría → Responder 200
                                                                     └ no → Responder 400
```

## Qué aprendés

- A usar **Database Webhooks** de Supabase: la base llama a una URL cuando cambia una tabla.
- A **proteger un webhook** con un encabezado secreto (**Header Auth**).
- A pedirle a la IA datos con forma fija con **Information Extractor**, y a normalizar lo que devuelve antes de guardarlo.
- A **actualizar una fila** con el nodo Supabase, filtrando por su `id`.
- Cómo evitar un bucle cuando un workflow escribe en la misma tabla que lo dispara.

## Qué necesitás

- Una cuenta de n8n con una URL pública: n8n Cloud sirve tal cual. Una n8n en tu compu no recibe los avisos de Supabase sin un túnel.
- Un proyecto de Supabase con el esquema de [`supabase/sql/00_esquema.sql`](../../supabase/sql/00_esquema.sql). Paso a paso en [`supabase/README.md`](../../supabase/README.md).
- Tres credenciales en n8n:

| Credencial | Tipo en n8n | Va en | Qué lleva |
|---|---|---|---|
| **Header Auth** | `httpHeaderAuth` | **Evento de Supabase** | **Name** `x-webhook-secreto` y **Value** un secreto largo (abajo, cómo generarlo). |
| **Google Gemini(PaLM) Api** | `googlePalmApi` | **Modelo Gemini** | Una clave gratis de [Google AI Studio](https://aistudio.google.com/apikey). |
| **Supabase API** | `supabaseApi` | **Guardar la categoría** | **Project Settings → API Keys**: Host = `https://<tu-proyecto>.supabase.co`, Secret Key = una clave secreta `sb_secret_...`. |

**Un secreto para el webhook.** En el SQL Editor de Supabase, esta consulta te da uno de 64 caracteres al azar:

```sql
select replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
```

Usá el mismo valor en la credencial de n8n y en el Database Webhook. No lo subas a ningún repo.

## Cómo importarlo

1. **Copiar y pegar**: en la [página del evento](https://nodo-cero-bo.github.io), «Copiar workflow», y en n8n pegá con Ctrl + V en un workflow nuevo.
2. **Import from URL**: menú del workflow → **Import from URL** con este enlace:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/30-supabase/34-supabase-webhook-ia/workflow.json
   ```

3. **Import from File**: bajá [`workflow.json`](workflow.json) y elegí **Import from File**.

## Cómo probarlo

### 1. Primero, sin Supabase

1. Elegí las tres credenciales en **Evento de Supabase**, **Modelo Gemini** y **Guardar la categoría**.
2. Creá una idea con el workflow 30 o 31 y fijate su `id` (por ejemplo, 1).
3. Abrí **Evento de Supabase**, tocá **Listen for test event** y, desde una terminal, mandá el mismo aviso que mandaría Supabase a la **Test URL** (cambiá la URL, el secreto y el `id`):

   ```bash
   curl -X POST "https://<tu-n8n>/webhook-test/supabase-ideas" \
     -H "Content-Type: application/json" \
     -H "x-webhook-secreto: <tu-secreto>" \
     -d '{"type": "INSERT", "table": "ideas", "schema": "public",
          "record": {"id": 1, "nombre": "Equipo Ada", "idea": "Registrar en Fuji la asistencia a un taller", "nivel": "inicial", "categoria": null},
          "old_record": null}'
   ```

4. La respuesta es algo como `{"ok": true, "id": 1, "categoria": "web3", "motivo": "...", "fila_actualizada": true}`, y en **Table Editor → ideas** la fila 1 ya tiene categoría.
5. Probá sin el encabezado `x-webhook-secreto`: n8n responde **403** y no ejecuta nada. Probá con `"type": "UPDATE"`: responde **400** y no toca la base.

### 2. Con el Database Webhook de Supabase

1. **Publicá** el workflow y copiá la **Production URL** de **Evento de Supabase** (`https://<tu-n8n>/webhook/supabase-ideas`).
2. En Supabase, andá a **Integrations → Database Webhooks** (si te lo pide, activá los webhooks) y tocá **Create a new hook**:
   - **Name**: `ideas_a_n8n`.
   - **Table**: `ideas`. **Events**: nada más **Insert**.
   - **Type of webhook**: **HTTP Request**. **Method**: `POST`. **URL**: tu Production URL.
   - **Timeout**: 5000 ms (la IA tarda unos segundos en contestar).
   - **HTTP Headers**: dejá `Content-type: application/json` y sumá `x-webhook-secreto` con tu secreto.
3. Mandá una idea con el formulario del workflow 30 o insertá una fila en el Table Editor. En unos segundos se completa `categoria`.
4. Si no pasa nada: en n8n, pestaña **Executions** del workflow; en Supabase, el SQL Editor con `select * from net._http_response order by created desc limit 5;` muestra lo que respondió n8n.

**Con SQL, en lugar del panel.** Un Database Webhook es un trigger que llama a `supabase_functions.http_request`. Con los webhooks ya activados en el panel, esto crea el mismo:

```sql
create trigger ideas_a_n8n
  after insert on public.ideas
  for each row execute function supabase_functions.http_request(
    'https://<tu-n8n>/webhook/supabase-ideas',
    'POST',
    '{"Content-Type": "application/json", "x-webhook-secreto": "<tu-secreto>"}',
    '{}',
    '5000'
  );
```

El secreto queda escrito en la definición del trigger, igual que con el panel: cualquiera con acceso al SQL de tu proyecto lo puede ver.

## Cómo está armado

| Nodo | Qué hace |
|---|---|
| **Evento de Supabase** (Webhook) | `POST /webhook/supabase-ideas` con **Authentication: Header Auth**: sin el encabezado correcto, n8n responde 403. **Respond: Using 'Respond to Webhook' Node**. |
| **Leer el evento** (Code) | Supabase manda `{ type, table, schema, record, old_record }`. Sigue nada más si es un `INSERT` en `public.ideas` con `id` y texto. |
| **¿Es una idea nueva?** (IF) | Sí: a la IA. No: **Responder 400** con los motivos. |
| **Clasificar con IA** (Information Extractor + **Modelo Gemini**) | Pide `categoria` y `motivo`. La descripción de cada atributo es la instrucción para el modelo. |
| **Elegir la categoría** (Code) | Saca mayúsculas, tildes y espacios, y si no es una de la lista usa `otra`. |
| **Guardar la categoría** (Supabase · Update) | Filtro `id` **Equals** el id del evento; cambia nada más `categoria`. |
| **Responder 200** | Devuelve `id`, `categoria`, `motivo` y si encontró la fila. |

Las categorías son `ia`, `web3`, `automatizacion`, `impacto-social`, `educacion` y `otra`. Para usar las tuyas, cambialas en la descripción del atributo `categoria` y en la lista `VALIDAS` de **Elegir la categoría**.

**Por qué no hay bucle.** El workflow escribe en `ideas` con un `UPDATE`. El webhook escucha nada más `INSERT`, así que ese cambio no lo vuelve a disparar. Y si alguien suma el evento `UPDATE` en Supabase, **Leer el evento** lo rechaza con 400 sin tocar la base.

## Ideas para extenderlo

- Sumá un resumen de una línea: un atributo más en **Clasificar con IA**, una columna `resumen` en la tabla y un campo más en **Guardar la categoría**.
- Avisá en Telegram o por correo cuando entra una idea de cierta categoría.
- Usá el mismo patrón con `perfiles` (workflow 20): cuando se registra alguien, mandale una bienvenida.
- Cambiá el Information Extractor por un **Text Classifier**, que tiene una salida por categoría, para hacer algo distinto con cada una.

## Documentación oficial

- [Database Webhooks de Supabase](https://supabase.com/docs/guides/database/webhooks) y [pg_net](https://supabase.com/docs/guides/database/extensions/pg_net)
- [Webhook de n8n, con su autenticación](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/) y [Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/)
- [Information Extractor](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.information-extractor/) y [Text Classifier](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.text-classifier/)
- [Google Gemini Chat Model](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatgooglegemini/) y [credencial de Google Gemini](https://docs.n8n.io/integrations/builtin/credentials/googleai/)
- [Nodo Supabase](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.supabase/)

---

Licencia MIT. n8n, Supabase y Google Gemini son marcas de sus dueños.
