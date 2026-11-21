# 32 · Cargar documentos para RAG

Subí un PDF o un TXT por formulario y n8n lo deja listo para que una IA busque en él: lee el texto, lo parte en pedazos, calcula el **embedding** de cada pedazo con Gemini y guarda todo en la tabla `documentos` de Supabase (con pgvector). Es la primera mitad de un sistema RAG; la otra mitad es el agente del [workflow 33](../33-agente-con-memoria-y-rag).

```text
Subir documento → Guardar en Supabase (Vector Store · Insert) → Contar los pedazos → Página final
                      ▲ Embeddings Gemini      ▲ Leer el archivo ◄ Partir en pedazos
```

## Qué aprendés

- Qué es un **embedding**: una lista de números que representa el significado de un texto. Textos que dicen cosas parecidas tienen embeddings cercanos, aunque usen otras palabras.
- A **subir archivos** con un campo `file` del Form Trigger.
- A usar los **sub-nodos de IA** de n8n: un cargador de documentos, un separador de texto y un modelo de embeddings conectados a un nodo raíz.
- Cómo guarda los vectores **pgvector** en Supabase y por qué la dimensión de la columna tiene que coincidir con la del modelo.

## Qué necesitás

- Una cuenta de n8n (n8n Cloud o tu propia n8n 2.48.7).
- Un proyecto de Supabase con el esquema de [`supabase/sql/00_esquema.sql`](../../supabase/sql/00_esquema.sql). Crea la tabla `documentos`, su índice y la función de búsqueda `match_documents`. Paso a paso en [`supabase/README.md`](../../supabase/README.md).
- Dos credenciales en n8n:

| Credencial | Tipo en n8n | De dónde sale |
|---|---|---|
| **Supabase API** | `supabaseApi` | **Project Settings → API Keys**: Host = `https://<tu-proyecto>.supabase.co` (sin `/rest/v1`), Secret Key = una clave secreta `sb_secret_...`. |
| **Google Gemini(PaLM) Api** | `googlePalmApi` | Una clave gratis de [Google AI Studio](https://aistudio.google.com/apikey) (**Get API key**). El campo Host queda como viene. |

## Cómo importarlo

1. **Copiar y pegar**: en la [página del evento](https://nodo-cero-bo.github.io), «Copiar workflow», y en n8n pegá con Ctrl + V en un workflow nuevo.
2. **Import from URL**: menú del workflow → **Import from URL** con este enlace:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/30-supabase/32-cargar-documentos-rag/workflow.json
   ```

3. **Import from File**: bajá [`workflow.json`](workflow.json) y elegí **Import from File**.

## Cómo probarlo

1. Elegí la credencial de Supabase en **Guardar en Supabase** y la de Gemini en **Embeddings Gemini**.
2. Tocá **Execute workflow**: se abre el formulario de prueba.
3. Subí un archivo corto (un par de páginas está perfecto para empezar), escribí un tema (por ejemplo `agenda`) y tocá **Subir y guardar**.
4. La página final dice cuántos pedazos guardó, por ejemplo «Guardamos 6 pedazos de agenda.txt».
5. En Supabase, **Table Editor → documentos**: una fila por pedazo, con `content` (el texto), `metadata` (archivo, tema, página o líneas) y `embedding` (3072 números).
6. Seguí con el [workflow 33](../33-agente-con-memoria-y-rag) y preguntale algo que esté en el archivo.

Si subís el mismo archivo dos veces, se guarda dos veces. Para empezar de cero, en el SQL Editor: `delete from documentos where metadata->>'archivo' = 'agenda.txt';`

## Cómo está armado

| Nodo | Qué hace |
|---|---|
| **Subir documento** (Form Trigger) | Campo **Archivo (PDF o TXT)** de tipo `file`, con **Field Name** `archivo`: el binario llega con ese nombre. El campo **Tema** es opcional. |
| **Guardar en Supabase** (Supabase Vector Store · Insert Documents) | Tabla `documentos`, **Query Name** `match_documents`. **Embedding Batch Size** en 50: cada envío a Supabase lleva 50 pedazos. |
| **Leer el archivo** (Default Data Loader) | Lee el binario `archivo` (detecta PDF o texto) y le suma metadata: `archivo` (nombre) y `tema`. |
| **Partir en pedazos** (Recursive Character Text Splitter) | Pedazos de unos 1000 caracteres que se pisan 150, para no cortar una idea a la mitad. |
| **Embeddings Gemini** | `models/gemini-embedding-001`, que devuelve vectores de **3072** dimensiones. |
| **Contar los pedazos** (Code) y **Página final** | Cuentan lo guardado y se lo muestran a la persona. |

### Sobre el modelo de embeddings

- La columna `embedding` es `vector(3072)` porque `gemini-embedding-001` devuelve 3072 números. Si un modelo devuelve otra cantidad, Postgres rechaza la fila.
- El workflow 33 tiene que usar **el mismo modelo** para buscar: los vectores de modelos distintos no se pueden comparar.
- `text-embedding-004` (768 dimensiones) ya no está disponible en la API de Gemini. Si cambiás a otro modelo, cambiá las apariciones de `3072` en el SQL, borrá la tabla (`drop table documentos;`), corré el esquema de nuevo y volvé a cargar tus documentos.
- pgvector indexa hasta 2000 dimensiones con `vector`, así que el esquema indexa la versión `halfvec` (media precisión, hasta 4000). La búsqueda usa la misma expresión y aprovecha el índice.

### Límites del plan gratis de Gemini

El plan gratis tiene un límite de pedidos por minuto. Un documento de pocas páginas entra sin problema; para uno grande, cargalo por partes o bajá **Embedding Batch Size**. Para un Markdown, guardalo como `.txt` antes de subirlo.

## Ideas para extenderlo

- Cargá documentos desde Google Drive o desde una URL con HTTP Request, en lugar del formulario.
- Sumá más metadata (equipo, idioma, fecha) y filtrá la búsqueda por ella en el workflow 33 (**Metadata Filter**).
- Antes de guardar, borrá las filas viejas del mismo archivo con el nodo Supabase (**Delete**, **Filter** en **String** con `metadata->>archivo=eq.agenda.txt`) para que volver a subirlo lo reemplace.
- Probá otros tamaños de pedazo y mirá cómo cambian las respuestas del agente.

## Documentación oficial

- [Supabase Vector Store en n8n](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoresupabase/)
- [Default Data Loader](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.documentdefaultdataloader/) y [Recursive Character Text Splitter](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.textsplitterrecursivecharactertextsplitter/)
- [Embeddings Google Gemini](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.embeddingsgooglegemini/) y [credencial de Google Gemini](https://docs.n8n.io/integrations/builtin/credentials/googleai/)
- [Embeddings en la API de Gemini](https://ai.google.dev/gemini-api/docs/embeddings)
- [pgvector en Supabase](https://supabase.com/docs/guides/database/extensions/pgvector) e [índices HNSW (y halfvec)](https://supabase.com/docs/guides/ai/vector-indexes/hnsw-indexes)
- [n8n Form Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.formtrigger/)

---

Licencia MIT. n8n, Supabase y Google Gemini son marcas de sus dueños.
