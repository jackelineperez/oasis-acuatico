import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '64px 20px' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>404</h2>
      <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '24px' }}>
        ¡Ups! La página que buscas no existe.
      </p>
      <Link to="/" className="btn-add-order" style={{ display: 'inline-flex', textDecoration: 'none' }}>
        Volver al Catálogo
      </Link>
    </div>
  );
}
