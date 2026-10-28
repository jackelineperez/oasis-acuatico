import { useCart } from '../../context/CartContext';

export function CheckoutModal() {
  const {
    cart, totalItems, totalPrice, isCheckoutOpen, setIsCheckoutOpen,
    setIsCartOpen, clearCart, setCompletedOrder, showToast
  } = useCart();

  if (!isCheckoutOpen) return null;

  const formatPrice = (value) => '$ ' + (Number(value) || 0).toLocaleString('es-CO');
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!cart.length) {
      showToast('Agrega algún producto antes de simular el pedido.', 'error');
      setIsCheckoutOpen(false);
      return;
    }
    const detail = cart.map((item) => {
      const price = item.precioNumerico ?? (Number(item.precio) || 0);
      return { id: item.id, nombre: item.nombre, precio: price, cantidad: item.cantidad, subtotal: price * item.cantidad };
    });
    setCompletedOrder({
      id: 'DEMO-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
      fecha: new Date().toLocaleDateString('es-CO'),
      estado: 'Simulado',
      total: totalPrice,
      detalle: detail
    });
    clearCart();
    setIsCheckoutOpen(false);
    showToast('Pedido simulado localmente. No se enviaron datos.', 'success');
  };

  return (
    <div className="checkout-overlay" onClick={() => setIsCheckoutOpen(false)}>
      <div className="checkout-modal" onClick={(event) => event.stopPropagation()}>
        <div className="checkout-header">
          <div className="checkout-title-wrap">
            <span className="checkout-badge-icon">🧪</span>
            <div>
              <h3 className="checkout-title">Simular pedido</h3>
              <p className="checkout-subtitle">Demo local: no necesitas ingresar datos personales.</p>
            </div>
          </div>
          <button className="checkout-close-btn" onClick={() => setIsCheckoutOpen(false)} aria-label="Cerrar ventana">✕</button>
        </div>
        <div className="checkout-body">
          <form onSubmit={handleSubmit} className="checkout-form-grid">
            <div className="checkout-fields-col">
              <h4 className="checkout-col-heading">Pedido de demostración</h4>
              <p>La simulación solo usa los productos seleccionados y sus cantidades. No se guarda ni se transmite información personal.</p>
              <p>Esta demo no realiza pagos, no crea órdenes reales y no modifica el inventario.</p>
            </div>
            <div className="checkout-summary-col">
              <h4 className="checkout-col-heading">📋 Resumen del pedido</h4>
              <div className="checkout-items-preview">
                {cart.map((item) => {
                  const price = item.precioNumerico ?? (Number(item.precio) || 0);
                  return <div key={item.id} className="checkout-item-preview-row">
                    <div className="checkout-item-name-group"><span className="checkout-item-qty">{item.cantidad}x</span><span className="checkout-item-name">{item.nombre}</span></div>
                    <span className="checkout-item-subtotal">{formatPrice(price * item.cantidad)}</span>
                  </div>;
                })}
              </div>
              <div className="checkout-totals-card">
                <div className="checkout-total-row"><span>Productos ({totalItems}):</span><span>{formatPrice(totalPrice)}</span></div>
                <div className="checkout-total-row"><span>Envío:</span><span>Solo demostración</span></div>
                <div className="checkout-total-row final-total"><span>Total ilustrativo:</span><span className="total-highlight-large">{formatPrice(totalPrice)}</span></div>
              </div>
              <div className="checkout-notice-card"><p>ℹ️ <strong>Sin compra real:</strong> el resultado se genera en memoria y desaparece al recargar la página.</p></div>
              <div className="checkout-modal-actions">
                <button type="button" className="btn-back-to-cart" onClick={() => { setIsCheckoutOpen(false); setIsCartOpen(true); }}>← Volver al carrito</button>
                <button type="submit" className="btn-confirm-order">Simular pedido ✓</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
