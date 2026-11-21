-- =====================================================================================
-- Nodo Cero · datos de ejemplo (opcional)
--
-- Carga tres ideas para que el GET del workflow 31 devuelva algo desde el primer minuto.
-- Corré primero 00_esquema.sql. Se puede correr varias veces: no repite las filas.
-- Si ya creaste el Database Webhook del workflow 34, estas filas también se clasifican con IA.
-- =====================================================================================

insert into public.ideas (nombre, idea, nivel, categoria)
select v.nombre, v.idea, v.nivel, v.categoria
from (
  values
    ('Equipo de ejemplo 1', 'Un asistente que responde las preguntas frecuentes de una biblioteca con sus propios documentos.', 'intermedio', 'ia'),
    ('Equipo de ejemplo 2', 'Registrar en Avalanche Fuji la asistencia a un taller y mostrar quién lo terminó.', 'avanzado', 'web3'),
    ('Equipo de ejemplo 3', 'Un formulario que ordena los pedidos de un emprendimiento y avisa cuando falta stock.', 'inicial', 'automatizacion')
) as v (nombre, idea, nivel, categoria)
where not exists (
  select 1 from public.ideas i where i.nombre = v.nombre and i.idea = v.idea
);
