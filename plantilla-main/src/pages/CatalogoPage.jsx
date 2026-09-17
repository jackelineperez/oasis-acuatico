import { Banner } from '../components/Banner';
import { Product } from '../components/Product';

export function CatalogoPage({ productos, categoriaActiva, onAddToCart, cargando }) {
  const productosFiltrados = categoriaActiva === "Inicio" 
    ? productos 
    : productos.filter(p => p.categoria && p.categoria.toLowerCase() === categoriaActiva.toLowerCase());

  return (
    <>
      {/* Banner Section */}
      <Banner />

      {/* Section Header */}
      <section className="catalog-header">
        <div>
          <h2 className="catalog-title">
            {categoriaActiva === "Inicio" ? "Todos los Productos" : categoriaActiva}
          </h2>
          <p className="catalog-count">{productosFiltrados.length} producto(s) disponibles</p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="product-grid">
        {cargando ? (
          <p className="loading-text">Cargando productos...</p>
        ) : (
          productosFiltrados.map((producto) => (
            <Product
              key={producto.id}
              indice={producto.id}
              nombre={producto.nombre}
              descripcion={producto.descripcion}
              precio={producto.precio}
              imagen={producto.imagen}
              tag={producto.tag}
              onAddToCart={onAddToCart}
            />
          ))
        )}
      </section>
    </>
  );
}
