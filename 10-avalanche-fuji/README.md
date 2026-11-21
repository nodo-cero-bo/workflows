# Avalanche Fuji

Siete workflows de n8n para leer y usar la red de prueba de Avalanche, del primer pedido a la red hasta verificar pagos y escuchar los eventos de tu propio contrato. Todos leen con el RPC público de Fuji: sin cuentas, sin claves y sin tocar tu wallet.

Es el track de **Avalanche Fuji** de Nodo Cero, con el apoyo de Team1, el programa de comunidad de Avalanche, y con mención especial para los equipos que integren Fuji.

> **Antes de empezar:** [Descargá Core Wallet](https://core.app/download?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) y activá el modo testnet ([cómo](https://support.core.app/en/articles/13052998-core-extension-how-do-i-toggle-testnet-on-and-off)) · [Pedí AVAX de prueba en el faucet](https://build.avax.network/console/primary-network/faucet?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Aprendé en Avalanche Academy](https://build.avax.network/academy?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Sumate a Team1 LATAM](https://www.team1.network/?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026#waitlist) · [Explorá tus transacciones](https://build.avax.network/explorer/fuji/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026)

| Dato | Valor |
|---|---|
| Red | Avalanche Fuji C-Chain (la red de prueba, compatible con Ethereum) |
| Chain ID | `43113` (`0xa869`) |
| RPC público | `https://api.avax-test.network/ext/bc/C/rpc` (sin clave) |
| Moneda | AVAX de prueba, con 18 decimales: 1 AVAX = 10^18 wei |
| Ver una transacción | `https://build.avax.network/explorer/fuji/c-chain/tx/<hash>` |
| Ver una dirección | `https://build.avax.network/explorer/fuji/c-chain/address/<dirección>` |

## Los workflows

| Workflow | Qué hace | Nivel |
|---|---|---|
| [`10-fuji-estado-de-la-red`](10-fuji-estado-de-la-red) | chainId, último bloque y precio del gas, en números legibles. | inicial · 10 min |
| [`11-fuji-saldo-wallet`](11-fuji-saldo-wallet) | El saldo en AVAX de una dirección, por API (Webhook GET) o con un formulario. | inicial · 15 min |
| [`12-fuji-leer-transaccion`](12-fuji-leer-transaccion) | **El desafío del día:** dado un hash, quién envió, a quién, cuánto, gas, costo, estado, bloque, confirmaciones y enlace al explorador. | inicial · 15 min |
| [`13-fuji-verificar-pago`](13-fuji-verificar-pago) | Una API que verifica un pago: estado, destino, monto mínimo y confirmaciones. Opcional: lo registra en Supabase. | intermedio · 20 min |
| [`14-fuji-monitor-wallet`](14-fuji-monitor-wallet) | Revisa un saldo cada 5 minutos y arma un aviso cuando cambia. | intermedio · 15 min |
| [`15-fuji-token-erc20`](15-fuji-token-erc20) | Nombre, símbolo, decimales y saldo de un token ERC-20 con `eth_call`, con el USDC de prueba de Circle. | intermedio · 20 min |
| [`16-fuji-eventos-contrato`](16-fuji-eventos-contrato) | Lee eventos con `eth_getLogs` y los decodifica: transferencias de tokens y los registros de tu contrato. | avanzado · 25 min |

Y en [`avalanche/contratos`](../avalanche/contratos): **RegistroNodoCero**, un contrato simple en Solidity, comentado en español, con la guía para desplegarlo en Fuji con Remix y Core Wallet y leer sus eventos con el workflow 16.

## Por dónde empezar

1. **10**, para ver cómo se le pregunta algo a la red.
2. **12**, el desafío: con un hash tuyo (una transferencia chica desde Core a alguien de tu equipo).
3. Después, según tu proyecto: **13** si cobrás o verificás pagos, **14** si querés avisos, **15** si usás tokens y **16** con el contrato si querés dejar algo tuyo en la red.

Para un proyecto completo, mirá las guías [Pagos verificables en Fuji](https://github.com/nodo-cero-bo/guias/blob/main/proyectos/03-pagos-verificables-en-fuji.md), [Agente Web3 que lee Fuji](https://github.com/nodo-cero-bo/guias/blob/main/proyectos/04-agente-web3-que-lee-fuji.md) y [Tu contrato en Fuji](https://github.com/nodo-cero-bo/guias/blob/main/proyectos/06-tu-contrato-en-fuji.md).

## Lo que conviene saber del RPC público

Lo medimos en vivo el 21 de noviembre de 2026:

- **Responde rápido y sin clave**, pero limita la cantidad de pedidos por minuto. Si lo llamás muchas veces seguidas, responde `429 Too Many Requests` durante un minuto. Cada workflow hace pocos pedidos y los vuelve a intentar si fallan (**Settings → Retry On Fail**); el 15 y el 16, que hacen varios, los mandan de a uno (**Batching**). No lo pongas en un bucle ni en un horario de menos de un minuto.
- **`eth_getLogs` acepta hasta 100 bloques por pedido.** Con más, responde «block range too large». El workflow 16 parte el rango en tramos.
- **Los errores de JSON-RPC llegan con HTTP 200**, en el campo `error` en vez de `result` (por ejemplo, un hash mal escrito). Una transacción que no existe llega como `result: null`. Los workflows revisan los dos casos.
- **El explorador** que responde para Fuji es `build.avax.network/explorer/fuji/c-chain` (el de `subnets-test.avax.network` redirige ahí).

## Los datos de ejemplo

Todos son reales y se verificaron en vivo en Fuji antes de ponerlos:

| Dato | Dónde se usa | Qué es |
|---|---|---|
| `0xe3f00c7d004c3219b867f2349e528be962712ea328b9e7007b233b58af655150` | 12 y 13 | Una transferencia de 0.5 AVAX, bloque 61411475, estado `0x1` |
| `0x27424800d38c80f6342568475080b27d7eeb749363d50f79b7b0c05ed4caf9f3` | README del 13 | Una transacción que falló (estado `0x0`), para probar esa regla |
| `0xd00ae08403b9bbb9124bb305c09058e32c39a48c` | 11 y 14 | El contrato WAVAX de Fuji (`symbol()` devuelve `WAVAX`), con saldo |
| `0x5425890298aed601595a70ab815c96711a31bc65` | 15 y 16 | El USDC de Circle en Fuji: está en la [lista oficial de Circle](https://developers.circle.com/stablecoins/usdc-contract-addresses), `symbol()` devuelve `USDC` y `decimals()`, `6` |

## Seguridad

Ningún workflow pide ni guarda claves privadas ni frases de recuperación: leer la red no las necesita. Lo que se firma (mandar AVAX, desplegar o usar un contrato) se hace en Core Wallet, y vos lo confirmás. Usá una wallet nueva para la hackathon, separada de cualquiera con plata real.

## Documentación

- [C-Chain RPC](https://build.avax.network/docs/rpcs/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026), en la documentación de Avalanche.
- [Avalanche Academy](https://build.avax.network/academy?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026): [Blockchain Fundamentals](https://build.avax.network/academy/blockchain/blockchain-fundamentals?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) (sin código), [Avalanche Fundamentals](https://build.avax.network/academy/avalanche-l1/avalanche-fundamentals?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) e [Intro to Solidity](https://build.avax.network/academy/blockchain/solidity-foundry?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026).
- [La API JSON-RPC explicada en español](https://ethereum.org/es/developers/docs/apis/json-rpc/), en ethereum.org.
- [Recursos de Avalanche y Team1](https://github.com/nodo-cero-bo/guias/blob/main/avalanche/recursos.md), en las guías de Nodo Cero.

---

Licencia MIT, como todo el repo. Avalanche, Core, Team1, Circle y USDC son marcas de sus dueños.
