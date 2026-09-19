export function ListaCategoriasAdmin({ categorias = [], onEditar, onEliminar, cargando }) {
  if (cargando) {
    return <p className="loading-text">Cargando lista de categorías...</p>;
  }

  if (categorias.length === 0) {
    return (
      <div className="empty-admin-list">
        <p>No hay categorías registradas en el sistema.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <div className="table-header-info">
        <h3 className="table-title">🏷️ Lista de Categorías Registradas</h3>
        <span className="table-count">{categorias.length} categoría(s)</span>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td className="td-id">#{cat.id}</td>
                <td>
                  <strong>{cat.nombre || cat.label}</strong>
                </td>
                <td>
                  <span className="td-desc">{cat.descripcion || 'Sin descripción'}</span>
                </td>
                <td>
                  <span className={`badge-category ${cat.estado === false ? 'badge-inactivo' : ''}`} style={cat.estado === false ? { background: '#f8d7da', color: '#721c24' } : {}}>
                    {cat.estado !== false ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="td-actions text-right">
                  <button className="btn-action-edit" onClick={() => onEditar(cat)}>
                    ✏️ Editar
                  </button>
                  <button className="btn-action-delete" onClick={() => onEliminar(cat.id)}>
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
