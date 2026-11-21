# 33 · Agente con memoria y tus documentos

Un agente de IA para chatear que hace dos cosas que un chat común no hace: **recuerda la conversación** (la guarda en Postgres, en tu Supabase) y **busca en tus documentos** antes de responder (los que cargaste con el [workflow 32](../32-cargar-documentos-rag)). Si le preguntás algo que está en un PDF, lo encuentra y te dice de qué archivo salió. Eso es RAG: generar una respuesta apoyada en lo que se recupera de tus datos.

```text
Chat → Agente ─┬─ Modelo Gemini          (piensa y escribe)
               ├─ Memoria en Postgres    (recuerda la conversación)
               └─ Buscar en documentos   (herramienta: Supabase Vector Store)
                      └─ Embeddings Gemini (convierte la pregunta en vector)
```

## Qué aprendés

- A armar un **AI Agent** con modelo, memoria y una herramienta, y a escribir su **System Message**.
- A guardar la memoria del chat en **Postgres** (Supabase) para que sobreviva entre ejecuciones y se pueda revisar.
- A usar un **Vector Store como herramienta** del agente: el agente decide cuándo buscar y qué pedir.
- A conectar n8n a la base de Supabase por el **pooler en modo sesión**, y por qué.

## Qué necesitás

- Una cuenta de n8n (n8n Cloud o tu propia n8n 2.48.7).
- Un proyecto de Supabase con el esquema de [`supabase/sql/00_esquema.sql`](../../supabase/sql/00_esquema.sql) y al menos un documento cargado con el [workflow 32](../32-cargar-documentos-rag).
- Tres credenciales en n8n:

| Credencial | Tipo en n8n | Va en | De dónde sale |
|---|---|---|---|
| **Google Gemini(PaLM) Api** | `googlePalmApi` | **Modelo Gemini** y **Embeddings Gemini** | Una clave gratis de [Google AI Studio](https://aistudio.google.com/apikey). |
| **Postgres** | `postgres` | **Memoria en Postgres** | La conexión a la base de Supabase por el pooler (abajo, paso a paso). |
| **Supabase API** | `supabaseApi` | **Buscar en documentos** | **Project Settings → API Keys**: Host = `https://<tu-proyecto>.supabase.co`, Secret Key = una clave secreta `sb_secret_...`. |

### La credencial Postgres, paso a paso

1. En tu proyecto de Supabase, tocá **Connect** (arriba) y elegí **Session pooler**.
2. En n8n, creá una credencial **Postgres** con:
   - **Host**: el del pooler, con la forma `aws-<n>-<región>.pooler.supabase.com`.
   - **Database**: `postgres`.
   - **User**: `postgres.<id-del-proyecto>` (con el punto y el id: así el pooler sabe a qué proyecto ir).
   - **Password**: la contraseña de la base. Si no la tenés, la cambiás en **Database Settings → Database password**.
   - **Port**: `5432`.
   - **SSL**: **Require**, y en **CA Certificate** pegá el contenido del certificado que bajás en la sección **SSL Configuration** de **Database Settings** (es un archivo `.crt` de texto: abrilo con el bloc de notas y copiá todo, desde `-----BEGIN CERTIFICATE-----` hasta `-----END CERTIFICATE-----`).
3. Guardá: n8n prueba la conexión.

**Por qué el pooler en modo sesión.** La conexión directa de Supabase (`db.<id>.supabase.co`) es por IPv6, y muchas redes y servicios en la nube salen nada más por IPv4. El pooler en modo sesión (puerto 5432) es IPv4 en todos los planes y se comporta como una conexión normal de Postgres. El modo transacción (puerto 6543) está pensado para funciones que abren y cierran conexiones todo el tiempo, y no acepta sentencias preparadas.

**Por qué el certificado.** El certificado del pooler lo firma la autoridad propia de Supabase (Supabase Root 2021 CA), que las computadoras no traen instalada. Con SSL en **Require** y sin el certificado, n8n falla con «self-signed certificate in certificate chain». Pegando el certificado, la conexión va cifrada y verificada. Para una prueba rápida, **Ignore SSL Issues (Insecure)** también conecta, cifrado pero sin verificar con quién.

> Esta credencial entra a la base con el usuario `postgres`, el dueño de las tablas: puede leer y cambiar todo. Tratala como la clave secreta, y nunca la uses fuera de n8n.

## Cómo importarlo

1. **Copiar y pegar**: en la [página del evento](https://nodo-cero-bo.github.io), «Copiar workflow», y en n8n pegá con Ctrl + V en un workflow nuevo.
2. **Import from URL**: menú del workflow → **Import from URL** con este enlace:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/30-supabase/33-agente-con-memoria-y-rag/workflow.json
   ```

3. **Import from File**: bajá [`workflow.json`](workflow.json) y elegí **Import from File**.

## Cómo probarlo

1. Elegí las credenciales en **Modelo Gemini**, **Embeddings Gemini**, **Memoria en Postgres** y **Buscar en documentos**.
2. Tocá **Open chat** (abajo del canvas) y preguntá algo que esté en el documento que cargaste, por ejemplo «¿A qué hora es el almuerzo según la agenda?».
3. El agente busca, responde y nombra el archivo. Abrí el nodo **Agente** para ver la llamada a **Buscar_en_documentos** y los pedazos que le volvieron.
4. Probá la memoria: «Hola, me llamo Ana», después otra pregunta y después «¿Cómo me llamo?».
5. En Supabase, **Table Editor → n8n_chat_histories**: cada mensaje es una fila. `session_id` queda como `<id de la conversación>__Memoria_en_Postgres`: n8n le suma el nombre del nodo para que dos memorias del mismo workflow no se mezclen.

**Para compartirlo**, abrí **Chat**, activá **Make Chat Publicly Available**, elegí **Hosted Chat** y publicá el workflow: n8n te da una URL con una página de chat lista. Cualquiera con la URL usa tu cuota de Gemini; si la vas a difundir, sumale **Authentication** (Basic Auth).

## Cómo está armado

| Nodo | Qué hace |
|---|---|
| **Chat** (Chat Trigger) | Recibe cada mensaje con `chatInput` y un `sessionId` por conversación. |
| **Agente** (AI Agent) | Decide si buscar, llama a la herramienta y responde. Las instrucciones están en **Options → System Message**: cambialas para tu proyecto. |
| **Modelo Gemini** | El modelo que piensa. Temperatura 0.2 para que se apegue a lo que encuentra. Podés elegir otro modelo de la lista. |
| **Memoria en Postgres** (Postgres Chat Memory) | Tabla `n8n_chat_histories`, **Context Window Length** 10: relee los últimos 10 intercambios. |
| **Buscar en documentos** (Supabase Vector Store · Retrieve Documents As Tool) | Tabla `documentos`, función `match_documents`, **Limit** 4. La **Description** es lo que el agente lee para saber cuándo usarla. |
| **Embeddings Gemini** | `models/gemini-embedding-001`, el mismo del workflow 32. Si son distintos, la búsqueda no encuentra nada que sirva. |

La tabla `n8n_chat_histories` la crea el esquema con RLS activada. Si no existiera, el nodo la crearía solito, pero sin RLS: por eso conviene correr el esquema antes.

## Ideas para extenderlo

- Cambiá el **System Message** para que el agente sea la mentora de tu proyecto, con su tono y sus reglas.
- Sumá más herramientas: el nodo Supabase como herramienta para leer la tabla `ideas`, o un HTTP Request a Avalanche Fuji como en el [workflow 40](../../40-proyectos/40-agente-web3-fuji).
- Filtrá la búsqueda por tema con **Metadata Filter** en **Buscar en documentos** (por ejemplo `tema` = `reglas`).
- Guardá el `sessionId` de cada persona con su perfil de Clerk para retomar su conversación en otro momento.

## Documentación oficial

- [AI Agent](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/) y [Chat Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.chattrigger/)
- [Postgres Chat Memory](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.memorypostgreschat/) y [credencial Postgres](https://docs.n8n.io/integrations/builtin/credentials/postgres/)
- [Supabase Vector Store](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoresupabase/)
- [Google Gemini Chat Model](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatgooglegemini/) y [Embeddings Google Gemini](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsgooglegemini/)
- [Cómo conectarse a la base de Supabase (pooler y modos)](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [SSL en Supabase](https://supabase.com/docs/guides/platform/ssl-enforcement)

---

Licencia MIT. n8n, Supabase y Google Gemini son marcas de sus dueños.
