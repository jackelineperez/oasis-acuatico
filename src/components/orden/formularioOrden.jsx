import { useState } from 'react';

export function FormularioOrden({ ordenAEditar, onGuardar, onCancelar, guardando }) {
  // El formulario se remonta con `key` distinto por registro (ver gestión), así que basta el estado inicial.
  const [formData, setFormData] = useState(() => (
    ordenAEditar ? {
      cliente: ordenAEditar.cliente || '',
      fecha: ordenAEditar.fecha || '',
      total: ordenAEditar.total || '',
      estado: ordenAEditar.estado || 'Pendiente',
      metodoPago: ordenAEditar.metodoPago || 'Efectivo'
    } : {
      cliente: '',
      fecha: '',
      total: '',
      estado: 'Pendiente',
      metodoPago: 'Efectivo'
    }
  ));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const total = Number(formData.total);
    if (!formData.cliente.trim() || !(total >= 0) || formData.total === '') {
      alert('Completa el cliente y un total válido (mayor o igual a 0).');
      return;
    }

    onGuardar({ ...formData, total });
  };

  const esEdicion = Boolean(ordenAEditar);

  return (
    <div className="card-form-container">
      <div className="form-header">
        <h3 className="form-title">
          {esEdicion ? '✏️ Editar Orden' : '➕ Registrar Nueva Orden'}
        </h3>
        <p className="form-subtitle">
          {esEdicion ? 'Actualiza la orden seleccionada' : 'Registra una nueva orden'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="cliente" className="form-label">Cliente *</label>
            <input
              type="text"
              id="cliente"
              name="cliente"
              className="form-input"
              value={formData.cliente}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha" className="form-label">Fecha</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              className="form-input"
              value={formData.fecha}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="total" className="form-label">Total *</label>
            <input
              type="number"
              min="0"
              step="any"
              id="total"
              name="total"
              className="form-input"
              value={formData.total}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="estado" className="form-label">Estado</label>
            <select id="estado" name="estado" className="form-input" value={formData.estado} onChange={handleChange}>
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="metodoPago" className="form-label">Método de pago</label>
            <select id="metodoPago" name="metodoPago" className="form-input" value={formData.metodoPago} onChange={handleChange}>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Nequi">Nequi</option>
              <option value="Transferencia">Transferencia</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={guardando}>
            {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Orden' : 'Guardar Orden'}
          </button>

          {esEdicion && (
            <button type="button" className="btn-cancel" onClick={onCancelar} disabled={guardando}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
}