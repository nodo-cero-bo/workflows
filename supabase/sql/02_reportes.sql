-- =====================================================================================
-- Nodo Cero · tabla «reportes» para el workflow 67 (reportes ambientales ciudadanos)
--
-- Qué crea:
--   reportes         cada reporte que llega por el formulario del workflow 67, con la
--                    categoría y la urgencia que le pone la IA
--   reportes-fotos   un bucket PRIVADO de Supabase Storage para las fotos de los reportes
--
-- Cómo se corre: copiá todo este archivo en el SQL Editor de tu proyecto de Supabase y tocá Run.
-- Se puede correr las veces que quieras: si algo ya existe, lo deja como está (es idempotente).
-- No necesita el esquema 00_esquema.sql, pero tampoco choca con él.
--
-- Seguridad, en corto (lo mismo que en 00_esquema.sql):
--   - La tabla tiene la seguridad por filas (RLS) activada y ninguna política: con la clave
--     pública (sb_publishable_..., o la anon de antes) no se puede leer ni escribir nada.
--   - n8n entra con la clave secreta (sb_secret_..., o la service_role de antes), que usa el rol
--     service_role y SALTEA RLS: guarda los reportes y sube las fotos. Esa clave va nada más en
--     la credencial «Supabase API» de n8n: nunca en una página web, en una app ni en un repo.
--   - Las fotos van a un bucket privado: no tienen enlace público. Las ves en Storage, en el panel
--     de Supabase. Una foto de la calle puede mostrar caras, patentes o casas: por eso no se publica.
-- =====================================================================================


-- -------------------------------------------------------------------------------------
-- reportes: lo que manda la gente por el formulario del workflow 67
-- -------------------------------------------------------------------------------------
create table if not exists public.reportes (
  id          bigint generated always as identity primary key,
  descripcion text not null check (char_length(descripcion) between 5 and 2000),
  lugar       text not null check (char_length(lugar) between 2 and 300),
  categoria   text not null default 'otro'
              check (categoria in ('basura', 'quema', 'agua', 'arboles', 'animales', 'ruido', 'otro')),
  urgencia    text not null default 'media' check (urgencia in ('alta', 'media', 'baja')),
  resumen     text check (char_length(resumen) <= 500),
  foto_ruta   text check (char_length(foto_ruta) <= 300),
  estado      text not null default 'nuevo' check (estado in ('nuevo', 'en_revision', 'resuelto', 'descartado')),
  origen      text not null default 'formulario' check (char_length(origen) <= 40),
  creado_en   timestamptz not null default now()
);

comment on table public.reportes is
  'Reportes ambientales ciudadanos. Llegan por el formulario del workflow 67; la IA completa categoria, urgencia y resumen.';
comment on column public.reportes.descripcion is 'Qué pasa, con las palabras de quien reporta (de 5 a 2000 caracteres).';
comment on column public.reportes.lugar is 'Dónde: barrio, calle o una referencia (de 2 a 300 caracteres). No es una dirección exacta.';
comment on column public.reportes.categoria is
  'La elige la IA: basura, quema, agua, arboles, animales, ruido u otro.';
comment on column public.reportes.urgencia is 'La elige la IA: alta (riesgo para personas, fuego, inundación), media o baja.';
comment on column public.reportes.resumen is 'Una frase corta escrita por la IA para leer el reporte de un vistazo.';
comment on column public.reportes.foto_ruta is
  'Dónde quedó la foto dentro del bucket reportes-fotos (por ejemplo 2026-11-21/abc123.jpg). Vacía si no mandaron foto.';
comment on column public.reportes.estado is 'Para el equipo que atiende: nuevo, en_revision, resuelto o descartado.';
comment on column public.reportes.origen is 'De dónde vino: formulario, o prueba si llegó por «Al tocar Execute», el disparador de prueba del workflow 67.';
comment on column public.reportes.creado_en is 'Cuándo llegó el reporte.';

create index if not exists reportes_creado_en_idx on public.reportes (creado_en desc);
create index if not exists reportes_categoria_urgencia_idx on public.reportes (categoria, urgencia);
create index if not exists reportes_estado_idx on public.reportes (estado);


-- -------------------------------------------------------------------------------------
-- reportes-fotos: bucket privado de Storage (public = false), de hasta 5 MB por foto
-- y nada más imágenes JPG, PNG o WEBP. Si ya existe, no se toca.
-- -------------------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('reportes-fotos', 'reportes-fotos', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;


-- =====================================================================================
-- Permisos y seguridad por filas (RLS)
--
-- Postgres revisa dos cosas antes de que alguien toque una tabla:
--   1. los permisos (grant): si ese rol puede hacer esa operación en la tabla;
--   2. las políticas de RLS: a qué filas se aplica. Con RLS activada y sin políticas, ninguna.
--
-- Roles de Supabase:
--   anon           pedidos con la clave pública y sin sesión
--   authenticated  pedidos con la clave pública y una sesión iniciada
--   service_role   pedidos con la clave secreta: saltea RLS. Es la que usa n8n.
-- =====================================================================================

alter table public.reportes enable row level security;

-- La clave pública no recibe ningún permiso.
revoke all on table public.reportes from anon, authenticated;

-- n8n (service_role) lee y escribe. En proyectos nuevos estos permisos no siempre vienen dados,
-- y sin ellos la API responde «permission denied» (error 42501) aunque RLS no aplique.
grant select, insert, update, delete on table public.reportes to service_role;
grant usage, select on sequence public.reportes_id_seq to service_role;

-- Storage: la tabla storage.objects ya viene con RLS activada en Supabase. No sumamos políticas,
-- así que con la clave pública nadie puede subir, listar ni bajar fotos de reportes-fotos;
-- n8n sube con la clave secreta, que saltea RLS.

-- ¿Querés mostrar los reportes en un mapa o en una página con la clave pública (nada más leer)?
-- Mostrá lo mínimo: sin la descripción ni la foto, que pueden traer datos de personas. Por ejemplo:
--
--   create or replace view public.reportes_publicos with (security_invoker = true) as
--     select id, categoria, urgencia, lugar, estado, creado_en from public.reportes;
--   grant select on public.reportes_publicos to anon, authenticated;
--   grant select (id, categoria, urgencia, lugar, estado, creado_en) on public.reportes to anon, authenticated;
--   drop policy if exists "Cualquiera ve los reportes sin datos sensibles" on public.reportes;
--   create policy "Cualquiera ve los reportes sin datos sensibles"
--     on public.reportes for select to anon, authenticated using (estado <> 'descartado');
--
-- Pensalo antes: «lugar» queda a la vista de cualquiera que tenga la URL del proyecto.

-- Fin. Para revisar lo que quedó: Table Editor → reportes, y Storage → reportes-fotos.
