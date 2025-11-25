import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { servicioService } from '../services';
import { useCart } from '../contexts/CartContext';
import Recomendaciones from '../components/recomendaciones/Recomendaciones';
import './ServicioDetalle.css';
import { useToast } from '../components/Toast/Toast';

const ServicioDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    const fetchServicio = async () => {
      try {
        setLoading(true);
        const data = await servicioService.getById(id);
        setServicio(data);
      } catch (err) {
        console.error('Error al cargar servicio:', err);
        setError('No se pudo cargar el servicio');
      } finally {
        setLoading(false);
      }
    };

    fetchServicio();
  }, [id]);

  const handleAddToCart = () => {
  addToCart(
    { servicio: parseInt(id), cantidad: 1 },
    {
      onSuccess: () => {
        success(`${servicio.nombre} agregado al carrito`);
      },
      onError: (err) => {
        showError(err.response?.data?.error || 'Error al agregar al carrito');
      }
    }
  );
};

  const handleSolicitarNow = () => {
    addToCart(servicio, 'servicio');
    navigate('/carrito');
  };

  const getIconoServicio = (tipo) => {
    const iconos = {
      'web': '🌐',
      'ia': '🧠',
      'chatbot': '🤖',
      'ml': '📊',
      'mobile': '📱',
      'iot': '🔧',
      'redes': '🌐',
      'automatizacion': '⚙️',
      'consultoria': '💼',
    };
    return iconos[tipo] || '🛠️';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando servicio...</div>
      </div>
    );
  }

  if (error || !servicio) {
    return (
      <div className="error-container">
        <h2>⚠️ {error || 'Servicio no encontrado'}</h2>
        <Link to="/servicios" className="btn-back">
          Volver a servicios
        </Link>
      </div>
    );
  }

  return (
    <div className="servicio-detalle-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Inicio</Link>
          <span> / </span>
          <Link to="/servicios">Servicios</Link>
          <span> / </span>
          <span>{servicio.nombre}</span>
        </div>

        <div className="servicio-detalle">
          {/* Columna izquierda - Icono e imagen */}
          <div className="servicio-visual">
            <div className="servicio-icon-large">
              {getIconoServicio(servicio.tipo_servicio)}
            </div>

            {servicio.imagen_principal && (
              <div className="servicio-imagen">
                <img
                  src={`http://localhost:8000${servicio.imagen_principal}`}
                  alt={servicio.nombre}
                />
              </div>
            )}

            {/* Info rápida */}
            <div className="quick-info">
              <div className="info-card">
                <span className="info-icon">⏱️</span>
                <div className="info-content">
                  <h4>Tiempo Estimado</h4>
                  <p>{servicio.tiempo_estimado_dias} días</p>
                </div>
              </div>

              <div className="info-card">
                <span className="info-icon">💰</span>
                <div className="info-content">
                  <h4>Precio</h4>
                  {servicio.cotizacion_dinamica ? (
                    <p>A cotizar</p>
                  ) : (
                    <p>Desde ${parseFloat(servicio.precio_base).toFixed(2)}</p>
                  )}
                </div>
              </div>

              <div className="info-card">
                <span className="info-icon">🎯</span>
                <div className="info-content">
                  <h4>Categoría</h4>
                  <p>{servicio.categoria_nombre}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Información */}
          <div className="servicio-info">
            <div className="servicio-tipo-badge">
              {servicio.tipo_servicio_display}
            </div>

            <h1 className="servicio-title">{servicio.nombre}</h1>

            {servicio.destacado && (
              <span className="badge-destacado">⭐ Servicio Destacado</span>
            )}

            <div className="servicio-precio-section">
              {servicio.cotizacion_dinamica ? (
                <div className="precio-cotizar">
                  <span className="precio-label">Cotización personalizada</span>
                  <p className="precio-note">
                    El precio varía según las necesidades específicas de tu proyecto
                  </p>
                </div>
              ) : (
                <div className="precio-fijo">
                  <span className="precio-desde">Desde</span>
                  <span className="precio-valor">
                    ${parseFloat(servicio.precio_base).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="servicio-actions">
              {isInCart(servicio.id, 'servicio') ? (
                <button className="btn-cart added" disabled>
                  ✓ En el Carrito
                </button>
              ) : (
                <button 
                  className="btn-cart"
                  onClick={handleAddToCart}
                >
                  🛒 Agregar al Carrito
                </button>
              )}
              <button 
                className="btn-solicitar"
                onClick={handleSolicitarNow}
              >
                Solicitar Ahora
              </button>
            </div>

            {/* Descripción */}
            <div className="servicio-descripcion">
              <h3>📝 Descripción del Servicio</h3>
              <p>{servicio.descripcion}</p>
            </div>

            {/* Requisitos del Cliente */}
            <div className="servicio-requisitos">
              <h3>📋 ¿Qué necesitamos de ti?</h3>
              <p>{servicio.requisitos_cliente}</p>
            </div>

            {/* Proceso */}
            <div className="servicio-proceso">
              <h3>🔄 Proceso de Trabajo</h3>
              <div className="proceso-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Solicitud</h4>
                    <p>Agrega el servicio al carrito y completa tu pedido</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Consultoría Inicial</h4>
                    <p>Nos reunimos para entender tus necesidades específicas</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Propuesta</h4>
                    <p>Te enviamos una propuesta detallada y cotización final</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h4>Desarrollo</h4>
                    <p>Comenzamos el desarrollo con actualizaciones constantes</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h4>Entrega</h4>
                    <p>Entregamos el proyecto completo y capacitamos a tu equipo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ventajas */}
            <div className="servicio-ventajas">
              <h3>✨ ¿Por qué elegirnos?</h3>
              <ul>
                <li>✅ Equipo experto con años de experiencia</li>
                <li>✅ Soluciones personalizadas a tu medida</li>
                <li>✅ Soporte continuo post-entrega</li>
                <li>✅ Tecnologías de vanguardia</li>
                <li>✅ Garantía de satisfacción</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botón Volver */}
        <div className="back-button-container">
          <Link to="/servicios" className="btn-back">
            ← Volver a Servicios
          </Link>
        </div>

        {/* Recomendaciones */}
        <Recomendaciones servicioId={id} tipo="servicio" />
      </div>
    </div>
  );
};

export default ServicioDetalle;