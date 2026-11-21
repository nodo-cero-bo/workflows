# Leer eventos de un contrato en Fuji

Pide los eventos (logs) de los últimos bloques de Avalanche Fuji con `eth_getLogs` y los decodifica: las transferencias de tokens (`Transfer` de ERC-20 y de NFT) y los proyectos registrados en el contrato de ejemplo de este repo (`ProyectoRegistrado`). Es la base para que n8n reaccione a lo que pasa en un contrato.

| | |
|---|---|
| **Nivel** | avanzado · 25 minutos |
| **Credenciales** | ninguna |
| **Probado** | ejecutado en n8n 2.48.7 contra Fuji en vivo: transferencias de USDC, de cualquier token, de un NFT (9 tramos de 100 bloques) y rangos sin eventos. El evento `ProyectoRegistrado` se probó con logs reales que emitió el contrato al correrlo en una EVM local ([pruebas](../../docs/PRUEBAS.md)) |

> **Avalanche Fuji, a mano:** [Descargá Core Wallet](https://core.app/download?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) y activá el modo testnet ([cómo](https://support.core.app/en/articles/13052998-core-extension-how-do-i-toggle-testnet-on-and-off)) · [Pedí AVAX de prueba en el faucet](https://build.avax.network/console/primary-network/faucet?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Aprendé en Avalanche Academy](https://build.avax.network/academy?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Sumate a Team1 LATAM](https://www.team1.network/?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026#waitlist) · [Explorá tus transacciones](https://build.avax.network/explorer/fuji/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026)

## Qué hace

1. **Qué buscar** tiene el filtro:

   | Campo | Qué es | En el ejemplo |
   |---|---|---|
   | `contrato` | La dirección que emite los eventos. Vacío: cualquier contrato. | USDC de Circle en Fuji |
   | `topic0` | Qué evento. Vacío: todos. | `Transfer` |
   | `bloquesHaciaAtras` | Cuántos bloques mirar desde el último, hasta 1000. | 300 |
   | `desdeBloque` | Si lo completás, busca desde ese bloque hacia adelante (hasta 1000 bloques). | vacío |
   | `decimales` | Los del token, para mostrar el monto legible. | 6 |

2. **Pedir el último bloque** (`eth_blockNumber`).
3. **Partir en tramos de 100 bloques** arma un filtro por tramo: el RPC público de Fuji acepta hasta 100 bloques por pedido.
4. **Pedir los eventos (eth_getLogs)** hace un pedido por tramo, de a uno (**Options → Batching**).
5. **Decodificar los eventos** devuelve un ítem por evento, con el bloque, la transacción, el contrato, los datos decodificados y el enlace al explorador.

## El límite del RPC público

Se midió en vivo el 21 de noviembre de 2026: si un pedido de `eth_getLogs` abarca más de 100 bloques, el RPC responde

```json
{ "code": -32602, "message": "block range too large: total block range in this request exceeds the maximum of 100 blocks" }
```

Por eso el workflow parte el rango en tramos de 100 y pide como mucho 10 por ejecución (1000 bloques: en Fuji sale un bloque cada 1 o 2 segundos, así que son unos 30 minutos). Para mirar más atrás, usá `desdeBloque` y avanzá de a 1000. El RPC público también limita cuántos pedidos acepta por minuto: si responde 429, esperá un minuto.

## Cómo se lee un evento

Un log trae `address` (el contrato), `topics` y `data`:

| Parte | Qué tiene |
|---|---|
| `topics[0]` | Qué evento es: el keccak256 de su firma. `Transfer(address,address,uint256)` da `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`. |
| `topics[1]`, `topics[2]`, `topics[3]` | Los parámetros `indexed`, de 32 bytes cada uno. Una dirección ocupa los últimos 20. |
| `data` | El resto de los parámetros, codificados con la ABI. |

Así se decodifica cada evento que conoce el workflow:

| Evento | Cómo se reconoce | Qué sale |
|---|---|---|
| `Transfer` de un ERC-20 | `topic0` de Transfer y 3 topics | `de`, `para`, `valorCrudo` (de `data`) y `valor` con decimales |
| `Transfer` de un NFT (ERC-721) | la misma firma, con 4 topics: el `tokenId` también es `indexed` | `de`, `para`, `tokenId` |
| `ProyectoRegistrado` del [contrato de ejemplo](../../avalanche/contratos) | `topic0` `0xa349a1d38906b94dcd1cbd81cc94738a389a4deaf16ae3d301bc1617cc04df77` | `autora` (de `topics[1]`), `nombre`, `enlace` y `cuando` (de `data`) |
| cualquier otro | — | `evento: "otro"` con `topics` y `data` crudos, para que lo decodifiques vos |

## Qué aprendés

- Pedir eventos con `eth_getLogs`, filtrando por contrato, por evento (`topic0`) y por rango de bloques.
- Respetar el límite de un servicio partiendo el trabajo en tramos, con un ítem por pedido.
- Qué son `topic0`, los parámetros `indexed` y `data`.
- Decodificar direcciones, montos y textos de la ABI a mano.
- Armar el cuerpo de un pedido entero con una expresión (`JSON.stringify`).

## Qué necesitás

Nada más que tu n8n. Para leer un contrato tuyo: desplegalo en Fuji con Remix y Core Wallet siguiendo [`avalanche/contratos`](../../avalanche/contratos), y anotá su dirección y el bloque del despliegue.

## Cómo importarlo

1. **Copiar y pegar:** abrí [`workflow.json`](workflow.json), copialo con «Copy raw file» y pegalo con Ctrl + V en un workflow nuevo. En la [página del evento](https://nodo-cero-bo.github.io) está el botón «Copiar workflow».
2. **Import from URL:** menú del workflow (los tres puntos) → **Import from URL**:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/10-avalanche-fuji/16-fuji-eventos-contrato/workflow.json
   ```

3. **Import from File:** bajá el archivo y usá **Import from File**.

## Cómo probarlo

1. Hacé clic en **Execute workflow** y abrí **Decodificar los eventos**: un ítem por transferencia de USDC en los últimos 300 bloques. Si en ese rato nadie movió USDC, sale `eventos: 0` con un mensaje: subí `bloquesHaciaAtras` a 1000.
2. Vaciá `contrato` y `decimales` y ejecutá de nuevo: aparecen transferencias de cualquier token de Fuji, también de NFT.
3. Abrí **Partir en tramos de 100 bloques** y mirá los rangos de cada pedido.
4. **Con tu contrato** de [`avalanche/contratos`](../../avalanche/contratos):
   - `contrato`: la dirección que te dio Remix;
   - `topic0`: `0xa349a1d38906b94dcd1cbd81cc94738a389a4deaf16ae3d301bc1617cc04df77`;
   - `desdeBloque`: el bloque del despliegue;
   - `decimales`: vacío.

   Registrá un proyecto desde Remix, ejecutá el workflow y aparece tu evento con el nombre y el enlace legibles.

## Qué devuelve

Una transferencia de USDC real, el 21 de noviembre de 2026:

```json
{
  "bloque": 61412015,
  "transaccion": "0x961a6d696e9ae8732872bf2ff2ec98da51a30adb5d4e3746d4ae495ee938e799",
  "contrato": "0x5425890298aed601595a70ab815c96711a31bc65",
  "evento": "Transfer (ERC-20)",
  "de": "0x4ffd83f9f9081a4f331db888729f67d2da1ba415",
  "para": "0xa00768eb29ac9da2bad0e66a8b63fbcd705abdb3",
  "valorCrudo": "17500",
  "valor": "0.0175",
  "explorador": "https://build.avax.network/explorer/fuji/c-chain/tx/0x961a6d696e9ae8732872bf2ff2ec98da51a30adb5d4e3746d4ae495ee938e799"
}
```

Un NFT (ERC-721), del mismo día:

```json
{ "bloque": 61411610, "contrato": "0xc730d3fcdfc09dea92a24c830a0bcff0d48520d2", "evento": "Transfer (ERC-721)", "de": "0x4c8058ebd8bf4bf0f43d94f83389cb770fc93a0b", "para": "0x2f9e0de0c8a7a9ed7af4a31225b6245b45d31c5a", "tokenId": "1011" }
```

Un `ProyectoRegistrado`, decodificado de un log que emitió el contrato de ejemplo en la prueba local (la `autora` es una dirección de prueba):

```json
{ "evento": "ProyectoRegistrado", "autora": "0x00000000000000000000000000000000000c0de0", "nombre": "Ñandú ágil: pagos con n8n", "enlace": "", "cuando": "21/11/2026 03:00:00" }
```

## Ideas para extenderlo

- **Que escuche por su cuenta:** cambiá el disparador por un Schedule Trigger, guardá el último bloque revisado con `$getWorkflowStaticData('global')` (como en [`14-fuji-monitor-wallet`](../14-fuji-monitor-wallet)) y pedí desde ahí en cada vuelta.
- **Un registro público:** guardá cada `ProyectoRegistrado` en Supabase y mostralo en tu página.
- **Pagos en USDC:** filtrá los `Transfer` de USDC cuyo `para` sea tu dirección: cada uno es un pago recibido.
- **Tu propio evento:** sumá su `topic0` en **Decodificar los eventos** y decodificá `data` según sus tipos (cada parámetro estático ocupa una palabra de 32 bytes; los textos, como en `ProyectoRegistrado`).

## Documentación

- n8n: [HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest) (Batching está en sus opciones) y [Code](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code).
- Avalanche: [C-Chain RPC](https://build.avax.network/docs/rpcs/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) (`eth_getLogs`).
- Solidity: [eventos](https://docs.soliditylang.org/en/latest/contracts.html#events) y [la especificación de la ABI](https://docs.soliditylang.org/en/latest/abi-spec.html).
- Los estándares [ERC-20](https://eips.ethereum.org/EIPS/eip-20) y [ERC-721](https://eips.ethereum.org/EIPS/eip-721).
- La guía de proyecto [Tu contrato en Fuji](https://github.com/nodo-cero-bo/guias/blob/main/proyectos/06-tu-contrato-en-fuji.md).

---

Licencia MIT, como todo el repo. Avalanche, Core, Team1, Circle y USDC son marcas de sus dueños.
