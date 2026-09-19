import { useState } from 'react';
import { AuthContext } from './authContext';
import { ROL_ADMIN, iniciarSesion, registrarCliente } from '../services/authService';

const CLAVE_SESION = 'oasis_sesion';

const leerSesion = () => {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE_SESION));
    return guardada?.rol && guardada?.email ? guardada : null;
  } catch {
    return null;
  }
};

const guardarSesion = (sesion) => {
  try {
    if (sesion) localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    else localStorage.removeItem(CLAVE_SESION);
  } catch {
    // Sin almacenamiento disponible: la sesión dura solo mientras la pestaña esté abierta.
  }
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesion);

  const establecer = (sesion) => {
    guardarSesion(sesion);
    setUsuario(sesion);
    return sesion;
  };

  const value = {
    usuario,
    esAdmin: usuario?.rol === ROL_ADMIN,
    login: async (email, clave) => establecer(await iniciarSesion(email, clave)),
    registrar: async (datos) => establecer(await registrarCliente(datos)),
    logout: () => establecer(null)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
