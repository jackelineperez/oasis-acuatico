import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu } from './Menu';
import { useCart } from '../context/CartContext';

export function Header({ 
  categorias = [], 
  categoriaActiva, 
  onSelectCategoria
}) {
  const location = useLocation();
  const esCatalogo = location.pathname === '/';
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header className="header-navbar">
      <div className="header-inner">
        {/* Brand / Logo con Link a la ruta raíz */}
        <Link to="/" className="header-brand" style={{ textDecoration: 'none' }}>
          <div className="brand-logo">🐟</div>
          <span className="brand-name">Oasis<span className="brand-highlight">Acuatico</span></span>
        </Link>
        
        {/* Nav de categorías sólo en la página de catálogo */}
        {esCatalogo ? (
          <Menu categorias={categorias} onSelectCategoria={onSelectCategoria} categoriaActiva={categoriaActiva} />
        ) : (
          <div className="view-title-nav">
            <span className="view-badge">Modo Administración</span>
          </div>
        )}

        {/* Naves de rutas con NavLink y Carrito */}
        <div className="header-actions" style={{ gap: '12px' }}>
          <div className="view-nav">
            <NavLink 
              to="/" 
              end
              className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
              style={{ textDecoration: 'none' }}
            >
              🛍️ Catálogo
            </NavLink>
            <NavLink 
              to="/productos" 
              className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
              style={{ textDecoration: 'none' }}
            >
              ⚙️ Productos
            </NavLink>
            <NavLink 
              to="/categorias" 
              className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
              style={{ textDecoration: 'none' }}
            >
              🏷️ Categorías
            </NavLink>
            <NavLink 
              to="/usuarios" 
              className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
              style={{ textDecoration: 'none' }}
            >
              👥 Usuarios
            </NavLink>
            <NavLink 
              to="/clientes" 
              className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
              style={{ textDecoration: 'none' }}
            >
              🧑‍🤝‍🧑 Clientes
            </NavLink>
            <NavLink 
              to="/ordenes" 
              className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
              style={{ textDecoration: 'none' }}
            >
              🧾 Órdenes
            </NavLink>
            <NavLink 
              to="/estados-orden" 
              className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
              style={{ textDecoration: 'none' }}
            >
              📌 Estados
            </NavLink>
          </div>

          <button 
            className="cart-button" 
            onClick={() => setIsCartOpen(true)}
            aria-label="Abrir carrito de pedidos"
            title="Ver mi carrito de pedidos"
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-label">Mi Pedido</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}