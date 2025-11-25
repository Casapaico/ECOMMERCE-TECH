import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriaService } from '../services';
import { usePrefetchCategoria } from '../hooks/useCategorias';
import './Categorias.css';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const prefetchCategoria = usePrefetchCategoria();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const data = await categoriaService.getAll();
        setCategorias(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const getIconoCategoria = (nombre) => {
    const iconos = {
      'Sistemas para Restaurantes': '🍽️',
      'Sistemas Empresariales': '💼',
      'Desarrollo de Inteligencia Artificial': '🤖',
      'Desarrollo Web y Móvil': '📱',
      'Automatización y IoT': '⚙️',
    };
    return iconos[nombre] || '📦';
  };

  const getColorCategoria = (index) => {
    const colores = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    return colores[index % colores.length];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="categorias-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>📂 Todas las Categorías</h1>
          <p>Explora nuestras categorías de productos y servicios tecnológicos</p>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{categorias.reduce((sum, cat) => sum + cat.total_productos, 0)}</h3>
              <p>Productos Totales</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛠️</div>
            <div className="stat-content">
              <h3>{categorias.reduce((sum, cat) => sum + cat.total_servicios, 0)}</h3>
              <p>Servicios Totales</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📂</div>
            <div className="stat-content">
              <h3>{categorias.length}</h3>
              <p>Categorías</p>
            </div>
          </div>
        </div>

        {/* Grid de Categorías */}
        <div className="categorias-grid">
          {categorias.map((categoria, index) => (
            <div key={categoria.id} className="categoria-card">
              {/* Header de la card con gradiente */}
              <div 
                className="categoria-header"
                style={{ background: getColorCategoria(index) }}
              >
                <div className="categoria-icon">
                  {getIconoCategoria(categoria.nombre)}
                </div>
                <h2>{categoria.nombre}</h2>
              </div>

              {/* Contenido */}
              <div className="categoria-body">
                <p className="categoria-descripcion">
                  {categoria.descripcion || 'Explora nuestra colección de soluciones tecnológicas'}
                </p>

                {/* Estadísticas */}
                <div className="categoria-stats">
                  <div className="stat-item">
                    <span className="stat-number">{categoria.total_productos}</span>
                    <span className="stat-label">Productos</span>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <span className="stat-number">{categoria.total_servicios}</span>
                    <span className="stat-label">Servicios</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="categoria-actions">
                  {categoria.total_productos > 0 && (
                    <Link
                      to={`/categorias/${categoria.id}/productos`}
                      className="btn-categoria btn-productos"
                      onMouseEnter={() => prefetchCategoria(categoria.id)}
                    >
                      <span>📦</span>
                      Ver Productos
                    </Link>
                  )}
                  {categoria.total_servicios > 0 && (
                    <Link
                      to={`/servicios?categoria=${categoria.id}`}
                      className="btn-categoria btn-servicios"
                    >
                      <span>🛠️</span>
                      Ver Servicios
                    </Link>
                  )}
                  {categoria.total_productos === 0 && categoria.total_servicios === 0 && (
                    <div className="no-items">
                      <span>Próximamente</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <div className="cta-card">
            <h2>¿No encuentras lo que buscas?</h2>
            <p>
              Ofrecemos soluciones personalizadas para cada necesidad. 
              Contáctanos y cuéntanos sobre tu proyecto.
            </p>
            <div className="cta-buttons">
              <Link to="/servicios" className="btn-cta-primary">
                Ver Todos los Servicios
              </Link>
              <Link to="/productos" className="btn-cta-secondary">
                Ver Todos los Productos
              </Link>
            </div>
          </div>
        </div>

        {/* Info adicional */}
        <div className="info-boxes">
          <div className="info-box">
            <div className="info-icon">🎯</div>
            <h3>Soluciones a Medida</h3>
            <p>Cada proyecto es único y adaptamos nuestras soluciones a tus necesidades específicas</p>
          </div>
          <div className="info-box">
            <div className="info-icon">⚡</div>
            <h3>Tecnología de Vanguardia</h3>
            <p>Utilizamos las últimas tecnologías para garantizar soluciones modernas y escalables</p>
          </div>
          <div className="info-box">
            <div className="info-icon">🤝</div>
            <h3>Soporte Continuo</h3>
            <p>Acompañamiento constante desde la implementación hasta el mantenimiento</p>
          </div>
          <div className="info-box">
            <div className="info-icon">💡</div>
            <h3>Innovación Constante</h3>
            <p>Siempre actualizados con las últimas tendencias del mercado tecnológico</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categorias;