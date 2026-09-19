import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const GRUPOS = [
  {
    id: 'inventario',
    titulo: '📦 Inventario',
    items: [
      { to: '/productos', label: '⚙️ Productos' },
      { to: '/categorias', label: '🏷️ Categorías' }
    ]
  },
  {
    id: 'personas',
    titulo: '👥 Personas',
    items: [
      { to: '/usuarios', label: '👥 Usuarios' },
      { to: '/clientes', label: '🧑‍🤝‍🧑 Clientes' }
    ]
  },
  {
    id: 'ventas',
    titulo: '🧾 Ventas',
    items: [
      { to: '/ordenes', label: '🧾 Órdenes' },
      { to: '/estados-orden', label: '📌 Estados' }
    ]
  }
];

export function Sidebar({ abierto, onNavegar }) {
  const { pathname } = useLocation();
  // Empieza desplegado el grupo de la ruta activa; el resto se abre a mano.
  const [abiertos, setAbiertos] = useState(() =>
    GRUPOS.filter((g) => g.items.some((i) => i.to === pathname)).map((g) => g.id)
  );

  const alternar = (id) =>
    setAbiertos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const claseLink = ({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`;

  return (
    <aside className={`sidebar ${abierto ? 'open' : ''}`} aria-label="Menú de administración">
      <nav className="sidebar-nav">
        <NavLink to="/" end className={claseLink} onClick={onNavegar}>
          🛍️ Catálogo
        </NavLink>

        {GRUPOS.map((grupo) => {
          const desplegado = abiertos.includes(grupo.id);
          return (
            <div key={grupo.id} className="sidebar-group">
              <button
                type="button"
                className="sidebar-group-toggle"
                aria-expanded={desplegado}
                aria-controls={`grupo-${grupo.id}`}
                onClick={() => alternar(grupo.id)}
              >
                <span>{grupo.titulo}</span>
                <span className={`sidebar-chevron ${desplegado ? 'open' : ''}`} aria-hidden="true">▾</span>
              </button>
              {desplegado && (
                <div id={`grupo-${grupo.id}`} className="sidebar-submenu">
                  {grupo.items.map((item) => (
                    <NavLink key={item.to} to={item.to} className={claseLink} onClick={onNavegar}>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
