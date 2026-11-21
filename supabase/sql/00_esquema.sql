-- =====================================================================================
-- Nodo Cero · esquema de Supabase para los workflows de n8n
--
-- Qué crea:
--   perfiles            usuarias que llegan de Clerk (workflows 20, 21 y 41)
--   ideas               ideas que llegan por formulario o por la API (workflows 30, 31 y 34)
--   pagos_fuji          pagos verificados en Avalanche Fuji (workflows 13 y 41)
--   documentos          pedazos de texto con su embedding, para buscar por significado (32 y 33)
--   match_documents     la función de búsqueda que llama el nodo Supabase Vector Store de n8n
--   n8n_chat_histories  la memoria del agente (nodo Postgres Chat Memory, workflow 33)
--
-- Cómo se corre: copiá todo este archivo en el SQL Editor de tu proyecto de Supabase y tocá Run.
-- Se puede correr las veces que quieras: si algo ya existe, lo deja como está (es idempotente).
--
-- Seguridad, en corto:
--   - Todas las tablas tienen la seguridad por filas (RLS) activada.
--   - n8n se conecta con la clave secreta del proyecto (sb_secret_..., o la service_role de antes).
--     Esa clave usa el rol service_role, que SALTEA RLS: n8n puede leer y escribir todo.
--     Por eso esa clave nunca va en una página web, en una app ni en un repo. Se guarda
--     nada más en la credencial «Supabase API» de n8n.
--   - La clave pública (sb_publishable_..., o la anon de antes) no puede leer ni escribir nada
--     de estas tablas: no hay políticas para ella. Más abajo está cómo abrir una tabla si lo necesitás.
--
-- Embeddings: el workflow 32 usa Gemini «models/gemini-embedding-001», que devuelve vectores
-- de 3072 dimensiones. Si cambiás a un modelo con otra dimensión: reemplazá cada 3072 de este
-- archivo (columna, índice y función) por la nueva, borrá la tabla con «drop table documentos;»,
-- corré el archivo de nuevo y volvé a cargar tus documentos (create table if not exists no
-- cambia una tabla que ya existe).
-- =====================================================================================

-- En el SQL Editor de Supabase las extensiones viven en el esquema «extensions».
-- Lo sumamos a la ruta de búsqueda de esta sesión para que «vector» y «halfvec» se encuentren
-- aunque la extensión se haya instalado antes en «public».
set search_path = public, extensions;

create schema if not exists extensions;
create extension if not exists vector with schema extensions;


-- -------------------------------------------------------------------------------------
-- Actualizar «actualizado_en» solita en cada cambio de fila
-- -------------------------------------------------------------------------------------
create or replace function public.tocar_actualizado_en()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.actualizado_en := now();
  return new;
end;
$$;

comment on function public.tocar_actualizado_en() is
  'Trigger: pone la fecha y hora actual en actualizado_en cada vez que se modifica una fila.';


-- -------------------------------------------------------------------------------------
-- perfiles: una fila por usuaria de Clerk
-- -------------------------------------------------------------------------------------
create table if not exists public.perfiles (
  id             bigint generated always as identity primary key,
  clerk_id       text not null unique,
  email          text,
  nombre         text,
  avatar_url     text,
  creado_en      timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

comment on table public.perfiles is
  'Usuarias que inician sesión con Clerk. El workflow 20 crea, actualiza o borra la fila con cada webhook de Clerk.';
comment on column public.perfiles.clerk_id is
  'Id de la usuaria en Clerk (empieza con user_). Es único: sirve para hacer upsert con on_conflict=clerk_id.';
comment on column public.perfiles.email is 'Correo principal que tiene en Clerk.';
comment on column public.perfiles.nombre is 'Nombre y apellido que tiene en Clerk.';
comment on column public.perfiles.avatar_url is 'URL de la foto de perfil que da Clerk.';
comment on column public.perfiles.creado_en is 'Cuándo se creó la fila.';
comment on column public.perfiles.actualizado_en is 'Cuándo cambió por última vez (lo pone el trigger perfiles_actualizado_en).';

drop trigger if exists perfiles_actualizado_en on public.perfiles;
create trigger perfiles_actualizado_en
  before update on public.perfiles
  for each row execute function public.tocar_actualizado_en();


-- -------------------------------------------------------------------------------------
-- ideas: lo que llega por el formulario (30) o por la API (31); la IA completa la categoría (34)
-- -------------------------------------------------------------------------------------
create table if not exists public.ideas (
  id        bigint generated always as identity primary key,
  nombre    text not null check (char_length(nombre) between 1 and 120),
  idea      text not null check (char_length(idea) between 1 and 2000),
  nivel     text check (nivel in ('inicial', 'intermedio', 'avanzado')),
  categoria text,
  creado_en timestamptz not null default now()
);

comment on table public.ideas is
  'Ideas de proyecto. Llegan por el formulario del workflow 30 o por la API del 31; el workflow 34 completa la categoría con IA.';
comment on column public.ideas.nombre is 'Nombre de quien manda la idea o de su equipo (de 1 a 120 caracteres).';
comment on column public.ideas.idea is 'La idea, en texto libre (de 1 a 2000 caracteres).';
comment on column public.ideas.nivel is 'Nivel que se anima a encarar: inicial, intermedio o avanzado.';
comment on column public.ideas.categoria is
  'La completa la IA (workflow 34): ia, web3, automatizacion, impacto-social, educacion u otra. Vacía hasta que la clasifica.';
comment on column public.ideas.creado_en is 'Cuándo llegó la idea.';

create index if not exists ideas_creado_en_idx on public.ideas (creado_en desc);
create index if not exists ideas_categoria_idx on public.ideas (categoria);


-- -------------------------------------------------------------------------------------
-- pagos_fuji: pagos en la red de prueba de Avalanche que n8n verificó
-- -------------------------------------------------------------------------------------
create table if not exists public.pagos_fuji (
  id         bigint generated always as identity primary key,
  tx_hash    text not null unique check (tx_hash ~* '^0x[0-9a-f]{64}$'),
  desde      text,
  hacia      text,
  monto_avax numeric,
  bloque     bigint,
  verificado boolean not null default false,
  creado_en  timestamptz not null default now(),
  clerk_id   text,
  monto_wei  numeric
);

-- Columnas que sumó el workflow 41 (pago con login). «add column if not exists» las agrega
-- también si creaste la tabla con una versión anterior de este archivo.
alter table public.pagos_fuji add column if not exists clerk_id text;
alter table public.pagos_fuji add column if not exists monto_wei numeric;

comment on table public.pagos_fuji is
  'Pagos en Avalanche Fuji (chainId 43113) que n8n leyó y verificó (workflows 13 y 41). Es una red de prueba: el AVAX no tiene valor.';
comment on column public.pagos_fuji.clerk_id is
  'Quién registró el pago, si llegó con sesión de Clerk (workflow 41). Vacío en el workflow 13, que no pide login.';
comment on column public.pagos_fuji.monto_wei is 'El mismo monto en wei (1 AVAX = 10^18 wei), como entero exacto.';
comment on column public.pagos_fuji.tx_hash is 'Hash de la transacción: 0x y 64 caracteres hexadecimales. Es único: un pago se registra una vez.';
comment on column public.pagos_fuji.desde is 'Dirección que envió el pago (0x...).';
comment on column public.pagos_fuji.hacia is 'Dirección que lo recibió (0x...).';
comment on column public.pagos_fuji.monto_avax is 'Monto en AVAX (no en wei). numeric guarda los decimales exactos.';
comment on column public.pagos_fuji.bloque is 'Número de bloque donde quedó la transacción.';
comment on column public.pagos_fuji.verificado is 'true si pasó todas las revisiones del workflow (estado, destino, monto y confirmaciones).';
comment on column public.pagos_fuji.creado_en is 'Cuándo se registró.';

create index if not exists pagos_fuji_hacia_idx on public.pagos_fuji (lower(hacia));
create index if not exists pagos_fuji_creado_en_idx on public.pagos_fuji (creado_en desc);
create index if not exists pagos_fuji_clerk_id_idx on public.pagos_fuji (clerk_id);


-- -------------------------------------------------------------------------------------
-- documentos: la tabla que usa el nodo Supabase Vector Store de n8n
-- Las columnas content, metadata y embedding son las que escribe el nodo: no les cambies el nombre.
-- -------------------------------------------------------------------------------------
create table if not exists public.documentos (
  id        bigserial primary key,
  content   text,
  metadata  jsonb,
  embedding vector(3072),
  creado_en timestamptz not null default now()
);

comment on table public.documentos is
  'Pedazos de tus documentos con su embedding. El workflow 32 los carga y el agente del 33 busca en ellos.';
comment on column public.documentos.content is 'El texto del pedazo.';
comment on column public.documentos.metadata is 'Datos del pedazo en JSON: archivo de origen, página, tema. Sirve para filtrar la búsqueda.';
comment on column public.documentos.embedding is
  'Vector de 3072 números (Gemini gemini-embedding-001) que representa el significado del texto.';
comment on column public.documentos.creado_en is 'Cuándo se cargó.';

-- Índice para buscar rápido por significado. pgvector indexa hasta 2000 dimensiones con «vector»
-- y hasta 4000 con «halfvec» (media precisión), así que con 3072 indexamos la versión halfvec.
-- La función de búsqueda de abajo usa la misma expresión, y por eso Postgres puede usar el índice.
create index if not exists documentos_embedding_idx
  on public.documentos using hnsw ((embedding::halfvec(3072)) halfvec_cosine_ops);

-- Índice para el filtro por metadata (metadata @> '{"tema": "..."}').
create index if not exists documentos_metadata_idx
  on public.documentos using gin (metadata jsonb_path_ops);


-- -------------------------------------------------------------------------------------
-- match_documents: la búsqueda por significado
--
-- El nodo Supabase Vector Store de n8n (por debajo, LangChain) llama a esta función por la API
-- de Supabase con tres argumentos con nombre: query_embedding, match_count y filter.
-- El nombre por defecto que busca el nodo es match_documents (opción «Query Name»).
-- Devuelve los pedazos más parecidos a la pregunta, del más al menos parecido.
-- Se borra y se vuelve a crear para poder cambiar lo que devuelve sin errores.
-- -------------------------------------------------------------------------------------
drop function if exists public.match_documents(vector, integer, jsonb);

create function public.match_documents(
  query_embedding vector(3072),
  match_count     integer default null,
  filter          jsonb default '{}'
)
returns table (
  id         bigint,
  content    text,
  metadata   jsonb,
  similarity double precision
)
language sql
stable
set search_path = public, extensions
as $$
  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding::halfvec(3072) <=> query_embedding::halfvec(3072)) as similarity
  from public.documentos as d
  where d.metadata @> coalesce(filter, '{}'::jsonb)
  order by d.embedding::halfvec(3072) <=> query_embedding::halfvec(3072)
  limit match_count;
$$;

comment on function public.match_documents(vector, integer, jsonb) is
  'Búsqueda por significado para el nodo Supabase Vector Store de n8n: los match_count pedazos de documentos más parecidos a query_embedding, filtrados por metadata.';


-- -------------------------------------------------------------------------------------
-- n8n_chat_histories: la memoria del agente (nodo Postgres Chat Memory)
-- El nodo crea esta tabla si no existe, pero la creamos acá para que nazca con RLS activada.
-- Tiene la forma exacta que espera el nodo: id, session_id y message.
-- -------------------------------------------------------------------------------------
create table if not exists public.n8n_chat_histories (
  id         serial primary key,
  session_id varchar(255) not null,
  message    jsonb not null
);

comment on table public.n8n_chat_histories is
  'Mensajes de cada conversación con el agente del workflow 33. La escribe y la lee el nodo Postgres Chat Memory de n8n.';
comment on column public.n8n_chat_histories.session_id is 'Id de la conversación (sessionId del Chat Trigger).';
comment on column public.n8n_chat_histories.message is 'Un mensaje (de la persona o del agente) en el formato de LangChain.';

create index if not exists n8n_chat_histories_session_idx on public.n8n_chat_histories (session_id, id);


-- =====================================================================================
-- Seguridad por filas (RLS) y permisos
--
-- Postgres revisa dos cosas antes de dejar que alguien toque una tabla:
--   1. Los permisos (grant): si el rol puede hacer esa operación en la tabla.
--   2. Las políticas de RLS: a qué filas se aplica.
-- Con RLS activada y sin políticas, nadie ve ninguna fila, salvo los roles que la saltean.
--
-- Roles de Supabase:
--   anon           pedidos con la clave pública y sin sesión
--   authenticated  pedidos con la clave pública y una sesión iniciada
--   service_role   pedidos con la clave secreta: saltea RLS. Es la que usa n8n.
--   postgres       el dueño de las tablas: es el usuario de la credencial «Postgres» de n8n (workflow 33)
--                  y del SQL Editor. Como dueño, tampoco lo frena RLS.
-- =====================================================================================

alter table public.perfiles           enable row level security;
alter table public.ideas              enable row level security;
alter table public.pagos_fuji         enable row level security;
alter table public.documentos         enable row level security;
alter table public.n8n_chat_histories enable row level security;

-- La clave pública no recibe ningún permiso de entrada: se lo damos tabla por tabla cuando hace falta.
revoke all on table public.perfiles, public.ideas, public.pagos_fuji, public.documentos, public.n8n_chat_histories
  from anon, authenticated;

-- n8n (service_role) lee y escribe todo. En proyectos nuevos estos permisos no siempre vienen
-- dados, y sin ellos la API responde «permission denied» (error 42501) aunque RLS no aplique.
grant select, insert, update, delete
  on table public.perfiles, public.ideas, public.pagos_fuji, public.documentos, public.n8n_chat_histories
  to service_role;
grant usage, select on sequence public.documentos_id_seq, public.n8n_chat_histories_id_seq to service_role;

-- La búsqueda la puede llamar nada más n8n. Corre con los permisos de quien la llama (security invoker),
-- así que aunque alguien la llamara con la clave pública, RLS no le devolvería ningún documento.
revoke execute on function public.match_documents(vector, integer, jsonb) from public, anon, authenticated;
grant execute on function public.match_documents(vector, integer, jsonb) to service_role;

-- Política 1 · perfiles: cada persona con sesión puede leer su propia fila y ninguna otra.
-- Sirve si conectás Clerk a Supabase como proveedor de sesión (Supabase → Authentication →
-- Third-party Auth → Clerk): el token de Clerk llega con «sub» = id de la usuaria = clerk_id.
-- Sin esa conexión, la política no le muestra nada a nadie.
grant select on table public.perfiles to authenticated;
drop policy if exists "Cada persona lee su propio perfil" on public.perfiles;
create policy "Cada persona lee su propio perfil"
  on public.perfiles
  for select
  to authenticated
  using ((select auth.jwt() ->> 'sub') = clerk_id);

-- ideas, pagos_fuji, documentos y n8n_chat_histories no tienen políticas: la clave pública
-- no ve nada y todo pasa por n8n. Si querés mostrar las ideas en una página web con la clave
-- pública (nada más leer, nunca escribir), corré estas tres líneas:
--
--   grant select on table public.ideas to anon, authenticated;
--   drop policy if exists "Cualquiera puede leer las ideas" on public.ideas;
--   create policy "Cualquiera puede leer las ideas" on public.ideas for select to anon, authenticated using (true);
--
-- Pensalo antes: la columna «nombre» queda visible para cualquiera que tenga la URL del proyecto.

-- Fin. Para revisar lo que quedó: Table Editor (las tablas) y Database → Functions (match_documents).
