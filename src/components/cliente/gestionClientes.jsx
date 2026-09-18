import { useState } from 'react';
import { FormularioCliente } from './formularioCliente';
import { ListaClientesAdmin } from './listaClienteAdmin';
import { crearCliente, actualizarCliente, eliminarCliente } from '../../services/clienteService';

export function GestionClientes({ clientes = [], onActualizarClientes, cargando }) {
  const [clienteAEditar, setClienteAEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = (formData) => {
    setGuardando(true);

    if (clienteAEditar) {
      actualizarCliente(clienteAEditar.id, formData)
        .then(() => {
          alert('Cliente actualizado con éxito');
          setClienteAEditar(null);
          onActualizarClientes();
        })
        .catch((err) => {
          console.error('Error al actualizar cliente:', err);
          alert('Error al actualizar el cliente');
        })
        .finally(() => {
          setGuardando(false);
        });
    } else {
      crearCliente(formData)
        .then(() => {
          alert('Cliente creado con éxito');
          onActualizarClientes();
        })
        .catch((err) => {
          console.error('Error al crear cliente:', err);
          alert('Error al registrar el cliente');
        })
        .finally(() => {
          setGuardando(false);
        });
    }
  };

  const handleEditar = (cliente) => {
    setClienteAEditar(cliente);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarEditar = () => {
    setClienteAEditar(null);
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      eliminarCliente(id)
        .then(() => {
          alert('Cliente eliminado con éxito');
          if (clienteAEditar && clienteAEditar.id === id) {
            setClienteAEditar(null);
          }
          onActualizarClientes();
        })
        .catch((err) => {
          console.error('Error al eliminar cliente:', err);
          alert('Error al eliminar el cliente');
        });
    }
  };

  return (
    <section className="gestion-productos-section">
      <div className="gestion-header">
        <h2>👥 Gestión de Clientes</h2>
        <p>Registra nuevos clientes o edita/elimina los clientes del sistema.</p>
      </div>

      <FormularioCliente
        clienteAEditar={clienteAEditar}
        onGuardar={handleGuardar}
        onCancelar={handleCancelarEditar}
        guardando={guardando}
      />

      <ListaClientesAdmin
        clientes={clientes}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        cargando={cargando}
      />
    </section>
  );
}