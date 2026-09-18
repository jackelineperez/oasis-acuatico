export function Menu({ categorias = [], onSelectCategoria, categoriaActiva }) {
    const listaCategorias = Array.isArray(categorias) ? categorias : [];

    return (
        <>
            <nav className="nav-categories">
                <button
                    key="inicio"
                    className={`category-pill ${categoriaActiva === "Inicio" ? 'active' : ''}`}
                    onClick={() => onSelectCategoria("Inicio")}
                >
                    Inicio
                </button>
            {listaCategorias.map((cat) => {
                const nombreCat = cat.nombre || cat.label;
                return (
                    <button
                        key={cat.id || nombreCat}
                        className={`category-pill ${categoriaActiva === nombreCat ? 'active' : ''}`}
                        onClick={() => onSelectCategoria(nombreCat)}
                    >
                        {nombreCat}
                    </button>
                );
            })}
            </nav>
        </>
    );
}


    