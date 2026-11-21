# Verificar un pago en Fuji

Una API que confirma un pago en Avalanche Fuji: le mandás el hash, tu dirección y el monto mínimo, y n8n revisa en la red que la transacción haya salido bien, que haya ido a tu dirección, que el monto alcance y que tenga las confirmaciones pedidas. Responde `verificado: true` o te dice por qué no. Opcional: registra cada pago verificado en Supabase.

| | |
|---|---|
| **Nivel** | intermedio · 20 minutos |
| **Credenciales** | ninguna para verificar; **Supabase API** (`supabaseApi`) para la rama opcional que registra |
| **Probado** | ejecutado en n8n 2.48.7 contra Fuji en vivo: la prueba manual y la API publicada con curl, en cada regla (pago válido, monto bajo, otro destino, confirmaciones, hash inexistente, transacción fallida, pedido incompleto y RPC caído). La rama de Supabase se probó activada contra una API local con el formato de Supabase y la tabla del SQL del repo ([pruebas](../../docs/PRUEBAS.md)) |

> **Avalanche Fuji, a mano:** [Descargá Core Wallet](https://core.app/download?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) y activá el modo testnet ([cómo](https://support.core.app/en/articles/13052998-core-extension-how-do-i-toggle-testnet-on-and-off)) · [Pedí AVAX de prueba en el faucet](https://build.avax.network/console/primary-network/faucet?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Aprendé en Avalanche Academy](https://build.avax.network/academy?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Sumate a Team1 LATAM](https://www.team1.network/?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026#waitlist) · [Explorá tus transacciones](https://build.avax.network/explorer/fuji/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026)

## Qué hace

```text
POST /webhook/fuji-verificar-pago
{ "txHash": "0x...", "destino": "0x...", "montoMinimo": "0.5", "confirmacionesMinimas": 1 }
```

| Campo | Qué es |
|---|---|
| `txHash` | El hash de la transacción del pago (`0x` y 64 caracteres). Se guarda en minúsculas, así un mismo pago no se registra dos veces. |
| `destino` | Tu dirección, la que tenía que recibir el pago. Da igual si viene con mayúsculas. |
| `montoMinimo` | El mínimo **en AVAX**, como texto o número: `"0.5"` o `0.5`. Hasta 18 decimales. |
| `confirmacionesMinimas` | Opcional, 1 si no lo mandás. |

El recorrido:

1. **Revisar el pedido** mira el formato de cada campo antes de gastar llamadas al RPC y pasa `montoMinimo` a wei con texto y `BigInt` (con los decimales de JavaScript, `0.1 + 0.2` no da `0.3`). Si falta algo, **Responder: pedido incompleto** devuelve 400 con la lista de errores.
2. **Leer la transacción**, **Leer el recibo** y **Leer el último bloque**, como en el [12](../12-fuji-leer-transaccion). Tienen **On Error: Continue**: si el RPC falla o limita los pedidos, la API responde igual (502, `regla: "rpc"`) en vez de dejar a quien llama esperando.
3. **Verificar el pago** aplica las reglas en orden y responde con la primera que no se cumple:

| Orden | Regla | `detalle.regla` si falla |
|---|---|---|
| 0 | El RPC respondió | `rpc` |
| 1 | La transacción existe en Fuji | `existe` |
| 2 | Ya entró en un bloque | `confirmaciones` |
| 3 | Salió bien (estado `0x1`) | `estado` |
| 4 | `to` es tu dirección (las dos en minúsculas) | `destino` |
| 5 | `value` ≥ mínimo, en wei y con `BigInt` | `monto` |
| 6 | Confirmaciones ≥ las pedidas | `confirmaciones` |

4. **Responder con el resultado** devuelve `{ verificado, motivo, detalle }`.
5. **Opcional, desactivado:** **¿Registrar el pago?** y **Registrar en pagos_fuji** guardan cada pago verificado en Supabase.

## Qué aprendés

- Una API que valida lo que recibe y responde 400 cuando falta algo.
- Reglas de verificación en orden, cada una con su motivo: lo que hace confiable a un verificador.
- Comparar montos en wei con `BigInt` y direcciones en minúsculas.
- Que un HTTP Request siga aunque falle (**Settings → On Error: Continue**).
- Dejar una rama lista pero desactivada, y activarla cuando tengas la cuenta.

## Qué necesitás

- Para verificar: nada más que tu n8n. Para probar con un pago tuyo, Core Wallet en Fuji con AVAX de prueba.
- Para registrar (opcional): un proyecto de Supabase con la tabla `pagos_fuji` del [SQL del repo](../../supabase/sql) y una credencial **Supabase API** (`supabaseApi`): en Supabase, **Project Settings → API Keys**. En n8n, **Host** es la URL del proyecto (`https://<id>.supabase.co`) y **Secret Key**, la clave secreta (`sb_secret_...`; la `service_role` de antes también sirve). Esa clave va nada más en la credencial de n8n.

## Cómo importarlo

1. **Copiar y pegar:** abrí [`workflow.json`](workflow.json), copialo con «Copy raw file» y pegalo con Ctrl + V en un workflow nuevo. En la [página del evento](https://nodo-cero-bo.github.io) está el botón «Copiar workflow».
2. **Import from URL:** menú del workflow (los tres puntos) → **Import from URL**:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/10-avalanche-fuji/13-fuji-verificar-pago/workflow.json
   ```

3. **Import from File:** bajá el archivo y usá **Import from File**.

Al importarlo, n8n no te pide nada: el nodo de Supabase está desactivado.

## Cómo probarlo

**1. Sin publicar.** **Execute workflow** verifica el pago de **Pedido de prueba** (una transacción real de 0.5 AVAX): abrí **Verificar el pago** y tiene que decir `verificado: true`. Después rompelo de a una cosa por vez, editando el JSON de **Pedido de prueba**:

| Cambiá | Tiene que responder |
|---|---|
| `"montoMinimo": "1"` | `regla: "monto"`: el monto (0.5 AVAX) es menor que el mínimo |
| `destino` por otra dirección | `regla: "destino"`: el pago fue a otra dirección |
| `"confirmacionesMinimas": 100000000` | `regla: "confirmaciones"` |
| una letra del hash | `regla: "existe"`: no hay ninguna transacción con ese hash |
| `txHash` por `0x27424800d38c80f6342568475080b27d7eeb749363d50f79b7b0c05ed4caf9f3` (una transacción real que falló) | `regla: "estado"`: existe, pero falló |
| `"txHash": "0x12"` | `regla: "pedido"` y la lista de errores |

**2. La API.** Hacé **Publish**, copiá la **Production URL** de **Recibir el pago a verificar** y mandale un POST:

```bash
curl -X POST "https://<tu-n8n>/webhook/fuji-verificar-pago" \
  -H "Content-Type: application/json" \
  -d '{"txHash":"0xe3f00c7d004c3219b867f2349e528be962712ea328b9e7007b233b58af655150","destino":"0x74e3ce84499e0fe6c951878e48f610d61d24a520","montoMinimo":"0.5","confirmacionesMinimas":3}'
```

**3. Con un pago tuyo.** Mandá AVAX de prueba desde Core a una dirección de tu equipo (la «tienda»), copiá el hash y verificalo con esa dirección como `destino`.

## Qué devuelve

Un pago verificado (HTTP 200), en una llamada real del 21 de noviembre de 2026:

```json
{
  "verificado": true,
  "motivo": "Pago verificado: 0.5 AVAX a 0x74e3ce84499e0fe6c951878e48f610d61d24a520, con 1268 confirmaciones.",
  "detalle": {
    "regla": "ninguna",
    "hash": "0xe3f00c7d004c3219b867f2349e528be962712ea328b9e7007b233b58af655150",
    "pedido": { "destino": "0x74e3ce84499e0fe6c951878e48f610d61d24a520", "montoMinimo": "0.5", "confirmacionesMinimas": 3 },
    "explorador": "https://build.avax.network/explorer/fuji/c-chain/tx/0xe3f00c7d004c3219b867f2349e528be962712ea328b9e7007b233b58af655150",
    "de": "0xd2717e58381adbce9a5422dcd3003f490253da40",
    "para": "0x74e3ce84499e0fe6c951878e48f610d61d24a520",
    "montoAVAX": "0.5",
    "montoWei": "500000000000000000",
    "bloque": 61411475,
    "confirmaciones": 1268,
    "estado": "exitosa"
  }
}
```

Un pago que no alcanza (HTTP 200, `verificado: false`):

```json
{
  "verificado": false,
  "motivo": "El monto (0.5 AVAX) es menor que el mínimo pedido (1 AVAX).",
  "detalle": { "regla": "monto", "montoAVAX": "0.5", "pedido": { "montoMinimo": "1" } }
}
```

Los códigos HTTP: 200 cuando pudo verificar (con `verificado` en `true` o `false`), 400 si el pedido está incompleto y 502 si el RPC de Fuji no respondió.

## Activar el registro en Supabase

1. En Supabase, corré [`supabase/sql/00_esquema.sql`](../../supabase/sql) en el **SQL Editor**: crea `pagos_fuji` con `tx_hash` (única), `desde`, `hacia`, `monto_avax`, `monto_wei`, `bloque`, `verificado` y `creado_en`.
2. En n8n, abrí **Registrar en pagos_fuji** y creá la credencial **Supabase API** con Host y Secret Key.
3. Seleccioná el nodo y apretá **D** (o clic derecho → **Activate**). Guardá y publicá de nuevo.

Como `tx_hash` es única, un mismo pago no se registra dos veces: el segundo intento falla con «duplicate key value violates unique constraint» (la respuesta a quien llama sale igual, porque se manda antes). Si querés rechazarlo en la respuesta, buscá el hash en la tabla antes de verificar, con una operación **Get Many** del nodo Supabase.

## Ideas para extenderlo

- **Con login:** que nada más una persona con sesión pueda registrar su pago: es [`41-pagos-fuji-con-login`](../../40-proyectos/41-pagos-fuji-con-login), con Clerk.
- **Formulario de pago:** un formulario de n8n donde la persona pega su hash y ve si su pago se verificó.
- **Pagos con tokens:** para cobrar en USDC, verificá el evento `Transfer` del token en el recibo (`logs`): mirá cómo se decodifica en [`16-fuji-eventos-contrato`](../16-fuji-eventos-contrato).
- **Aviso al equipo:** cuando `verificado` es `true`, mandá un mensaje por Telegram o Gmail (mirá la nota de [`14-fuji-monitor-wallet`](../14-fuji-monitor-wallet)).

## Documentación

- n8n: [Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook), [Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook), [If](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if), [HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest), [ajustes de cada nodo](https://docs.n8n.io/build/understand-workflows/workflow-components/work-with-nodes) (On Error), [Supabase](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.supabase) y su [credencial](https://docs.n8n.io/integrations/builtin/credentials/supabase).
- Avalanche: [C-Chain RPC](https://build.avax.network/docs/rpcs/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026).
- La guía de proyecto [Pagos verificables en Fuji](https://github.com/nodo-cero-bo/guias/blob/main/proyectos/03-pagos-verificables-en-fuji.md), con la idea completa y cómo presentarla.

---

Licencia MIT, como todo el repo. Avalanche, Core, Team1 y Supabase son marcas de sus dueños.
