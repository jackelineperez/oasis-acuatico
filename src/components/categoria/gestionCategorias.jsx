import { useState } from 'react';
import { FormularioCategoria } from './formularioCategoria';
import { ListaCategoriasAdmin } from './listaCategoriaAdmin';
import { crearCategoria, actualizarCategoria, eliminarCategoria } from '../../services/categoryService';

export function GestionCategorias({ categorias = [], onActualizarCategorias, cargando }) {
  const [categoriaAEditar, setCategoriaAEditar] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const handleGuardar = (formData) => {
    setGuardando(true);

    if (categoriaAEditar) {
      actualizarCategoria(categoriaAEditar.id, formData)
        .then(() => {
          alert('Categoría actualizada con éxito');
          setCategoriaAEditar(null);
          onActualizarCategorias();
        })
        .catch((err) => {
          console.error('Error al actualizar categoría:', err);
          alert('Error al actualizar la categoría');
        })
        .finally(() => {
          setGuardando(false);
        });
    } else {
      crearCategoria(formData)
        .then(() => {
          alert('Categoría creada con éxito');
          onActualizarCategorias();
        })
        .catch((err) => {
          console.error('Error al crear categoría:', err);
          alert('Error al registrar la categoría');
        })
        .finally(() => {
          setGuardando(false);
        });
    }
  };

  const handleEditar = (categoria) => {
    setCategoriaAEditar(categoria);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarEditar = () => {
    setCategoriaAEditar(null);
  };

  const handleEliminar = (id) => {
    if (eliminando) return;
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      setEliminando(true);
      eliminarCategoria(id)
        .then(() => {
          alert('Categoría eliminada con éxito');
          if (categoriaAEditar && categoriaAEditar.id === id) {
            setCategoriaAEditar(null);
          }
          onActualizarCategorias();
        })
        .catch((err) => {
          console.error('Error al eliminar categoría:', err);
          alert('Error al eliminar la categoría');
        })
        .finally(() => setEliminando(false));
    }
  };

  return (
    <section className="gestion-productos-section">
      <div className="gestion-header">
        <h2>🏷️ Gestión de Categorías</h2>
        <p>Registra nuevas categorías o edita/elimina las categorías disponibles en el catálogo.</p>
      </div>

      <FormularioCategoria
        key={categoriaAEditar?.id ?? 'nuevo'}
        categoriaAEditar={categoriaAEditar}
        onGuardar={handleGuardar}
        onCancelar={handleCancelarEditar}
        guardando={guardando}
      />

      <ListaCategoriasAdmin
        categorias={categorias}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
        cargando={cargando}
      />
    </section>
  );
}
