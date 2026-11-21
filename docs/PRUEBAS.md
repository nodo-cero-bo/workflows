# Pruebas en una n8n local

Última corrida: 21 de noviembre de 2026 a las 03:22 (hora de Bolivia) · n8n 2.48.7 · Node v24.21.0 · win32

Cómo se hizo: `npm run probar` (`tools/probar_local.mjs`) importa cada `workflow.json` en una n8n local nueva, sin credenciales, y ejecuta por CLI (`n8n execute`) los que tienen `"probado": "ejecutado"` en su `meta.json` y empiezan con Manual Trigger. Los `"auditado"` se importan y pasan el auditor, pero necesitan cuentas (Gemini, Supabase, Clerk, GitHub) para correr: se prueban en tu n8n después de cargar las credenciales.

Resultado: 23 workflows, 23 importados, 9 ejecutados, 0 con problemas.

| workflow | meta.probado | importa | ejecución | tiempo | resultado |
|---|---|---|---|---|---|
| `00-fundamentos/01-hola-n8n` | ejecutado | sí | success | 5 s | 6 nodos, «Mensaje: buscan integrantes» devolvió 2 ítems |
| `00-fundamentos/02-mi-primera-api` | ejecutado | sí | — | — | no empieza con Manual Trigger: se prueba con el servidor (tools/n8n_local.sh publicar) |
| `00-fundamentos/03-http-request` | ejecutado | sí | success | 5 s | 4 nodos, «Leer las respuestas» devolvió 1 ítem |
| `00-fundamentos/04-formulario` | ejecutado | sí | — | — | no empieza con Manual Trigger: se prueba con el servidor (tools/n8n_local.sh publicar) |
| `00-fundamentos/05-agente-ia` | auditado | sí | — | — | necesita credenciales |
| `10-avalanche-fuji/10-fuji-estado-de-la-red` | ejecutado | sí | success | 5 s | 5 nodos, «Pasar a números legibles» devolvió 1 ítem |
| `10-avalanche-fuji/11-fuji-saldo-wallet` | ejecutado | sí | success | 5 s | 5 nodos, «Responder con el saldo» devolvió 1 ítem |
| `10-avalanche-fuji/12-fuji-leer-transaccion` | ejecutado | sí | success | 5 s | 6 nodos, «Armar el resumen» devolvió 1 ítem |
| `10-avalanche-fuji/13-fuji-verificar-pago` | ejecutado | sí | success | 6 s | 11 nodos, «Registrar en pagos_fuji» devolvió 1 ítem |
| `10-avalanche-fuji/14-fuji-monitor-wallet` | ejecutado | sí | success | 5 s | 6 nodos, «Sin cambios» devolvió 1 ítem |
| `10-avalanche-fuji/15-fuji-token-erc20` | ejecutado | sí | success | 6 s | 5 nodos, «Decodificar las respuestas» devolvió 1 ítem |
| `10-avalanche-fuji/16-fuji-eventos-contrato` | ejecutado | sí | success | 6 s | 6 nodos, «Decodificar los eventos» devolvió 5 ítems |
| `20-clerk/20-clerk-webhook-a-supabase` | auditado | sí | — | — | necesita credenciales |
| `20-clerk/21-clerk-api-protegida` | auditado | sí | — | — | necesita credenciales |
| `20-clerk/22-clerk-invitaciones` | auditado | sí | — | — | necesita credenciales |
| `30-supabase/30-formulario-a-supabase` | auditado | sí | — | — | necesita credenciales |
| `30-supabase/31-api-crud-supabase` | auditado | sí | — | — | necesita credenciales |
| `30-supabase/32-cargar-documentos-rag` | auditado | sí | — | — | necesita credenciales |
| `30-supabase/33-agente-con-memoria-y-rag` | auditado | sí | — | — | necesita credenciales |
| `30-supabase/34-supabase-webhook-ia` | auditado | sí | — | — | necesita credenciales |
| `40-proyectos/40-agente-web3-fuji` | auditado | sí | — | — | necesita credenciales |
| `40-proyectos/41-pagos-fuji-con-login` | auditado | sí | — | — | necesita credenciales |
| `40-proyectos/42-reporte-kpis` | auditado | sí | — | — | necesita credenciales |

## Salida de cada ejecución

El primer ítem que devolvió el último nodo (recortado).

### Nodo Cero · Hola n8n: datos, expresiones y decisiones

`00-fundamentos/01-hola-n8n` · success · último nodo: «Mensaje: buscan integrantes»

```json
{
  "evento": "Nodo Cero",
  "fecha": "21/11/2026",
  "equipo": "Equipo Motacú",
  "integrantes": 3,
  "lugares_libres": 1,
  "tecnologias": "n8n, Avalanche Fuji",
  "usa_ia": false,
  "mensaje": "Equipo Motacú tiene 1 lugar libre. ¿Te sumás?"
}
```

### Nodo Cero · Llamar a cualquier API con HTTP Request

`00-fundamentos/03-http-request` · success · último nodo: «Leer las respuestas»

```json
{
  "temperatura_c": 26.5,
  "humedad_pct": 84,
  "viento_kmh": 16.9,
  "hora_del_dato": "2026-11-21T03:15",
  "bloque_hex": "0x3a91cc6",
  "bloque_fuji": 61414598,
  "resumen": "En Santa Cruz hay 26,5 °C y Fuji va por el bloque 61.414.598."
}
```

### Nodo Cero · Estado de la red Fuji

`10-avalanche-fuji/10-fuji-estado-de-la-red` · success · último nodo: «Pasar a números legibles»

```json
{
  "red": "Avalanche Fuji C-Chain",
  "esFuji": true,
  "chainId": 43113,
  "chainIdHex": "0xa869",
  "ultimoBloque": 61414600,
  "ultimoBloqueHex": "0x3a91cc8",
  "horaDelBloque": "21/11/2026 03:21:46",
  "zonaHoraria": "America/La_Paz",
  "haceSegundos": 2,
  "transaccionesEnElBloque": 2,
  "gasUsadoEnElBloque": 2492640,
  "precioDelGas": {
    "wei": "160",
    "nAVAX": "0.00000016"
  },
  "tarifaBaseDelBloque": {
    "wei": "10",
    "nAVAX": "0.00000001"
  },
  "costoDeUnaTransferencia": {
    "gas": 21000,
    "AVAX": "0.00000000000336"
  },
  "explorador": "https://build.avax.network/e
…
```

### Nodo Cero · Saldo de una wallet en Fuji

`10-avalanche-fuji/11-fuji-saldo-wallet` · success · último nodo: «Responder con el saldo»

```json
{
  "ok": true,
  "red": "Avalanche Fuji C-Chain",
  "direccion": "0xd00ae08403b9bbb9124bb305c09058e32c39a48c",
  "saldoAVAX": "1017872.259549593428297287",
  "saldoWei": "1017872259549593428297287",
  "consultado": "21/11/2026 03:21:53",
  "explorador": "https://build.avax.network/explorer/fuji/c-chain/address/0xd00ae08403b9bbb9124bb305c09058e32c39a48c"
}
```

### Nodo Cero · Leer una transacción en Fuji

`10-avalanche-fuji/12-fuji-leer-transaccion` · success · último nodo: «Armar el resumen»

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
  "precioGas": {
    "wei": "160",
    "nAVAX": "0.00000016"
  },
  "costoAVAX": "0.00000000000336",
  "costoWei": "3360000",
  "bloque": 61411475,
  "confirmaciones": 3129,
  "eventos": 0,
  "explorador": "https://build.avax.network/explorer/fuji/c
…
```

### Nodo Cero · Verificar un pago en Fuji

`10-avalanche-fuji/13-fuji-verificar-pago` · success · último nodo: «Registrar en pagos_fuji»

```json
{
  "verificado": true,
  "motivo": "Pago verificado: 0.5 AVAX a 0x74e3ce84499e0fe6c951878e48f610d61d24a520, con 3133 confirmaciones.",
  "detalle": {
    "regla": "ninguna",
    "hash": "0xe3f00c7d004c3219b867f2349e528be962712ea328b9e7007b233b58af655150",
    "pedido": {
      "destino": "0x74e3ce84499e0fe6c951878e48f610d61d24a520",
      "montoMinimo": "0.1",
      "confirmacionesMinimas": 1
    },
    "explorador": "https://build.avax.network/explorer/fuji/c-chain/tx/0xe3f00c7d004c3219b867f2349e528be962712ea328b9e7007b233b58af655150",
    "de": "0xd2717e58381adbce9a5422dcd3003f490253da40",

…
```

### Nodo Cero · Monitor de una wallet en Fuji

`10-avalanche-fuji/14-fuji-monitor-wallet` · success · último nodo: «Sin cambios»

```json
{
  "direccion": "0xd00ae08403b9bbb9124bb305c09058e32c39a48c",
  "cambio": false,
  "primeraRevision": true,
  "entro": false,
  "saldoAVAX": "1017872.259549593428297287",
  "saldoAnteriorAVAX": null,
  "diferenciaAVAX": "0",
  "movimientoAVAX": "0",
  "revisadoAnterior": null,
  "revisado": "21/11/2026 03:22:09",
  "explorador": "https://build.avax.network/explorer/fuji/c-chain/address/0xd00ae08403b9bbb9124bb305c09058e32c39a48c"
}
```

### Nodo Cero · Saldo de un token ERC-20 en Fuji

`10-avalanche-fuji/15-fuji-token-erc20` · success · último nodo: «Decodificar las respuestas»

```json
{
  "token": "0x5425890298aed601595a70ab815c96711a31bc65",
  "nombre": "USD Coin",
  "simbolo": "USDC",
  "decimales": 6,
  "wallet": "0x93083f60f1877a6ba974d5ed88bb74943deb8390",
  "saldo": "2953953.749881",
  "saldoCrudo": "2953953749881",
  "exploradorToken": "https://build.avax.network/explorer/fuji/c-chain/address/0x5425890298aed601595a70ab815c96711a31bc65",
  "exploradorWallet": "https://build.avax.network/explorer/fuji/c-chain/address/0x93083f60f1877a6ba974d5ed88bb74943deb8390"
}
```

### Nodo Cero · Leer eventos de un contrato en Fuji

`10-avalanche-fuji/16-fuji-eventos-contrato` · success · último nodo: «Decodificar los eventos»

```json
{
  "bloque": 61414381,
  "transaccion": "0x8570a75c5c9ad981d897afd3e0f33f90adbbb01ba649cfa58de06c23c72d743d",
  "contrato": "0x5425890298aed601595a70ab815c96711a31bc65",
  "evento": "Transfer (ERC-20)",
  "de": "0x75b9b758dce00616969ad584894cebc07e66e830",
  "para": "0x0f875601504c9179562506afa34b2d084268869b",
  "valorCrudo": "100020",
  "valor": "0.10002",
  "explorador": "https://build.avax.network/explorer/fuji/c-chain/tx/0x8570a75c5c9ad981d897afd3e0f33f90adbbb01ba649cfa58de06c23c72d743d"
}
```

## Volver a correrlas

```bash
cd workflows
npm i            # n8n 2.48.7, una vez
npm run probar   # o: N8N_INSTALACION=<carpeta con node_modules/n8n> node tools/probar_local.mjs
```

Usa su propia carpeta de datos (`N8N_CARPETA`, por defecto `<tmp>/n8n_probar`) y el puerto `N8N_PUERTO+2` (por defecto 5792) para el task runner, así que puede correr al mismo tiempo que otras instancias de `tools/n8n_local.sh`.
