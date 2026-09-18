import { useState } from 'react';
import { FormularioUsuario } from './formularioUsuario';
import { ListaUsuariosAdmin } from './usuarioAdmin';
import { crearUsuario, actualizarUsuario, eliminarUsuario } from '../../services/usuarioService';

export function GestionUsuarios({ usuarios = [], onActualizarUsuarios, cargando }) {
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = (formData) => {
    setGuardando(true);

    if (usuarioAEditar) {
      actualizarUsuario(usuarioAEditar.id, formData)
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
      crearUsuario(formData)
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
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
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
        });
    }
  };

  return (
    <section className="gestion-productos-section">
      <div className="gestion-header">
        <h2>👤 Gestión de Usuarios</h2>
        <p>Registra nuevos usuarios o edita/elimina los usuarios del sistema.</p>
      </div>

      <FormularioUsuario
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