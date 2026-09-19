import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

// Redirige al catálogo si el usuario no es administrador.
export function SoloAdmin({ children }) {
  const { esAdmin } = useAuth();
  return esAdmin ? children : <Navigate to="/" replace />;
}
