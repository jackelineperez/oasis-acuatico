import { MenuInferior } from './MenuInferior';

export function Footer({ categorias = [], setCategoriaActiva }) {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand-section">
          <div className="footer-brand">
            <span className="brand-logo">🐟</span>
            <span className="brand-name">Oasis<span className="brand-highlight">Acuatico</span></span>
          </div>
          <p className="footer-description">Catálogo de demostración de peces y accesorios para acuarios.</p>
        </div>
        <div className="footer-links-group">
          <MenuInferior categorias={categorias} setCategoriaActiva={setCategoriaActiva} />
          <div className="footer-column">
            <h4 className="footer-heading">Demo local</h4>
            <p className="footer-info">Los pedidos son simulados en este navegador.</p>
            <p className="footer-info">No se solicitan ni envían datos personales.</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Oasis Acuático · Demostración sin compras reales.</p>
      </div>
    </footer>
  );
}
