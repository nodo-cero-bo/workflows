# Una API protegida con Clerk

Una API de n8n (`GET /webhook/mi-perfil`) que exige la sesión de Clerk. Tu página manda el token de sesión en `Authorization: Bearer <token>`; n8n verifica que lo firmó tu aplicación de Clerk, que no venció y que salió de tu página, y devuelve el perfil de esa persona desde Supabase. Sin una sesión válida responde **401**. Con [`clerk/app-ejemplo`](../../clerk/app-ejemplo) tenés el circuito completo: login → n8n → Supabase.

| | |
|---|---|
| **Nivel** | avanzado · 25 minutos |
| **Disparador** | Webhook `GET /webhook/mi-perfil` |
| **Credenciales** | JWT Auth (`jwtAuth`) con la clave pública de Clerk · Supabase API (`supabaseApi`) |
| **Estado** | auditado: pasa el auditor e importa en n8n 2.48.7; para correr necesita tus cuentas de Clerk y Supabase |

## Qué hace

1. **Pedido a /mi-perfil** (Webhook `GET`) recibe el pedido. Su opción **Allowed Origins (CORS)** dice desde qué páginas el navegador puede llamarlo.
2. **Leer el pedido** saca el token del encabezado `Authorization: Bearer ...` y guarda `origenes_permitidos`, la lista de páginas que aceptás.
3. **Verificar sesión de Clerk** (nodo JWT, operación **Verify**, algoritmo **RS256**) comprueba la firma con la clave pública de Clerk y las fechas `exp` y `nbf`, con 5 segundos de tolerancia.
4. **¿Sesión válida?** y **¿Viene de tu página?** mandan al **401** si el token no pasó o si su `azp` (la página que lo pidió) no está en `origenes_permitidos`.
5. **Buscar perfil** (Supabase) trae la fila de `perfiles` con `clerk_id` igual al `sub` del token, el id de la persona en Clerk.
6. **¿Tiene perfil?** responde **200** con el perfil o **404** si todavía no hay fila (el [workflow 20](../20-clerk-webhook-a-supabase) es el que la crea).

Respuesta con sesión:

```json
{
  "ok": true,
  "perfil": { "clerk_id": "user_...", "email": "ada@example.com", "nombre": "Ada Lovelace", "avatar_url": "https://img.clerk.com/...", "creado_en": "...", "actualizado_en": "..." },
  "sesion": { "sub": "user_...", "vence": "2026-11-21T15:01:00.000Z" }
}
```

## Qué aprendés

- Qué es un token de sesión de Clerk (un JWT) y qué traen sus datos: `sub`, `azp`, `exp`, `nbf`, `sid`.
- Verificar un JWT RS256 con el nodo **JWT** y una credencial **JWT Auth** con clave PEM, fijando el algoritmo para que nadie pueda mandar un token firmado de otra forma.
- La opción **On Error: Continue** de un nodo, para decidir vos qué pasa cuando falla.
- CORS: el pedido previo `OPTIONS` del navegador y la opción **Allowed Origins (CORS)** del Webhook.
- Responder 200, 401 o 404 con **Respond to Webhook**.

## Qué necesitás

- **Tu aplicación de Clerk** ([guía](https://github.com/nodo-cero-bo/guias/blob/main/00-empezar/05-cuenta-clerk.md)).
- **Una credencial JWT Auth** (`jwtAuth`) en **Verificar sesión de Clerk**:
  1. En el panel de Clerk, página **API keys**, copiá la **JWKS Public Key** en formato PEM, con las líneas `-----BEGIN PUBLIC KEY-----` y `-----END PUBLIC KEY-----`.
  2. En n8n, creá la credencial **JWT Auth**: **Key Type** `PEM Key`, pegá la clave en **Public Key**, dejá **Private Key** vacía y elegí **Algorithm** `RS256`.
  3. La clave pública no es secreta: sirve para verificar, no para firmar.
- **Una credencial Supabase API** (`supabaseApi`) en **Buscar perfil**: en Supabase, **Project Settings → API Keys**, la URL del proyecto va en **Host** y una clave secreta (`sb_secret_...`) en **Secret Key**.
- **La tabla `perfiles`** ([`supabase/sql/00_esquema.sql`](../../supabase/sql/00_esquema.sql)) con al menos una fila: la llena el workflow 20.

## Cómo importarlo

- **Copiar y pegar:** en la [página del catálogo](https://nodo-cero-bo.github.io) tocá «Copiar workflow» y pegá con Ctrl + V en un workflow vacío de n8n.
- **Import from URL:** menú del workflow (los tres puntos) → **Import from URL**, y pegá:

  ```text
  https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/20-clerk/21-clerk-api-protegida/workflow.json
  ```

- **Import from File:** bajá [`workflow.json`](workflow.json) y elegilo en menú → **Import from File**.

## Cómo probarlo paso a paso

1. Importalo y elegí tus credenciales en **Verificar sesión de Clerk** (JWT Auth) y **Buscar perfil** (Supabase API).
2. Decidí desde qué dirección vas a abrir tu página. Con la app de ejemplo es `http://localhost:5500`, que ya viene puesta en dos lugares:
   - **Pedido a /mi-perfil** → **Options** → **Allowed Origins (CORS)**;
   - **Leer el pedido** → `origenes_permitidos`.
   Si usás otra, cambiala en los dos, sin barra al final. Varias van separadas por comas y sin espacios: `http://localhost:5500,https://mi-app.com`.
3. Tocá **Publish** y copiá la **Production URL** del Webhook (termina en `/webhook/mi-perfil`).
4. Seguí el [README de la app de ejemplo](../../clerk/app-ejemplo): pegás esa URL y tu Publishable Key, abrís la página, iniciás sesión y tocás **Ver mi perfil**.
5. Mirá los tres casos:
   - con sesión y con fila en `perfiles`: **200** y tu perfil;
   - con sesión y sin fila: **404** (publicá el workflow 20 y volvé a registrarte o mandá un `user.created` de prueba);
   - con **Probar sin token**: **401**.

Sin navegador, con un token real: en la página de ejemplo con la sesión iniciada, abrí la consola del navegador (F12) y escribí `await Clerk.session.getToken()`. Copiá el texto y, en menos de un minuto (el token vence rápido):

```bash
curl -H "Authorization: Bearer <token>" https://TU-INSTANCIA.app.n8n.cloud/webhook/mi-perfil
```

Si lo llamás desde la terminal, el token puede traer un `azp` (la dirección de tu página): eso está bien, n8n lo compara con `origenes_permitidos`.

## Cómo lo probamos

En una n8n 2.48.7 local, con el workflow publicado, un par de claves RSA generado para la prueba (la pública en una credencial JWT Auth) y una imitación local de la API de Supabase:

- Token válido con perfil: **200** con el perfil. Token válido sin fila: **404**. Token sin `azp`: **200**.
- Token vencido, con `nbf` en el futuro, firmado con otra clave, firmado con HS256 usando la clave pública como secreto, con `azp` de otra página, roto o ausente: **401** con su motivo.
- Pedido previo `OPTIONS` desde `http://localhost:5500`: **204** con `Access-Control-Allow-Origin: http://localhost:5500` y `Access-Control-Allow-Headers: authorization`. Las respuestas 200, 401 y 404 también traen el encabezado de CORS.

## Si algo falla

| Lo que ves | Qué probar |
|---|---|
| 401 con una sesión recién iniciada | La clave PEM quedó incompleta (faltan las líneas BEGIN y END) o es de otra aplicación de Clerk (las de desarrollo y producción son distintas). Copiala de nuevo. |
| 401 «el token no salió de una página permitida (azp: ...)» | Sumá esa dirección exacta a `origenes_permitidos` en **Leer el pedido**. |
| 401 al llamar con curl un token copiado | Venció: los tokens de Clerk duran un minuto. Pedí uno nuevo. |
| 404 «todavía no hay un perfil» | La sesión está bien, falta la fila: revisá el workflow 20 y el webhook de Clerk. |
| El navegador dice `CORS` o `Failed to fetch` | **Allowed Origins (CORS)** del Webhook no incluye la dirección de tu página, o el workflow no está publicado. |
| `Problem in node 'Buscar perfil'` | Revisá la credencial de Supabase y que exista la tabla `perfiles`. |

## Ideas para extenderlo

- Sumá un `POST /mi-perfil` para que cada persona edite su nombre, con la misma verificación.
- Usá `sub` para traer lo que es de esa persona en otras tablas, por ejemplo sus ideas o sus pagos en Fuji (como el workflow `41-pagos-fuji-con-login`).
- Rechazá sesiones con `sts: "pending"` si tu aplicación usa organizaciones obligatorias.
- Agregá datos propios al token con [plantillas de sesión](https://clerk.com/docs/guides/sessions/customize-session-tokens) y leelos en n8n sin ir a la base.

## Documentación oficial

- Clerk: [verificar el token a mano](https://clerk.com/docs/guides/sessions/manual-jwt-verification), [tokens de sesión](https://clerk.com/docs/guides/sessions/session-tokens) y [`getToken()`](https://clerk.com/docs/js-frontend/reference/objects/session).
- n8n: [JWT](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.jwt), [credencial JWT](https://docs.n8n.io/integrations/builtin/credentials/jwt), [Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook), [Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook), [Supabase](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.supabase) y [opciones de cada nodo, como On Error](https://docs.n8n.io/build/understand-workflows/workflow-components/work-with-nodes).

---

Licencia MIT, como todo el repo. Clerk, Supabase y n8n son marcas de sus dueños.
