import { useState } from 'react';

export function FormularioCliente({ clienteAEditar, onGuardar, onCancelar, guardando }) {
  // El formulario se remonta con `key` distinto por registro (ver gestión), así que basta el estado inicial.
  const [formData, setFormData] = useState(() => (
    clienteAEditar ? {
      nombre: clienteAEditar.nombre || '',
      email: clienteAEditar.email || '',
      telefono: clienteAEditar.telefono || '',
      documento: clienteAEditar.documento || '',
      direccion: clienteAEditar.direccion || '',
      estado: clienteAEditar.estado ?? true
    } : {
      nombre: '',
      email: '',
      telefono: '',
      documento: '',
      direccion: '',
      estado: true
    }
  ));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.email.trim()) {
      alert('Por favor completa el nombre y el correo del cliente.');
      return;
    }

    onGuardar({
      ...formData,
      estado: formData.estado === true || formData.estado === 'true'
    });
  };

  const esEdicion = Boolean(clienteAEditar);

  return (
    <div className="card-form-container">
      <div className="form-header">
        <h3 className="form-title">
          {esEdicion ? '✏️ Editar Cliente' : '➕ Registrar Nuevo Cliente'}
        </h3>
        <p className="form-subtitle">
          {esEdicion ? 'Modifica los datos del cliente' : 'Ingresa los datos del cliente'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre completo *</label>
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
            <label htmlFor="email" className="form-label">Correo *</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono" className="form-label">Teléfono</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              className="form-input"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="documento" className="form-label">Documento</label>
            <input
              type="text"
              id="documento"
              name="documento"
              className="form-input"
              value={formData.documento}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              className="form-input"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="estado">Estado</label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                id="estado"
                name="estado"
                checked={Boolean(formData.estado)}
                onChange={handleChange}
              />
              <span>Cliente activo</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={guardando}>
            {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Cliente' : 'Guardar Cliente'}
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