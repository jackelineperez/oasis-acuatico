import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'oasis_cart_items';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cart]);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
  };

  const clearToast = () => {
    setToastMessage(null);
  };

  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const cleanStr = String(price).replace(/[^0-9.-]+/g, '');
    return parseFloat(cleanStr) || 0;
  };

  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    const maxStock = Number(product.stock) || 0;

    if (maxStock <= 0) {
      showToast(`⚠️ "${product.nombre}" está agotado.`, 'error');
      return false;
    }

    let added = false;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => String(item.id) === String(product.id));

      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].cantidad;
        const newQty = currentQty + quantity;

        if (newQty > maxStock) {
          showToast(`⚠️ Solo quedan ${maxStock} unidades disponibles de "${product.nombre}".`, 'warning');
          const updated = [...prevCart];
          updated[existingIndex] = {
            ...updated[existingIndex],
            cantidad: maxStock,
            stock: maxStock
          };
          return updated;
        }

        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          cantidad: newQty,
          stock: maxStock,
          precioNumerico: parsePrice(product.precio)
        };
        added = true;
        return updated;
      } else {
        const initialQty = Math.min(quantity, maxStock);
        added = true;
        return [
          ...prevCart,
          {
            id: product.id,
            nombre: product.nombre,
            descripcion: product.descripcion || '',
            precio: product.precio,
            precioNumerico: parsePrice(product.precio),
            imagen: product.imagen || '',
            categoria: product.categoria || '',
            tag: product.tag || '',
            stock: maxStock,
            cantidad: initialQty
          }
        ];
      }
    });

    if (added) {
      showToast(`🛒 "${product.nombre}" agregado al carrito`, 'success');
    }
    return added;
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => String(i.id) === String(productId));
      if (item) {
        showToast(`🗑️ "${item.nombre}" eliminado del pedido`, 'info');
      }
      return prevCart.filter((i) => String(i.id) !== String(productId));
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (String(item.id) === String(productId)) {
            const stockLimit = Number(item.stock) || 999;
            if (newQuantity <= 0) {
              return null;
            }
            if (newQuantity > stockLimit) {
              showToast(`⚠️ Stock máximo disponible alcanzado (${stockLimit} unid.)`, 'warning');
              return { ...item, cantidad: stockLimit };
            }
            return { ...item, cantidad: newQuantity };
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + (item.cantidad || 0), 0);
  const totalPrice = cart.reduce((acc, item) => {
    const p = item.precioNumerico !== undefined ? item.precioNumerico : parsePrice(item.precio);
    return acc + p * (item.cantidad || 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        completedOrder,
        setCompletedOrder,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toastMessage,
        clearToast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
