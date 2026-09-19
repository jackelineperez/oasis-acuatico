import { useState } from 'react';

export function FormularioEstadoOrden({ estadoAEditar, onGuardar, onCancelar, guardando }) {
  // El formulario se remonta con `key` distinto por registro (ver gestión), así que basta el estado inicial.
  const [formData, setFormData] = useState(() => (
    estadoAEditar ? {
      nombre: estadoAEditar.nombre || '',
      descripcion: estadoAEditar.descripcion || '',
      color: estadoAEditar.color || '#4CAF50'
    } : {
      nombre: '',
      descripcion: '',
      color: '#4CAF50'
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

    if (!formData.nombre.trim()) {
      alert('El nombre del estado es obligatorio.');
      return;
    }

    onGuardar(formData);
  };

  const esEdicion = Boolean(estadoAEditar);

  return (
    <div className="card-form-container">
      <div className="form-header">
        <h3 className="form-title">
          {esEdicion ? '✏️ Editar Estado' : '➕ Registrar Nuevo Estado'}
        </h3>
        <p className="form-subtitle">
          {esEdicion ? 'Actualiza el estado de la orden' : 'Crea un nuevo estado de orden'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre del estado *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-input"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="color" className="form-label">Color</label>
            <input
              type="color"
              id="color"
              name="color"
              className="form-input"
              value={formData.color}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="form-input form-textarea"
            rows="3"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={guardando}>
            {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Estado' : 'Guardar Estado'}
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