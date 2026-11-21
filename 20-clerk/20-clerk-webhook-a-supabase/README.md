# De Clerk a Supabase con un webhook

Cada vez que alguien se registra, cambia sus datos o borra su cuenta en tu aplicación de Clerk, Clerk le avisa a n8n con un webhook firmado. n8n comprueba la firma y mantiene al día la tabla `perfiles` de Supabase. Es la mitad del circuito login → n8n → Supabase: la otra mitad es [`21-clerk-api-protegida`](../21-clerk-api-protegida).

| | |
|---|---|
| **Nivel** | intermedio · 20 minutos |
| **Disparador** | Webhook `POST /webhook/clerk-usuarias` |
| **Credenciales** | Supabase API (`supabaseApi`) |
| **Estado** | auditado: pasa el auditor e importa en n8n 2.48.7; para correr necesita tus cuentas de Clerk y Supabase |

## Qué hace

1. **Recibir aviso de Clerk** (Webhook) recibe el `POST` de Clerk con la opción **Raw Body** activada, para tener el cuerpo exacto que se firmó.
2. **Configuración** guarda el **Signing Secret** de tu endpoint y la tolerancia de tiempo (300 segundos).
3. **Verificar firma de Svix** (Code) comprueba la firma. Si no coincide, si falta el secreto o si el aviso es viejo, **Responder 401** contesta con el motivo y no se toca la base.
4. **¿Qué evento llegó?** (Switch) separa `user.created`, `user.updated`, `user.deleted` y cualquier otro evento.
5. Altas y cambios hacen un *upsert*: **Actualizar perfil** intenta cambiar la fila con ese `clerk_id` y, si no existía, **Crear perfil** la inserta. Las bajas pasan por **Borrar perfil**.
6. **Responder 200** le confirma a Clerk que el aviso llegó.

Las columnas que se llenan son las de `perfiles`: `clerk_id`, `email` (el correo principal), `nombre` (nombre y apellido), `avatar_url`, `creado_en` y `actualizado_en`.

## Qué aprendés

- Por qué un webhook público tiene que verificar quién lo llama, y cómo se hace con la firma de Svix que usa Clerk.
- La opción **Raw Body** del Webhook: la firma se calcula sobre el cuerpo byte por byte, así que hay que verificarlo antes de interpretarlo.
- HMAC SHA-256, base64 y comparación en tiempo constante (`crypto.timingSafeEqual`) con `require('crypto')` en el Code node.
- **Respond to Webhook** con códigos distintos según el camino (200 y 401).
- **Switch** con salidas con nombre y una salida para «otro evento».
- Un *upsert* con los nodos de Supabase, para que el resultado sea el mismo aunque Clerk mande un aviso dos veces o fuera de orden.

## Qué necesitás

- **Una aplicación de Clerk.** Si no la tenés, seguí la guía [Tu aplicación en Clerk](https://github.com/nodo-cero-bo/guias/blob/main/00-empezar/05-cuenta-clerk.md).
- **La tabla `perfiles` en Supabase.** Corré [`supabase/sql/00_esquema.sql`](../../supabase/sql/00_esquema.sql) en el SQL Editor de tu proyecto: crea la tabla con `clerk_id` único.
- **Una credencial Supabase API** (`supabaseApi`) en los nodos **Actualizar perfil**, **Crear perfil** y **Borrar perfil**: en Supabase, **Project Settings → API Keys**. La URL del proyecto va en **Host** y una clave secreta (`sb_secret_...`) en **Secret Key**.
- **El Signing Secret del endpoint de Clerk** (`whsec_...`), que vas a pegar en **Configuración** (paso 4 de abajo).

## Cómo importarlo

Elegí una de estas formas:

- **Copiar y pegar:** en la [página del catálogo](https://nodo-cero-bo.github.io) tocá «Copiar workflow» y pegá con Ctrl + V en un workflow vacío de n8n.
- **Import from URL:** en n8n, menú del workflow (los tres puntos) → **Import from URL**, y pegá:

  ```text
  https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/20-clerk/20-clerk-webhook-a-supabase/workflow.json
  ```

- **Import from File:** bajá [`workflow.json`](workflow.json) y elegilo en menú → **Import from File**.

## Cómo probarlo paso a paso

1. Importalo y elegí tu credencial **Supabase API** en los tres nodos de Supabase.
2. Tocá **Publish**. Abrí el nodo **Recibir aviso de Clerk** y copiá la **Production URL** (termina en `/webhook/clerk-usuarias`). Usá esa y no la de test: Clerk llama cuando vos no estás mirando.
3. En el [panel de Clerk](https://dashboard.clerk.com/sign-up), entrá a **Webhooks** → **Add Endpoint**. Pegá la URL en **Endpoint URL** y en **Subscribe to events** marcá `user.created`, `user.updated` y `user.deleted`. Tocá **Create**.
4. En la página del endpoint copiá el **Signing Secret** (el ojito lo muestra). En n8n, abrí **Configuración**, pegalo en `secreto_firma` y publicá de nuevo.
5. En Clerk, pestaña **Testing**: elegí `user.created` y tocá **Send Example**. En **Message Attempts** tiene que aparecer **Succeeded**.
6. En n8n, pestaña **Executions**: vas a ver la ejecución con el camino que siguió. En Supabase, **Table Editor → perfiles**: está la fila del usuario de ejemplo de Clerk.
7. Probá el circuito real: registrate en tu aplicación (por ejemplo con [`clerk/app-ejemplo`](../../clerk/app-ejemplo)), cambiá tu nombre y mirá cómo se actualiza la fila.

> **Cuidá el secreto.** El secreto en **Configuración** viaja con el workflow si lo exportás. Si tu plan de n8n tiene **Variables** (Pro o Enterprise), creá `CLERK_WEBHOOK_SIGNING_SECRET` y en `secreto_firma` poné `{{ $vars.CLERK_WEBHOOK_SIGNING_SECRET }}`. Si no, borrá el secreto antes de compartir el JSON.

### Probarlo sin Clerk: firmá un aviso vos

Para entender la firma, mandá un aviso firmado con tu propio secreto. Guardá esto como `firmar.mjs`, completá la URL y el mismo secreto que pusiste en **Configuración**, y corrélo con `node firmar.mjs` (Node 18 o más nuevo):

```js
// Manda un user.created de prueba firmado como lo firma Clerk (con Svix).
import crypto from 'node:crypto';

const URL = 'https://TU-INSTANCIA.app.n8n.cloud/webhook/clerk-usuarias';
const SECRETO = 'whsec_...'; // el mismo de Configuración

const ahora = Date.now();
const cuerpo = JSON.stringify({
  type: 'user.created',
  object: 'event',
  timestamp: ahora,
  data: {
    id: 'user_prueba_firma',
    first_name: 'Ada',
    last_name: 'Lovelace',
    email_addresses: [{ id: 'idn_1', email_address: 'ada@example.com' }],
    primary_email_address_id: 'idn_1',
    image_url: null,
    created_at: ahora,
    updated_at: ahora,
  },
});
const id = 'msg_prueba_' + ahora;
const timestamp = String(Math.floor(ahora / 1000));
const clave = Buffer.from(SECRETO.split('_')[1], 'base64');
const firma = crypto.createHmac('sha256', clave).update(`${id}.${timestamp}.${cuerpo}`).digest('base64');

const r = await fetch(URL, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'svix-id': id, 'svix-timestamp': timestamp, 'svix-signature': `v1,${firma}` },
  body: cuerpo,
});
console.log(r.status, await r.text()); // 200 {"ok":true,"evento":"user.created","clerk_id":"user_prueba_firma"}
```

Cambiá una letra del secreto o del cuerpo después de firmar y vas a ver el **401** con `"motivo": "la firma no coincide con el Signing Secret"`.

## Cómo lo probamos

En una n8n 2.48.7 local, con el workflow publicado, un secreto `whsec_` generado para la prueba y una imitación local de la API de Supabase (PostgREST) en lugar de un proyecto real:

- Avisos válidos `user.created`, `user.updated` (con la fila ya creada y sin ella) y `user.deleted`: **200**, y en la base quedó lo esperado (crear, actualizar o borrar).
- Un cuerpo con espacios, `ñ` y barras escapadas: **200** (la firma se verificó sobre el cuerpo crudo).
- Dos firmas en `svix-signature`, con la buena en segundo lugar: **200**.
- Firma con otro secreto, cuerpo cambiado después de firmar, `svix-timestamp` de hace 10 minutos y pedido sin encabezados: **401**, cada uno con su motivo.
- Supabase caído: n8n respondió **500**, que es lo que hace que Clerk reintente.

## Si algo falla

| Lo que ves | Qué probar |
|---|---|
| 401 «falta el Signing Secret de Clerk» | Pegá el secreto en **Configuración** → `secreto_firma` (empieza con `whsec_`) y publicá de nuevo. |
| 401 «la firma no coincide» | El secreto es de otro endpoint o quedó incompleto. Copialo otra vez desde la página del endpoint en Clerk. |
| 401 «no llegó el cuerpo crudo» | En el Webhook, **Options → Raw Body** tiene que estar activado. |
| 401 «svix-timestamp está fuera de la tolerancia» | El aviso es viejo (más de 300 segundos). Si tu prueba tarda, subí `tolerancia_segundos` un rato, sin pasarte. |
| 500 `Error in workflow` | Falla Supabase: revisá la credencial y que exista la tabla `perfiles`. Clerk reintenta los avisos que fallaron y con **Replay** podés reenviarlos a mano. |
| En Clerk, **Failed** y en n8n ninguna ejecución | El workflow no está publicado o la URL es la de test (`/webhook-test/`). |

## Ideas para extenderlo

- Guardá el `svix_id` de cada aviso en una tabla y saltá los que ya procesaste (Clerk lo repite en cada reintento).
- Compará `data.updated_at` con lo que ya tenés guardado y descartá avisos que llegan tarde.
- En vez de borrar, marcá la baja con una columna `borrado_en`, para que un aviso viejo no vuelva a crear la fila.
- Mandá un mensaje de bienvenida (Gmail o Telegram) cuando llega un `user.created`.
- Sumá `user.merged` u otros eventos del **Event Catalog** de Clerk.

## Documentación oficial

- Clerk: [Webhooks](https://clerk.com/docs/guides/development/webhooks/overview), [sincronizar datos con webhooks](https://clerk.com/docs/guides/development/webhooks/syncing) y [depurar webhooks](https://clerk.com/docs/guides/development/webhooks/debugging).
- Svix: [verificar la firma a mano](https://docs.svix.com/receiving/verifying-payloads/how-manual) y [calendario de reintentos](https://docs.svix.com/retries).
- n8n: [Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook), [Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook), [Code node](https://docs.n8n.io/build/code-in-n8n/using-the-code-node), [Switch](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch), [Supabase](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.supabase), [credencial de Supabase](https://docs.n8n.io/integrations/builtin/credentials/supabase) y [Variables](https://docs.n8n.io/build/code-in-n8n/define-custom-variables).

---

Licencia MIT, como todo el repo. Clerk, Svix, Supabase y n8n son marcas de sus dueños.
