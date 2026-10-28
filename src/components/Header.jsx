import { Link, useLocation } from 'react-router-dom';
import { Menu } from './Menu';
import { useCart } from '../context/CartContext';

export function Header({ categorias = [], categoriaActiva, onSelectCategoria }) {
  const location = useLocation();
  const esCatalogo = location.pathname === '/';
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="header-navbar">
      <div className="header-inner">
        <div className="header-left" />
        <Link to="/" className="header-brand" style={{ textDecoration: 'none' }}>
          <div className="brand-logo" aria-hidden="true">🐟</div>
          <span className="brand-name">Oasis<span className="brand-highlight">Acuatico</span></span>
        </Link>
        {esCatalogo ? (
          <Menu categorias={categorias} onSelectCategoria={onSelectCategoria} categoriaActiva={categoriaActiva} />
        ) : <div className="view-title-nav"><span className="view-badge">Demo de catálogo</span></div>}
        <div className="header-actions" style={{ gap: '12px' }}>
          {esCatalogo && (
            <button
              className="cart-button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Abrir carrito de demostración"
              title="Ver pedido de demostración"
            >
              <span className="cart-icon" aria-hidden="true">🛒</span>
              <span className="cart-label">Mi Pedido</span>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
