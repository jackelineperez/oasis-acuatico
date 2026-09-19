import { useState } from 'react';

export function ListaOrdenesAdmin({ ordenes = [], onEditar, onEliminar, cargando }) {
  const [ordenExpandida, setOrdenExpandida] = useState(null);

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

  const toggleExpand = (id) => {
    setOrdenExpandida((prev) => (prev === id ? null : id));
  };

  const formatPrice = (val) => {
    const num = Number(val) || 0;
    return `$ ${num.toLocaleString('es-CO')}`;
  };

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
              <th>Método Pago</th>
              <th>Estado</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => {
              const esExpandida = ordenExpandida === orden.id;
              const items = Array.isArray(orden.detalle) ? orden.detalle : [];

              return (
                <tr key={orden.id} className={esExpandida ? 'tr-expanded-parent' : ''}>
                  <td className="td-id">
                    <button
                      className="btn-toggle-expand"
                      onClick={() => toggleExpand(orden.id)}
                      title={esExpandida ? 'Ocultar detalle' : 'Ver detalle'}
                    >
                      {esExpandida ? '▼' : '▶'} #{orden.id}
                    </button>
                  </td>
                  <td>
                    <strong>{orden.cliente || 'Sin cliente'}</strong>
                    {orden.telefono && <p className="td-sub-info">📞 {orden.telefono}</p>}
                  </td>
                  <td>{orden.fecha || 'Sin fecha'}</td>
                  <td className="td-price">{formatPrice(orden.total)}</td>
                  <td>
                    <span className="badge-payment">
                      {orden.metodoPago || orden.metodo_pago || 'Efectivo'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status ${String(orden.estado).toLowerCase().replace(/\s+/g, '-')}`}>
                      {orden.estado || 'Pendiente'}
                    </span>
                  </td>
                  <td className="td-actions text-right">
                    <button
                      className="btn-action-view-items"
                      onClick={() => toggleExpand(orden.id)}
                    >
                      {esExpandida ? 'Ocultar' : `Ver Items (${items.length})`}
                    </button>
                    <button className="btn-action-edit" onClick={() => onEditar(orden)}>
                      ✏️ Editar
                    </button>
                    <button className="btn-action-delete" onClick={() => onEliminar(orden.id)}>
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal/Panel de Detalle de Orden Expandida */}
      {ordenExpandida && (
        <div className="order-detail-preview-panel">
          {(() => {
            const orden = ordenes.find((o) => o.id === ordenExpandida);
            if (!orden) return null;
            const items = Array.isArray(orden.detalle) ? orden.detalle : [];

            return (
              <div className="order-detail-card">
                <div className="order-detail-header">
                  <h4>🧾 Detalle de la Orden #{orden.id} - {orden.cliente}</h4>
                  <button className="btn-close-preview" onClick={() => setOrdenExpandida(null)}>✕</button>
                </div>

                <div className="order-detail-grid">
                  <div>
                    <p><strong>Fecha:</strong> {orden.fecha}</p>
                    <p><strong>Método de Pago:</strong> {orden.metodoPago || orden.metodo_pago || 'Efectivo'}</p>
                    <p><strong>Estado:</strong> {orden.estado || 'Pendiente'}</p>
                  </div>
                  <div>
                    {orden.telefono && <p><strong>Teléfono:</strong> {orden.telefono}</p>}
                    {orden.email && <p><strong>Email:</strong> {orden.email}</p>}
                    {orden.direccion && <p><strong>Dirección:</strong> {orden.direccion}</p>}
                    {orden.notas && <p><strong>Notas:</strong> {orden.notas}</p>}
                  </div>
                </div>

                <h5 className="order-items-heading">🐟 Productos en esta orden:</h5>
                {items.length === 0 ? (
                  <p className="text-muted-italic">No hay desglose de productos registrado para esta orden antigua.</p>
                ) : (
                  <table className="order-items-mini-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th className="text-center">Cant.</th>
                        <th className="text-right">Precio</th>
                        <th className="text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it, idx) => (
                        <tr key={idx}>
                          <td>{it.nombre}</td>
                          <td className="text-center">{it.cantidad}</td>
                          <td className="text-right">{formatPrice(it.precio)}</td>
                          <td className="text-right">{formatPrice(it.subtotal || (it.precio * it.cantidad))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="order-detail-total-row">
                  <span>Total Orden:</span>
                  <strong>{formatPrice(orden.total)}</strong>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}