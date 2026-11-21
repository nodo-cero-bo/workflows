# Supabase para los workflows de Nodo Cero

El esquema de base de datos que usan los workflows de Supabase, Clerk y Avalanche Fuji de este repo: cuatro tablas, la memoria del agente, la búsqueda por significado con pgvector y la seguridad por filas (RLS), todo explicado en comentarios dentro del SQL.

| Archivo | Qué hace |
|---|---|
| [`sql/00_esquema.sql`](sql/00_esquema.sql) | Crea todo. Se puede correr las veces que quieras: lo que ya existe queda como está. |
| [`sql/01_datos_de_ejemplo.sql`](sql/01_datos_de_ejemplo.sql) | Opcional: tres ideas de ejemplo para probar la API del workflow 31. Tampoco repite filas. |
| [`sql/02_reportes.sql`](sql/02_reportes.sql) | Para el workflow 67 (reportes ambientales): la tabla `reportes`, el bucket privado `reportes-fotos` de Storage y su RLS, explicada. También se puede correr las veces que quieras. |

## Qué crea

| Objeto | Para qué | Lo usan |
|---|---|---|
| `perfiles` | Una fila por usuaria de Clerk: `clerk_id` (único), `email`, `nombre`, `avatar_url`, `creado_en`, `actualizado_en` (se actualiza sola con un trigger). | 20, 21, 41 |
| `ideas` | Ideas de proyecto: `nombre`, `idea`, `nivel` (inicial, intermedio o avanzado), `categoria` (la completa la IA) y `creado_en`. | 30, 31, 34 |
| `pagos_fuji` | Pagos verificados en Avalanche Fuji: `tx_hash` (único, `0x` + 64 hexadecimales), `desde`, `hacia`, `monto_avax` (numeric, decimales exactos), `bloque`, `verificado` y `creado_en`. Más `clerk_id` y `monto_wei`, que completa el workflow 41 cuando el pago llega con login. | 13, 41 |
| `documentos` | Pedazos de texto con su embedding: `content`, `metadata` (jsonb), `embedding` (`vector(3072)`) y `creado_en`. Con un índice HNSW para buscar rápido. | 32, 33 |
| `match_documents(query_embedding, match_count, filter)` | La búsqueda por significado que llama el nodo **Supabase Vector Store** de n8n. Devuelve `id`, `content`, `metadata` y `similarity`, del pedazo más parecido al menos parecido. | 32, 33 |
| `n8n_chat_histories` | La memoria del agente (nodo **Postgres Chat Memory**): `id`, `session_id` y `message`. | 33 |

## Cómo correrlo (5 minutos)

1. Creá una cuenta y un proyecto en [Supabase](https://supabase.com/dashboard/sign-up). El plan gratis alcanza. Guardá la contraseña de la base que te pide: la vas a usar en el workflow 33.
2. En el panel del proyecto, abrí **SQL Editor** (en la barra de la izquierda) y tocá **New query**.
3. Abrí [`sql/00_esquema.sql`](sql/00_esquema.sql) acá en GitHub, tocá **Copy raw file**, pegalo en el editor y tocá **Run**. Tiene que terminar con «Success. No rows returned».
4. Si querés datos de ejemplo, hacé lo mismo con [`sql/01_datos_de_ejemplo.sql`](sql/01_datos_de_ejemplo.sql).
5. Revisá lo que quedó: **Table Editor** muestra las tablas y **Database → Functions** muestra `match_documents`.

Si Supabase te avisa que la consulta tiene operaciones destructivas, es por los `drop ... if exists` que dejan el script listo para correrlo de nuevo: borran y recrean la función de búsqueda, una política y un trigger, nunca una tabla ni sus datos.

## Las claves y la seguridad

n8n se conecta a Supabase de dos formas, y las dos tienen acceso total:

| Credencial de n8n | Con qué entra | Qué puede hacer |
|---|---|---|
| **Supabase API** (`supabaseApi`) | La **clave secreta** del proyecto (`sb_secret_...`, en **Project Settings → API Keys**; la `service_role` de antes también funciona). | Usa el rol `service_role`, que **saltea RLS**: lee y escribe todo por la API. |
| **Postgres** (`postgres`), en el workflow 33 | El usuario `postgres` y la contraseña de la base, por el pooler en modo sesión. | Es el dueño de las tablas: RLS tampoco lo frena. |

Por eso:

- **La clave secreta y la contraseña de la base van nada más en las credenciales de n8n.** Nunca en una página web, en una app, en un repo ni en una captura de pantalla. Si alguna se filtra, en Supabase generá una clave nueva y borrá la vieja (o cambiá la contraseña de la base).
- **La clave pública** (`sb_publishable_...`, o la `anon` de antes) es la que va en una página web. El esquema no le da permisos sobre ninguna tabla, así que con ella no se puede leer ni escribir nada de esto.

### RLS, en corto

Postgres revisa dos cosas antes de que alguien toque una tabla: los **permisos** (`grant`: si puede hacer esa operación) y las **políticas de RLS** (a qué filas se aplica). El esquema:

1. Activa RLS en las cinco tablas. Con RLS activada y sin políticas, nadie ve ninguna fila, salvo los roles que la saltean.
2. Saca todos los permisos a `anon` y `authenticated` (los roles de la clave pública) y le da a `service_role` los que necesita. En proyectos nuevos esos permisos no siempre vienen dados, y sin ellos la API responde «permission denied».
3. Deja una sola política activa, en `perfiles`: «Cada persona lee su propio perfil». Sirve si conectás Clerk a Supabase como proveedor de sesión ([Clerk third-party auth](https://supabase.com/docs/guides/auth/third-party/clerk)): el token de Clerk trae `sub` = el id de la usuaria, que es el `clerk_id`.
4. Deja comentado cómo abrir la lectura de `ideas` a la clave pública, si querés mostrarlas en una página. Antes de hacerlo, pensá que la columna `nombre` queda a la vista.

### La búsqueda por significado

- `gemini-embedding-001` (el modelo de los workflows 32 y 33) devuelve vectores de **3072** números, por eso `embedding` es `vector(3072)`. `text-embedding-004`, que devolvía 768, ya no está disponible en la API de Gemini.
- pgvector indexa hasta 2000 dimensiones con `vector` y hasta 4000 con `halfvec` (media precisión). El índice usa `embedding::halfvec(3072)` y la función ordena por la misma expresión, así que la búsqueda aprovecha el índice.
- La función se llama `match_documents` porque es el nombre que el nodo Supabase Vector Store busca por defecto (opción **Query Name**), y recibe los tres argumentos con nombre que manda: `query_embedding`, `match_count` y `filter`.
- **Cambiar de modelo:** reemplazá cada `3072` del SQL por la dimensión nueva, borrá la tabla (`drop table documentos;`), corré el esquema de nuevo y volvé a cargar los documentos. Los vectores de modelos distintos no se pueden mezclar.

### Las conexiones del workflow 33

La credencial **Postgres** del workflow 33 se conecta por el **pooler en modo sesión** (botón **Connect → Session pooler**): host `aws-<n>-<región>.pooler.supabase.com`, puerto `5432`, base `postgres`, usuario `postgres.<id-del-proyecto>`. La conexión directa es por IPv6 y muchas redes salen nada más por IPv4; el pooler en modo sesión es IPv4 y se comporta como una conexión normal. Para el SSL, el README del [workflow 33](../30-supabase/33-agente-con-memoria-y-rag) explica cómo usar el certificado de Supabase.

## Cómo se probó

El esquema se corrió tres veces seguidas sobre Postgres con pgvector 0.8 (PGlite), con los roles `anon`, `authenticated` y `service_role` de Supabase simulados, y pasó 30 pruebas: que sea idempotente, también sobre una tabla `pagos_fuji` creada con una versión anterior; que `service_role` cree, lea y actualice; que la clave pública no lea ni escriba (error 42501); que la política de `perfiles` muestre a cada persona nada más su fila; que las reglas `check` y `unique` rechacen datos malos; que `match_documents` ordene por parecido, filtre por metadata y use el índice HNSW; y que la tabla de memoria sea la que espera n8n. Después, los workflows 30 a 34 se ejecutaron en una n8n 2.48.7 local contra una API con el mismo formato que la de Supabase sobre esa base.

## Documentación oficial

- [Seguridad por filas (RLS)](https://supabase.com/docs/guides/database/postgres/row-level-security) y [roles de Postgres en Supabase](https://supabase.com/docs/guides/database/postgres/roles)
- [Claves de API](https://supabase.com/docs/guides/getting-started/api-keys)
- [pgvector](https://supabase.com/docs/guides/database/extensions/pgvector) e [índices HNSW](https://supabase.com/docs/guides/ai/vector-indexes/hnsw-indexes)
- [Cómo conectarse a la base (pooler y modos)](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Database Webhooks](https://supabase.com/docs/guides/database/webhooks)
- [Supabase Vector Store en n8n](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoresupabase/) y [credencial Supabase de n8n](https://docs.n8n.io/integrations/builtin/credentials/supabase/)
- [pgvector en GitHub](https://github.com/pgvector/pgvector)

---

Licencia MIT. Supabase, Postgres, Clerk, Avalanche y Google Gemini son marcas de sus dueños.
