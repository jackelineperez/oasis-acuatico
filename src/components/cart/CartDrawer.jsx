import { useEffect } from 'react';
import { useCart } from '../../context/CartContext';

export function CartDrawer() {
  const {
    cart,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const formatPrice = (val) => {
    const num = Number(val) || 0;
    return `$ ${num.toLocaleString('es-CO')}`;
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-group">
            <span className="cart-drawer-icon">🛒</span>
            <div>
              <h3 className="cart-drawer-title">Mi Carrito</h3>
              <p className="cart-drawer-subtitle">{totalItems} producto(s) agregado(s)</p>
            </div>
          </div>
          <button
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">🐠</div>
              <h4>Tu carrito está vacío</h4>
              <p>Agrega peces y accesorios desde el catálogo para iniciar tu pedido.</p>
              <button
                className="btn-start-shopping"
                onClick={() => setIsCartOpen(false)}
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => {
                const precioUnitario = item.precioNumerico !== undefined
                  ? item.precioNumerico
                  : (typeof item.precio === 'number' ? item.precio : parseFloat(String(item.precio).replace(/[^0-9.-]+/g, '')) || 0);
                const subtotal = precioUnitario * item.cantidad;
                const stockDisponible = Number(item.stock) || 0;
                const esTopeStock = item.cantidad >= stockDisponible;

                return (
                  <div key={item.id} className="cart-item-card">
                    <div className="cart-item-img-wrap">
                      {item.imagen ? (
                        <img src={item.imagen} alt={item.nombre} className="cart-item-img" />
                      ) : (
                        <span className="cart-item-placeholder">🐟</span>
                      )}
                    </div>

                    <div className="cart-item-info">
                      <div className="cart-item-top">
                        <h4 className="cart-item-title">{item.nombre}</h4>
                        <button
                          className="cart-item-btn-remove"
                          onClick={() => removeFromCart(item.id)}
                          title="Eliminar del carrito"
                        >
                          🗑️
                        </button>
                      </div>

                      {item.categoria && (
                        <span className="cart-item-category">{item.categoria}</span>
                      )}

                      <div className="cart-item-price-row">
                        <span className="cart-item-unit-price">
                          {formatPrice(precioUnitario)} c/u
                        </span>
                        <span className="cart-item-stock-hint">
                          Stock disp.: <strong>{stockDisponible}</strong>
                        </span>
                      </div>

                      <div className="cart-item-actions-row">
                        <div className="cart-qty-stepper">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                            title="Disminuir"
                          >
                            -
                          </button>
                          <span className="qty-value">{item.cantidad}</span>
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                            disabled={esTopeStock}
                            title={esTopeStock ? 'Stock máximo alcanzado' : 'Aumentar'}
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-subtotal">
                          <span className="subtotal-label">Subtotal:</span>
                          <span className="subtotal-amount">{formatPrice(subtotal)}</span>
                        </div>
                      </div>

                      {esTopeStock && stockDisponible > 0 && (
                        <p className="cart-stock-warning">
                          ⚠️ Máxima cantidad disponible seleccionada
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-box">
              <div className="cart-summary-row">
                <span>Subtotal ({totalItems} productos):</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="cart-summary-row shipping-row">
                <span>Envío:</span>
                <span className="free-shipping-tag">Por coordinar / Gratis</span>
              </div>
              <div className="cart-summary-row total-row">
                <span>Total a Pagar:</span>
                <span className="total-highlight">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <div className="cart-actions-group">
              <button
                className="btn-clear-cart"
                onClick={() => {
                  if (window.confirm('¿Deseas vaciar todos los productos del carrito?')) {
                    clearCart();
                  }
                }}
              >
                Vaciar
              </button>
              <button
                className="btn-checkout-proceed"
                onClick={handleCheckoutClick}
              >
                <span>Finalizar Compra</span>
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
