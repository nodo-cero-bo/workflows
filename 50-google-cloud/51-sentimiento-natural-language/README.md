# 51 · Opiniones con Cloud Natural Language

Un formulario de opiniones que **Google Cloud Natural Language** lee por vos. Para cada opinión te dice el tono (positivo, negativo, neutral o mixto), con un puntaje, y de qué o de quién habla: las personas, lugares, organizaciones y eventos que nombra (las **entidades**). Sirve para escuchar a tu comunidad sin leer cien mensajes uno por uno: encuestas de un evento, reclamos de un servicio, comentarios de un emprendimiento.

```text
Formulario de opiniones → Analizar con Natural Language ─┬─ (salió bien) → Armar el resumen → Página con el resumen
                          (HTTP Request a Google)        └─ (error)      → Explicar el error → Página de error
```

## Qué aprendés

- A llamar una [API](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#api) de Google Cloud con **HTTP Request** y una [cuenta de servicio](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#cuenta-de-servicio), sin escribir código de autenticación.
- Qué es el **análisis de sentimiento** (`score` y `magnitude`) y el **análisis de entidades**, con la versión 2 de la API.
- A pasar números a palabras simples en un nodo **Code**.
- A manejar errores con la **salida de error** de un nodo, para que quien usa el formulario vea qué pasó en vez de una pantalla en blanco.
- A armar la página final de un formulario con un poco de HTML.

## Qué necesitás

- Una cuenta de n8n (n8n Cloud o tu propia n8n 2.48.7).
- Un [proyecto de Google Cloud](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#proyecto-de-google-cloud) con la **Cloud Natural Language API** habilitada. Las primeras 5.000 unidades por mes de análisis de sentimiento y de entidades no se cobran; una unidad es un texto de hasta 1.000 caracteres. Cada opinión que mandás usa una unidad de cada análisis.
- Una cuenta de servicio con el rol **Service Usage Consumer** (`roles/serviceusage.serviceUsageConsumer`), que deja usar las APIs habilitadas del proyecto, y su clave JSON. Natural Language no tiene un rol propio.
- Una credencial en n8n:

| Credencial | Tipo en n8n | Va en | De dónde sale |
|---|---|---|---|
| **Google Service Account API** | `googleApi` | **Analizar con Natural Language** | La clave JSON de tu cuenta de servicio: `client_email` en **Service Account Email** y `private_key` en **Private Key**. Activá **Set up for use in HTTP Request node** y en **Scope(s)** escribí `https://www.googleapis.com/auth/cloud-platform`. |

Paso a paso, desde crear la cuenta: guía [Google Cloud y créditos](https://github.com/nodo-cero-bo/guias/blob/main/00-empezar/08-google-cloud.md).

> [!NOTE]
> **Por qué HTTP Request y no el nodo de Natural Language.** n8n tiene un nodo **Google Cloud Natural Language**, pero acepta nada más una credencial OAuth2 (no una cuenta de servicio) y hace nada más el análisis de sentimiento. Con **HTTP Request** usás la misma credencial que los workflows 50, 52 y 53 y pedís sentimiento y entidades juntos, con el método `documents:annotateText`.

## Cómo importarlo

1. **Copiar y pegar**: en la [página del evento](https://nodo-cero-bo.github.io), «Copiar workflow», y en n8n pegá con Ctrl + V en un workflow nuevo.
2. **Import from URL**: menú del workflow (**···**) → **Import from URL** con este enlace:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/50-google-cloud/51-sentimiento-natural-language/workflow.json
   ```

3. **Import from File**: bajá [`workflow.json`](workflow.json) y elegí **Import from File**.

## Cómo probarlo

1. Abrí **Analizar con Natural Language**. Debajo de **Credential Type** (que ya dice **Google Service Account API**) está el campo de la credencial: elegí la tuya. Si la creás desde ahí, acordate de activar **Set up for use in HTTP Request node** y de poner el scope.
2. Cerrá el nodo y tocá **Execute workflow**. Se abre otra pestaña con el formulario **¿Qué te pareció?**.
3. Escribí `El taller de n8n en Santa Cruz me encantó, pero el wifi anduvo lento.`, elegí **Un evento** y tocá **Analizar**.
4. **Cómo sabés que funcionó**: la página final dice el tono (en este ejemplo, mixto: una parte buena y una mala), el puntaje, la intensidad y de qué habla («Santa Cruz (lugar), n8n (organización)» o parecido). En n8n, los nodos de la rama de arriba se ponen verdes.
5. Volvé a n8n y abrí **Analizar con Natural Language**: en **Output** está todo lo que devolvió Google, frase por frase.
6. Probá con una opinión muy positiva y con otra muy negativa, y mirá cómo cambia el `score`.

Para dejarlo andando: tocá **Publish** y compartí la URL de producción del formulario (en **Formulario de opiniones**, pestaña **Production URL**).

## Si algo falla

Si Google rechaza el pedido, el formulario no queda en blanco: la página dice qué pasó y qué revisar. Lo más común:

| Lo que ves | Qué pasa y cómo se arregla |
|---|---|
| 403 con `Cloud Natural Language API has not been used in project ... or it is disabled` | La API no está habilitada. Abrí el enlace del mensaje, tocá **Enable**, esperá un minuto y probá de nuevo. |
| 403 con `Request had insufficient authentication scopes` | A la credencial le falta el scope. Abrila, activá **Set up for use in HTTP Request node** y escribí `https://www.googleapis.com/auth/cloud-platform` en **Scope(s)**. |
| 403 con `Permission denied` o `serviceusage` | A la cuenta de servicio le falta el rol **Service Usage Consumer** en el proyecto. |
| 400 con `INVALID_ARGUMENT` | El texto llegó vacío o en un idioma que el análisis no soporta. El workflow pide `es` (español): si tus textos son en otro idioma, cambiá `languageCode` en el cuerpo del pedido o sacalo para que Google lo detecte. |
| 401 o `invalid_grant` | La clave privada está incompleta o no corresponde a esa cuenta de servicio. Copiá de nuevo el `private_key` entero o creá una clave nueva. |
| La página tarda y no muestra nada | Abrí **Executions** en n8n: ahí ves en qué nodo se quedó y el error completo. |

## Cómo está armado

| Nodo | Qué hace |
|---|---|
| **Formulario de opiniones** (n8n Form Trigger) | Pide la opinión y sobre qué es. Ruta: `/form/nodo-cero-opiniones`. |
| **Analizar con Natural Language** (HTTP Request) | `POST https://language.googleapis.com/v2/documents:annotateText` con la credencial **Google Service Account API**. El cuerpo pide `extractDocumentSentiment` y `extractEntities` para un texto `PLAIN_TEXT` en español. En **Settings**, **On Error** = **Continue (using error output)**. |
| **Armar el resumen** (Code) | Pasa el `score` a un tono, ordena las entidades por cantidad de menciones, deja afuera teléfonos, direcciones, números, precios y fechas, y busca la frase más positiva y la más negativa. |
| **Página con el resumen** (n8n Form, Completion) | Muestra el resultado con un poco de HTML (**Respond With** = **Show Text**). |
| **Explicar el error** y **Página de error** | Toman la salida de error, buscan el código de Google y muestran una pista para arreglarlo. |

**Cómo leer el sentimiento.** `score` va de -1 (muy negativo) a 1 (muy positivo). `magnitude` mide cuánta emoción hay en todo el texto, sin importar si es buena o mala: crece con textos largos y con palabras fuertes. Un `score` cerca de 0 con `magnitude` alta es una opinión mixta (cosas buenas y malas que se compensan); con `magnitude` baja, es neutral. Los umbrales del workflow (0,25 para el tono y 1 para la intensidad) son un punto de partida: ajustalos mirando tus propios datos.

**Los idiomas.** El español está soportado para sentimiento y entidades. El quechua, el aimara y el guaraní no están en la lista de idiomas de Natural Language: para esos textos, traducilos antes con [52-traducir-y-resumir](../52-traducir-y-resumir) o usá Gemini.

## Ideas para extenderlo

- Guardá cada opinión con su tono en Supabase, como en [30-formulario-a-supabase](../../30-supabase/30-formulario-a-supabase), y armá un tablero de cómo va tu evento o tu servicio.
- Avisá por Telegram cuando llegue una opinión negativa, para responder rápido.
- Sumá `classifyText: true` en `features` para que Google diga de qué categoría es el texto.
- Analizá un archivo guardado en Cloud Storage: cambiá `content` por `gcsContentUri` con la dirección `gs://` que te da [53-archivos-a-cloud-storage](../53-archivos-a-cloud-storage).

## Documentación oficial

- [`documents.annotateText` (v2)](https://docs.cloud.google.com/natural-language/docs/reference/rest/v2/documents/annotateText) y la [forma de una entidad](https://docs.cloud.google.com/natural-language/docs/reference/rest/v2/Entity)
- [Idiomas soportados por Natural Language](https://docs.cloud.google.com/natural-language/docs/languages) y [precios](https://cloud.google.com/products/natural-language/pricing)
- [Configurar Natural Language](https://docs.cloud.google.com/natural-language/docs/setup)
- [HTTP Request](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/) y [credencial Google Service Account](https://docs.n8n.io/integrations/builtin/credentials/google/service-account/) en n8n
- [Manejo de errores en n8n](https://docs.n8n.io/flow-logic/error-handling/)

---

Licencia MIT. n8n y Google Cloud son marcas de sus dueños.
