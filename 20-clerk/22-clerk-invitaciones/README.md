# Invitaciones con Clerk

Un formulario de n8n donde pegás una lista de correos. n8n la limpia y, por cada persona, le pide a la **Backend API** de Clerk que cree una invitación. Clerk le manda a cada una un correo con su enlace para registrarse en tu aplicación, y vos ves un resumen de lo que salió bien y de lo que no.

| | |
|---|---|
| **Nivel** | intermedio · 15 minutos |
| **Disparador** | Formulario de n8n en `/form/clerk-invitaciones` |
| **Credenciales** | Header Auth (`httpHeaderAuth`) con la Secret key de Clerk |
| **Estado** | auditado: pasa el auditor e importa en n8n 2.48.7; para correr necesita tu aplicación de Clerk |

## Qué hace

1. **Formulario de invitaciones** pide los correos (uno por línea, o separados por comas o espacios) y, si querés, la página a la que llegan al aceptar.
2. **Limpiar la lista** (Code) pasa todo a minúscula, saca repetidos y aparta lo que no tiene forma de correo.
3. **¿Hay correos para invitar?** muestra **Página sin correos** si no quedó ninguno.
4. **Un ítem por correo** (Split Out) convierte la lista en un ítem por persona.
5. **Invitar en Clerk** (HTTP Request) hace un `POST https://api.clerk.com/v1/invitations` por ítem, con el cuerpo:

   ```json
   { "email_address": "ada@example.com", "notify": true, "redirect_url": "https://tu-app.com/registro" }
   ```

   `redirect_url` va nada más si lo completaste. La Secret key viaja en `Authorization: Bearer ...` desde la credencial.
6. **Armar resumen** (Code) junta cada respuesta con su correo y **Página final** lo muestra: invitadas, rechazadas con su motivo y descartadas por el formato.

## Qué aprendés

- Llamar a una API con **HTTP Request** y una credencial **Header Auth**, sin escribir la clave en el nodo.
- **Split Out** y cómo n8n corre cada nodo una vez por ítem.
- Las opciones **Include Response Headers and Status** y **Never Error**: el workflow sigue aunque la API rechace un pedido, y podés leer el código (`statusCode`) y el error.
- **Batching**, para no pasarte del límite de pedidos de una API.
- Un formulario de n8n con una **página final** que arma su texto con expresiones.

## Qué necesitás

- **Tu aplicación de Clerk** ([guía](https://github.com/nodo-cero-bo/guias/blob/main/00-empezar/05-cuenta-clerk.md)) y su **Secret key** (`sk_test_...`), en la página **API keys** del panel.
- **Una credencial Header Auth** (`httpHeaderAuth`) en **Invitar en Clerk**:
  - **Name:** `Authorization`
  - **Value:** `Bearer sk_test_...` (la palabra `Bearer`, un espacio y tu Secret key)

La Secret key permite administrar tu aplicación entera: va en esta credencial y en ningún otro lado. Nunca en una página web, una nota, un nodo Code o un commit.

## Cómo importarlo

- **Copiar y pegar:** en la [página del catálogo](https://nodo-cero-bo.github.io) tocá «Copiar workflow» y pegá con Ctrl + V en un workflow vacío de n8n.
- **Import from URL:** menú del workflow (los tres puntos) → **Import from URL**, y pegá:

  ```text
  https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/20-clerk/22-clerk-invitaciones/workflow.json
  ```

- **Import from File:** bajá [`workflow.json`](workflow.json) y elegilo en menú → **Import from File**.

## Cómo probarlo paso a paso

1. Importalo, abrí **Invitar en Clerk** y creá la credencial **Header Auth** como dice arriba.
2. Tocá **Publish**. Abrí **Formulario de invitaciones** y copiá la **Production URL** del formulario.
3. Abrila en el navegador, pegá uno o dos correos tuyos (podés sumar uno repetido y uno mal escrito para ver cómo se limpian) y tocá **Mandar invitaciones**.
4. La página final te dice a quién se invitó. Revisá tu bandeja de entrada: el correo de Clerk trae el enlace para registrarte.
5. En el panel de Clerk, **Users** → **Invitations**: cada invitación aparece como pendiente hasta que la persona se registra.
6. Mandá el mismo correo otra vez: ahora la página final lo muestra como rechazado con **422**, porque ya tenía una invitación pendiente.

Para probarlo sin formulario, en el editor tocá **Execute workflow**: n8n abre el formulario de prueba.

## Cómo lo probamos

En una n8n 2.48.7 local, con el workflow publicado y el formulario enviado por `curl`:

- Contra una imitación local de la Backend API (con el mismo esquema que publica Clerk): tres correos válidos, uno repetido con mayúsculas y uno mal escrito dieron tres invitaciones, y el mal escrito quedó en «Descartados por el formato». Un correo ya invitado volvió con **422** y su motivo en el resumen. Un formulario sin correos válidos mostró **Página sin correos**.
- Contra `https://api.clerk.com/v1/invitations` de verdad, con una clave inventada: Clerk respondió **401** («The provided Clerk Secret Key is invalid») y el resumen lo mostró, sin cortar el workflow.

## Si algo falla

| Lo que ves | Qué probar |
|---|---|
| 401 «The provided Clerk Secret Key is invalid» | En la credencial, **Value** tiene que ser `Bearer ` más la Secret key completa, y **Name** `Authorization`. Revisá que sea la clave de la misma aplicación. |
| 422 con «already pending invitations» o que el correo ya existe | Esa persona ya tenía una invitación o una cuenta. Si querés mandarla igual, sumá `ignore_existing: true` al cuerpo. |
| Clerk rechaza `redirect_url` | Tiene que ser una dirección completa, con `https://`. |
| 429 | Pasaste el límite: Clerk acepta 100 invitaciones por hora en cada aplicación. Esperá y volvé a intentar. |
| No llega el correo | Mirá la carpeta de spam y que la invitación figure en **Users** → **Invitations**. |

## Ideas para extenderlo

- Leé los correos de una planilla de Google Sheets o de una tabla de Supabase en vez del formulario.
- Agregá `public_metadata` (por ejemplo `{ "equipo": "Las Fujinas" }`): cuando la persona se registra, queda en su perfil de Clerk.
- Ajustá `expires_in_days` para que la invitación venza antes que los 30 días de siempre.
- Para que entren nada más las personas invitadas, activá el modo [Invite-only](https://clerk.com/docs/guides/secure/restricting-access) en Clerk.
- Guardá el resumen en Supabase o mandalo por correo a quien organiza.

## Documentación oficial

- Clerk: [invitar usuarias](https://clerk.com/docs/guides/users/inviting), [crear una invitación](https://clerk.com/docs/reference/backend/invitations/create-invitation), [referencia de la Backend API](https://clerk.com/docs/reference/backend-api) y [límites de la API](https://clerk.com/docs/guides/how-clerk-works/system-limits).
- n8n: [Form Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.formtrigger), [Form](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.form), [Split Out](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.splitout), [HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest) y [credenciales de HTTP Request](https://docs.n8n.io/integrations/builtin/credentials/httprequest).

---

Licencia MIT, como todo el repo. Clerk y n8n son marcas de sus dueños.
