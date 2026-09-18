import { MenuInferior } from "./MenuInferior";

export function Footer({ categorias = [], setCategoriaActiva }) {

    return (
        <>
        <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-brand-section">
            <div className="footer-brand">
              <span className="brand-logo">🐟</span>
              <span className="brand-name">Oasis<span className="brand-highlight">Acuatico</span></span>
            </div>
            <p className="footer-description">
              Tu tienda favorita de peces y accesorios para acuarios.
            </p>
          </div>

          <div className="footer-links-group">
            <MenuInferior categorias={categorias} setCategoriaActiva={setCategoriaActiva}/>

            <div className="footer-column">
              <h4 className="footer-heading">Contacto & Horarios</h4>
              <p className="footer-info">📍 Av. Principal #123, Ciudad</p>
              <p className="footer-info">🕒 Lunes a Domingo: 11:00 AM - 10:00 PM</p>
              <p className="footer-info">📞 +57 3170123652</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} OasisAcuatico. Todos los derechos reservados.</p>
        </div>
      </footer>
        </>
    );
}


    