# Monitor de una wallet en Fuji

Cada 5 minutos, n8n lee el saldo de una dirección de Avalanche Fuji, lo compara con el de la vuelta anterior y, si cambió, arma un mensaje de aviso: cuánto entró o salió y el saldo nuevo. Le conectás Telegram o Gmail y te llega al celular.

| | |
|---|---|
| **Nivel** | intermedio · 15 minutos |
| **Credenciales** | ninguna para vigilar; la de Telegram o Gmail si querés recibir el aviso |
| **Probado** | ejecutado en n8n 2.48.7 contra Fuji en vivo: las dos ramas en prueba manual y publicado con un horario de 15 segundos durante 7 minutos, donde recordó el saldo entre vueltas y avisó cada cambio real ([pruebas](../../docs/PRUEBAS.md)) |

> **Avalanche Fuji, a mano:** [Descargá Core Wallet](https://core.app/download?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) y activá el modo testnet ([cómo](https://support.core.app/en/articles/13052998-core-extension-how-do-i-toggle-testnet-on-and-off)) · [Pedí AVAX de prueba en el faucet](https://build.avax.network/console/primary-network/faucet?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Aprendé en Avalanche Academy](https://build.avax.network/academy?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Sumate a Team1 LATAM](https://www.team1.network/?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026#waitlist) · [Explorá tus transacciones](https://build.avax.network/explorer/fuji/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026)

## Qué hace

1. **Cada 5 minutos** (Schedule Trigger) dispara el workflow cuando está publicado. **Al hacer clic en Probar** sirve para probarlo a mano.
2. **Wallet a vigilar** tiene la dirección y un campo para pruebas, `saldoAnteriorDePrueba`. La del ejemplo es el contrato WAVAX de Fuji: cambiala por la tuya.
3. **Leer el saldo** pide `eth_getBalance` al RPC público.
4. **Comparar con el saldo anterior** lee la memoria del workflow (`$getWorkflowStaticData('global')`), compara con `BigInt` y guarda el saldo nuevo para la próxima vuelta.
5. **¿Cambió el saldo?** manda el ítem a **Mensaje de aviso** (rama «true») o a **Sin cambios**.
6. **Mensaje de aviso** deja el texto listo en `mensaje`, para conectarle Telegram, Gmail o lo que quieras.

## Qué aprendés

- Disparar un workflow con un horario (Schedule Trigger).
- Recordar datos entre ejecuciones con los datos estáticos del workflow.
- Decidir con un If y armar un mensaje con una expresión.
- Probar a mano algo que depende del tiempo, con un dato de prueba.
- Conectar un aviso a Telegram o Gmail.

## Qué necesitás

- Tu n8n y la dirección a vigilar (la tuya de Core, la que empieza con `0x`).
- Para recibir el aviso, una de estas credenciales:
  - **Telegram API** (`telegramApi`): el token de un bot que creás con @BotFather en Telegram.
  - **Gmail OAuth2** (`gmailOAuth2`): conectás tu cuenta de Google desde n8n. En n8n Cloud es un clic en **Sign in with Google**.

## Cómo importarlo

1. **Copiar y pegar:** abrí [`workflow.json`](workflow.json), copialo con «Copy raw file» y pegalo con Ctrl + V en un workflow nuevo. En la [página del evento](https://nodo-cero-bo.github.io) está el botón «Copiar workflow».
2. **Import from URL:** menú del workflow (los tres puntos) → **Import from URL**:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/10-avalanche-fuji/14-fuji-monitor-wallet/workflow.json
   ```

3. **Import from File:** bajá el archivo y usá **Import from File**.

## Cómo probarlo

**1. La primera vuelta.** Hacé clic en **Execute**. Sale por **Sin cambios** con `primeraRevision: true`: todavía no hay un saldo anterior para comparar.

**2. El aviso, sin esperar.** En las ejecuciones manuales la memoria no se guarda, así que cada prueba manual es una «primera vuelta». Para ver el aviso, poné un monto cualquiera en `saldoAnteriorDePrueba` (por ejemplo `1000000`) y ejecutá de nuevo: sale por **Mensaje de aviso** con la diferencia.

**3. De verdad.** Dejá `saldoAnteriorDePrueba` vacío, poné tu dirección en `direccion` y hacé **Publish**. En la pestaña **Executions** vas a ver una ejecución cada 5 minutos. Mandate AVAX de prueba (o mandá desde tu wallet) y, en la vuelta siguiente, aparece el aviso.

## Qué devuelve

El aviso de la prueba manual con `saldoAnteriorDePrueba: "1000000"`, el 21 de noviembre de 2026:

```json
{
  "direccion": "0xd00ae08403b9bbb9124bb305c09058e32c39a48c",
  "cambio": true,
  "primeraRevision": false,
  "entro": true,
  "saldoAVAX": "1017872.259549593428297287",
  "saldoAnteriorAVAX": "1000000",
  "diferenciaAVAX": "17872.259549593428297287",
  "movimientoAVAX": "17872.259549593428297287",
  "revisadoAnterior": "saldo de prueba",
  "revisado": "21/11/2026 02:12:10",
  "explorador": "https://build.avax.network/explorer/fuji/c-chain/address/0xd00ae08403b9bbb9124bb305c09058e32c39a48c",
  "mensaje": "Entraron 17872.259549593428297287 AVAX en 0xd00ae08403b9bbb9124bb305c09058e32c39a48c (Fuji). Saldo nuevo: 1017872.259549593428297287 AVAX; antes: 1000000 AVAX. https://build.avax.network/explorer/fuji/c-chain/address/0xd00ae08403b9bbb9124bb305c09058e32c39a48c"
}
```

Publicado, n8n guarda la memoria junto con el workflow (en `staticData`). En la prueba quedó así:

```json
{ "global": { "saldos": { "0x...": { "wei": "375438403605988836", "revisado": "21/11/2026 02:22:50" } } } }
```

Se guarda un saldo por dirección: si cambiás la dirección, la primera vuelta de la nueva no avisa.

## Conectar el aviso

**Telegram**

1. En Telegram, hablale a @BotFather, mandá `/newbot` y seguí los pasos: te da el token del bot.
2. Mandale cualquier mensaje a tu bot (si no, no te puede escribir).
3. En n8n, después de **Mensaje de aviso**, sumá **Telegram → Send a text message**. Creá la credencial **Telegram API** con el token.
4. **Chat ID**: el tuyo. Una forma de verlo: un **Telegram Trigger** en otro workflow te lo muestra cuando le escribís al bot (`message.chat.id`).
5. **Text**: `{{ $json.mensaje }}`.

**Gmail**

1. Después de **Mensaje de aviso**, sumá **Gmail → Send a message** y conectá tu cuenta con la credencial **Gmail OAuth2**.
2. **To**: tu correo. **Subject**: `Cambió el saldo de tu wallet en Fuji`. **Message**: `{{ $json.mensaje }}`.

## Ideas para extenderlo

- **Varias wallets:** poné una lista de direcciones, partila en ítems y dejá que cada nodo trabaje una vez por ítem; la memoria ya guarda un saldo por dirección.
- **Tokens:** vigilá el saldo de USDC con la llamada `balanceOf` de [`15-fuji-token-erc20`](../15-fuji-token-erc20).
- **Eventos de tu contrato:** guardá el último bloque revisado en la memoria y pedí los eventos nuevos en cada vuelta, como cuenta [`16-fuji-eventos-contrato`](../16-fuji-eventos-contrato).
- **Historial:** guardá cada cambio en una tabla de Supabase.

Para cuidar el RPC público, no bajes el horario de un minuto: tiene límites de uso y, si lo llamás demasiado seguido, responde 429 por un rato.

## Documentación

- n8n: [Schedule Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger), [getWorkflowStaticData](https://docs.n8n.io/build/code-in-n8n/cookbook/built-in-methods-and-variables-examples/getworkflowstaticdata), [If](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.if), [Edit Fields (Set)](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.set), [Telegram](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.telegram) y [Gmail](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.gmail).
- Telegram: [crear un bot con BotFather](https://core.telegram.org/bots/tutorial).
- Avalanche: [C-Chain RPC](https://build.avax.network/docs/rpcs/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) (`eth_getBalance`).

---

Licencia MIT, como todo el repo. Avalanche, Core, Team1, Telegram y Gmail son marcas de sus dueños.
