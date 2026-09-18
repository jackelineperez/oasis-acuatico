import { useState, useEffect } from 'react';

export function FormularioUsuario({ usuarioAEditar, onGuardar, onCancelar, guardando }) {
  const initialFormState = {
    nombre: '',
    email: '',
    telefono: '',
    documento: '',
    rol: 'Administrador',
    estado: true
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (usuarioAEditar) {
      setFormData({
        nombre: usuarioAEditar.nombre || '',
        email: usuarioAEditar.email || '',
        telefono: usuarioAEditar.telefono || '',
        documento: usuarioAEditar.documento || '',
        rol: usuarioAEditar.rol || 'Administrador',
        estado: usuarioAEditar.estado ?? true
      });
    } else {
      setFormData(initialFormState);
    }
  }, [usuarioAEditar]);

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
      alert('Por favor completa el nombre y el correo del usuario.');
      return;
    }

    onGuardar({
      ...formData,
      estado: formData.estado === true || formData.estado === 'true'
    });
  };

  const esEdicion = Boolean(usuarioAEditar);

  return (
    <div className="card-form-container">
      <div className="form-header">
        <h3 className="form-title">
          {esEdicion ? '✏️ Editar Usuario' : '➕ Registrar Nuevo Usuario'}
        </h3>
        <p className="form-subtitle">
          {esEdicion
            ? 'Modifica los datos del usuario seleccionado'
            : 'Ingresa los datos para registrar un nuevo usuario'}
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
              placeholder="Ej. Ana Gómez"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Ej. ana@correo.com"
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
              placeholder="Ej. 3001234567"
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
              placeholder="Ej. 123456789"
              value={formData.documento}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rol" className="form-label">Rol</label>
            <select
              id="rol"
              name="rol"
              className="form-input"
              value={formData.rol}
              onChange={handleChange}
            >
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Cliente">Cliente</option>
              <option value="Soporte">Soporte</option>
            </select>
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
              <span>Usuario activo</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={guardando}>
            {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Usuario' : 'Guardar Usuario'}
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