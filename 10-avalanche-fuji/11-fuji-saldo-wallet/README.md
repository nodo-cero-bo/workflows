# Saldo de una wallet en Fuji

Pasale una dirección de Avalanche Fuji y te devuelve cuántos AVAX tiene. La misma consulta tiene tres entradas: una prueba manual, una API que cualquier página puede llamar y un formulario para quien no programa.

| | |
|---|---|
| **Nivel** | inicial · 15 minutos |
| **Credenciales** | ninguna |
| **Probado** | ejecutado en n8n 2.48.7 contra Fuji en vivo: la prueba manual, la API con curl y el formulario hasta su página final ([pruebas](../../docs/PRUEBAS.md)) |

> **Avalanche Fuji, a mano:** [Descargá Core Wallet](https://core.app/download?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) y activá el modo testnet ([cómo](https://support.core.app/en/articles/13052998-core-extension-how-do-i-toggle-testnet-on-and-off)) · [Pedí AVAX de prueba en el faucet](https://build.avax.network/console/primary-network/faucet?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Aprendé en Avalanche Academy](https://build.avax.network/academy?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Sumate a Team1 LATAM](https://www.team1.network/?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026#waitlist) · [Explorá tus transacciones](https://build.avax.network/explorer/fuji/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026)

## Qué hace

**Fila de arriba, la API:**

1. **Consulta por URL** (Webhook GET) recibe `/webhook/fuji-saldo?address=0x...`. Para probar sin publicar, **Al hacer clic en Probar** y **Dirección de ejemplo** mandan lo mismo.
2. **Leer saldo en Fuji** le pide al RPC `eth_getBalance` con la dirección.
3. **Pasar de wei a AVAX** revisa la dirección y convierte el saldo con `BigInt`.
4. **Responder con el saldo** devuelve el JSON con el código HTTP que corresponde: 200 si salió bien, 400 si la dirección no sirve y 502 si el RPC no respondió.

**Fila de abajo, el formulario:** **Formulario de saldo** pide la dirección, hace la misma consulta y **Mostrar el saldo** muestra el resultado en una página final. Un formulario de n8n no puede terminar en Respond to Webhook (termina en un nodo n8n Form de tipo **Form Ending**): por eso tiene sus propios nodos.

La dirección de ejemplo es la del contrato WAVAX de Fuji (`0xd00ae08403b9bbb9124bb305c09058e32c39a48c`), que guarda los AVAX que la gente «envuelve» como token: tiene saldo de sobra para ver números grandes.

## Qué aprendés

- Crear una API con Webhook GET y leer los parámetros de la URL en `$json.query`.
- Responder con Respond to Webhook y calcular el código HTTP con una expresión.
- Armar un formulario de n8n con una página final que usa los datos del workflow.
- Pasar de wei a AVAX con `BigInt`, sin perder decimales.
- Que un HTTP Request siga aunque falle (**Settings → On Error: Continue**), para responder siempre.

## Qué necesitás

Nada más que tu n8n. No pide credenciales ni wallet: el saldo de una dirección es un dato público de la red. Para ver tu propio saldo, tu dirección de la C-Chain en Core Wallet (empieza con `0x`).

## Cómo importarlo

1. **Copiar y pegar:** abrí [`workflow.json`](workflow.json), copialo con «Copy raw file» y pegalo con Ctrl + V en un workflow nuevo. En la [página del evento](https://nodo-cero-bo.github.io) está el botón «Copiar workflow».
2. **Import from URL:** menú del workflow (los tres puntos) → **Import from URL**:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/10-avalanche-fuji/11-fuji-saldo-wallet/workflow.json
   ```

3. **Import from File:** bajá el archivo y usá **Import from File**.

## Cómo probarlo

**1. Sin publicar.** Hacé clic en **Execute workflow** y abrí **Pasar de wei a AVAX**. Después cambiá la dirección de **Dirección de ejemplo** por la tuya y ejecutá de nuevo.

**2. La API.** Hacé **Publish** (arriba a la derecha). Abrí **Consulta por URL**, copiá la **Production URL** y abrila en el navegador con tu dirección al final:

```text
https://<tu-n8n>/webhook/fuji-saldo?address=0xd00ae08403b9bbb9124bb305c09058e32c39a48c
```

O desde la terminal:

```bash
curl "https://<tu-n8n>/webhook/fuji-saldo?address=0xd00ae08403b9bbb9124bb305c09058e32c39a48c"
```

Probá también con una dirección mal escrita (`?address=0x123`): responde 400 con el motivo.

**3. El formulario.** Con el workflow publicado, abrí **Formulario de saldo**, copiá su **Production URL** y abrila en el navegador. Pegá una dirección y tocá **Ver saldo**.

Las URL de prueba (`/webhook-test/`, `/form-test/`) funcionan nada más mientras el editor está escuchando (botón **Execute workflow**); las de producción (`/webhook/`, `/form/`), cuando el workflow está publicado.

## Qué devuelve

La API, en una llamada real del 21 de noviembre de 2026 (HTTP 200):

```json
{
  "ok": true,
  "red": "Avalanche Fuji C-Chain",
  "direccion": "0xd00ae08403b9bbb9124bb305c09058e32c39a48c",
  "saldoAVAX": "1017872.259549593428297287",
  "saldoWei": "1017872259549593428297287",
  "consultado": "21/11/2026 02:16:01",
  "explorador": "https://build.avax.network/explorer/fuji/c-chain/address/0xd00ae08403b9bbb9124bb305c09058e32c39a48c"
}
```

Con una dirección que no sirve (HTTP 400):

```json
{
  "ok": false,
  "tipoError": "direccion",
  "error": "Mandá una dirección de la C-Chain en ?address= : 0x y 40 caracteres hexadecimales.",
  "direccion": "0x123"
}
```

El formulario muestra una página con el saldo como título («1017872.259549593428297287 AVAX») y el enlace al explorador.

## Ideas para extenderlo

- **Tu página:** llamá a la API desde JavaScript con `fetch('https://<tu-n8n>/webhook/fuji-saldo?address=' + direccion)` y mostrá el saldo. El Webhook ya permite llamadas desde cualquier origen (**Options → Allowed Origins**: `*`).
- **Varias direcciones:** recibí una lista separada por comas, partila en ítems con un Code y dejá que el HTTP Request haga un pedido por ítem.
- **Saldo de un token:** sumá la lectura de USDC de [`15-fuji-token-erc20`](../15-fuji-token-erc20).
- **Avisos:** si querés que te avise cuando cambia, mirá [`14-fuji-monitor-wallet`](../14-fuji-monitor-wallet).

## Documentación

- n8n: [Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook), [Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook), [n8n Form Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.formtrigger), [n8n Form](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.form), [HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest) y los [ajustes de cada nodo](https://docs.n8n.io/build/understand-workflows/workflow-components/work-with-nodes) (On Error, Retry On Fail).
- Avalanche: [C-Chain RPC](https://build.avax.network/docs/rpcs/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) (`eth_getBalance`).
- [La API JSON-RPC explicada en español](https://ethereum.org/es/developers/docs/apis/json-rpc/), en ethereum.org.

---

Licencia MIT, como todo el repo. Avalanche, Core y Team1 son marcas de sus dueños.
