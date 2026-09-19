import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { OrderReceiptModal } from './components/cart/OrderReceiptModal';
import { ToastNotification } from './components/common/ToastNotification';
import { CatalogoPage } from './pages/CatalogoPage';
import { ProductosPage } from './pages/ProductosPage';
import { CategoriaPage } from './pages/categoriaPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UsuariosPage } from './pages/usuarioPage';
import { ClientePage } from './pages/clientePage';
import { OrdenPage } from './pages/ordenPage';
import { EstadoOrdenPage } from './pages/estadoOrdenPage';
import { LoginPage } from './pages/LoginPage';
import { SoloAdmin } from './auth/SoloAdmin';
import { useAuth } from './auth/useAuth';
import { obtenerProductos } from './services/productService';
import { obtenerCategorias } from './services/categoryService';
import { obtenerUsuarios } from './services/usuarioService';
import { obtenerClientes } from './services/clienteService';
import { obtenerOrdenes } from './services/ordenService';
import { obtenerEstadosOrden } from './services/estadoOrdenService';

const normalizarLista = (data) => Array.isArray(data) ? data : [];
const nombreCategoria = (c) => c.nombre || c.label;
const esPantallaAncha = () => window.matchMedia('(min-width: 769px)').matches;

function MainApp() {
  const { usuario, esAdmin, logout } = useAuth();
  const rol = usuario?.rol ?? null;

  const [categoriaActiva, setCategoriaActiva] = useState('Inicio');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [pendientes, setPendientes] = useState(0);
  const [errores, setErrores] = useState([]);
  const [cargadoPara, setCargadoPara] = useState(null);
  const [sidebarAbierto, setSidebarAbierto] = useState(esPantallaAncha);
  const cargando = cargadoPara !== rol || pendientes > 0;

  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, completedOrder, setCompletedOrder } = useCart();

  // Carga un recurso; mantiene `cargando` mientras haya peticiones en curso y registra errores.
  const cargar = (nombre, obtener, setter) => {
    setPendientes((n) => n + 1);
    obtener()
      .then((data) => {
        setter(normalizarLista(data));
        setErrores((prev) => prev.filter((e) => e !== nombre));
      })
      .catch((error) => {
        console.error(`Error al obtener ${nombre}:`, error);
        setter([]);
        setErrores((prev) => (prev.includes(nombre) ? prev : [...prev, nombre]));
      })
      .finally(() => setPendientes((n) => n - 1));
  };

  const cargarProductos = () => cargar('productos', obtenerProductos, setProductos);
  const cargarCategorias = () => cargar('categorías', obtenerCategorias, setCategorias);
  const cargarUsuarios = () => cargar('usuarios', obtenerUsuarios, setUsuarios);
  const cargarClientes = () => cargar('clientes', obtenerClientes, setClientes);
  const cargarOrdenes = () => cargar('órdenes', obtenerOrdenes, setOrdenes);
  const cargarEstados = () => cargar('estados de orden', obtenerEstadosOrden, setEstados);

  // El cliente solo necesita productos y categorías; el resto es del panel de administración.
  const cargarTodo = () => {
    cargarProductos();
    cargarCategorias();
    if (esAdmin) {
      cargarUsuarios();
      cargarClientes();
      cargarOrdenes();
      cargarEstados();
    }
  };

  useEffect(() => {
    if (!rol) return;
    cargarTodo();
    setCargadoPara(rol);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rol]);

  const handleLogout = () => {
    logout();
    setProductos([]);
    setCategorias([]);
    setUsuarios([]);
    setClientes([]);
    setOrdenes([]);
    setEstados([]);
    setErrores([]);
    setCategoriaActiva('Inicio');
    setCargadoPara(null);
  };

  const handleAddToCart = (producto) => {
    addToCart(producto, 1);
  };

  const handleCompraFinalizada = () => {
    cargarProductos();
    cargarOrdenes();
    cargarClientes();
  };

  const handleSeleccionarCategoriaFooter = (cat) => {
    setCategoriaActiva(cat);
    navigate('/');
  };

  // Sin sesión solo existe el inicio de sesión.
  if (!usuario) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace state={{ from: location.pathname }} />} />
      </Routes>
    );
  }

  // El cliente solo ve categorías y productos disponibles (activos).
  const categoriasVisibles = esAdmin ? categorias : categorias.filter((c) => c.estado !== false);
  const categoriasInactivas = new Set(categorias.filter((c) => c.estado === false).map(nombreCategoria));
  const productosVisibles = esAdmin
    ? productos
    : productos.filter((p) => p.estado !== false && !categoriasInactivas.has(p.categoria));

  const cerrarSidebarEnMovil = () => {
    if (!esPantallaAncha()) setSidebarAbierto(false);
  };

  return (
    <div className="app-layout">
      <Header
        categorias={categoriasVisibles}
        categoriaActiva={categoriaActiva}
        onSelectCategoria={setCategoriaActiva}
        sidebarAbierto={sidebarAbierto}
        onToggleSidebar={() => setSidebarAbierto((abierto) => !abierto)}
        onLogout={handleLogout}
      />

      <div className={`app-body ${esAdmin && sidebarAbierto ? 'with-sidebar' : ''}`}>
        {esAdmin && (
          <>
            <Sidebar abierto={sidebarAbierto} onNavegar={cerrarSidebarEnMovil} />
            {sidebarAbierto && (
              <div className="sidebar-backdrop" onClick={() => setSidebarAbierto(false)} aria-hidden="true" />
            )}
          </>
        )}

        <main className="app-container">
          {errores.length > 0 && (
            <div className="error-banner" role="alert">
              No se pudieron cargar: {errores.join(', ')}.{' '}
              <button type="button" onClick={cargarTodo}>Reintentar</button>
            </div>
          )}

          <Routes>
            <Route path="/login" element={<Navigate to="/" replace />} />

            <Route
              path="/"
              element={
                <CatalogoPage
                  productos={productosVisibles}
                  categoriaActiva={categoriaActiva}
                  onAddToCart={handleAddToCart}
                  cargando={cargando}
                />
              }
            />

            <Route
              path="/productos"
              element={
                <SoloAdmin>
                  <ProductosPage
                    productos={productos}
                    categorias={categorias}
                    onActualizarProductos={cargarProductos}
                    cargando={cargando}
                  />
                </SoloAdmin>
              }
            />

            <Route
              path="/categorias"
              element={
                <SoloAdmin>
                  <CategoriaPage
                    categorias={categorias}
                    onActualizarCategorias={cargarCategorias}
                    cargando={cargando}
                  />
                </SoloAdmin>
              }
            />

            <Route
              path="/usuarios"
              element={
                <SoloAdmin>
                  <UsuariosPage
                    usuarios={usuarios}
                    onActualizarUsuarios={cargarUsuarios}
                    cargando={cargando}
                  />
                </SoloAdmin>
              }
            />

            <Route
              path="/clientes"
              element={
                <SoloAdmin>
                  <ClientePage
                    clientes={clientes}
                    onActualizarClientes={cargarClientes}
                    cargando={cargando}
                  />
                </SoloAdmin>
              }
            />

            <Route
              path="/ordenes"
              element={
                <SoloAdmin>
                  <OrdenPage
                    ordenes={ordenes}
                    onActualizarOrdenes={cargarOrdenes}
                    cargando={cargando}
                  />
                </SoloAdmin>
              }
            />

            <Route
              path="/estados-orden"
              element={
                <SoloAdmin>
                  <EstadoOrdenPage
                    estados={estados}
                    onActualizarEstados={cargarEstados}
                    cargando={cargando}
                  />
                </SoloAdmin>
              }
            />

            <Route path="*" element={esAdmin ? <NotFoundPage /> : <Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <Footer
        categorias={categoriasVisibles}
        setCategoriaActiva={handleSeleccionarCategoriaFooter}
      />

      {/* Cart & Checkout Elements */}
      <CartDrawer />
      <CheckoutModal onCompraFinalizada={handleCompraFinalizada} />
      <OrderReceiptModal 
        order={completedOrder} 
        onClose={() => setCompletedOrder(null)} 
      />
      <ToastNotification />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}

export default App;
