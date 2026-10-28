import { useCart } from '../../context/CartContext';

export function OrderReceiptModal({ order, onClose }) {
  const { setCompletedOrder } = useCart();
  if (!order) return null;

  const close = () => {
    setCompletedOrder(null);
    if (onClose) onClose();
  };
  const formatPrice = (value) => '$ ' + (Number(value) || 0).toLocaleString('es-CO');
  const items = Array.isArray(order.detalle) ? order.detalle : [];

  return (
    <div className="receipt-overlay" onClick={close}>
      <div className="receipt-modal" onClick={(event) => event.stopPropagation()}>
        <div className="receipt-header">
          <div className="receipt-success-badge"><span className="receipt-check-icon">✓</span></div>
          <h2 className="receipt-title">¡Simulación completada!</h2>
          <p className="receipt-subtitle">Pedido de demostración <strong>#{order.id}</strong>. No es una compra real.</p>
        </div>
        <div className="receipt-body">
          <div className="receipt-meta-grid">
            <div className="meta-block"><span className="meta-label">Fecha local:</span><span className="meta-val">{order.fecha}</span></div>
            <div className="meta-block"><span className="meta-label">Estado:</span><span className="badge-status-pending">Simulado</span></div>
          </div>
          <div className="receipt-section">
            <h4 className="receipt-section-title">🐟 Resumen de productos</h4>
            <div className="receipt-table-wrapper">
              <table className="receipt-table">
                <thead><tr><th>Producto</th><th className="text-center">Cant.</th><th className="text-right">Precio unit.</th><th className="text-right">Subtotal</th></tr></thead>
                <tbody>{items.map((item, index) => <tr key={item.id ?? index}>
                  <td><strong>{item.nombre}</strong></td><td className="text-center">{item.cantidad}</td>
                  <td className="text-right">{formatPrice(item.precio)}</td><td className="text-right">{formatPrice(item.subtotal)}</td>
                </tr>)}</tbody>
              </table>
            </div>
          </div>
          <div className="receipt-total-box"><span>Total ilustrativo:</span><span className="receipt-total-amount">{formatPrice(order.total)}</span></div>
          <div className="receipt-info-notice"><p>Este comprobante es solo visual. No se registró una orden, no se procesó un pago y no se actualizó ningún inventario.</p></div>
        </div>
        <div className="receipt-actions">
          <button className="btn-receipt-print" onClick={() => window.print()}>🖨️ Imprimir comprobante demo</button>
          <button className="btn-receipt-catalog" onClick={close}>Volver al catálogo</button>
        </div>
      </div>
    </div>
  );
}
