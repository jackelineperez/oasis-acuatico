import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { crearOrden } from '../../services/ordenService';
import { actualizarProducto } from '../../services/productService';
import { crearCliente } from '../../services/clienteService';

export function CheckoutModal({ onCompraFinalizada }) {
  const {
    cart,
    totalItems,
    totalPrice,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    clearCart,
    setCompletedOrder,
    showToast
  } = useCart();

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: '',
    metodoPago: 'Nequi',
    notas: ''
  });

  const [procesando, setProcesando] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (val) => {
    const num = Number(val) || 0;
    return `$ ${num.toLocaleString('es-CO')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Tu carrito está vacío.', 'error');
      setIsCheckoutOpen(false);
      return;
    }

    if (!formData.nombre.trim() || !formData.telefono.trim() || !formData.email.trim() || !formData.direccion.trim()) {
      showToast('Por favor completa todos los campos requeridos (*).', 'error');
      return;
    }

    setProcesando(true);
    setPasoActual(2);

    try {
      // 1. Preparar datos de la orden
      const itemsDetalle = cart.map((item) => {
        const p = item.precioNumerico !== undefined
          ? item.precioNumerico
          : (typeof item.precio === 'number' ? item.precio : parseFloat(String(item.precio).replace(/[^0-9.-]+/g, '')) || 0);
        return {
          id: item.id,
          nombre: item.nombre,
          precio: p,
          cantidad: item.cantidad,
          subtotal: p * item.cantidad
        };
      });

      const ordenPayload = {
        cliente: formData.nombre.trim(),
        fecha: new Date().toISOString().split('T')[0],
        total: Number(totalPrice),
        metodoPago: formData.metodoPago,
        metodo_pago: formData.metodoPago,
        estado: 'Pendiente',
        estado_orden: 'Pendiente',
        telefono: formData.telefono.trim(),
        email: formData.email.trim(),
        direccion: `${formData.direccion.trim()}${formData.ciudad ? `, ${formData.ciudad.trim()}` : ''}`,
        notas: formData.notas.trim() || '',
        descuento: 0,
        detalle: itemsDetalle
      };

      // 2. Guardar la orden en MockAPI
      const ordenCreada = await crearOrden(ordenPayload);

      // 3. Descontar el STOCK de cada producto en MockAPI
      const promesasStock = cart.map(async (item) => {
        const stockActual = Number(item.stock) || 0;
        const nuevoStock = Math.max(0, stockActual - item.cantidad);
        
        try {
          await actualizarProducto(item.id, {
            id: item.id,
            nombre: item.nombre,
            descripcion: item.descripcion || '',
            precio: item.precio,
            categoria: item.categoria || '',
            imagen: item.imagen || '',
            tag: item.tag || '',
            stock: nuevoStock,
            estado: nuevoStock > 0
          });
        } catch (errStock) {
          console.error(`Error al descontar stock del producto #${item.id}:`, errStock);
        }
      });

      await Promise.allSettled(promesasStock);

      // 4. Opcional: Registrar cliente en MockAPI
      try {
        await crearCliente({
          nombre: formData.nombre.trim(),
          apellido: '',
          telefono: formData.telefono.trim(),
          email: formData.email.trim(),
          correo: formData.email.trim(),
          direccion: formData.direccion.trim(),
          documento: '',
          estado: true
        });
      } catch (errCliente) {
        // Silencioso si falla la creación de cliente
        console.log('Nota: no se requirió duplicar cliente en MockAPI', errCliente);
      }

      // 5. Notificar actualización de productos y órdenes al estado principal
      if (onCompraFinalizada) {
        onCompraFinalizada();
      }

      // 6. Preparar objeto de orden completada para el comprobante
      const ordenResultado = {
        ...ordenPayload,
        id: ordenCreada?.id || `ORD-${Date.now().toString().slice(-4)}`
      };

      // 7. Limpiar carrito y abrir modal de comprobante
      clearCart();
      setIsCheckoutOpen(false);
      setCompletedOrder(ordenResultado);
      showToast('🎉 ¡Orden finalizada y stock actualizado con éxito!', 'success');
    } catch (error) {
      console.error('Error durante el proceso de finalización de compra:', error);
      showToast('Ocurrió un error al procesar la compra. Por favor intenta nuevamente.', 'error');
    } finally {
      setProcesando(false);
      setPasoActual(1);
    }
  };

  return (
    <div className="checkout-overlay" onClick={() => !procesando && setIsCheckoutOpen(false)}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="checkout-header">
          <div className="checkout-title-wrap">
            <span className="checkout-badge-icon">🛍️</span>
            <div>
              <h3 className="checkout-title">Finalización de Compra</h3>
              <p className="checkout-subtitle">Ingresa tus datos de entrega y confirma tu pedido</p>
            </div>
          </div>
          {!procesando && (
            <button
              className="checkout-close-btn"
              onClick={() => setIsCheckoutOpen(false)}
              aria-label="Cerrar ventana de pago"
            >
              ✕
            </button>
          )}
        </div>

        {/* Formulario y Resumen */}
        <div className="checkout-body">
          {procesando ? (
            <div className="checkout-loading-state">
              <div className="loading-spinner-aquatic"></div>
              <h4>Procesando tu pedido en Oasis Acuático...</h4>
              <p>Estamos registrando la orden y actualizando el stock disponible en la base de datos.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="checkout-form-grid">
              {/* Left Column: Form Fields */}
              <div className="checkout-fields-col">
                <h4 className="checkout-col-heading">📍 Datos de Envío y Contacto</h4>

                <div className="form-group">
                  <label htmlFor="checkout-nombre" className="form-label">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="checkout-nombre"
                    name="nombre"
                    className="form-input"
                    placeholder="Ej. Juan Pérez"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="checkout-telefono" className="form-label">
                      Teléfono / Celular *
                    </label>
                    <input
                      type="tel"
                      id="checkout-telefono"
                      name="telefono"
                      className="form-input"
                      placeholder="Ej. 3101234567"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="checkout-email" className="form-label">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      id="checkout-email"
                      name="email"
                      className="form-input"
                      placeholder="ejemplo@correo.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="checkout-direccion" className="form-label">
                      Dirección de Entrega *
                    </label>
                    <input
                      type="text"
                      id="checkout-direccion"
                      name="direccion"
                      className="form-input"
                      placeholder="Ej. Calle 123 #45-67 Apto 201"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="checkout-ciudad" className="form-label">
                      Ciudad / Municipio
                    </label>
                    <input
                      type="text"
                      id="checkout-ciudad"
                      name="ciudad"
                      className="form-input"
                      placeholder="Ej. Bogotá, Medellín, Cali..."
                      value={formData.ciudad}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="checkout-metodoPago" className="form-label">
                    Método de Pago *
                  </label>
                  <select
                    id="checkout-metodoPago"
                    name="metodoPago"
                    className="form-input"
                    value={formData.metodoPago}
                    onChange={handleChange}
                  >
                    <option value="Nequi">📱 Nequi</option>
                    <option value="Daviplata">📲 Daviplata</option>
                    <option value="Efectivo">💵 Contra entrega (Efectivo)</option>
                    <option value="Transferencia">🏦 Transferencia Bancaria</option>
                    <option value="Tarjeta">💳 Tarjeta Débito / Crédito</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="checkout-notas" className="form-label">
                    Notas o Instrucciones Especiales
                  </label>
                  <textarea
                    id="checkout-notas"
                    name="notas"
                    className="form-input form-textarea"
                    placeholder="Detalles para la entrega, horarios preferidos, referencias..."
                    rows="2"
                    value={formData.notas}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="checkout-summary-col">
                <h4 className="checkout-col-heading">📋 Resumen del Pedido</h4>

                <div className="checkout-items-preview">
                  {cart.map((item) => {
                    const precio = item.precioNumerico !== undefined
                      ? item.precioNumerico
                      : (typeof item.precio === 'number' ? item.precio : parseFloat(String(item.precio).replace(/[^0-9.-]+/g, '')) || 0);
                    return (
                      <div key={item.id} className="checkout-item-preview-row">
                        <div className="checkout-item-name-group">
                          <span className="checkout-item-qty">{item.cantidad}x</span>
                          <span className="checkout-item-name">{item.nombre}</span>
                        </div>
                        <span className="checkout-item-subtotal">
                          {formatPrice(precio * item.cantidad)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="checkout-totals-card">
                  <div className="checkout-total-row">
                    <span>Productos ({totalItems}):</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="checkout-total-row">
                    <span>Envío:</span>
                    <span className="text-free-green">Coordinación directa</span>
                  </div>
                  <div className="checkout-total-row final-total">
                    <span>Total a Pagar:</span>
                    <span className="total-highlight-large">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <div className="checkout-notice-card">
                  <p>🔒 <strong>Compra Segura</strong>: Tu pedido será registrado directamente en el sistema y descontará el stock disponible en tienda.</p>
                </div>

                <div className="checkout-modal-actions">
                  <button
                    type="button"
                    className="btn-back-to-cart"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setIsCartOpen(true);
                    }}
                  >
                    ← Volver al Carrito
                  </button>
                  <button
                    type="submit"
                    className="btn-confirm-order"
                    disabled={procesando}
                  >
                    {procesando ? 'Procesando...' : 'Confirmar Pedido ✓'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
