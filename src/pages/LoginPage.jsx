import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const FORM_VACIO = { nombre: '', email: '', clave: '', confirmar: '' };

export function LoginPage() {
  const { usuario, login, registrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [modo, setModo] = useState('login');
  const [form, setForm] = useState(FORM_VACIO);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) return <Navigate to="/" replace />;

  const esRegistro = modo === 'registro';
  const destino = location.state?.from || '/';

  const cambiarModo = (nuevo) => {
    setModo(nuevo);
    setError('');
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (esRegistro) {
      if (form.clave.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.');
      if (form.clave !== form.confirmar) return setError('Las contraseñas no coinciden.');
    }

    setEnviando(true);
    try {
      if (esRegistro) await registrar(form);
      else await login(form.email, form.clave);
      navigate(destino, { replace: true });
    } catch (err) {
      const esRed = !err.message || err.message.startsWith('Error HTTP') || err.name === 'TypeError';
      setError(esRed ? 'No se pudo conectar con el servidor. Inténtalo de nuevo.' : err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-logo" aria-hidden="true">🐟</div>
          <h1 className="brand-name">Oasis<span className="brand-highlight">Acuatico</span></h1>
          <p className="login-subtitle">
            {esRegistro ? 'Crea tu cuenta de cliente' : 'Inicia sesión para continuar'}
          </p>
        </div>

        <div className="login-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={!esRegistro}
            className={`login-tab ${!esRegistro ? 'active' : ''}`} onClick={() => cambiarModo('login')}>
            Iniciar sesión
          </button>
          <button type="button" role="tab" aria-selected={esRegistro}
            className={`login-tab ${esRegistro ? 'active' : ''}`} onClick={() => cambiarModo('registro')}>
            Crear cuenta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {esRegistro && (
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">Nombre completo</label>
              <input id="nombre" name="nombre" type="text" className="form-input" autoComplete="name"
                value={form.nombre} onChange={handleChange} required />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input id="email" name="email" type="email" className="form-input" autoComplete="email"
              value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="clave" className="form-label">Contraseña</label>
            <input id="clave" name="clave" type="password" className="form-input"
              autoComplete={esRegistro ? 'new-password' : 'current-password'}
              value={form.clave} onChange={handleChange} required />
          </div>

          {esRegistro && (
            <div className="form-group">
              <label htmlFor="confirmar" className="form-label">Confirmar contraseña</label>
              <input id="confirmar" name="confirmar" type="password" className="form-input" autoComplete="new-password"
                value={form.confirmar} onChange={handleChange} required />
            </div>
          )}

          {error && <p className="login-error" role="alert">{error}</p>}

          <button type="submit" className="btn-save login-submit" disabled={enviando}>
            {enviando ? 'Un momento...' : esRegistro ? 'Crear cuenta' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
