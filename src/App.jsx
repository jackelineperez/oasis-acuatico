import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';
import { OrderReceiptModal } from './components/cart/OrderReceiptModal';
import { ToastNotification } from './components/common/ToastNotification';
import { CatalogoPage } from './pages/CatalogoPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { obtenerProductos } from './services/productService';
import { obtenerCategorias } from './services/categoryService';

const esPantallaAncha = () => window.matchMedia('(min-width: 769px)').matches;

function MainApp() {
  const [categoriaActiva, setCategoriaActiva] = useState('Inicio');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(esPantallaAncha);
  const { addToCart, completedOrder, setCompletedOrder } = useCart();

  const cargarCatalogo = async () => {
    setCargando(true);
    setError(false);
    try {
      const [productosData, categoriasData] = await Promise.all([
        obtenerProductos(),
        obtenerCategorias()
      ]);
      setProductos(Array.isArray(productosData) ? productosData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData.filter((c) => c.estado !== false) : []);
    } catch (err) {
      console.error('No se pudo cargar el catálogo de demostración:', err);
      setProductos([]);
      setCategorias([]);
      setError(true);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCatalogo();
  }, []);

  const handleAddToCart = (producto) => addToCart(producto, 1);
  const seleccionarCategoria = (categoria) => setCategoriaActiva(categoria);

  return (
    <div className="app-layout">
      <Header
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onSelectCategoria={seleccionarCategoria}
        sidebarAbierto={sidebarAbierto}
        onToggleSidebar={() => setSidebarAbierto((abierto) => !abierto)}
      />
      <main className="app-container">
        {error && (
          <div className="error-banner" role="alert">
            No se pudo cargar el catálogo de demostración. Comprueba tu conexión e inténtalo de nuevo.{' '}
            <button type="button" onClick={cargarCatalogo}>Reintentar</button>
          </div>
        )}
        <Routes>
          <Route path="/" element={
            <CatalogoPage
              productos={productos.filter((p) => p.estado !== false)}
              categoriaActiva={categoriaActiva}
              onAddToCart={handleAddToCart}
              cargando={cargando}
            />
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer categorias={categorias} setCategoriaActiva={seleccionarCategoria} />
      <CartDrawer />
      <CheckoutModal />
      <OrderReceiptModal order={completedOrder} onClose={() => setCompletedOrder(null)} />
      <ToastNotification />
    </div>
  );
}

export default function App() {
  return <CartProvider><MainApp /></CartProvider>;
}
