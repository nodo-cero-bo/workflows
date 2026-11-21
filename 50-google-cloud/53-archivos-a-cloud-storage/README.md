# 53 · Archivos a Cloud Storage

Un formulario para subir un archivo (una foto, un PDF, una planilla) que queda guardado en un **bucket** de **Cloud Storage**, el depósito de archivos de Google Cloud. Le pone un nombre ordenado por fecha y hora, guarda quién lo subió y devuelve un enlace para abrirlo. Sirve para juntar fotos de un reporte ambiental, comprobantes, trabajos de un taller o cualquier archivo que tu proyecto necesite guardar en un lugar seguro.

```text
Subir un archivo → Configuración → Preparar el nombre → Subir al bucket ─┬─ (salió bien) → Armar los enlaces → Página con el enlace
(formulario)       (tu bucket)     (fecha, hora, nombre)                  └─ (error)      → Explicar el error → Página de error
```

## Qué aprendés

- Cómo viaja un archivo por n8n: los **datos binarios** de un ítem, al lado de su JSON.
- A usar el nodo **Google Cloud Storage** con una [cuenta de servicio](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#cuenta-de-servicio).
- A armar nombres de archivo ordenados y sin caracteres raros.
- La diferencia entre la **URL autenticada** (`https://storage.cloud.google.com/...`) y la dirección `gs://`.
- A dar permiso sobre **un bucket** y no sobre todo el proyecto: el permiso justo y nada más.

## Qué necesitás

- Una cuenta de n8n (n8n Cloud o tu propia n8n 2.48.7).
- Un [proyecto de Google Cloud](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#proyecto-de-google-cloud) con facturación y un [bucket](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#cloud-storage-y-bucket). Si lo creás en la región `us-central1`, `us-east1` o `us-west1`, entra en el nivel gratuito: 5 GB-mes de almacenamiento regional.
- Una cuenta de servicio con el rol **Storage Object User** (`roles/storage.objectUser`) **dado sobre ese bucket**, y su clave JSON. Ese rol deja crear, leer y borrar archivos del bucket, pero no tocar otros buckets ni cambiar permisos.
- Una credencial en n8n:

| Credencial | Tipo en n8n | Va en | De dónde sale |
|---|---|---|---|
| **Google Service Account API** | `googleApi` | **Subir al bucket** | La clave JSON de tu cuenta de servicio: `client_email` en **Service Account Email** y `private_key` en **Private Key**. |

Paso a paso: guía [Google Cloud y créditos](https://github.com/nodo-cero-bo/guias/blob/main/00-empezar/08-google-cloud.md) (el bucket y su permiso están en el paso 8).

> [!NOTE]
> **Por qué Storage Object User y no Storage Object Creator.** Según la documentación de Google, Creator deja subir archivos pero no verlos. En una n8n 2.48.7 local vimos que el nodo, después de subir el archivo, pide sus datos (nombre, tamaño, tipo) para devolverlos: es una lectura, y con Creator esa lectura no tiene permiso. Storage Object User incluye subir y leer.

## Cómo importarlo

1. **Copiar y pegar**: en la [página del evento](https://nodo-cero-bo.github.io), «Copiar workflow», y en n8n pegá con Ctrl + V en un workflow nuevo.
2. **Import from URL**: menú del workflow (**···**) → **Import from URL** con este enlace:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/50-google-cloud/53-archivos-a-cloud-storage/workflow.json
   ```

3. **Import from File**: bajá [`workflow.json`](workflow.json) y elegí **Import from File**.

## Cómo probarlo

1. Abrí **Configuración** y escribí el nombre de tu bucket en `bucket`, tal cual lo creaste (sin `gs://`). `carpeta` puede quedar como `nodo-cero`.
2. Abrí **Subir al bucket**. Fijate que **Authentication** diga **Service Account** y elegí tu credencial.
3. Tocá **Execute workflow**. Se abre el formulario **Subí un archivo a Google Cloud**.
4. Escribí el nombre de tu equipo, elegí un archivo chico (una foto o un PDF de prueba, sin datos de nadie) y tocá **Subir**.
5. **Cómo sabés que funcionó**: la página final dice «tu archivo está en Google Cloud», con el nombre con que se guardó (por ejemplo `nodo-cero/2026-11-21/101530-mi-foto.jpg`), el tamaño y un enlace **Abrir el archivo**.
6. Tocá el enlace: Google te pide iniciar sesión y, con la cuenta dueña del proyecto, te muestra el archivo. En la consola, **Cloud Storage → Buckets → tu bucket**, vas a ver la carpeta `nodo-cero` con la fecha de hoy.
7. En el archivo, pestaña de detalles, mirá **Custom metadata**: ahí están `equipo` y `descripcion`.

## Si algo falla

Si Google rechaza la subida, la página dice qué pasó y qué revisar:

| Lo que ves | Qué pasa y cómo se arregla |
|---|---|
| 404 | El bucket no existe con ese nombre. Copialo de la consola, sin `gs://` ni espacios. |
| 403 | A la cuenta de servicio le falta permiso en el bucket. En el bucket, pestaña **Permissions**, **Grant access**: la cuenta de servicio con el rol **Storage Object User**. |
| 403 aunque el archivo sí aparece en el bucket | Lo más probable es que la cuenta tenga **Storage Object Creator**, que no deja leer: cambiá a **Storage Object User** (mirá la nota de arriba). |
| `No llegó ningún archivo` | El formulario no mandó el archivo. Elegí uno antes de tocar **Subir**. |
| `The billing account for the owning project is disabled` | El proyecto no tiene facturación activa (guía, paso 4). |
| El enlace dice que no tenés acceso | La URL autenticada abre el archivo a cuentas de Google con permiso para verlo. Iniciá sesión con la cuenta dueña del proyecto o dale a la otra persona el rol **Storage Object Viewer** en el bucket. |

## Cómo está armado

| Nodo | Qué hace |
|---|---|
| **Subir un archivo** (n8n Form Trigger) | Pide el equipo, el archivo (PDF, PNG, JPG, TXT o CSV) y una descripción. El archivo llega como dato binario en el campo `archivo`. Ruta: `/form/nodo-cero-archivos`. |
| **Configuración** (Edit Fields) | `bucket` y `carpeta`. Tiene **Strip Binary** apagado para que el archivo siga viaje. |
| **Preparar el nombre** (Code) | Arma `<carpeta>/<fecha>/<hora>-<nombre-sin-acentos>.<extensión>` con la hora de Bolivia. La hora adelante evita que dos archivos con el mismo nombre se pisen. |
| **Subir al bucket** (Google Cloud Storage) | **Resource** `Object`, **Operation** `Create`, **Authentication** `Service Account`. Guarda el tipo del archivo (**Content Type**) y, en **Metadata**, el equipo y la descripción. En **Settings**, **On Error** = **Continue (using error output)**. |
| **Armar los enlaces** (Code) | Con el bucket y el nombre que devolvió Google, arma la URL autenticada, la dirección `gs://` y el tamaño legible. |
| **Página con el enlace** / **Página de error** | La página final del formulario, con HTML simple. |

**Las carpetas no existen.** En Cloud Storage todo es un objeto con un nombre. Si el nombre tiene barras (`nodo-cero/2026-11-21/foto.jpg`), la consola lo muestra como carpetas, pero son parte del nombre.

**Tu bucket es privado, y está bien.** Un bucket nuevo viene con la **prevención de acceso público** activada: nadie de afuera puede ver los archivos aunque tenga el enlace. Dejalo así. Para compartir un archivo con alguien sin cuenta de Google, usá una [URL firmada](https://docs.cloud.google.com/storage/docs/access-control/signed-urls), que vence sola; nunca hagas público un bucket con datos de personas.

## Ideas para extenderlo

- Reportes ambientales: que el formulario pida una foto y un lugar, y que Gemini describa la foto antes de guardarla.
- Guardá en Supabase quién subió qué, con la dirección `gs://` de cada archivo.
- Analizá un PDF de texto con [51-sentimiento-natural-language](../51-sentimiento-natural-language) usando su `gs://`.
- Listá lo que hay en el bucket con la operación **Get Many** del mismo nodo, o borrá archivos viejos con una regla de **Lifecycle** del bucket.

## Documentación oficial

- [Google Cloud Storage](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlecloudstorage/) y [credencial Google Service Account](https://docs.n8n.io/integrations/builtin/credentials/google/service-account/) en n8n
- [Crear un bucket](https://docs.cloud.google.com/storage/docs/creating-buckets) y [roles de Cloud Storage](https://docs.cloud.google.com/storage/docs/access-control/iam-roles)
- [URL autenticada y otros puntos de acceso](https://docs.cloud.google.com/storage/docs/request-endpoints) y [prevención de acceso público](https://docs.cloud.google.com/storage/docs/public-access-prevention)
- [Nivel gratuito de Google Cloud](https://docs.cloud.google.com/free/docs/free-cloud-features)

---

Licencia MIT. n8n, Google Cloud y Cloud Storage son marcas de sus dueños.
