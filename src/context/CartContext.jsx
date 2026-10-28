import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => setToastMessage({ message, type, id: Date.now() });
  const clearToast = () => setToastMessage(null);
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    return parseFloat(String(price).replace(/[^0-9.-]+/g, '')) || 0;
  };

  const addToCart = (product, quantity = 1) => {
    if (!product) return false;
    const maxStock = Number(product.stock) || 0;
    if (maxStock <= 0) {
      showToast('Este producto aparece agotado en la demo.', 'error');
      return false;
    }
    setCart((previous) => {
      const index = previous.findIndex((item) => String(item.id) === String(product.id));
      if (index >= 0) {
        const updated = [...previous];
        updated[index] = { ...updated[index], cantidad: Math.min(updated[index].cantidad + quantity, maxStock) };
        return updated;
      }
      return [...previous, {
        id: product.id,
        nombre: product.nombre,
        descripcion: product.descripcion || '',
        precio: product.precio,
        precioNumerico: parsePrice(product.precio),
        imagen: product.imagen || '',
        categoria: product.categoria || '',
        tag: product.tag || '',
        stock: maxStock,
        cantidad: Math.min(quantity, maxStock)
      }];
    });
    showToast('Producto agregado al pedido de demostración.', 'success');
    return true;
  };

  const removeFromCart = (productId) => setCart((previous) => previous.filter((item) => String(item.id) !== String(productId)));
  const updateQuantity = (productId, newQuantity) => setCart((previous) => previous
    .map((item) => String(item.id) === String(productId)
      ? (newQuantity <= 0 ? null : { ...item, cantidad: Math.min(newQuantity, Number(item.stock) || 999) })
      : item)
    .filter(Boolean));
  const clearCart = () => setCart([]);
  const totalItems = cart.reduce((sum, item) => sum + (item.cantidad || 0), 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.precioNumerico ?? parsePrice(item.precio)) * (item.cantidad || 0), 0);

  return (
    <CartContext.Provider value={{
      cart, totalItems, totalPrice, isCartOpen, setIsCartOpen,
      isCheckoutOpen, setIsCheckoutOpen, completedOrder, setCompletedOrder,
      addToCart, removeFromCart, updateQuantity, clearCart,
      toastMessage, clearToast, showToast
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
