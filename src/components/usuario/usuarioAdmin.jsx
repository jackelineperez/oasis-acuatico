export function ListaUsuariosAdmin({ usuarios = [], onEditar, onEliminar, cargando }) {
  if (cargando) {
    return <p className="loading-text">Cargando lista de usuarios...</p>;
  }

  if (usuarios.length === 0) {
    return (
      <div className="empty-admin-list">
        <p>No hay usuarios registrados en el sistema.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <div className="table-header-info">
        <h3 className="table-title">📋 Lista de Usuarios Registrados</h3>
        <span className="table-count">{usuarios.length} usuario(s)</span>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td className="td-id">#{usuario.id}</td>
                <td>
                  <strong>{usuario.nombre}</strong>
                  <p className="td-desc">{usuario.documento || 'Sin documento'}</p>
                </td>
                <td>{usuario.email || 'Sin correo'}</td>
                <td>
                  <span className="badge-category">{usuario.rol || 'Sin rol'}</span>
                </td>
                <td>
                  {usuario.estado ? 'Activo' : 'Inactivo'}
                </td>
                <td className="td-actions text-right">
                  <button className="btn-action-edit" onClick={() => onEditar(usuario)}>
                    ✏️ Editar
                  </button>
                  <button className="btn-action-delete" onClick={() => onEliminar(usuario.id)}>
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}