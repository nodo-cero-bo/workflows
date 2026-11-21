# App de ejemplo: login con Clerk → n8n → Supabase

Una página HTML, sin instalar nada y sin compilar, que cierra el circuito completo:

1. Iniciás sesión con **Clerk** (la ventana de login es la de Clerk).
2. La página le pide a Clerk tu token de sesión con `Clerk.session.getToken()`.
3. Lo manda a tu webhook de **n8n** ([`21-clerk-api-protegida`](../../20-clerk/21-clerk-api-protegida)) en `Authorization: Bearer <token>`.
4. n8n verifica el token y te devuelve tu fila de la tabla `perfiles` de **Supabase**, que mantiene al día el workflow [`20-clerk-webhook-a-supabase`](../../20-clerk/20-clerk-webhook-a-supabase).

La página muestra tu perfil, la respuesta cruda de n8n y los datos de tu token decodificados, para que veas qué viaja en cada paso. Con **Probar sin token** ves el **401** que contesta n8n cuando falta la sesión.

## Qué necesitás

- Tu aplicación de Clerk ([guía](https://github.com/nodo-cero-bo/guias/blob/main/00-empezar/05-cuenta-clerk.md)). Una instancia de desarrollo (claves `pk_test_`) anda en `localhost`.
- El workflow **21** importado, con sus credenciales y publicado.
- El workflow **20** publicado y conectado al webhook de Clerk, para que exista tu fila en `perfiles`. Sin él, la página te va a mostrar un **404**: la sesión es válida, pero falta el perfil.
- Una forma de servir la carpeta en `http://localhost:5500` (abajo hay tres).

## Configurala en 4 pasos

**1. Completá los dos datos del principio del script** en [`index.html`](index.html):

```js
const PUBLISHABLE_KEY = 'pk_test_COMPLETAR';
const URL_MI_PERFIL = 'https://TU-INSTANCIA.app.n8n.cloud/webhook/mi-perfil';
```

- `PUBLISHABLE_KEY`: en el panel de Clerk, página **API keys**, la **Publishable key**. No es secreta: está hecha para ir en una página. La **Secret key** (`sk_...`) nunca va acá.
- `URL_MI_PERFIL`: la **Production URL** del nodo **Pedido a /mi-perfil** del workflow 21 (con `/webhook/`, no `/webhook-test/`).

La página saca de la Publishable key la dirección de tu instancia de Clerk y carga desde ahí los dos scripts oficiales (`@clerk/ui@1` y `@clerk/clerk-js@6`), igual que el [JavaScript Quickstart de Clerk](https://clerk.com/docs/js-frontend/getting-started/quickstart).

**2. Serví la carpeta en el puerto 5500.** Clerk no arranca si abrís el archivo con doble clic (`file://`). Elegí una:

```bash
# con Python
python -m http.server 5500

# con Node
npx serve -l 5500
```

O con la extensión **Live Server** de VS Code, que usa el 5500. Después abrí `http://localhost:5500`.

**3. Revisá los orígenes permitidos en n8n.** El workflow 21 ya viene con `http://localhost:5500` en dos lugares:

| Dónde | Para qué |
|---|---|
| Nodo **Pedido a /mi-perfil** → **Options** → **Allowed Origins (CORS)** | Que el navegador deje a tu página llamar a n8n y leer la respuesta. Sin esto ves un error de CORS en la consola. |
| Nodo **Leer el pedido** → `origenes_permitidos` | Que n8n acepte tokens pedidos desde tu página: compara el dato `azp` del token con esta lista. |

Si servís la página en otra dirección, cambiala en los dos, sin barra al final (`http://localhost:3000`, no `http://localhost:3000/`). Varias van separadas por comas y sin espacios. Después volvé a publicar.

**4. Probala.** Tocá **Iniciar sesión**, entrá o creá tu cuenta y tocá **Ver mi perfil**.

## Qué tenés que ver

| Respuesta | Qué significa |
|---|---|
| **200** con tu nombre, correo y foto | El circuito completo anda: Clerk, n8n y Supabase. |
| **404** «todavía no hay un perfil» | La sesión es válida, falta tu fila: revisá el workflow 20 y el webhook de Clerk. |
| **401** con «azp» en el motivo | El token salió de una dirección que no está en `origenes_permitidos`. |
| **401** con una sesión recién iniciada | La clave PEM de la credencial JWT Auth del workflow 21 está incompleta o es de otra aplicación. |
| «El navegador no pudo llamar...» | La URL está mal, el workflow no está publicado o falta tu dirección en **Allowed Origins (CORS)**. |

## Cómo está hecha

Todo está en `index.html`, comentado:

- `cargarScript()` carga los dos scripts oficiales de Clerk en orden; después, `Clerk.load({ ui: { ClerkUI: window.__internal_ClerkUICtor } })` los inicializa.
- `Clerk.openSignIn()` abre el login; `Clerk.mountUserButton()` muestra tu avatar con el menú de cuenta; `Clerk.addListener()` repinta la página cuando entrás o salís.
- `llamarApi()` pide el token con `Clerk.session.getToken()` justo antes de cada llamada (dura un minuto y Clerk lo renueva) y hace el `fetch` con `Authorization: Bearer`.
- Los datos que llegan de n8n se muestran con `textContent`, nunca como HTML.

## Para seguir

- Publicala (por ejemplo con GitHub Pages) y sumá esa dirección en los dos lugares de n8n.
- Agregá un formulario que mande datos con `POST` a otro webhook protegido de la misma forma.
- Mostrá algo que sea de cada persona: sus ideas, sus pagos en Fuji (workflow `41-pagos-fuji-con-login`).

Documentación de Clerk: [JavaScript Quickstart](https://clerk.com/docs/js-frontend/getting-started/quickstart), [objeto `Clerk`](https://clerk.com/docs/js-frontend/reference/objects/clerk), [`getToken()`](https://clerk.com/docs/js-frontend/reference/objects/session) y [verificar el token del lado del servidor](https://clerk.com/docs/guides/sessions/manual-jwt-verification).

---

Licencia MIT, como todo el repo. Clerk, n8n y Supabase son marcas de sus dueños y sus nombres se usan nada más para describir con qué se conecta este ejemplo.
