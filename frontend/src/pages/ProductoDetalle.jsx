import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProductById } from '../hooks/useProducts';
import { useCartRQ } from '../hooks/useCart';
import { useToast } from '../components/Toast/Toast';
import Recomendaciones from '../components/recomendaciones/Recomendaciones';
import './ProductoDetalle.css';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  
  // Usar React Query para el producto
  const { data: producto, isLoading: loading, error } = useProductById(id);
  
  // Usar React Query para el carrito
  const { addToCart, isAddingToCart, cart } = useCartRQ();
  
  const [imagenActual, setImagenActual] = useState(null);
  
  // Actualizar imagen cuando carga el producto
  useState(() => {
    if (producto?.imagen_principal) {
      setImagenActual(producto.imagen_principal);
    }
  }, [producto]);

  const handleAddToCart = () => {
    addToCart(
      { producto: parseInt(id), cantidad: 1 },
      {
        onSuccess: () => {
          success(`${producto.nombre} agregado al carrito`);
        },
        onError: (err) => {
          showError(err.response?.data?.error || 'Error al agregar al carrito');
        },
      }
    );
  };

  const handleBuyNow = () => {
    addToCart(
      { producto: parseInt(id), cantidad: 1 },
      {
        onSuccess: () => {
          navigate('/carrito');
        },
        onError: (err) => {
          showError(err.response?.data?.error || 'Error al agregar al carrito');
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando producto...</div>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="error-container">
        <h2>⚠️ {error || 'Producto no encontrado'}</h2>
        <Link to="/productos" className="btn-back">
          Volver a productos
        </Link>
      </div>
    );
  }

  // Preparar galería de imágenes
  const imagenes = [
    producto.imagen_principal,
    producto.captura1,
    producto.captura2,
    producto.captura3,
  ].filter(Boolean);

  return (
    <div className="producto-detalle-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span> / </span>
          <Link to="/productos">Productos</Link>
          <span> / </span>
          <span>{producto.nombre}</span>
        </div>

        <div className="producto-detalle">
          {/* Galería de Imágenes */}
          <div className="producto-gallery">
            <div className="main-image">
              {imagenActual ? (
                <img
                  src={`http://localhost:8000${imagenActual}`}
                  alt={producto.nombre}
                />
              ) : (
                <div className="no-image">📦</div>
              )}
            </div>

            {imagenes.length > 1 && (
              <div className="thumbnails">
                {imagenes.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${img === imagenActual ? 'active' : ''}`}
                    onClick={() => setImagenActual(img)}
                  >
                    <img
                      src={`http://localhost:8000${img}`}
                      alt={`${producto.nombre} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Información del Producto */}
          <div className="producto-info">
            <div className="producto-category">
              {producto.categoria_nombre}
            </div>

            <h1 className="producto-title">{producto.nombre}</h1>

            <div className="producto-version">
              Versión: <strong>{producto.version_actual}</strong>
            </div>

            <div className="producto-price">
              ${parseFloat(producto.precio).toFixed(2)}
            </div>

            <div className="producto-license">
              <strong>Tipo de Licencia:</strong>
              <span className="license-badge">
                {producto.tipo_licencia === 'perpetua' && '🔓 Perpetua'}
                {producto.tipo_licencia === 'anual' && '📅 Anual'}
                {producto.tipo_licencia === 'mensual' && '📆 Mensual'}
                {producto.tipo_licencia === 'trial' && '🧪 Prueba'}
              </span>
            </div>

            <div className="producto-stock">
              {producto.stock > 0 ? (
                <span className="in-stock">✅ Disponible</span>
              ) : (
                <span className="out-stock">❌ Agotado</span>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="producto-actions">
              {producto.stock > 0 ? (
                <>
                  <button 
                    className="btn-cart"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? 'Agregando...' : '🛒 Agregar al Carrito'}
                  </button>
                  <button 
                    className="btn-buy"
                    onClick={handleBuyNow}
                    disabled={isAddingToCart}
                  >
                    Comprar Ahora
                  </button>
                </>
              ) : (
                <button className="btn-cart" disabled>
                  Producto no disponible
                </button>
              )}
            </div>

            {/* Descripción */}
            <div className="producto-description">
              <h3>Descripción</h3>
              <p>{producto.descripcion}</p>
            </div>

            {/* Descripción Técnica */}
            {producto.descripcion_tecnica && (
              <div className="producto-technical">
                <h3>Especificaciones Técnicas</h3>
                <p>{producto.descripcion_tecnica}</p>
              </div>
            )}

            {/* Requisitos del Sistema */}
            {producto.requisitos_sistema && (
              <div className="producto-requirements">
                <h3>Requisitos del Sistema</h3>
                <p>{producto.requisitos_sistema}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Descarga (si está disponible) */}
        {producto.archivo_descarga && (
          <div className="download-section">
            <h3>🔽 Descarga</h3>
            <p>
              Este producto incluye un archivo descargable. La descarga estará disponible
              después de la compra.
            </p>
          </div>
        )}

        {/* Botón Volver */}
        <div className="back-button-container">
          <Link to="/productos" className="btn-back">
            ← Volver a Productos
          </Link>
        </div>

        {/* Recomendaciones */}
        <Recomendaciones productoId={id} tipo="producto" />
      </div>
    </div>
  );
};

export default ProductoDetalle;