# 50 · Asistente con Gemini en Vertex AI

Un asistente que conversa en el chat de n8n con **Gemini corriendo en Vertex AI**, la plataforma de IA de Google Cloud. Recuerda la conversación y ayuda a tu equipo a pensar su proyecto: qué servicio de Google Cloud usar, qué nodos de n8n conectar y en qué orden. Es el mismo tipo de agente que [05-agente-ia](../../00-fundamentos/05-agente-ia), pero el modelo corre en tu proyecto de Google Cloud y lo paga su facturación (o tus créditos, si cubren Vertex AI).

```text
Mensaje en el chat → Configuración → Asistente (AI Agent) ─┬─ Gemini en Vertex AI   (piensa y escribe)
                     (tu proyecto)                          └─ Memoria simple        (recuerda los últimos 10 mensajes)
```

> [!IMPORTANT]
> Vertex AI se paga por uso y no tiene nivel gratuito. Si abriste la prueba gratis de Google Cloud desde el 16 de noviembre de 2026, los USD 300 de bienvenida **no cubren** Vertex AI. Antes de probar, creá una **alerta de presupuesto** ([guía, paso 5](https://github.com/nodo-cero-bo/guias/blob/main/00-empezar/08-google-cloud.md#5-creá-la-alerta-de-presupuesto-no-te-la-saltees)). Si preferís no gastar, usá [05-agente-ia](../../00-fundamentos/05-agente-ia), que hace lo mismo con la clave gratis de Google AI Studio.

## Qué aprendés

- A usar el nodo **Google Vertex Chat Model** con una [cuenta de servicio](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#cuenta-de-servicio) de Google Cloud.
- A armar un [agente](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#agente) con **AI Agent**, un mensaje de sistema y [memoria](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#memoria).
- A juntar lo que cambia de persona a persona (el ID de tu proyecto) en un nodo **Configuración** que los demás leen con una [expresión](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#expresión).
- Qué modelos de Gemini hay en Vertex AI, en qué regiones y cuánto cuestan.

## Qué necesitás

- Una cuenta de n8n (n8n Cloud o tu propia n8n 2.48.7).
- Un [proyecto de Google Cloud](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#proyecto-de-google-cloud) con facturación y la API de Vertex AI habilitada (`aiplatform.googleapis.com`). En la consola puede aparecer como **Vertex AI API**, **Agent Platform API** o **Gemini Enterprise Agent Platform API**: Google le cambió el nombre a la plataforma en 2026, pero es la misma API.
- Una cuenta de servicio con el rol **Agent Platform User** (`roles/aiplatform.user`; antes se llamaba «Vertex AI User») y su clave JSON.
- Una credencial en n8n:

| Credencial | Tipo en n8n | Va en | De dónde sale |
|---|---|---|---|
| **Google Service Account API** | `googleApi` | **Gemini en Vertex AI** | La clave JSON de tu cuenta de servicio: `client_email` en **Service Account Email**, `private_key` en **Private Key**, **Region** en **Global (multi-region)**. |

Todo eso, paso a paso y sin dar nada por sabido, está en la guía [Google Cloud y créditos](https://github.com/nodo-cero-bo/guias/blob/main/00-empezar/08-google-cloud.md). Si ya tenés la credencial de los workflows 51 a 53, sirve la misma: sumale el rol a la cuenta de servicio.

## Cómo importarlo

1. **Copiar y pegar**: en la [página del evento](https://nodo-cero-bo.github.io), «Copiar workflow», y en n8n pegá con Ctrl + V en un workflow nuevo.
2. **Import from URL**: menú del workflow (**···**) → **Import from URL** con este enlace:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/50-google-cloud/50-vertex-ai-asistente/workflow.json
   ```

3. **Import from File**: bajá [`workflow.json`](workflow.json) y elegí **Import from File**.

Vas a ver cuatro nodos y varias notas amarillas y rosas que explican cada paso. El nodo **Gemini en Vertex AI** aparece con un aviso rojo: le falta la credencial. Es normal.

## Cómo probarlo

1. Abrí **Configuración** (doble clic). En el campo `proyecto_id` escribí el **ID** de tu proyecto, por ejemplo `nodo-cero-482915`. Lo ves en la consola de Google Cloud, en el selector de proyectos de arriba: es el que está en minúsculas con guiones, no el nombre ni el número.
2. Abrí **Gemini en Vertex AI**. En **Credential to connect with**, elegí tu credencial **Google Service Account API** (o creala ahí con **Create new credential**). Dejá **Model Name** en `gemini-3.5-flash-lite` y **Region** en **Global**.
3. Cerrá el nodo y tocá **Open chat**, abajo del canvas. Se abre un panel de chat.
4. Escribí `Hola, ¿qué servicio de Google Cloud me sirve para traducir avisos al quechua?` y mandalo.
5. **Cómo sabés que funcionó**: en unos segundos aparece la respuesta en el chat y los nodos del canvas se ponen verdes.
6. Seguí con `¿Y cómo lo conecto con n8n?`. La respuesta tiene en cuenta lo anterior: eso es la memoria.
7. Abrí **Asistente** y mirá **Logs**: qué recibió el modelo, qué contestó y cuántos [tokens](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#tokens-de-la-ia) usó.

No se rompe nada si probás: cambiá el mensaje de sistema, el modelo o la temperatura y volvé a preguntar.

## Si algo falla

| Lo que ves | Qué pasa y cómo se arregla |
|---|---|
| `Select or enter a Google Cloud project ID.` | `proyecto_id` está vacío en **Configuración**. Escribí el ID de tu proyecto. |
| `Permission 'aiplatform.endpoints.predict' denied` o `403` | A la cuenta de servicio le falta el rol **Agent Platform User**, o el ID de proyecto no es el de la cuenta. Revisá **IAM & Admin → IAM** en la consola. |
| `Vertex AI API has not been used in project ... or it is disabled` (o el mismo aviso con otro nombre de la API) | La API no está habilitada. Entrá al enlace que trae el error, tocá **Enable**, esperá un minuto y probá de nuevo. |
| `This API method requires billing to be enabled` | El proyecto no tiene una cuenta de facturación. Vinculala en **Billing** (guía, paso 4). |
| `Publisher Model ... was not found` o `404` | El modelo no existe en esa región o cambió de nombre. Dejá **Region** en **Global** y usá un ID de la [lista de modelos](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/google-models). |
| `invalid_grant` o `Invalid JWT Signature` | La clave privada está incompleta o la cuenta de servicio no coincide. Copiá de nuevo el `private_key` entero, con `BEGIN` y `END`, o creá una clave nueva. |
| `429` o `Resource exhausted` | Llegaste a la [cuota](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#cuota) por minuto. Esperá un momento y mandá menos mensajes seguidos. |

## Cómo está armado

| Nodo | Qué hace |
|---|---|
| **Mensaje en el chat** (Chat Trigger) | Recibe cada mensaje con `chatInput` y un `sessionId` por conversación. |
| **Configuración** (Edit Fields) | Suma `proyecto_id` y deja pasar lo que vino del chat (**Include Other Input Fields**). |
| **Asistente** (AI Agent) | Arma la respuesta. Quién es y cómo responde está en **Options → System Message**. |
| **Gemini en Vertex AI** (Google Vertex Chat Model) | **Authentication** = **Google Service Account**, **Project ID** leído de **Configuración** con `$('Configuración').first().json.proyecto_id`, modelo `gemini-3.5-flash-lite`, región `global`, temperatura 0,4. |
| **Memoria simple** (Simple Memory) | Guarda los últimos 10 mensajes de cada conversación en la memoria de n8n (se borra si n8n se reinicia). |

**El modelo.** `gemini-3.5-flash-lite` es estable (GA desde julio de 2026), rápido y el más económico de la línea 3.5. Se sirve desde `global` y desde las multirregiones `us` y `eu`. El que trae el nodo por defecto, `gemini-2.5-flash`, se retiró el 20 de octubre de 2026: por eso el workflow ya trae otro elegido. Para más capacidad, probá `gemini-3.5-flash`. En Vertex AI los IDs van sin `models/` adelante (en la API de Gemini de AI Studio, sí).

**Por qué una cuenta de servicio.** Es una cuenta de Google para programas: tiene sus propios permisos (los roles que le das) y n8n entra con su clave sin usar tu contraseña. Si la clave se filtra, la borrás y listo, sin tocar tu cuenta personal.

**La otra credencial.** El nodo también acepta **Google Vertex AI** (`googleVertexAiApi`), que guarda el proyecto adentro de la credencial. Acá usamos **Google Service Account API** porque es la misma de los workflows 51, 52 y 53.

## Ideas para extenderlo

- Reescribí el **System Message** para que sea el asistente de tu proyecto: de una feria, de una materia, del punto de reciclaje del barrio.
- Sumale herramientas: un **HTTP Request Tool** que llame a Cloud Translation o a Natural Language cuando el agente lo necesite (con la misma credencial).
- Cambiá **Memoria simple** por **Postgres Chat Memory** en Supabase para que la conversación dure, como en [33-agente-con-memoria-y-rag](../../30-supabase/33-agente-con-memoria-y-rag).
- Publicá el chat: en **Mensaje en el chat**, activá **Make Chat Publicly Available**, elegí **Hosted Chat** y publicá. Cualquiera con la URL usa tu facturación, así que sumale **Authentication** y una alerta de presupuesto.

## Documentación oficial

- [Google Vertex Chat Model](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatgooglevertex/), [AI Agent](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/) y [Chat Trigger](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.chattrigger/) en n8n
- [Credencial Google Service Account de n8n](https://docs.n8n.io/integrations/builtin/credentials/google/service-account/) y [credencial Google Vertex AI](https://docs.n8n.io/integrations/builtin/credentials/googlevertexai)
- [Modelos de Google en la plataforma (Vertex AI)](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/google-models) y [Gemini 3.5 Flash-Lite](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-5-flash-lite)
- [Roles y permisos para usar Gemini](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/access-control)
- [Precios](https://cloud.google.com/model-garden/pricing) y [qué cubre la prueba gratis](https://docs.cloud.google.com/free/docs/free-cloud-features)

---

Licencia MIT. n8n, Google Cloud, Vertex AI y Gemini son marcas de sus dueños.
