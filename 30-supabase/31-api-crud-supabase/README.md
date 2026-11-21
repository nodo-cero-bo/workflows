# 31 · Una API sobre Supabase

Tu propia API REST para la tabla `ideas`, hecha con un Webhook de n8n: una sola URL que lista ideas con `GET` y crea una con `POST`. Valida lo que llega y responde con el código HTTP que corresponde.

```text
                ┌─ GET  → Listar ideas (Supabase · Get Many) → Armar la lista → Responder 200
API de ideas ───┤
                └─ POST → Validar la idea → ¿Datos válidos? ─ sí → Crear la idea (Supabase · Create) → Responder 201
                                                            └ no → Responder 400
```

## Qué aprendés

- A usar **un Webhook con dos métodos** (GET y POST) en la misma URL, con una salida por método.
- A **responder con Respond to Webhook** y elegir el código: 200 (OK), 201 (Created) y 400 (Bad Request).
- A **validar un pedido en el Code node** antes de escribir en la base.
- A traer filas con **Get Many**, con límite y orden.

## Qué necesitás

- Una cuenta de n8n (n8n Cloud o tu propia n8n 2.48.7).
- Un proyecto de Supabase con el esquema de [`supabase/sql/00_esquema.sql`](../../supabase/sql/00_esquema.sql) (y, si querés datos para el GET desde el primer minuto, [`01_datos_de_ejemplo.sql`](../../supabase/sql/01_datos_de_ejemplo.sql)). Paso a paso en [`supabase/README.md`](../../supabase/README.md).
- Una credencial **Supabase API** (`supabaseApi`): **Host** = `https://<tu-proyecto>.supabase.co` (sin `/rest/v1`) y **Secret Key** = una clave secreta `sb_secret_...` de **Project Settings → API Keys**.

> La clave secreta queda del lado de n8n: quien usa tu API nunca la ve. Por eso esta API puede ser pública sin abrir la base: lo único que se puede hacer es lo que el workflow permite.

## Cómo importarlo

1. **Copiar y pegar**: en la [página del evento](https://nodo-cero-bo.github.io), «Copiar workflow», y en n8n pegá con Ctrl + V en un workflow nuevo.
2. **Import from URL**: menú del workflow → **Import from URL** con este enlace:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/30-supabase/31-api-crud-supabase/workflow.json
   ```

3. **Import from File**: bajá [`workflow.json`](workflow.json) y elegí **Import from File**.

## Cómo probarlo

1. Elegí tu credencial de Supabase en **Listar ideas** y en **Crear la idea**.
2. **Publicá** el workflow y abrí **API de ideas**: en **Production URL** está tu URL, algo como `https://<tu-n8n>/webhook/ideas`.
3. Desde una terminal (en Windows, Git Bash o PowerShell con `curl.exe`), cambiá la URL por la tuya:

   ```bash
   # Crear una idea: 201
   curl -X POST "https://<tu-n8n>/webhook/ideas" \
     -H "Content-Type: application/json" \
     -d '{"nombre": "Equipo Ada", "idea": "Un bot que ordena los turnos", "nivel": "inicial"}'

   # Pedido incompleto: 400 con la lista de errores
   curl -X POST "https://<tu-n8n>/webhook/ideas" \
     -H "Content-Type: application/json" \
     -d '{"nombre": "Equipo Ada"}'

   # Listar las 5 más nuevas: 200
   curl "https://<tu-n8n>/webhook/ideas?limite=5"
   ```

4. Respuestas que vas a ver (con estos datos de ejemplo):

   ```json
   {"ok": true, "idea": {"id": 2, "nombre": "Equipo Ada", "idea": "Un bot que ordena los turnos", "nivel": "inicial", "categoria": null, "creado_en": "2026-11-21T14:11:49.977+00:00"}}
   {"ok": false, "errores": ["Falta «idea»."]}
   {"cantidad": 1, "ideas": [ ... ]}
   ```

Mientras armás, podés usar la **Test URL** (`/webhook-test/ideas`) con el workflow sin publicar: tocá **Listen for test event** en **API de ideas** y mandá el pedido.

## Cómo está armado

| Nodo | Qué hace |
|---|---|
| **API de ideas** (Webhook) | **Allow Multiple HTTP Methods** con GET y POST en el path `ideas`. La salida de arriba es GET y la de abajo, POST. **Respond: Using 'Respond to Webhook' Node**. |
| **Listar ideas** (Supabase · Get Many) | **Limit** desde `?limite=` (entre 1 y 100, 20 si no viene) y **Order By** `creado_en.desc`. Tiene **Always Output Data** para responder aunque la tabla esté vacía. |
| **Armar la lista** (Code) | Junta las filas en `{ cantidad, ideas }`. |
| **Validar la idea** (Code) | Revisa `nombre`, `idea` y `nivel` (si no viene, queda `inicial`) y arma la lista de errores. |
| **¿Datos válidos?** (IF) | Sigue a **Crear la idea** o a **Responder 400**. |
| **Crear la idea** (Supabase · Create) | Escribe la fila y devuelve cómo quedó, con su `id`. |

## Ideas para extenderlo

- Sumá `PATCH` y `DELETE` con otro método en el mismo Webhook y las operaciones **Update** y **Delete** del nodo Supabase, filtrando por `id`.
- Filtrá el GET por nivel (`?nivel=inicial`): en **Listar ideas**, **Filter** en **Build Manually** y una condición `nivel` `Equals` `{{ $json.query.nivel }}`. Con un IF antes, aplicalo nada más cuando el parámetro viene.
- Protegé el POST con **Authentication: Header Auth** en el Webhook, como en el [workflow 34](../34-supabase-webhook-ia).
- Llamá a tu API desde una página web con `fetch` y mostrá las ideas en tarjetas.

## Documentación oficial

- [Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/) y [Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/)
- [Code node](https://docs.n8n.io/build/code-in-n8n/using-the-code-node)
- [Nodo Supabase](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.supabase/) y [credencial Supabase](https://docs.n8n.io/integrations/builtin/credentials/supabase/)
- [Cómo se escriben filtros y orden en la API de Supabase](https://supabase.com/docs/guides/api/sql-to-rest)
- [Importar y exportar workflows en n8n](https://docs.n8n.io/build/manage-workflows/export-and-import)

---

Licencia MIT. n8n y Supabase son marcas de sus dueños.
