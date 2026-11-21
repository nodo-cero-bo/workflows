# 54 · Respuestas en BigQuery

Una encuesta corta que guarda cada respuesta como una fila en **BigQuery**, el almacén de datos de Google Cloud, y enseguida consulta con SQL cuántas respuestas hay por línea de la hackathon y su promedio. Quien responde ve el resultado al instante. Sirve para cualquier dato que crece y que querés contar, promediar o cruzar: encuestas, registros de asistencia, mediciones, reportes.

```text
Encuesta → Configuración → Armar la fila → Guardar en BigQuery ─┬─ (bien) → Consultar los resultados ─┬─ (bien) → Armar el resumen → Página final
           (proyecto, dataset, tabla)       (INSERT con parámetros) │                    (SELECT)     │
                                                                    └──────────── (error) ───────────┴──→ Explicar el error → Página de error
```

## Qué aprendés

- Qué es BigQuery: un **dataset** es una carpeta de tablas y cada tabla tiene columnas con tipo, como una [tabla](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#tabla-fila-y-columna) de cualquier base de datos.
- A crear un dataset y una tabla con [SQL](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#sql).
- A guardar una fila con un `INSERT` **con parámetros**: lo que escribe la persona viaja aparte de la consulta, así nadie puede colar SQL desde el formulario.
- A consultar con `SELECT ... GROUP BY` y a meter datos de n8n en el SQL con `{{ }}`.
- A ponerle un freno a los costos con **Maximum Bytes Billed**.

## Qué necesitás

- Una cuenta de n8n (n8n Cloud o tu propia n8n 2.48.7).
- Un [proyecto de Google Cloud](https://github.com/nodo-cero-bo/guias/blob/main/glosario.md#proyecto-de-google-cloud) **con facturación** y la **BigQuery API** habilitada (en muchos proyectos ya viene habilitada). El **sandbox** de BigQuery, que se usa sin tarjeta, no alcanza para este workflow: no acepta `INSERT` (DML).
- Una cuenta de servicio con dos roles y su clave JSON:
  - **BigQuery Data Editor** (`roles/bigquery.dataEditor`), dado **sobre el dataset** `nodo_cero`: deja leer y escribir sus tablas.
  - **BigQuery Job User** (`roles/bigquery.jobUser`), en el proyecto: deja correr consultas.
- Una credencial en n8n:

| Credencial | Tipo en n8n | Va en | De dónde sale |
|---|---|---|---|
| **Google Service Account API** | `googleApi` | **Guardar en BigQuery** y **Consultar los resultados** | La clave JSON de tu cuenta de servicio: `client_email` en **Service Account Email** y `private_key` en **Private Key**. |

Paso a paso, desde crear la cuenta: guía [Google Cloud y créditos](https://github.com/nodo-cero-bo/guias/blob/main/00-empezar/08-google-cloud.md).

## Antes de importar: creá la tabla

1. En la consola de Google Cloud, buscá **BigQuery** y entrá (se abre **BigQuery Studio**). Fijate que arriba esté elegido tu proyecto.
2. Tocá **+** (o **Compose a new query**) para abrir el editor de consultas.
3. Pegá esto y tocá **Run**:

   ```sql
   CREATE SCHEMA IF NOT EXISTS nodo_cero OPTIONS (location = 'US');
   CREATE TABLE IF NOT EXISTS nodo_cero.respuestas (
     fecha TIMESTAMP,
     equipo STRING,
     linea STRING,
     puntaje INT64,
     comentario STRING
   );
   ```

4. **Cómo sabés que funcionó**: en el panel de la izquierda (**Explorer**) aparece `nodo_cero` y, adentro, la tabla `respuestas`. Abrila y mirá la pestaña **Schema**: las cinco columnas.
5. Dale permiso a la cuenta de servicio sobre el dataset: en **Explorer**, los tres puntos al lado de `nodo_cero` → **Share** (o **Manage permissions**) → **Add principal**, pegá el `client_email` de tu cuenta de servicio y elegí **BigQuery Data Editor**. El rol **BigQuery Job User** se lo das en **IAM & Admin → IAM**, sobre el proyecto.

En SQL de BigQuery, un dataset se crea con `CREATE SCHEMA`: es lo mismo con otro nombre. Si usás otros nombres, cambialos también en el nodo **Configuración**.

## Cómo importarlo

1. **Copiar y pegar**: en la [página del evento](https://nodo-cero-bo.github.io), «Copiar workflow», y en n8n pegá con Ctrl + V en un workflow nuevo.
2. **Import from URL**: menú del workflow (**···**) → **Import from URL** con este enlace:

   ```text
   https://raw.githubusercontent.com/nodo-cero-bo/workflows/main/50-google-cloud/54-bigquery-respuestas/workflow.json
   ```

3. **Import from File**: bajá [`workflow.json`](workflow.json) y elegí **Import from File**.

## Cómo probarlo

1. Abrí **Configuración** y escribí el **ID** de tu proyecto en `proyecto_id`. `dataset` y `tabla` ya dicen `nodo_cero` y `respuestas`.
2. Abrí **Guardar en BigQuery**, fijate que **Authentication** diga **Service Account** y elegí tu credencial. Hacé lo mismo en **Consultar los resultados**.
3. Tocá **Execute workflow**. Se abre la encuesta **¿Cómo te fue?**.
4. Elegí una línea y un puntaje, escribí un comentario si querés, y tocá **Enviar**.
5. **Cómo sabés que funcionó**: la página final dice «Gracias, tu respuesta quedó guardada» y muestra cuántas respuestas hay por línea, con su promedio. En n8n, la rama de arriba queda verde.
6. Mandá dos o tres respuestas más con otras líneas y mirá cómo cambia el resumen.
7. En BigQuery Studio, corré `SELECT * FROM nodo_cero.respuestas ORDER BY fecha DESC` y vas a ver tus filas, con la hora en UTC.

## Si algo falla

Si Google rechaza el `INSERT` o la consulta, la página dice qué pasó y qué revisar:

| Lo que ves | Qué pasa y cómo se arregla |
|---|---|
| `Not found: Dataset ...` o `Not found: Table ...` | La tabla no existe con ese nombre o está en otro proyecto. Revisá **Configuración** y que hayas corrido el SQL de arriba en el proyecto correcto. |
| `Access Denied` o `403` | A la cuenta de servicio le falta **BigQuery Data Editor** sobre el dataset o **BigQuery Job User** en el proyecto. |
| `Billing has not been enabled for this project` o un mensaje sobre DML en el sandbox | El proyecto no tiene facturación. El sandbox no acepta `INSERT`: vinculá una cuenta de facturación (guía, paso 4). |
| `Query exceeded limit for bytes billed` | La consulta iba a leer más de 1 GB y BigQuery la frenó antes de cobrarla. Con esta tabla no debería pasar: revisá que el `FROM` apunte a tu tabla. |
| `El puntaje tiene que ser un número del 1 al 5` | Llegó un puntaje raro. El formulario lo limita, pero si llamás al workflow de otra forma, mandá del 1 al 5. |
| `BigQuery API has not been used in project ...` | Habilitá la **BigQuery API** en **APIs & Services → Library**. |

## Cómo está armado

| Nodo | Qué hace |
|---|---|
| **Encuesta** (n8n Form Trigger) | Pide equipo (opcional), línea, puntaje del 1 al 5 y un comentario. Ruta: `/form/nodo-cero-encuesta`. |
| **Configuración** (Edit Fields) | `proyecto_id`, `dataset` y `tabla`. Los dos nodos de BigQuery los leen. |
| **Armar la fila** (Code) | Valida el puntaje, recorta los textos largos y deja los cuatro valores como texto. |
| **Guardar en BigQuery** (Google BigQuery, Execute Query) | `INSERT INTO ... VALUES (CURRENT_TIMESTAMP(), NULLIF(@equipo, ''), @linea, CAST(@puntaje AS INT64), NULLIF(@comentario, ''))`. Los valores van en **Options → Query Parameters (Named)**. La fecha la pone BigQuery. |
| **Consultar los resultados** (Google BigQuery, Execute Query) | `SELECT linea, COUNT(*), ROUND(AVG(puntaje), 1) ... GROUP BY linea`. **Return Integers as Numbers** activado. |
| **Armar el resumen** (Code) y **Página final** | Arman la lista por línea y la muestran. |
| **Explicar el error** (Code) y **Página de error** | Reciben la salida de error de los dos nodos de BigQuery (**On Error** = **Continue (using error output)**). |

**Por qué un `INSERT` y no la operación Insert del nodo.** La operación **Insert** del nodo de BigQuery carga por streaming, que se cobra aparte (poco, pero desde la primera fila). Un `INSERT` cuenta como una consulta más y entra en el TiB gratis de cada mes. Además, si falla, el error llega a la rama de error con su mensaje: lo probamos en una n8n 2.48.7 local, contra una imitación de la API de BigQuery.

**Por qué parámetros.** Si pegáramos el comentario adentro del SQL, alguien podría escribir algo que cambie la consulta (eso se llama inyección de SQL). Con `@comentario`, BigQuery lo trata como un texto, diga lo que diga.

**Cuánto cuesta.** El primer TiB de consultas y los primeros 10 GiB de almacenamiento de cada mes no se cobran. Cada consulta, también cada `INSERT`, cuenta como mínimo 10 MB: entran unas 100.000 por mes en lo gratis. **Maximum Bytes Billed** (1 GB) frena cualquier consulta que fuera a leer más. Igual, creá la alerta de presupuesto antes de probar.

## Ideas para extenderlo

- Conectá la tabla a **Looker Studio** para tener un tablero con gráficos, sin código.
- Guardá ahí el tono de cada opinión de [51-sentimiento-natural-language](../51-sentimiento-natural-language) y medí cómo cambia día a día.
- Usá el nodo de BigQuery como herramienta de un **AI Agent**, para que responda preguntas sobre tus datos.
- Programá un resumen diario con **Schedule Trigger** y mandalo por Telegram.

## Documentación oficial

- [Google BigQuery](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlebigquery/) y [credencial Google Service Account](https://docs.n8n.io/integrations/builtin/credentials/google/service-account/) en n8n
- [Roles de BigQuery](https://docs.cloud.google.com/bigquery/docs/access-control), [sandbox](https://docs.cloud.google.com/bigquery/docs/sandbox) y [precios](https://cloud.google.com/bigquery/pricing)
- [Consultas con parámetros](https://docs.cloud.google.com/bigquery/docs/parameterized-queries) e [INSERT y otras sentencias DML](https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/dml-syntax)

---

Licencia MIT. n8n, Google Cloud, BigQuery y Looker Studio son marcas de sus dueños.
