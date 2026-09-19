import { useState } from 'react';
import { FormularioOrden } from './formularioOrden';
import { ListaOrdenesAdmin } from './listaOrdenesAdmin';
import { crearOrden, actualizarOrden, eliminarOrden } from '../../services/ordenService';

export function GestionOrdenes({ ordenes = [], onActualizarOrdenes, cargando }) {
  const [ordenAEditar, setOrdenAEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const handleGuardar = (formData) => {
    setGuardando(true);

    if (ordenAEditar) {
      actualizarOrden(ordenAEditar.id, formData)
        .then(() => {
          alert('Orden actualizada con éxito');
          setOrdenAEditar(null);
          onActualizarOrdenes();
        })
        .catch((err) => {
          console.error('Error al actualizar orden:', err);
          alert('Error al actualizar la orden');
        })
        .finally(() => {
          setGuardando(false);
        });
    } else {
      crearOrden(formData)
        .then(() => {
          alert('Orden creada con éxito');
          onActualizarOrdenes();
        })
        .catch((err) => {
          console.error('Error al crear orden:', err);
          alert('Error al registrar la orden');
        })
        .finally(() => {
          setGuardando(false);
        });
    }
  };

  const handleEditar = (orden) => {
    setOrdenAEditar(orden);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarEditar = () => {
    setOrdenAEditar(null);
  };

  const handleEliminar = (id) => {
    if (eliminando) return;
    if (window.confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      setEliminando(true);
      eliminarOrden(id)
        .then(() => {
          alert('Orden eliminada con éxito');
          if (ordenAEditar && ordenAEditar.id === id) {
            setOrdenAEditar(null);
          }
          onActualizarOrdenes();
        })
        .catch((err) => {
          console.error('Error al eliminar orden:', err);
          alert('Error al eliminar la orden');
        })
        .finally(() => setEliminando(false));
    }
  };

  return (
    <section className="gestion-productos-section">
      <div className="gestion-header">
        <h2>🧾 Gestión de Órdenes</h2>
        <p>Registra nuevas órdenes o edita y elimina las existentes.</p>
      </div>

      <FormularioOrden
        key={ordenAEditar?.id ?? 'nuevo'}
        ordenAEditar={ordenAEditar}
        onGuardar={handleGuardar}
        onCancelar={handleCancelarEditar}
        guardando={guardando}
      />

      <ListaOrdenesAdmin
        ordenes={ordenes}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        cargando={cargando}
      />
    </section>
  );
}