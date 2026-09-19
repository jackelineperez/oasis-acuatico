import { useState } from 'react';
import { FormularioEstadoOrden } from './formularioEstadoOrden';
import { ListaEstadosOrdenAdmin } from './listaEstadoOrden';
import { crearEstadoOrden, actualizarEstadoOrden, eliminarEstadoOrden } from '../../services/estadoOrdenService';

export function GestionEstadosOrden({ estados = [], onActualizarEstados, cargando }) {
  const [estadoAEditar, setEstadoAEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const handleGuardar = (formData) => {
    setGuardando(true);

    if (estadoAEditar) {
      actualizarEstadoOrden(estadoAEditar.id, formData)
        .then(() => {
          alert('Estado actualizado con éxito');
          setEstadoAEditar(null);
          onActualizarEstados();
        })
        .catch((err) => {
          console.error('Error al actualizar estado:', err);
          alert('Error al actualizar el estado');
        })
        .finally(() => {
          setGuardando(false);
        });
    } else {
      crearEstadoOrden(formData)
        .then(() => {
          alert('Estado creado con éxito');
          onActualizarEstados();
        })
        .catch((err) => {
          console.error('Error al crear estado:', err);
          alert('Error al registrar el estado');
        })
        .finally(() => {
          setGuardando(false);
        });
    }
  };

  const handleEditar = (estado) => {
    setEstadoAEditar(estado);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarEditar = () => {
    setEstadoAEditar(null);
  };

  const handleEliminar = (id) => {
    if (eliminando) return;
    if (window.confirm('¿Estás seguro de que deseas eliminar este estado?')) {
      setEliminando(true);
      eliminarEstadoOrden(id)
        .then(() => {
          alert('Estado eliminado con éxito');
          if (estadoAEditar && estadoAEditar.id === id) {
            setEstadoAEditar(null);
          }
          onActualizarEstados();
        })
        .catch((err) => {
          console.error('Error al eliminar estado:', err);
          alert('Error al eliminar el estado');
        })
        .finally(() => setEliminando(false));
    }
  };

  return (
    <section className="gestion-productos-section">
      <div className="gestion-header">
        <h2>📌 Gestión de Estados de Orden</h2>
        <p>Administra los estados disponibles para cada orden del sistema.</p>
      </div>

      <FormularioEstadoOrden
        key={estadoAEditar?.id ?? 'nuevo'}
        estadoAEditar={estadoAEditar}
        onGuardar={handleGuardar}
        onCancelar={handleCancelarEditar}
        guardando={guardando}
      />

      <ListaEstadosOrdenAdmin
        estados={estados}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        cargando={cargando}
      />
    </section>
  );
}