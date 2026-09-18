export function ListaOrdenesAdmin({ ordenes = [], onEditar, onEliminar, cargando }) {
  if (cargando) {
    return <p className="loading-text">Cargando lista de órdenes...</p>;
  }

  if (ordenes.length === 0) {
    return (
      <div className="empty-admin-list">
        <p>No hay órdenes registradas en el sistema.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <div className="table-header-info">
        <h3 className="table-title">📋 Lista de Órdenes</h3>
        <span className="table-count">{ordenes.length} orden(es)</span>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td className="td-id">#{orden.id}</td>
                <td>{orden.cliente || 'Sin cliente'}</td>
                <td>{orden.fecha || 'Sin fecha'}</td>
                <td>${orden.total || 0}</td>
                <td>
                  <span className="badge-category">{orden.estado || 'Pendiente'}</span>
                </td>
                <td className="td-actions text-right">
                  <button className="btn-action-edit" onClick={() => onEditar(orden)}>
                    ✏️ Editar
                  </button>
                  <button className="btn-action-delete" onClick={() => onEliminar(orden.id)}>
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