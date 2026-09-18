export function ListaEstadosOrdenAdmin({ estados = [], onEditar, onEliminar, cargando }) {
  if (cargando) {
    return <p className="loading-text">Cargando lista de estados de orden...</p>;
  }

  if (estados.length === 0) {
    return (
      <div className="empty-admin-list">
        <p>No hay estados de orden registrados en el sistema.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <div className="table-header-info">
        <h3 className="table-title">📋 Lista de Estados de Orden</h3>
        <span className="table-count">{estados.length} estado(s)</span>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Color</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estados.map((estado) => (
              <tr key={estado.id}>
                <td className="td-id">#{estado.id}</td>
                <td>
                  <strong>{estado.nombre || 'Sin nombre'}</strong>
                </td>
                <td>{estado.descripcion || 'Sin descripción'}</td>
                <td>
                  <span
                    className="badge-category"
                    style={{
                      backgroundColor: estado.color || '#4CAF50',
                      color: '#fff',
                      border: 'none'
                    }}
                  >
                    {estado.color || '#4CAF50'}
                  </span>
                </td>
                <td className="td-actions text-right">
                  <button className="btn-action-edit" onClick={() => onEditar(estado)}>
                    ✏️ Editar
                  </button>
                  <button className="btn-action-delete" onClick={() => onEliminar(estado.id)}>
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
