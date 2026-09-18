import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CatalogoPage } from './pages/CatalogoPage';
import { ProductosPage } from './pages/ProductosPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UsuariosPage } from './pages/usuarioPage';
import { ClientePage } from './pages/clientePage';
import { OrdenPage } from './pages/ordenPage';
import { EstadoOrdenPage } from './pages/estadoOrdenPage';
import { obtenerProductos } from './services/productService';
import { obtenerCategorias } from './services/categoryService';
import { obtenerUsuarios } from './services/usuarioService';
import { obtenerClientes } from './services/clienteService';
import { obtenerOrdenes } from './services/ordenService';
import { obtenerEstadosOrden } from './services/estadoOrdenService';

const normalizarLista = (data) => Array.isArray(data) ? data : [];

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState('Inicio');
  const [cartCount, setCartCount] = useState(0);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cargando, setCargando] = useState(true);

  const navigate = useNavigate();

  const cargarProductos = () => {
    setCargando(true);
    obtenerProductos()
      .then((data) => {
        setProductos(normalizarLista(data));
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
        setProductos([]);
        setCargando(false);
      });
  };

  const cargarUsuarios = () => {
    obtenerUsuarios()
      .then((data) => {
        setUsuarios(normalizarLista(data));
      })
      .catch((error) => {
        console.error('Error al obtener usuarios:', error);
        setUsuarios([]);
      });
  };

  const cargarClientes = () => {
    obtenerClientes()
      .then((data) => {
        setClientes(normalizarLista(data));
      })
      .catch((error) => {
        console.error('Error al obtener clientes:', error);
        setClientes([]);
      });
  };

  const cargarOrdenes = () => {
    obtenerOrdenes()
      .then((data) => {
        setOrdenes(normalizarLista(data));
      })
      .catch((error) => {
        console.error('Error al obtener órdenes:', error);
        setOrdenes([]);
      });
  };

  const cargarEstados = () => {
    obtenerEstadosOrden()
      .then((data) => {
        setEstados(normalizarLista(data));
      })
      .catch((error) => {
        console.error('Error al obtener estados:', error);
        setEstados([]);
      });
  };

  useEffect(() => {
    cargarProductos();
    cargarUsuarios();
    cargarClientes();
    cargarOrdenes();
    cargarEstados();

    obtenerCategorias()
      .then((data) => {
        setCategorias(normalizarLista(data));
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
        setCategorias([]);
      });
  }, []);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const handleSeleccionarCategoriaFooter = (cat) => {
    setCategoriaActiva(cat);
    navigate('/');
  };

  return (
    <div className="app-layout">
      <Header 
        categorias={categorias}
        categoriaActiva={categoriaActiva} 
        onSelectCategoria={setCategoriaActiva}
        cartCount={cartCount}
      />

      <main className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={
              <CatalogoPage 
                productos={productos}
                categoriaActiva={categoriaActiva}
                onAddToCart={handleAddToCart}
                cargando={cargando}
              />
            } 
          />

          <Route 
            path="/productos" 
            element={
              <ProductosPage 
                productos={productos}
                categorias={categorias}
                onActualizarProductos={cargarProductos}
                cargando={cargando}
              />
            } 
          />

          <Route 
            path="/usuarios" 
            element={
              <UsuariosPage 
                usuarios={usuarios}
                onActualizarUsuarios={cargarUsuarios}
                cargando={cargando}
              />
            } 
          />

          <Route 
            path="/clientes" 
            element={
              <ClientePage 
                clientes={clientes}
                onActualizarClientes={cargarClientes}
                cargando={cargando}
              />
            } 
          />

          <Route 
            path="/ordenes" 
            element={
              <OrdenPage 
                ordenes={ordenes}
                onActualizarOrdenes={cargarOrdenes}
                cargando={cargando}
              />
            } 
          />

          <Route 
            path="/estados-orden" 
            element={
              <EstadoOrdenPage 
                estados={estados}
                onActualizarEstados={cargarEstados}
                cargando={cargando}
              />
            } 
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer 
        categorias={categorias}
        setCategoriaActiva={handleSeleccionarCategoriaFooter}
      />
    </div>
  );
}

export default App;