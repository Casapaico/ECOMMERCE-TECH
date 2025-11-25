import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productoService, servicioService } from '../services';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../components/Toast/Toast';
import './Home.css';

const Home = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [serviciosDestacados, setServiciosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, isInCart } = useCart();
  const { success } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productos, servicios] = await Promise.all([
          productoService.getDestacados(),
          servicioService.getDestacados(),
        ]);
        setProductosDestacados(productos);
        setServiciosDestacados(servicios);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (item, type) => {
    const added = addToCart(item, type);
    if (added) {
      const itemType = type === 'producto' ? 'Producto' : 'Servicio';
      success(`${itemType} "${item.nombre}" agregado al carrito`);
    }
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Bienvenido a TechStore 🚀</h1>
          <p>Software y servicios tecnológicos de vanguardia</p>
          <div className="hero-buttons">
            <Link to="/productos" className="btn-primary">
              Ver Productos
            </Link>
            <Link to="/servicios" className="btn-secondary">
              Ver Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>⭐ Productos Destacados</h2>
            <Link to="/productos" className="view-all">
              Ver todos →
            </Link>
          </div>

          <div className="products-grid">
            {productosDestacados.map((producto) => (
              <div key={producto.id} 
                   className="product-card"
                   onMouseEnter={() => prefetchProduct(producto.id)}>
                   
                <div className="product-image">
                  {producto.imagen_principal ? (
                    <img
                      src={`http://localhost:8000${producto.imagen_principal}`}
                      alt={producto.nombre}
                    />
                  ) : (
                    <div className="no-image">📦</div>
                  )}
                </div>

                <div className="product-info">
                  <span className="product-category">
                    {producto.categoria_nombre}
                  </span>
                  <h3>{producto.nombre}</h3>
                  <p className="product-description">
                    {producto.descripcion.substring(0, 100)}...
                  </p>

                  <div className="product-footer">
                    <span className="product-price">
                      ${parseFloat(producto.precio).toFixed(2)}
                    </span>
                    <div className="product-actions">
                      <Link
                        to={`/productos/${producto.id}`}
                        className="btn-details"
                      >
                        Ver Detalles
                      </Link>
                      <button
                        onClick={() => handleAddToCart(producto, 'producto')}
                        className={`btn-cart ${
                          isInCart(producto.id, 'producto') ? 'in-cart' : ''
                        }`}
                      >
                        {isInCart(producto.id, 'producto')
                          ? '✓ En carrito'
                          : '🛒 Agregar'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios Destacados */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>🛠️ Servicios Destacados</h2>
            <Link to="/servicios" className="view-all">
              Ver todos →
            </Link>
          </div>

          <div className="services-grid">
            {serviciosDestacados.map((servicio) => (
              <div key={servicio.id} className="service-card">
                <div className="service-icon">
                  {servicio.tipo_servicio_display === 'Chatbot' && '🤖'}
                  {servicio.tipo_servicio_display === 'Desarrollo Web' && '🌐'}
                  {servicio.tipo_servicio_display === 'Agente de IA' && '🧠'}
                  {servicio.tipo_servicio_display === 'App Móvil' && '📱'}
                  {!['Chatbot', 'Desarrollo Web', 'Agente de IA', 'App Móvil'].includes(
                    servicio.tipo_servicio_display
                  ) && '⚙️'}
                </div>

                <h3>{servicio.nombre}</h3>
                <span className="service-type">
                  {servicio.tipo_servicio_display}
                </span>
                <p>{servicio.descripcion.substring(0, 120)}...</p>

                <div className="service-info">
                  {servicio.cotizacion_dinamica ? (
                    <span className="service-price">Cotización a medida</span>
                  ) : (
                    <span className="service-price">
                      Desde ${parseFloat(servicio.precio_base).toFixed(2)}
                    </span>
                  )}
                  <span className="service-time">
                    ⏱️ {servicio.tiempo_estimado_dias} días
                  </span>
                </div>

                <div className="service-actions">
                  <Link
                    to={`/servicios/${servicio.id}`}
                    className="btn-details"
                  >
                    Ver Detalles
                  </Link>
                  <button
                    onClick={() => handleAddToCart(servicio, 'servicio')}
                    className={`btn-cart ${
                      isInCart(servicio.id, 'servicio') ? 'in-cart' : ''
                    }`}
                  >
                    {isInCart(servicio.id, 'servicio')
                      ? '✓ En carrito'
                      : '🛒 Solicitar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;