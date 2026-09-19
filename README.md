# 🐟 Oasis Acuático

Aplicación web de catálogo y administración para una tienda de productos acuáticos. Combina una **vitrina pública** (catálogo filtrable por categoría) con un **panel de administración** para gestionar productos, usuarios, clientes, órdenes y estados de orden.

Es un frontend de página única (SPA) construido con React y Vite que consume una API REST simulada con [MockAPI](https://mockapi.io).

## Características

- **Catálogo** con banner, tarjetas de producto, etiquetas (`tag`) y filtrado por categoría desde el menú superior o el pie de página.
- **Contador del carrito** en la cabecera al pulsar "Agregar" (por ahora solo es un contador, no hay checkout).
- **CRUD completo** (listar, crear, editar, eliminar) para:
  - Productos
  - Usuarios (con rol y estado)
  - Clientes (contacto, documento, dirección, estado)
  - Órdenes (cliente, fecha, total, estado, método de pago)
  - Estados de orden (nombre, color, descripción)
- Estados de carga y manejo de errores de red: si una petición falla, la lista queda vacía y el error se registra en consola.
- Página 404 para rutas desconocidas.

## Tecnologías

| Herramienta | Uso |
| --- | --- |
| [React 19](https://react.dev) | Interfaz de usuario |
| [React Router 7](https://reactrouter.com) | Enrutamiento del lado del cliente |
| [Vite 8](https://vite.dev) + `@vitejs/plugin-react` | Servidor de desarrollo y build |
| [Oxlint](https://oxc.rs) | Linter |
| MockAPI | Backend REST simulado |

## Requisitos

- [Node.js](https://nodejs.org) (versión LTS reciente)
- npm

## Inicio rápido

```bash
git clone https://github.com/jackelineperez/oasis-acuatico.git
cd oasis-acuatico
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo con HMR |
| `npm run build` | Genera el build de producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción |
| `npm run lint` | Ejecuta Oxlint sobre el proyecto |

## Rutas

| Ruta | Página | Descripción |
| --- | --- | --- |
| `/` | `CatalogoPage` | Catálogo público con filtro por categoría |
| `/productos` | `ProductosPage` | Administración de productos |
| `/usuarios` | `UsuariosPage` | Administración de usuarios |
| `/clientes` | `ClientePage` | Administración de clientes |
| `/ordenes` | `OrdenPage` | Administración de órdenes |
| `/estados-orden` | `EstadoOrdenPage` | Administración de estados de orden |
| `*` | `NotFoundPage` | Página no encontrada |

> Las rutas de administración no tienen autenticación: cualquiera que conozca la URL puede acceder a ellas.

## Estructura del proyecto

```
oasis-acuatico/
├── index.html
├── vite.config.js
├── .oxlintrc.json
├── public/                  # favicon y sprites de iconos
└── src/
    ├── main.jsx             # Punto de entrada (StrictMode + BrowserRouter)
    ├── App.jsx              # Estado global, carga de datos y rutas
    ├── App.css / index.css  # Estilos
    ├── pages/               # Una página por ruta
    ├── components/
    │   ├── Header.jsx, Footer.jsx, Banner.jsx
    │   ├── Menu.jsx, MenuInferior.jsx   # Navegación por categorías
    │   ├── Product.jsx                  # Tarjeta de producto
    │   ├── producto/        # Formulario, gestión y lista de productos
    │   ├── usuario/         # ... de usuarios
    │   ├── cliente/         # ... de clientes
    │   ├── orden/           # ... de órdenes
    │   └── estadoOrden/     # ... de estados de orden
    └── services/            # Capa de acceso a la API (fetch)
```

Cada módulo de administración sigue el mismo patrón de tres componentes: `formulario*` (alta/edición), `gestion*` (orquesta el estado y las operaciones) y `lista*` / `*Admin` (tabla de registros).

## Arquitectura de datos

`App.jsx` mantiene en estado los listados de productos, categorías, usuarios, clientes, órdenes y estados, y los carga todos al montar. Cada página recibe su lista y una función `onActualizar*` que vuelve a pedir los datos tras crear, editar o eliminar un registro.

### API

Los servicios de `src/services/` consumen los siguientes recursos de MockAPI (base `https://6aa6bbd7d7765db985079011.mockapi.io`):

| Recurso | Servicio | Operaciones |
| --- | --- | --- |
| `/producto` | `productService.js` | GET, POST, PUT, DELETE |
| `/categoria` | `categoryService.js` | GET |
| `/usuario` | `usuarioService.js` | GET, POST, PUT, DELETE |
| `/cliente` | `clienteService.js` | GET, POST, PUT, DELETE |
| `/orden` | `ordenService.js` | GET, POST, PUT, DELETE |
| `/estado_orden` | `estadoOrdenService.js` | GET, POST, PUT, DELETE |

### Campos principales

| Entidad | Campos |
| --- | --- |
| Producto | `nombre`, `precio`, `categoria`, `tag`, `imagen`, `descripcion` |
| Usuario | `nombre`, `email`, `telefono`, `documento`, `rol`, `estado` |
| Cliente | `nombre`, `email`, `telefono`, `documento`, `direccion`, `estado` |
| Orden | `cliente`, `fecha`, `total`, `estado`, `metodoPago` |
| Estado de orden | `nombre`, `color`, `descripcion` |

El filtrado del catálogo compara `producto.categoria` con el nombre de la categoría (sin distinguir mayúsculas), por lo que ambos deben coincidir.

## Configuración

La URL de la API está escrita directamente en cada archivo de `src/services/`. Para apuntar a otro backend, cambia la constante `API_URL` en cada servicio (o centralízala en una variable de entorno de Vite, `VITE_API_URL`).

## Limitaciones conocidas

- Sin autenticación ni control de acceso en el panel de administración.
- El carrito solo cuenta clics; no guarda productos ni genera pedidos.
- Los servicios no validan `response.ok`, así que un error HTTP se trata como datos.
- Sin pruebas automatizadas.
- El nombre del paquete (`quickorder`) y el título de `index.html` ("QuickOrder") quedaron de una versión anterior; la marca actual es Oasis Acuático.

## Licencia

Proyecto sin licencia definida.
