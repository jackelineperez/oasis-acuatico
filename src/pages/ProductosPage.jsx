import { GestionProductos } from '../components/producto/GestionProductos';

export function ProductosPage({ productos, categorias, onActualizarProductos, cargando }) {
  return (
    <GestionProductos
      productos={productos}
      categorias={categorias}
      onActualizarProductos={onActualizarProductos}
      cargando={cargando}
    />
  );
}
