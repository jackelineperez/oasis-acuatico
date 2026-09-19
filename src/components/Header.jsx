import { Link, useLocation } from 'react-router-dom';
import { Menu } from './Menu';
import { useAuth } from '../auth/useAuth';

export function Header({
  categorias = [],
  categoriaActiva,
  onSelectCategoria,
  cartCount = 0,
  sidebarAbierto = false,
  onToggleSidebar,
  onLogout
}) {
  const location = useLocation();
  const { usuario, esAdmin } = useAuth();
  const esCatalogo = location.pathname === '/';

  return (
    <header className="header-navbar">
      <div className="header-inner">
        <div className="header-left">
          {esAdmin && (
            <button
              type="button"
              className="sidebar-toggle"
              onClick={onToggleSidebar}
              aria-label={sidebarAbierto ? 'Ocultar menú lateral' : 'Mostrar menú lateral'}
              aria-expanded={sidebarAbierto}
            >
              <span aria-hidden="true">☰</span>
            </button>
          )}
        </div>

        <Link to="/" className="header-brand" style={{ textDecoration: 'none' }}>
          <div className="brand-logo" aria-hidden="true">🐟</div>
          <span className="brand-name">Oasis<span className="brand-highlight">Acuatico</span></span>
        </Link>

        {/* Categorías sólo en la página de catálogo */}
        {esCatalogo ? (
          <Menu categorias={categorias} onSelectCategoria={onSelectCategoria} categoriaActiva={categoriaActiva} />
        ) : (
          <div className="view-title-nav">
            <span className="view-badge">Modo Administración</span>
          </div>
        )}

        <div className="header-actions" style={{ gap: '12px' }}>
          {esCatalogo && (
            <button className="cart-button">
              <span className="cart-icon" aria-hidden="true">🛒</span>
              <span className="cart-label">Mi Pedido</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          )}

          <div className="user-chip">
            <div className="user-info">
              <span className="user-name">{usuario?.nombre}</span>
              <span className="user-role">{usuario?.rol}</span>
            </div>
            <button type="button" className="logout-button" onClick={onLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
