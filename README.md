# 🐟 Oasis Acuático — Demo segura

Catálogo de demostración de peces y accesorios para acuarios, construido con React y Vite. La aplicación permite explorar productos, filtrarlos por categoría y simular un pedido sin iniciar sesión ni facilitar datos personales.

## Alcance de la demo

- Catálogo público con filtros por categoría.
- Carrito temporal en memoria del navegador.
- Simulación de pedido y comprobante ficticio generados localmente.
- Sin inicio de sesión, panel de administración, registro de clientes ni formularios de contacto.
- Sin captura de nombre, teléfono, correo, dirección, notas de entrega ni método de pago.
- La simulación no crea pedidos en servicios remotos, no procesa pagos y no modifica inventario.
- El carrito y el comprobante no se guardan en `localStorage`; se pierden al recargar o cerrar la página.

## Tecnologías

- React 19
- React Router 7
- Vite 8
- Oxlint

## Requisitos

- Node.js LTS reciente
- npm

## Inicio rápido

```bash
git clone https://github.com/jackelineperez/oasis-acuatico.git
cd oasis-acuatico
npm install
npm run dev
```

Abre la dirección local indicada por Vite, normalmente `http://localhost:5173`.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Genera `dist/` |
| `npm run preview` | Previsualiza el build |
| `npm run lint` | Ejecuta Oxlint |

## Datos y privacidad

El catálogo sigue leyendo productos y categorías desde los servicios configurados en `src/services/`, que actualmente apuntan a una API de demostración de MockAPI. Esos datos del catálogo no son datos introducidos por quien visita la demo.

El flujo de pedido se ejecuta únicamente en el estado de React del navegador. No hace solicitudes para crear órdenes o clientes, no descuenta stock y no solicita información personal. La información del carrito se mantiene solo mientras la página está abierta.

Esta aplicación es una **demo pública, no un sistema de comercio electrónico de producción**. No debe usarse para compras, pagos ni datos reales. No hay backend de autenticación ni administración expuesto por esta interfaz.

## Estructura principal

```
src/
├── App.jsx
├── main.jsx
├── context/CartContext.jsx
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── cart/
│       ├── CartDrawer.jsx
│       ├── CheckoutModal.jsx
│       └── OrderReceiptModal.jsx
├── pages/CatalogoPage.jsx
└── services/
    ├── productService.js
    └── categoryService.js
```

## Limitaciones

- Los datos del catálogo dependen de la disponibilidad de la API de demostración.
- Los pedidos son ficticios y se descartan al recargar.
- No hay autenticación, autorización, backend transaccional ni pagos reales.
- No hay pruebas automatizadas configuradas.
