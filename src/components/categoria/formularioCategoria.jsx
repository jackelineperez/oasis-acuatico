import { useState } from 'react';

export function FormularioCategoria({ categoriaAEditar, onGuardar, onCancelar, guardando }) {
  // El formulario se remonta con `key` distinto por registro (ver gestión), así que basta el estado inicial.
  const [formData, setFormData] = useState(() => (
    categoriaAEditar ? {
      nombre: categoriaAEditar.nombre || '',
      descripcion: categoriaAEditar.descripcion || '',
      estado: categoriaAEditar.estado ?? true
    } : {
      nombre: '',
      descripcion: '',
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

    if (!formData.nombre.trim()) {
      alert('Por favor ingresa el nombre de la categoría.');
      return;
    }

    onGuardar({
      ...formData,
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      estado: formData.estado === true || formData.estado === 'true'
    });
  };

  const esEdicion = Boolean(categoriaAEditar);

  return (
    <div className="card-form-container">
      <div className="form-header">
        <h3 className="form-title">
          {esEdicion ? '✏️ Editar Categoría' : '➕ Registrar Nueva Categoría'}
        </h3>
        <p className="form-subtitle">
          {esEdicion ? 'Modifica los datos de la categoría' : 'Ingresa los datos para registrar una nueva categoría'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre de la Categoría *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-input"
              placeholder="Ej. Peces Betta, Acuarios & Urnas, Filtros..."
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="estado">Estado</label>
            <label className="checkbox-row" style={{ marginTop: '10px' }}>
              <input
                type="checkbox"
                id="estado"
                name="estado"
                checked={Boolean(formData.estado)}
                onChange={handleChange}
              />
              <span>Categoría activa</span>
            </label>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '12px' }}>
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="form-input form-textarea"
            placeholder="Breve descripción o detalle de los productos pertenecientes a esta categoría..."
            rows="3"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={guardando}>
            {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Categoría' : 'Guardar Categoría'}
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
