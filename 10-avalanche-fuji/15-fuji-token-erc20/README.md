# Saldo de un token ERC-20 en Fuji

Lee el nombre, el símbolo, los decimales y el saldo de una wallet en un token ERC-20 de Avalanche Fuji, con `eth_call` y la llamada armada a mano, byte por byte. El ejemplo es el USDC de prueba de Circle.

| | |
|---|---|
| **Nivel** | intermedio · 20 minutos |
| **Credenciales** | ninguna |
| **Probado** | ejecutado en n8n 2.48.7 contra Fuji en vivo, con USDC (6 decimales), con WAVAX (18) y con una dirección que no es un token ([pruebas](../../docs/PRUEBAS.md)) |

> **Avalanche Fuji, a mano:** [Descargá Core Wallet](https://core.app/download?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) y activá el modo testnet ([cómo](https://support.core.app/en/articles/13052998-core-extension-how-do-i-toggle-testnet-on-and-off)) · [Pedí AVAX de prueba en el faucet](https://build.avax.network/console/primary-network/faucet?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Aprendé en Avalanche Academy](https://build.avax.network/academy?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Sumate a Team1 LATAM](https://www.team1.network/?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026#waitlist) · [Explorá tus transacciones](https://build.avax.network/explorer/fuji/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026)

## Qué hace

1. **Token y wallet** tiene el contrato del token y la wallet de la que querés el saldo.
   - `token`: `0x5425890298aed601595a70ab815c96711a31bc65`, el USDC de Circle en Fuji. Está en la [lista oficial de Circle](https://developers.circle.com/stablecoins/usdc-contract-addresses) y se verificó en vivo antes de ponerlo: `symbol()` devuelve `USDC` y `decimals()`, `6`.
   - `wallet`: un contrato de Fuji que guarda USDC de prueba, elegido porque tiene saldo. Cambiala por la tuya.
2. **Armar las llamadas** devuelve cuatro ítems, uno por dato: `name()`, `symbol()`, `decimals()` y `balanceOf(wallet)`.
3. **Llamar al contrato (eth_call)** hace un pedido por ítem, de a uno (**Options → Batching**), para cuidar el RPC público.
4. **Decodificar las respuestas** lee lo que devolvió cada llamada y arma el resultado.

## Cómo se arma una llamada

`eth_call` ejecuta una función de lectura del contrato, sin firmar nada y sin gastar gas. En `data` va:

- el **selector**: los primeros 4 bytes del keccak256 de la firma de la función;
- los parámetros, cada uno rellenado con ceros hasta 32 bytes (64 caracteres hexadecimales).

| Función | Selector | `data` |
|---|---|---|
| `name()` | `0x06fdde03` | el selector |
| `symbol()` | `0x95d89b41` | el selector |
| `decimals()` | `0x313ce567` | el selector |
| `balanceOf(address)` | `0x70a08231` | el selector + la dirección sin `0x`, con ceros a la izquierda |

Por ejemplo, el saldo de `0x93083f60f1877a6ba974d5ed88bb74943deb8390`:

```text
0x70a08231 00000000000000000000000093083f60f1877a6ba974d5ed88bb74943deb8390
```

(sin el espacio). Ojo: el keccak256 de Ethereum no es el SHA3-256 del nodo Crypto de n8n. Son parecidos pero dan resultados distintos; para calcular un selector nuevo, mirá cómo en el README de [`avalanche/contratos`](../../avalanche/contratos).

## Cómo se decodifica la respuesta

- **Un número** (`decimals`, `balanceOf`) llega como una palabra de 32 bytes: `BigInt('0x...')` lo lee entero.
- **Un texto** (`name`, `symbol`) llega en tres partes: dónde empieza (en bytes), cuántos bytes tiene y los bytes en UTF-8. Algunos tokens viejos devuelven el símbolo como `bytes32`, en una palabra de 32 bytes: el workflow entiende los dos formatos.
- **El saldo** está en la unidad más chica del token. Se divide por 10^decimales con `BigInt` y el resto se arma como texto, sin redondear. USDC usa 6 decimales; AVAX y WAVAX, 18.

## Qué aprendés

- Leer un contrato con `eth_call`, sin wallet y sin gastar gas.
- Armar la llamada con el selector y los parámetros de la ABI.
- Decodificar números y textos de la ABI.
- Un HTTP Request que hace un pedido por ítem, con Batching.
- Juntar las respuestas con las llamadas por su orden.

## Qué necesitás

Nada más que tu n8n. Para tener USDC de prueba en tu wallet: el [faucet de Circle](https://faucet.circle.com/), eligiendo la red Avalanche Fuji y tu dirección de Core (la que empieza con `0x`).

## Cómo importarlo

1. **Copiar y pegar:** abrí [`workflow.json`](workflow.json), copialo con «Copy raw file» y pegalo con Ctrl + V en un workflow nuevo. En la [página del evento](https://nodo-cero-bo.github.io) está el botón «Copiar workflow».
2. **Import from URL:** menú del workflow (los tres puntos) → **Import from URL**:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/10-avalanche-fuji/15-fuji-token-erc20/workflow.json
   ```

3. **Import from File:** bajá el archivo y usá **Import from File**.

## Cómo probarlo

1. Hacé clic en **Execute workflow** y abrí **Decodificar las respuestas**: `USD Coin`, `USDC`, 6 decimales y el saldo.
2. Abrí **Armar las llamadas** y **Llamar al contrato (eth_call)** para ver cada `data` y cada respuesta cruda.
3. Poné tu dirección en `wallet` y ejecutá de nuevo (si todavía no pediste USDC en el faucet de Circle, el saldo es `0`).
4. Probá con WAVAX: `token` = `0xd00ae08403b9bbb9124bb305c09058e32c39a48c` (18 decimales).
5. Poné en `token` una dirección que no sea un contrato: el último nodo te avisa que la llamada volvió vacía (`0x`).

## Qué devuelve

La salida real del ejemplo, el 21 de noviembre de 2026:

```json
{
  "token": "0x5425890298aed601595a70ab815c96711a31bc65",
  "nombre": "USD Coin",
  "simbolo": "USDC",
  "decimales": 6,
  "wallet": "0x93083f60f1877a6ba974d5ed88bb74943deb8390",
  "saldo": "2953893.749881",
  "saldoCrudo": "2953893749881",
  "exploradorToken": "https://build.avax.network/explorer/fuji/c-chain/address/0x5425890298aed601595a70ab815c96711a31bc65",
  "exploradorWallet": "https://build.avax.network/explorer/fuji/c-chain/address/0x93083f60f1877a6ba974d5ed88bb74943deb8390"
}
```

## Ideas para extenderlo

- **Una API de saldos:** cambiá el disparador por un Webhook GET con `?wallet=` y respondé el JSON, como en [`11-fuji-saldo-wallet`](../11-fuji-saldo-wallet).
- **Más datos del token:** sumá `totalSupply()` (selector `0x18160ddd`) como un ítem más en **Armar las llamadas**.
- **Avisos de tokens:** combinalo con el horario y la memoria de [`14-fuji-monitor-wallet`](../14-fuji-monitor-wallet).
- **Las transferencias del token:** leelas con [`16-fuji-eventos-contrato`](../16-fuji-eventos-contrato).
- **Un agente que responde saldos:** usá esta llamada como herramienta, como en [`40-agente-web3-fuji`](../../40-proyectos/40-agente-web3-fuji).

## Documentación

- n8n: [HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest) (Batching está en sus opciones) y [Code](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code).
- [El estándar ERC-20 en español](https://ethereum.org/es/developers/docs/standards/tokens/erc-20/) y la [especificación EIP-20](https://eips.ethereum.org/EIPS/eip-20).
- [La especificación de la ABI](https://docs.soliditylang.org/en/latest/abi-spec.html), en la documentación de Solidity: selectores y cómo se codifica cada tipo.
- Circle: [direcciones oficiales de USDC](https://developers.circle.com/stablecoins/usdc-contract-addresses) y el [faucet](https://faucet.circle.com/).
- Avalanche: [C-Chain RPC](https://build.avax.network/docs/rpcs/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) (`eth_call`).

---

Licencia MIT, como todo el repo. Avalanche, Core, Team1, Circle y USDC son marcas de sus dueños.
