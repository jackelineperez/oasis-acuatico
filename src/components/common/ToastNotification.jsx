import { useEffect } from 'react';
import { useCart } from '../../context/CartContext';

export function ToastNotification() {
  const { toastMessage, clearToast } = useCart();

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      clearToast();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div className={`toast-notification toast-${toastMessage.type || 'info'}`}>
      <span className="toast-text">{toastMessage.message}</span>
      <button className="toast-close-btn" onClick={clearToast} aria-label="Cerrar notificación">
        ✕
      </button>
    </div>
  );
}
