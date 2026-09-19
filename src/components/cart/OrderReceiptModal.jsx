import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export function OrderReceiptModal({ order, onClose }) {
  const navigate = useNavigate();
  const { setCompletedOrder } = useCart();

  if (!order) return null;

  const handleClose = () => {
    setCompletedOrder(null);
    if (onClose) onClose();
  };

  const handleGoToOrders = () => {
    handleClose();
    navigate('/ordenes');
  };

  const handleGoToCatalog = () => {
    handleClose();
    navigate('/');
  };

  const formatPrice = (val) => {
    const num = Number(val) || 0;
    return `$ ${num.toLocaleString('es-CO')}`;
  };

  const items = Array.isArray(order.detalle) ? order.detalle : [];

  return (
    <div className="receipt-overlay" onClick={handleClose}>
      <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
        {/* Receipt Header */}
        <div className="receipt-header">
          <div className="receipt-success-badge">
            <span className="receipt-check-icon">✓</span>
          </div>
          <h2 className="receipt-title">¡Compra Finalizada con Éxito!</h2>
          <p className="receipt-subtitle">
            Tu orden <strong>#{order.id}</strong> ha sido registrada y el inventario se ha actualizado en tiempo real.
          </p>
        </div>

        {/* Receipt Content Card */}
        <div className="receipt-body">
          {/* Order Meta */}
          <div className="receipt-meta-grid">
            <div className="meta-block">
              <span className="meta-label">Fecha:</span>
              <span className="meta-val">{order.fecha || new Date().toISOString().split('T')[0]}</span>
            </div>
            <div className="meta-block">
              <span className="meta-label">Estado:</span>
              <span className="badge-status-pending">{order.estado || 'Pendiente'}</span>
            </div>
            <div className="meta-block">
              <span className="meta-label">Método de Pago:</span>
              <span className="meta-val highlight-pay">{order.metodoPago || order.metodo_pago || 'Efectivo'}</span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="receipt-section">
            <h4 className="receipt-section-title">👤 Datos del Cliente</h4>
            <div className="receipt-customer-details">
              <p><strong>Cliente:</strong> {order.cliente}</p>
              {order.telefono && <p><strong>Teléfono / WhatsApp:</strong> {order.telefono}</p>}
              {order.email && <p><strong>Correo:</strong> {order.email}</p>}
              {order.direccion && <p><strong>Dirección de Entrega:</strong> {order.direccion}</p>}
              {order.notas && <p><strong>Notas:</strong> {order.notas}</p>}
            </div>
          </div>

          {/* Products Purchased Table */}
          <div className="receipt-section">
            <h4 className="receipt-section-title">🐟 Resumen de Productos</h4>
            <div className="receipt-table-wrapper">
              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-right">Precio Unit.</th>
                    <th className="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{item.nombre}</strong>
                      </td>
                      <td className="text-center">{item.cantidad}</td>
                      <td className="text-right">{formatPrice(item.precio)}</td>
                      <td className="text-right">{formatPrice(item.subtotal || (item.precio * item.cantidad))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Box */}
          <div className="receipt-total-box">
            <span>Total Pagado / Por Pagar:</span>
            <span className="receipt-total-amount">{formatPrice(order.total)}</span>
          </div>

          <div className="receipt-info-notice">
            <p>💡 Hemos enviado una confirmación a nuestros operadores para despachar tu pedido lo antes posible.</p>
          </div>
        </div>

        {/* Receipt Actions */}
        <div className="receipt-actions">
          <button
            className="btn-receipt-print"
            onClick={() => window.print()}
          >
            🖨️ Imprimir Comprobante
          </button>
          <button
            className="btn-receipt-orders"
            onClick={handleGoToOrders}
          >
            🧾 Ver en Gestión de Órdenes
          </button>
          <button
            className="btn-receipt-catalog"
            onClick={handleGoToCatalog}
          >
            🛍️ Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
}
