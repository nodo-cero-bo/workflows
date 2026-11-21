# Leer una transacción en Fuji

**El desafío del día.** Dado el hash de una transacción de Avalanche Fuji, n8n te dice quién la envió, a quién, cuánto (en AVAX), el gas que usó y lo que costó, si salió bien, en qué bloque quedó, cuántas confirmaciones tiene y el enlace para verla en el explorador.

| | |
|---|---|
| **Nivel** | inicial · 15 minutos |
| **Credenciales** | ninguna |
| **Probado** | ejecutado en n8n 2.48.7 contra Fuji en vivo, con una transferencia, una llamada a un contrato, un hash inexistente y uno mal escrito ([pruebas](../../docs/PRUEBAS.md)) |

> **Avalanche Fuji, a mano:** [Descargá Core Wallet](https://core.app/download?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) y activá el modo testnet ([cómo](https://support.core.app/en/articles/13052998-core-extension-how-do-i-toggle-testnet-on-and-off)) · [Pedí AVAX de prueba en el faucet](https://build.avax.network/console/primary-network/faucet?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Aprendé en Avalanche Academy](https://build.avax.network/academy?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Sumate a Team1 LATAM](https://www.team1.network/?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026#waitlist) · [Explorá tus transacciones](https://build.avax.network/explorer/fuji/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026)

## Qué hace

1. **Tu hash** tiene el hash a leer. Trae uno real de ejemplo: una transferencia de 0.5 AVAX en el bloque 61411475.
2. **Leer la transacción** (`eth_getTransactionByHash`): lo que se pidió. Quién la firmó, a quién va, el monto en wei y el precio del gas.
3. **Leer el recibo** (`eth_getTransactionReceipt`): lo que pasó. El estado (`0x1` salió bien, `0x0` falló), el gas usado, lo que se pagó por unidad de gas y los eventos.
4. **Leer el último bloque** (`eth_blockNumber`): para contar las confirmaciones.
5. **Armar el resumen** hace las cuentas con `BigInt`:
   - monto: `value` ÷ 10^18;
   - costo: gas usado × `effectiveGasPrice`;
   - confirmaciones: último bloque − bloque de la transacción + 1.

Si el hash no existe en Fuji, o está mal escrito, devuelve `encontrada: false` con un mensaje que dice qué revisar.

## Qué aprendés

- La diferencia entre una transacción (lo que se pidió) y su recibo (lo que pasó).
- Encadenar varios pedidos JSON-RPC y juntarlos en un Code.
- Pasar de hexadecimal y de wei a números legibles sin perder precisión.
- Qué son el gas, su precio y las confirmaciones.
- Reconocer una transferencia simple (`input` vacío, `0x`), una llamada a un contrato y la creación de un contrato (`to` vacío).

## Qué necesitás

Tu n8n y un hash de Fuji. El workflow trae uno de ejemplo. Para tener uno tuyo:

1. Instalá [Core Wallet](https://core.app/download?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) y activá **Testnet Mode**.
2. Pedí AVAX de prueba en el [faucet](https://build.avax.network/console/primary-network/faucet?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026).
3. Mandá `0.01` AVAX a la dirección de alguien de tu equipo y copiá el hash desde la actividad de Core.

No pide credenciales: el RPC público de Fuji se lee sin clave y n8n nunca toca tu wallet.

## Cómo importarlo

1. **Copiar y pegar:** abrí [`workflow.json`](workflow.json), copialo con «Copy raw file» y pegalo con Ctrl + V en un workflow nuevo. En la [página del evento](https://nodo-cero-bo.github.io) está el botón «Copiar workflow».
2. **Import from URL:** menú del workflow (los tres puntos) → **Import from URL**:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/10-avalanche-fuji/12-fuji-leer-transaccion/workflow.json
   ```

3. **Import from File:** bajá el archivo y usá **Import from File**.

## Cómo probarlo

1. Hacé clic en **Execute workflow** y abrí **Armar el resumen**.
2. Abrí el enlace de `explorador`: son los mismos datos, leídos por n8n.
3. Pegá tu hash en **Tu hash** (66 caracteres: `0x` y 64 más) y ejecutá de nuevo.
4. Probá los casos raros:
   - un hash inventado, como `0x` seguido de 64 unos: sale `encontrada: false`;
   - un hash cortado: el RPC responde un error y el resumen te lo explica;
   - una llamada a un contrato, como `0x2b2da849d8c9184fa7e207ba8e4c91509491383b1cb69cabacd772ade0edc178`: sale `tipo: "llamada a un contrato"`, monto 0 y un evento.
5. Abrí cada HTTP Request para ver la respuesta cruda, en hexadecimal.

## Qué devuelve

La salida real del ejemplo, el 21 de noviembre de 2026:

```json
{
  "encontrada": true,
  "hash": "0xe3f00c7d004c3219b867f2349e528be962712ea328b9e7007b233b58af655150",
  "estado": "exitosa",
  "tipo": "transferencia de AVAX",
  "de": "0xd2717e58381adbce9a5422dcd3003f490253da40",
  "para": "0x74e3ce84499e0fe6c951878e48f610d61d24a520",
  "montoAVAX": "0.5",
  "montoWei": "500000000000000000",
  "gasUsado": 21000,
  "precioGas": { "wei": "160", "nAVAX": "0.00000016" },
  "costoAVAX": "0.00000000000336",
  "costoWei": "3360000",
  "bloque": 61411475,
  "confirmaciones": 798,
  "eventos": 0,
  "explorador": "https://build.avax.network/explorer/fuji/c-chain/tx/0xe3f00c7d004c3219b867f2349e528be962712ea328b9e7007b233b58af655150"
}
```

| Campo | Qué es |
|---|---|
| `estado` | `exitosa`, `fallida` (existe pero no movió el monto) o `pendiente` (todavía no entró en un bloque) |
| `montoAVAX` / `montoWei` | Lo que se mandó. Se guarda como texto para no perder decimales. |
| `gasUsado`, `precioGas`, `costoAVAX` | El trabajo que hizo la red, lo que costó cada unidad y el total. |
| `confirmaciones` | Bloques desde el de la transacción (incluido) hasta el último. En Avalanche una transacción es final apenas entra en un bloque; pedir más confirmaciones es un margen extra. |
| `eventos` | Cuántos eventos (logs) emitió. Para leerlos, el [16](../16-fuji-eventos-contrato). |

## Ideas para extenderlo

- **Una API:** cambiá el disparador por un Webhook GET (`?hash=0x...`) y respondé el resumen, como en [`11-fuji-saldo-wallet`](../11-fuji-saldo-wallet).
- **Un formulario:** que la persona pegue su hash y vea el resumen en la página final.
- **Verificar un pago:** sumale reglas (destino, monto mínimo, confirmaciones): es [`13-fuji-verificar-pago`](../13-fuji-verificar-pago).
- **Explicado por IA:** pasale el resumen a un agente para que cuente la transacción en palabras simples, como en [`40-agente-web3-fuji`](../../40-proyectos/40-agente-web3-fuji).

## Documentación

- n8n: [HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest) y [Code](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code).
- Avalanche: [C-Chain RPC](https://build.avax.network/docs/rpcs/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026), con `eth_getTransactionByHash` y `eth_getTransactionReceipt`.
- [La API JSON-RPC explicada en español](https://ethereum.org/es/developers/docs/apis/json-rpc/), en ethereum.org.

---

Licencia MIT, como todo el repo. Avalanche, Core y Team1 son marcas de sus dueños.
