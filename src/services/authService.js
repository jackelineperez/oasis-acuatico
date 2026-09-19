import { createCrudService } from './crudService';

export const ROL_ADMIN = 'Administrador';
export const ROL_CLIENTE = 'Cliente';

const usuariosApi = createCrudService('usuario');

// Credenciales del administrador integrado. Se pueden cambiar con variables de entorno (ver .env.example).
// OJO: al ser una app sin servidor, cualquier valor VITE_* queda visible en el bundle del navegador.
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@oasisacuatico.com';
const ADMIN_CLAVE = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin2026*';

const PREFIJO_HASH = 'sha256:';
const normalizarEmail = (email) => String(email || '').trim().toLowerCase();

export const hashClave = async (clave) => {
  const bytes = new TextEncoder().encode(clave);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
  return PREFIJO_HASH + hex;
};

// Las claves nuevas se guardan con hash; las antiguas de MockAPI están en texto plano.
const claveCoincide = async (guardada, ingresada) => {
  if (typeof guardada !== 'string' || !guardada) return false;
  return guardada.startsWith(PREFIJO_HASH) ? guardada === await hashClave(ingresada) : guardada === ingresada;
};

const crearSesion = (usuario) => ({
  id: usuario.id,
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol === ROL_ADMIN ? ROL_ADMIN : ROL_CLIENTE
});

export const iniciarSesion = async (email, clave) => {
  const correo = normalizarEmail(email);

  if (correo === normalizarEmail(ADMIN_EMAIL) && clave === ADMIN_CLAVE) {
    return { id: 'admin', nombre: 'Administrador', email: ADMIN_EMAIL, rol: ROL_ADMIN };
  }

  const usuarios = await usuariosApi.obtener();
  const usuario = (Array.isArray(usuarios) ? usuarios : []).find((u) => normalizarEmail(u.email) === correo);

  if (!usuario || !(await claveCoincide(usuario.clave, clave))) {
    throw new Error('Correo o contraseña incorrectos.');
  }
  if (usuario.estado === false) {
    throw new Error('Tu cuenta está inactiva. Contacta al administrador.');
  }
  return crearSesion(usuario);
};

export const registrarCliente = async ({ nombre, email, clave }) => {
  const correo = normalizarEmail(email);
  if (correo === normalizarEmail(ADMIN_EMAIL)) {
    throw new Error('Ese correo ya está registrado.');
  }

  const usuarios = await usuariosApi.obtener();
  if ((Array.isArray(usuarios) ? usuarios : []).some((u) => normalizarEmail(u.email) === correo)) {
    throw new Error('Ese correo ya está registrado.');
  }

  const creado = await usuariosApi.crear({
    nombre: nombre.trim(),
    email: correo,
    clave: await hashClave(clave),
    telefono: '',
    documento: '',
    rol: ROL_CLIENTE,
    estado: true
  });
  return crearSesion(creado);
};
