# Tu contrato en Fuji: RegistroNodoCero

Un contrato inteligente chico, comentado en español, para dejar algo tuyo en la red de prueba de Avalanche: un registro público de proyectos. Cada vez que alguien registra el suyo, el contrato emite un evento, y n8n lo lee con el workflow [`16-fuji-eventos-contrato`](../../10-avalanche-fuji/16-fuji-eventos-contrato), sin claves y sin cuenta.

| | |
|---|---|
| **Archivo** | [`RegistroNodoCero.sol`](RegistroNodoCero.sol) (Solidity `^0.8.20`, licencia MIT) |
| **Para desplegarlo** | Remix en el navegador y Core Wallet en Fuji, con un poco de AVAX de prueba |
| **Para leerlo** | el workflow 16, que ya sabe decodificar su evento |
| **Probado** | compila sin errores ni avisos con solc 0.8.20, 0.8.30 y 0.8.38; se desplegó y se usó en una EVM local (Cancun): registra, emite el evento con el topic0 de abajo y rechaza un nombre vacío. El workflow 16 decodificó esos logs en n8n 2.48.7 |

> **Avalanche Fuji, a mano:** [Descargá Core Wallet](https://core.app/download?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) y activá el modo testnet ([cómo](https://support.core.app/en/articles/13052998-core-extension-how-do-i-toggle-testnet-on-and-off)) · [Pedí AVAX de prueba en el faucet](https://build.avax.network/console/primary-network/faucet?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Aprendé en Avalanche Academy](https://build.avax.network/academy?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) · [Sumate a Team1 LATAM](https://www.team1.network/?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026#waitlist) · [Explorá tus transacciones](https://build.avax.network/explorer/fuji/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026)

## Qué hace el contrato

```solidity
event ProyectoRegistrado(address indexed autora, string nombre, string enlace, uint256 cuando);

function registrar(string calldata nombre, string calldata enlace) external;
uint256 public totalProyectos;
```

- **`registrar(nombre, enlace)`** es una transacción: la firmás con Core y cuesta un poco de gas (AVAX de prueba). Revisa que el nombre no esté vacío y que los textos no pasen de 100 y 200 bytes, suma uno a `totalProyectos` y emite `ProyectoRegistrado`.
- **`ProyectoRegistrado`** queda guardado en el recibo de la transacción, para siempre: `autora` es quien firmó (`msg.sender`), `nombre` y `enlace` son tus textos y `cuando` es la hora del bloque.
- **`totalProyectos()`** es una lectura gratis: cuántos proyectos se registraron.

Los textos no se guardan en el almacenamiento del contrato, nada más en el evento: es más barato y es justo lo que lee n8n. El contrato no recibe AVAX y no tiene dueña.

## Los números que necesitás

| Qué | Valor | Cómo sale |
|---|---|---|
| **topic0** de `ProyectoRegistrado` | `0xa349a1d38906b94dcd1cbd81cc94738a389a4deaf16ae3d301bc1617cc04df77` | keccak256 de `ProyectoRegistrado(address,string,string,uint256)` |
| Selector de `registrar` | `0xe4acbaa1` | primeros 4 bytes del keccak256 de `registrar(string,string)` |
| Selector de `totalProyectos` | `0xaeb1fda3` | primeros 4 bytes del keccak256 de `totalProyectos()` |
| Red | Avalanche Fuji C-Chain, chainId `43113` | |

El topic0 se calculó con dos librerías distintas (ethers 6.17.0 y @noble/hashes 2.4.0), coincide con el que da la ABI que genera el compilador y con el del log que emitió el contrato en la prueba.

### Cómo se calcula un topic0

El topic0 de un evento es el keccak256 de su **firma**: el nombre y los tipos de los parámetros, entre paréntesis, separados por comas,

- sin espacios y sin los nombres de los parámetros;
- sin la palabra `indexed`;
- con los tipos completos: `uint256`, no `uint`.

Para este contrato: `ProyectoRegistrado(address,string,string,uint256)`.

Para calcular el de tu evento, con Node.js en cualquier carpeta vacía:

```bash
npm init -y
npm install ethers@6.17.0
node -e "const { id } = require('ethers'); console.log(id('ProyectoRegistrado(address,string,string,uint256)'))"
```

Otra forma: usá tu contrato una vez y, en el explorador de Fuji, abrí la transacción y mirá sus eventos (logs): el primer topic es el topic0.

El keccak256 de Ethereum no es el SHA3-256 que trae el nodo Crypto de n8n: se parecen, pero dan resultados distintos.

## Desplegarlo en Fuji, paso a paso

### 1. Preparate

1. Instalá la extensión de [Core Wallet](https://core.app/download?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) en Chrome (o un navegador basado en Chromium) y creá una wallet nueva, separada de cualquiera que uses con plata real.
2. En Core, **Settings** → activá **Testnet Mode** ([cómo](https://support.core.app/en/articles/13052998-core-extension-how-do-i-toggle-testnet-on-and-off)).
3. Pedí AVAX de prueba en el [faucet](https://build.avax.network/console/primary-network/faucet?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026), en la C-Chain, con tu dirección que empieza con `0x`. Desplegar este contrato gasta unas 290 000 unidades de gas: con el gas de Fuji, es una fracción mínima de un AVAX.

> La frase de recuperación es la wallet. Nadie te la va a pedir: no la pegues en Remix, en n8n ni en ningún lado. Remix no necesita ninguna clave: le pide a Core que firme cada transacción y vos la confirmás.

### 2. Compilalo en Remix

1. Abrí [Remix](https://remix.ethereum.org), el editor de contratos en el navegador.
2. En **File explorer**, creá un archivo `RegistroNodoCero.sol` y pegá el contenido de [`RegistroNodoCero.sol`](RegistroNodoCero.sol).
3. Abrí el panel **Solidity Compiler**. En **Compiler**, elegí una versión 0.8 (desde 0.8.20; por ejemplo 0.8.30).
4. Abrí **Advanced Configurations** y poné **EVM Version** en `cancun`. La [documentación de Avalanche](https://build.avax.network/docs/avalanche-l1s/add-utility/deploy-smart-contract?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) lo pide porque la C-Chain admite hasta Cancun, y desde Solidity 0.8.30 los compiladores eligen una versión más nueva por defecto.
5. Tocá **Compile RegistroNodoCero.sol**. El tilde verde dice que está listo.

### 3. Desplegalo con Core

1. Abrí el panel **Deploy & Run Transactions**.
2. En **Environment**, elegí la opción **Injected Provider** (puede aparecer con el nombre de Core). Core te pide permiso para conectarse con Remix: aceptá.
3. Revisá que Remix muestre la red con chain ID `43113` (Fuji) y tu dirección en **Account**.
4. En **Contract** tiene que estar `RegistroNodoCero`. Tocá **Deploy** y confirmá la transacción en Core.
5. En **Deployed Contracts** aparece tu contrato: copiá su dirección (`0x...`).
6. Abrí la dirección en el [explorador de Fuji](https://build.avax.network/explorer/fuji/c-chain?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) y anotá el **número de bloque** de la transacción que lo creó: lo vas a usar en n8n.

### 4. Registrá un proyecto

1. En **Deployed Contracts**, desplegá tu contrato.
2. En `registrar`, completá `nombre` (por ejemplo `Las Fujinas`) y `enlace` (el de tu repo o `""` si no tenés), tocá **transact** y confirmá en Core.
3. Tocá `totalProyectos`: ahora dice `1`. Esa lectura no pide confirmación ni gasta gas.
4. Copiá el hash de la transacción desde la consola de Remix o desde Core, y abrila en el explorador:

   ```text
   https://build.avax.network/explorer/fuji/c-chain/tx/<hash>
   ```

   En sus eventos (logs) está `ProyectoRegistrado`, con el topic0 de arriba.

## Leerlo con n8n

1. Importá [`16-fuji-eventos-contrato`](../../10-avalanche-fuji/16-fuji-eventos-contrato).
2. En **Qué buscar** poné:

   | Campo | Valor |
   |---|---|
   | `contrato` | la dirección de tu contrato |
   | `topic0` | `0xa349a1d38906b94dcd1cbd81cc94738a389a4deaf16ae3d301bc1617cc04df77` |
   | `desdeBloque` | el bloque del despliegue |
   | `decimales` | vacío |

3. **Execute workflow**: un ítem por proyecto registrado, con `autora`, `nombre`, `enlace` y `cuando` legibles. Así salió en la prueba:

   ```json
   { "evento": "ProyectoRegistrado", "autora": "0x00000000000000000000000000000000000c0de0", "nombre": "Las Fujinas", "enlace": "https://github.com/nodo-cero-bo/proyectos", "cuando": "21/11/2026 03:00:00" }
   ```

El RPC público acepta hasta 100 bloques por pedido de eventos; el workflow parte el rango en tramos y mira hasta 1000 bloques desde `desdeBloque`. Si tu contrato es más viejo, mové `desdeBloque` hacia adelante de a 1000.

Para leer `totalProyectos()` desde n8n, usá la misma llamada que el workflow [`15-fuji-token-erc20`](../../10-avalanche-fuji/15-fuji-token-erc20): `eth_call` con `to` = tu contrato y `data` = `0xaeb1fda3`. La respuesta es un número de 32 bytes.

## Hacelo tuyo

- **Otro evento:** cambiá el nombre o los parámetros, recalculá el topic0 (con la firma nueva) y sumalo a **Decodificar los eventos** del workflow 16.
- **Asistencia o certificados:** `registrar(nombreDelTaller)` desde la wallet de cada persona, y n8n arma la lista pública.
- **Votación simple:** un evento por voto y n8n cuenta.
- **Que n8n escuche por su cuenta:** un Schedule Trigger y el último bloque revisado en la memoria del workflow, como en [`14-fuji-monitor-wallet`](../../10-avalanche-fuji/14-fuji-monitor-wallet).
- **Verificá el código en el explorador**, para que cualquiera pueda leerlo: [Using Explorer](https://build.avax.network/docs/primary-network/verify-contract/explorer?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026).

## Si algo falla

| Lo que ves | Qué probar |
|---|---|
| Remix no muestra **Injected Provider** | Revisá que la extensión de Core esté activa y desbloqueada, y que no haya otra wallet respondiendo primero. Recargá Remix. |
| Remix muestra otra red | Activá **Testnet Mode** en Core y volvé a conectar. |
| El despliegue falla sin un motivo claro | Compilá con **EVM Version** en `cancun` y desplegá de nuevo. |
| `registrar` falla con «Falta el nombre» o «muy largo» | Son las reglas del contrato: el nombre no puede ir vacío y los textos tienen un largo máximo (una letra con tilde ocupa 2 bytes). |
| El workflow 16 no encuentra eventos | Revisá la dirección del contrato, el topic0 y que `desdeBloque` sea anterior a tus transacciones. |

## Documentación

- [Remix](https://remix-ide.readthedocs.io/en/latest/): [compilar](https://remix-ide.readthedocs.io/en/latest/compile.html) y [desplegar](https://remix-ide.readthedocs.io/en/latest/run.html).
- Avalanche: [Deploy a Smart Contract](https://build.avax.network/docs/avalanche-l1s/add-utility/deploy-smart-contract?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) y el curso [Intro to Solidity](https://build.avax.network/academy/blockchain/solidity-foundry?utm_source=nodo-cero&utm_medium=github&utm_campaign=hackathon-n8n-bolivia-2026) de Avalanche Academy.
- Solidity: [eventos](https://docs.soliditylang.org/en/latest/contracts.html#events) y [la especificación de la ABI](https://docs.soliditylang.org/en/latest/abi-spec.html).
- [Qué es un contrato inteligente](https://ethereum.org/es/developers/docs/smart-contracts/), en español.
- ethers: [funciones de hash](https://docs.ethers.org/v6/api/hashing/), con `id()`.
- La guía de proyecto [Tu contrato en Fuji](https://github.com/nodo-cero-bo/guias/blob/main/proyectos/06-tu-contrato-en-fuji.md).

---

El contrato y este README están bajo la licencia MIT, como todo el repo. Avalanche, Core, Team1 y Remix son marcas de sus dueños.
