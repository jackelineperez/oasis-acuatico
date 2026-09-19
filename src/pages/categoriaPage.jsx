import { GestionCategorias } from '../components/categoria/gestionCategorias';

export function CategoriaPage({ categorias, onActualizarCategorias, cargando }) {
  return (
    <GestionCategorias
      categorias={categorias}
      onActualizarCategorias={onActualizarCategorias}
      cargando={cargando}
    />
  );
}
