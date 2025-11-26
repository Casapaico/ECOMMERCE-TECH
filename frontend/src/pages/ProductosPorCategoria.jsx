import { useParams, Link } from 'react-router-dom'
import { useProductsByCategory } from '../hooks/useProducts'
import { useCategoriaById } from '../hooks/useCategorias'
import { usePrefetchProduct } from '../hooks/useProducts'
import { useCartRQ } from '../hooks/useCart'
import { useToast } from '../components/Toast/Toast'
import './ProductosPorCategoria.css'

export default function ProductosPorCategoria() {
  const { categoriaId } = useParams()
  const { success, error: showError } = useToast()
  
  const { data: categoria, isLoading: loadingCategoria } = useCategoriaById(categoriaId)
  const { data: productos, isLoading: loadingProductos } = useProductsByCategory(categoriaId)
  const { addToCart, isAddingToCart } = useCartRQ()
  const prefetchProduct = usePrefetchProduct()

  const handleAddToCart = (productoId, productoNombre) => {
    addToCart(
      { producto: parseInt(productoId), cantidad: 1 },
      {
        onSuccess: () => {
          success(`${productoNombre} agregado al carrito`)
        },
        onError: (err) => {
          showError(err.response?.data?.error || 'Error al agregar al carrito')
        },
      }
    )
  }

  if (loadingCategoria || loadingProductos) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando productos...</div>
      </div>
    )
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="productos-categoria-container">
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No hay productos en esta categoría</h2>
          <p>Actualmente no tenemos productos disponibles en {categoria?.nombre}.</p>
          <div className="empty-actions">
            <Link to="/categorias" className="btn btn-primary">
              Ver todas las categorías
            </Link>
            <Link to="/productos" className="btn btn-secondary">
              Ver todos los productos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="productos-categoria-container">
      {/* Header de la categoría */}
      <div className="categoria-header">
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span className="separator">›</span>
          <Link to="/categorias">Categorías</Link>
          <span className="separator">›</span>
          <span className="current">{categoria?.nombre}</span>
        </div>
        
        <div className="categoria-title-section">
          <h1 className="categoria-title">
            {categoria?.icono && (
              <span className="categoria-icono">{categoria.icono}</span>
            )}
            {categoria?.nombre}
          </h1>
          
          {categoria?.descripcion && (
            <p className="categoria-descripcion">{categoria.descripcion}</p>
          )}
        </div>
        
        <div className="categoria-stats">
          <div className="stat">
            <span className="stat-number">{productos.length}</span>
            <span className="stat-label">productos disponibles</span>
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="productos-grid">
        {productos.map((producto) => (
          <div 
            key={producto.id} 
            className="producto-card"
            onMouseEnter={() => prefetchProduct(producto.id)}
          >
            {/* Link al detalle */}
            <Link to={`/productos/${producto.id}`} className="producto-link">
              <div className="producto-imagen">
                {producto.imagen_principal ? (
                  <img src={producto.imagen_principal} alt={producto.nombre} />
                ) : (
                  <div className="imagen-placeholder">
                    <span>📦</span>
                  </div>
                )}
                {producto.destacado && (
                  <span className="badge-destacado">⭐ Destacado</span>
                )}
              </div>
              
              <div className="producto-info">
                <h3 className="producto-nombre">{producto.nombre}</h3>
                <p className="producto-descripcion">
                  {producto.descripcion.length > 100 
                    ? producto.descripcion.substring(0, 100) + '...' 
                    : producto.descripcion}
                </p>
                
                <div className="producto-meta">
                  <span className="tipo-licencia">
                    {producto.tipo_licencia === 'perpetua' && '🔓 Perpetua'}
                    {producto.tipo_licencia === 'anual' && '📅 Anual'}
                    {producto.tipo_licencia === 'mensual' && '📆 Mensual'}
                    {producto.tipo_licencia === 'trial' && '⏱️ Trial'}
                  </span>
                  {producto.version_actual && (
                    <span className="version">v{producto.version_actual}</span>
                  )}
                </div>
                
                <div className="producto-footer">
                  <span className="precio">${producto.precio}</span>
                  <span className="ver-detalle">Ver detalles →</span>
                </div>
              </div>
            </Link>
            
            {/* Botón agregar al carrito */}
            <button
              onClick={(e) => {
                e.preventDefault()
                handleAddToCart(producto.id, producto.nombre)
              }}
              disabled={isAddingToCart}
              className="btn btn-primary btn-add-cart"
            >
              {isAddingToCart ? (
                <>
                  <span className="btn-loading"></span>
                  Agregando...
                </>
              ) : (
                <>
                  <span>🛒</span>
                  Agregar al carrito
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Botón volver */}
      <div className="back-section">
        <Link to="/categorias" className="btn-back">
          ← Volver a Categorías
        </Link>
      </div>
    </div>
  )
}