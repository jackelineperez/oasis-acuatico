export function Product({ indice, id, nombre, descripcion, precio, imagen, tag, stock, categoria, onAddToCart }) {
    const prodId = id || indice;
    const stockNum = stock !== undefined && stock !== null ? Number(stock) : 10;
    const estaAgotado = stockNum <= 0;
    const pocasUnidades = stockNum > 0 && stockNum <= 3;

    const productoData = {
        id: prodId,
        nombre,
        descripcion,
        precio,
        imagen,
        tag,
        stock: stockNum,
        categoria
    };

    const handleAdd = () => {
        if (estaAgotado) return;
        if (onAddToCart) {
            onAddToCart(productoData);
        }
    };

    const formatPrice = (val) => {
        if (!val && val !== 0) return '$ 0';
        if (typeof val === 'number') return `$ ${val.toLocaleString('es-CO')}`;
        const str = String(val);
        if (str.startsWith('$')) return str;
        const num = parseFloat(str.replace(/[^0-9.-]+/g, ''));
        return isNaN(num) ? `$ ${str}` : `$ ${num.toLocaleString('es-CO')}`;
    };

    return (
        <article className={`product-card ${estaAgotado ? 'product-card-sold-out' : ''}`} key={prodId}>
            <div className="product-image-container">
                {tag && <span className="product-tag">{tag}</span>}
                {estaAgotado ? (
                    <span className="product-stock-badge sold-out">Agotado</span>
                ) : pocasUnidades ? (
                    <span className="product-stock-badge low-stock">¡Solo {stockNum} disp.!</span>
                ) : (
                    <span className="product-stock-badge in-stock">Stock: {stockNum}</span>
                )}

                {imagen ? (
                    <img src={imagen} alt={nombre} className="product-image" loading="lazy" />
                ) : (
                    <div className="product-image-placeholder">🐠</div>
                )}
            </div>
            <div className="product-content">
                <h3 className="product-title">{nombre}</h3>
                <p className="product-description">{descripcion}</p>
                
                <div className="product-footer">
                    <div className="price-wrapper">
                        <span className="price-label">Precio</span>
                        <span className="product-price">{formatPrice(precio)}</span>
                    </div>
                    <button 
                        className={`btn-add-order ${estaAgotado ? 'btn-disabled' : ''}`} 
                        onClick={handleAdd}
                        disabled={estaAgotado}
                        title={estaAgotado ? 'Producto agotado' : 'Agregar al pedido'}
                    >
                        {estaAgotado ? (
                            <span>Agotado</span>
                        ) : (
                            <>
                                <span className="btn-plus">+</span> Agregar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
}