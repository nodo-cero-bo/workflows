# 30 · Formulario a Supabase

Un formulario de n8n para que cualquiera mande su idea de proyecto. Cada respuesta queda guardada como una fila nueva en la tabla `ideas` de tu Supabase, y la persona ve una página de gracias con el número de su idea.

```text
Formulario de ideas  →  Guardar la idea (Supabase · Create)  →  Página de gracias
```

## Qué aprendés

- A armar un **Form Trigger** con campos de texto, área de texto y lista desplegable, y a nombrar cada campo con **Field Name** para usarlo después (`{{ $json.nombre }}`).
- A **crear filas en Supabase** con el nodo Supabase, mapeando cada campo a su columna.
- A mostrar una **página final** con datos que devolvió la base (el `id` de la fila).
- Qué hace la **clave secreta** de Supabase y por qué nunca se comparte.

## Qué necesitás

- Una cuenta de n8n (n8n Cloud o tu propia n8n 2.48.7).
- Un proyecto de Supabase (el plan gratis alcanza) con el esquema de [`supabase/sql/00_esquema.sql`](../../supabase/sql/00_esquema.sql) corrido en el **SQL Editor**. Paso a paso en [`supabase/README.md`](../../supabase/README.md).
- Una credencial **Supabase API** (`supabaseApi`) en n8n:
  - **Host**: la URL del proyecto, `https://<tu-proyecto>.supabase.co`, sin `/rest/v1` al final.
  - **Secret Key**: una clave secreta `sb_secret_...` de **Project Settings → API Keys** (la `service_role` de antes también funciona).

> La clave secreta saltea la seguridad por filas (RLS) de Supabase: con ella se lee y se escribe todo. Guardala nada más en la credencial de n8n. Nunca la pongas en una página web, en una app ni en un repo.

## Cómo importarlo

Elegí una de estas formas:

1. **Copiar y pegar**: en la [página del evento](https://nodo-cero-bo.github.io), tocá «Copiar workflow» en la tarjeta. En n8n, abrí un workflow nuevo, hacé clic en el canvas y pegá con Ctrl + V.
2. **Import from URL**: en n8n, menú del workflow (los tres puntos) → **Import from URL**, y pegá este enlace:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/30-supabase/30-formulario-a-supabase/workflow.json
   ```

3. **Import from File**: bajá [`workflow.json`](workflow.json) y en n8n elegí **Import from File**.

## Cómo probarlo

1. Corré el esquema en Supabase, si todavía no lo hiciste.
2. Abrí el nodo **Guardar la idea** y, en **Credential to connect with**, creá o elegí tu credencial **Supabase API**.
3. Tocá **Execute**: n8n abre el formulario de prueba en una pestaña nueva. Completalo y tocá **Enviar idea**.
4. Vas a ver «Gracias, tu idea quedó guardada» con el número de tu idea.
5. En Supabase, abrí **Table Editor → ideas**: ahí está la fila, con `id`, `creado_en` y `categoria` vacía.
6. Para compartirlo: **publicá** el workflow (botón **Publish**) y abrí **Formulario de ideas** para copiar la **Production URL**. Esa es la que mandás a otras personas.

Si además armaste el [workflow 34](../34-supabase-webhook-ia), cada idea nueva se clasifica con IA y la columna `categoria` se completa sola en unos segundos.

## Cómo está armado

| Nodo | Qué hace |
|---|---|
| **Formulario de ideas** (Form Trigger) | Publica el formulario en `/form/nodo-cero-ideas`. Tiene **Respond When: Workflow Finishes**, así la persona espera a que se guarde la fila. |
| **Guardar la idea** (Supabase · Create) | Escribe `nombre`, `idea` y `nivel` en la tabla `ideas`. `.trim()` saca espacios de más. Devuelve la fila guardada. |
| **Página de gracias** (Form · Completion) | Muestra el mensaje final con el `id` y el nombre. |

La tabla `ideas` tiene sus propias reglas (`check`): el nombre va de 1 a 120 caracteres, la idea de 1 a 2000 y el nivel tiene que ser inicial, intermedio o avanzado. Si algo no cumple, Supabase rechaza la fila y la ejecución muestra el error.

## Ideas para extenderlo

- Sumá un campo de correo (tipo `email`) y una columna en la tabla, y mandá una confirmación.
- Agregá un nodo **IF** antes de guardar para rechazar ideas muy cortas, con una página final distinta.
- Usá el [workflow 31](../31-api-crud-supabase) para mostrar las ideas en una página propia.
- Cambiá el estilo del formulario con **Options → Custom Form Styling** para que tenga los colores de tu proyecto.

## Documentación oficial

- [n8n Form Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.formtrigger/) y [n8n Form](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.form/)
- [Nodo Supabase](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.supabase/) y [credencial Supabase](https://docs.n8n.io/integrations/builtin/credentials/supabase/)
- [Claves de API de Supabase](https://supabase.com/docs/guides/getting-started/api-keys)
- [Seguridad por filas (RLS) en Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Importar y exportar workflows en n8n](https://docs.n8n.io/build/manage-workflows/export-and-import)

---

Licencia MIT. n8n y Supabase son marcas de sus dueños.
