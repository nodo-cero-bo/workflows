# 52 · Resumir y traducir con Google Cloud

Pegás un aviso largo en español (una campaña de salud, una feria, un corte de agua) y te devuelve dos cosas: un **resumen** en tres frases simples, hecho por **Gemini en Vertex AI**, y su **traducción** con **Cloud Translation** al quechua, al aimara, al guaraní, al inglés o al portugués. Para que lo importante llegue a más gente, en su idioma.

```text
Aviso para tu comunidad → Configuración → Resumir con Gemini → Traducir el resumen → Armar la respuesta → Página final
(texto + idioma)          (qu, ay, gn…)    └─ Gemini en Vertex AI   (Cloud Translation)
```

> [!IMPORTANT]
> **Cloud Translation soporta quechua (`qu`), aimara (`ay`) y guaraní (`gn`).** Lo verificamos en la [lista oficial de idiomas](https://docs.cloud.google.com/translate/docs/languages) el 21 de noviembre de 2026: los tres están en el modelo de traducción neuronal (NMT), que es el que usa este nodo. La traducción automática ayuda mucho, pero no reemplaza a una persona hablante: antes de publicar un aviso, pedile a alguien que lo revise.

## Qué aprendés

- A usar el nodo **Google Translate** con una [cuenta de servicio](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#cuenta-de-servicio).
- A armar una **Basic LLM Chain**: una sola instrucción al modelo, sin memoria ni herramientas, ideal para resumir, clasificar o reescribir.
- A pasar una opción del formulario a un código (`Quechua` → `qu`) con una [expresión](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#expresión).
- Por qué conviene resumir antes de traducir, y cómo limpiar el HTML que devuelve la traducción.

## Qué necesitás

- Una cuenta de n8n (n8n Cloud o tu propia n8n 2.48.7).
- Un [proyecto de Google Cloud](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#proyecto-de-google-cloud) con facturación y dos APIs habilitadas: **Cloud Translation API** y la de Vertex AI (`aiplatform.googleapis.com`, que en la consola puede aparecer como **Vertex AI API** o **Agent Platform API**).
- Una cuenta de servicio con dos roles: **Cloud Translation API User** (`roles/cloudtranslate.user`) y **Agent Platform User** (`roles/aiplatform.user`), y su clave JSON.
- Una credencial en n8n, la misma para los dos nodos de Google:

| Credencial | Tipo en n8n | Va en | De dónde sale |
|---|---|---|---|
| **Google Service Account API** | `googleApi` | **Gemini en Vertex AI** y **Traducir el resumen** | La clave JSON de tu cuenta de servicio: `client_email` en **Service Account Email**, `private_key` en **Private Key**, **Region** en **Global (multi-region)**. |

Paso a paso: guía [Google Cloud y créditos](https://github.com/nodo-cero-bo/guias/blob/main/00-empezar/08-google-cloud.md).

**Lo que cuesta.** Cloud Translation no cobra los primeros 500.000 caracteres por mes (Google lo aplica como un crédito de USD 10 por mes). Vertex AI se paga por [tokens](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#tokens-de-la-ia) y no tiene nivel gratuito; los USD 300 de bienvenida de la prueba gratis **no lo cubren** si la abriste desde el 16 de noviembre de 2026. Creá una alerta de presupuesto antes de probar.

> [!TIP]
> **¿Sin créditos para Vertex AI?** Cambiá el modelo por uno gratis: borrá **Gemini en Vertex AI**, conectá un **Google Gemini Chat Model** en la entrada **Model** de **Resumir con Gemini** y creá la credencial **Google Gemini(PaLM) Api** con una clave de Google AI Studio ([guía 07](https://github.com/nodo-cero-bo/guias/blob/main/00-empezar/07-clave-gemini.md)). La traducción sigue en Google Cloud.

## Cómo importarlo

1. **Copiar y pegar**: en la [página del evento](https://nodo-cero-bo.github.io), «Copiar workflow», y en n8n pegá con Ctrl + V en un workflow nuevo.
2. **Import from URL**: menú del workflow (**···**) → **Import from URL** con este enlace:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/50-google-cloud/52-traducir-y-resumir/workflow.json
   ```

3. **Import from File**: bajá [`workflow.json`](workflow.json) y elegí **Import from File**.

## Cómo probarlo

1. Abrí **Configuración** y escribí el **ID** de tu proyecto en `proyecto_id` (el que está en minúsculas con guiones en el selector de proyectos de la consola).
2. Abrí **Gemini en Vertex AI** y elegí tu credencial. Hacé lo mismo en **Traducir el resumen** (con **Authentication** en **Service Account**).
3. Tocá **Execute workflow**. Se abre el formulario **Resumí y traducí un aviso**.
4. Pegá un aviso, por ejemplo: `Este sábado 29 de noviembre, de 9:00 a 12:00, hay campaña de vacunación gratuita en la plaza del barrio. Traé tu carnet.` Elegí **Quechua** y tocá **Resumir y traducir**.
5. **Cómo sabés que funcionó**: la página final muestra «Resumen en español» y, abajo, «En quechua (qu)» con la traducción. En n8n, todos los nodos quedan verdes.
6. Abrí **Resumir con Gemini** para ver la instrucción que recibió el modelo, y **Traducir el resumen** para ver qué devolvió Google (`translatedText` y `detectedSourceLanguage`).

## Si algo falla

| Lo que ves | Qué pasa y cómo se arregla |
|---|---|
| `Select or enter a Google Cloud project ID.` | Falta `proyecto_id` en **Configuración**. |
| En **Traducir el resumen**: `Cloud Translation API has not been used in project ...` | Habilitá **Cloud Translation API** en el proyecto y esperá un minuto. |
| En **Traducir el resumen**: `403` o `The caller does not have permission` | A la cuenta de servicio le falta el rol **Cloud Translation API User**. |
| En **Gemini en Vertex AI**: `403` o `aiplatform.endpoints.predict` | Falta el rol **Agent Platform User** o la API de Vertex AI no está habilitada. |
| `This API method requires billing to be enabled` | El proyecto no tiene facturación vinculada (guía, paso 4). |
| En **Traducir el resumen**: `Invalid Value` | El código de idioma no existe. Revisá la lista de **Configuración**: `qu`, `ay`, `gn`, `en`, `pt`. |
| La traducción trae `&quot;` o `&#39;` | No pasa si los datos vienen por **Armar la respuesta**, que los limpia. Si usás `translatedText` directo en otro nodo, pasalo antes por esa misma limpieza. |
| El resumen agrega cosas que el texto no dice | Bajá la temperatura de **Gemini en Vertex AI** a 0 y reforzá la instrucción del **Prompt**. |

## Cómo está armado

| Nodo | Qué hace |
|---|---|
| **Aviso para tu comunidad** (n8n Form Trigger) | Pide el texto y el idioma. Ruta: `/form/nodo-cero-traducir`. |
| **Configuración** (Edit Fields) | `proyecto_id` (lo tuyo) y `codigo_idioma`, que pasa la opción del formulario a su código ISO-639. |
| **Resumir con Gemini** (Basic LLM Chain) | Pide tres frases simples en español, sin inventar y con fechas, lugares y horarios tal como están. |
| **Gemini en Vertex AI** (Google Vertex Chat Model) | `gemini-3.5-flash-lite`, región `global`, temperatura 0,2 para que se apegue al texto. |
| **Traducir el resumen** (Google Translate) | Traduce el resumen al idioma elegido con Cloud Translation (API v2, modelo NMT). Google detecta por su cuenta el idioma de origen. |
| **Armar la respuesta** (Code) | Cloud Translation devuelve el texto como HTML: este nodo pasa `&quot;`, `&#39;` y compañía a caracteres normales y junta todo. |
| **Página final** (n8n Form, Completion) | Muestra el resumen y la traducción, con el aviso de revisarla con una persona hablante. |

**Por qué resumir primero.** Un aviso corto se entiende mejor y se traduce mejor. Además, Cloud Translation cobra por carácter: traducir el resumen gasta menos que traducir el texto entero.

**Otros idiomas.** Cloud Translation tiene más de cien. Para sumar uno, agregalo al desplegable del formulario y a la lista de `codigo_idioma` en **Configuración**, con el código de la [página de idiomas](https://docs.cloud.google.com/translate/docs/languages).

## Ideas para extenderlo

- Mandá el aviso traducido por Telegram o guardalo en Supabase con su idioma, para armar un archivo de avisos.
- Traducí al revés: un mensaje en guaraní o en quechua al español (Cloud Translation detecta el idioma de origen).
- Traducí a los tres idiomas de una vez: un **Split Out** con los tres códigos antes de **Traducir el resumen**.
- Juntalo con [51-sentimiento-natural-language](../51-sentimiento-natural-language): traducí al español los mensajes que llegan y después medí su tono.

## Documentación oficial

- [Idiomas de Cloud Translation](https://docs.cloud.google.com/translate/docs/languages), [método `translate` (v2)](https://docs.cloud.google.com/translate/docs/reference/rest/v2/translate), [roles](https://docs.cloud.google.com/translate/docs/access-control) y [precios](https://cloud.google.com/products/translate/pricing)
- [Google Translate](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googletranslate/), [Basic LLM Chain](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.chainllm/) y [Google Vertex Chat Model](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatgooglevertex/) en n8n
- [Credencial Google Service Account de n8n](https://docs.n8n.io/integrations/builtin/credentials/google/service-account/)
- [Gemini 3.5 Flash-Lite en Vertex AI](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-5-flash-lite) y [precios](https://cloud.google.com/model-garden/pricing)

---

Licencia MIT. n8n, Google Cloud, Cloud Translation, Vertex AI y Gemini son marcas de sus dueños.
