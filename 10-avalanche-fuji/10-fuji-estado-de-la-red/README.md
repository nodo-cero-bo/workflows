# Estado de la red Fuji

El «hola mundo» de leer una blockchain desde n8n: le pregunta al RPC público de Avalanche Fuji en qué red está, cuál es el último bloque y cuánto cuesta el gas, y te lo devuelve en números que se leen.

| | |
|---|---|
| **Nivel** | inicial · 10 minutos |
| **Credenciales** | ninguna |
| **Probado** | ejecutado en n8n 2.48.7 contra Fuji en vivo ([pruebas](../../docs/PRUEBAS.md)) |

> **Avalanche Fuji, a mano:** [Descargá Core Wallet](https://core.app/download?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) y activá el modo testnet ([cómo](https://support.core.app/en/articles/13052998-core-extension-how-do-i-toggle-testnet-on-and-off)) · [Pedí AVAX de prueba en el faucet](https://build.avax.network/console/primary-network/faucet?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Aprendé en Avalanche Academy](https://build.avax.network/academy?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Sumate a Team1 LATAM](https://www.team1.network/?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026#waitlist) · [Explorá tus transacciones](https://build.avax.network/explorer/fuji/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026)

## Qué hace

Cinco nodos en fila:

1. **Al hacer clic en Probar** arranca el workflow.
2. **Pedir el chainId** manda `eth_chainId` al RPC público de Fuji.
3. **Pedir el último bloque** manda `eth_getBlockByNumber` con `"latest"`.
4. **Pedir el precio del gas** manda `eth_gasPrice`.
5. **Pasar a números legibles** junta las tres respuestas, que llegan en hexadecimal, y arma un resumen: la red, el número del bloque, su hora en Bolivia, cuántas transacciones trae, el precio del gas en wei y en nAVAX, lo que cuesta una transferencia simple y el enlace al bloque en el explorador.

## Qué aprendés

- Qué es JSON-RPC: una pregunta (`method`) con sus datos (`params`) en un POST, y la respuesta en `result`.
- Usar HTTP Request con un cuerpo JSON.
- Leer la salida de otro nodo por su nombre: `$('Pedir el chainId').first().json`.
- Pasar hexadecimal a número con `BigInt` y wei a nAVAX sin perder precisión (1 AVAX = 10^18 wei; 1 nAVAX = 10^9 wei).
- Pasar la hora Unix de un bloque a la hora de Bolivia con Luxon.

## Qué necesitás

Nada más que tu n8n: [n8n Cloud](https://app.n8n.cloud/register) o una instalación propia con n8n 2.48.7 o más nueva. No pide credenciales ni wallet: el RPC público de Fuji (`https://api.avax-test.network/ext/bc/C/rpc`) se lee sin clave.

## Cómo importarlo

1. **Copiar y pegar:** abrí [`workflow.json`](workflow.json), copialo con el botón «Copy raw file» y pegalo con Ctrl + V (Cmd + V en Mac) en un workflow nuevo de n8n. En la [página del evento](https://nodo-cero-bo.github.io) está el botón «Copiar workflow».
2. **Import from URL:** en n8n, menú del workflow (los tres puntos) → **Import from URL**, con este enlace:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/10-avalanche-fuji/10-fuji-estado-de-la-red/workflow.json
   ```

3. **Import from File:** bajá el archivo y usá **Import from File** en el mismo menú.

## Cómo probarlo

1. Hacé clic en **Execute**.
2. Abrí **Pasar a números legibles**. `chainId` tiene que ser `43113` (`0xa869`): es Fuji.
3. Ejecutalo otra vez: `ultimoBloque` creció. En Fuji sale un bloque cada uno o dos segundos.
4. Abrí el enlace de `explorador` y compará con lo que muestra el explorador de Fuji.
5. Abrí cada HTTP Request y mirá la respuesta cruda: todo viene en hexadecimal.

## Qué devuelve

Una salida real del 21 de noviembre de 2026:

```json
{
  "red": "Avalanche Fuji C-Chain",
  "esFuji": true,
  "chainId": 43113,
  "chainIdHex": "0xa869",
  "ultimoBloque": 61412260,
  "ultimoBloqueHex": "0x3a913a4",
  "horaDelBloque": "21/11/2026 02:05:47",
  "zonaHoraria": "America/La_Paz",
  "haceSegundos": 2,
  "transaccionesEnElBloque": 1,
  "gasUsadoEnElBloque": 607817,
  "precioDelGas": { "wei": "160", "nAVAX": "0.00000016" },
  "tarifaBaseDelBloque": { "wei": "10", "nAVAX": "0.00000001" },
  "costoDeUnaTransferencia": { "gas": 21000, "AVAX": "0.00000000000336" },
  "explorador": "https://build.avax.network/explorer/fuji/c-chain/block/61412260"
}
```

El gas en Fuji está muy barato: por eso el precio sale en fracciones de nAVAX. Una transferencia simple de AVAX gasta siempre 21000 unidades de gas; lo que cambia es el precio de cada unidad.

## Ideas para extenderlo

- **Tu primer tablero:** cambiá el disparador por un Webhook y devolvé este JSON con Respond to Webhook, para mostrarlo en tu página (mirá cómo se hace en [`11-fuji-saldo-wallet`](../11-fuji-saldo-wallet)).
- **Historial del gas:** con un Schedule Trigger cada hora, guardá `precioDelGas` en una tabla de Supabase y graficalo.
- **La red principal:** el mismo workflow lee Avalanche C-Chain cambiando el RPC por `https://api.avax.network/ext/bc/C/rpc` (chainId 43114). Leer no cuesta nada; ahí los AVAX sí tienen valor, así que para probar quedate en Fuji.
- **Más métodos:** probá `eth_getBalance` (el [11](../11-fuji-saldo-wallet)) o `eth_getTransactionByHash` (el [12](../12-fuji-leer-transaccion)).

## Documentación

- n8n: [HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest), [Code](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code) y [fechas con Luxon](https://docs.n8n.io/build/work-with-data/transform-data/expression-reference/datetime).
- Avalanche: [C-Chain RPC](https://build.avax.network/docs/rpcs/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026), con todos los métodos `eth_*`.
- [La API JSON-RPC explicada en español](https://ethereum.org/es/developers/docs/apis/json-rpc/), en ethereum.org (la C-Chain usa la misma).

---

Licencia MIT, como todo el repo. Avalanche, Core y Team1 son marcas de sus dueños.
