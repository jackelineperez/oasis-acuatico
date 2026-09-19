import { useState } from 'react';
import { FormularioUsuario } from './formularioUsuario';
import { ListaUsuariosAdmin } from './usuarioAdmin';
import { hashClave } from '../../services/authService';
import { crearUsuario, actualizarUsuario, eliminarUsuario } from '../../services/usuarioService';

export function GestionUsuarios({ usuarios = [], onActualizarUsuarios, cargando }) {
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const handleGuardar = async (formData) => {
    setGuardando(true);

    // La clave se guarda con hash; si se deja vacía al editar, se conserva la existente.
    const { clave, ...resto } = formData;
    const datos = clave ? { ...resto, clave: await hashClave(clave) } : resto;

    if (usuarioAEditar) {
      actualizarUsuario(usuarioAEditar.id, { ...usuarioAEditar, ...datos })
        .then(() => {
          alert('Usuario actualizado con éxito');
          setUsuarioAEditar(null);
          onActualizarUsuarios();
        })
        .catch((err) => {
          console.error('Error al actualizar usuario:', err);
          alert('Error al actualizar el usuario');
        })
        .finally(() => {
          setGuardando(false);
        });
    } else {
      crearUsuario(datos)
        .then(() => {
          alert('Usuario creado con éxito');
          onActualizarUsuarios();
        })
        .catch((err) => {
          console.error('Error al crear usuario:', err);
          alert('Error al registrar el usuario');
        })
        .finally(() => {
          setGuardando(false);
        });
    }
  };

  const handleEditar = (usuario) => {
    setUsuarioAEditar(usuario);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarEditar = () => {
    setUsuarioAEditar(null);
  };

  const handleEliminar = (id) => {
    if (eliminando) return;
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setEliminando(true);
      eliminarUsuario(id)
        .then(() => {
          alert('Usuario eliminado con éxito');
          if (usuarioAEditar && usuarioAEditar.id === id) {
            setUsuarioAEditar(null);
          }
          onActualizarUsuarios();
        })
        .catch((err) => {
          console.error('Error al eliminar usuario:', err);
          alert('Error al eliminar el usuario');
        })
        .finally(() => setEliminando(false));
    }
  };

  return (
    <section className="gestion-productos-section">
      <div className="gestion-header">
        <h2>👤 Gestión de Usuarios</h2>
        <p>Registra nuevos usuarios o edita/elimina los usuarios del sistema.</p>
      </div>

      <FormularioUsuario
        key={usuarioAEditar?.id ?? 'nuevo'}
        usuarioAEditar={usuarioAEditar}
        onGuardar={handleGuardar}
        onCancelar={handleCancelarEditar}
        guardando={guardando}
      />

      <ListaUsuariosAdmin
        usuarios={usuarios}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        cargando={cargando}
      />
    </section>
  );
}