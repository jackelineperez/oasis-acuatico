import { GestionUsuarios } from '../components/usuario/gestionUsuario';

export function UsuariosPage({ usuarios, onActualizarUsuarios, cargando }) {
  return (
    <GestionUsuarios
      usuarios={usuarios}
      onActualizarUsuarios={onActualizarUsuarios}
      cargando={cargando}
    />
  );
}