import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { servicioService, categoriaService } from '../services';
import { useCart } from '../contexts/CartContext';
import './Servicios.css';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { addToCart, isInCart } = useCart();

  const categoriaFiltro = searchParams.get('categoria') || '';
  const tipoServicioFiltro = searchParams.get('tipo_servicio') || '';
  const ordenamiento = searchParams.get('ordering') || '-fecha_creacion';
  const busqueda = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const categoriasData = await categoriaService.getAll();
        setCategorias(categoriasData);

        const params = {};
        if (categoriaFiltro) params.categoria = categoriaFiltro;
        if (tipoServicioFiltro) params.tipo_servicio = tipoServicioFiltro;
        if (ordenamiento) params.ordering = ordenamiento;
        if (busqueda) params.search = busqueda;

        const serviciosData = await servicioService.getAll(params);
        setServicios(serviciosData);
      } catch (error) {
        console.error('Error al cargar servicios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoriaFiltro, tipoServicioFiltro, ordenamiento, busqueda]);

  const handleCategoriaChange = (categoriaId) => {
    if (categoriaId) {
      searchParams.set('categoria', categoriaId);
    } else {
      searchParams.delete('categoria');
    }
    setSearchParams(searchParams);
  };

  const handleTipoServicioChange = (tipo) => {
    if (tipo) {
      searchParams.set('tipo_servicio', tipo);
    } else {
      searchParams.delete('tipo_servicio');
    }
    setSearchParams(searchParams);
  };

  const handleOrdenamientoChange = (orden) => {
    searchParams.set('ordering', orden);
    setSearchParams(searchParams);
  };

  const handleBusquedaSubmit = (e) => {
    e.preventDefault();
    const searchInput = e.target.search.value;
    if (searchInput) {
      searchParams.set('search', searchInput);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const limpiarFiltros = () => {
    setSearchParams({});
  };

  const handleAddToCart = (servicio) => {
    addToCart(servicio, 'servicio');
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

  return (
    <div className="servicios-page">
      <div className="container">
        <div className="page-header">
          <h1>🛠️ Servicios Tecnológicos</h1>
          <p>Soluciones tecnológicas a medida para tu negocio</p>
        </div>

        <div className="search-bar">
          <form onSubmit={handleBusquedaSubmit}>
            <input
              type="text"
              name="search"
              placeholder="Buscar servicios..."
              defaultValue={busqueda}
            />
            <button type="submit">🔍 Buscar</button>
          </form>
        </div>

        <div className="servicios-content">
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Filtros</h3>
              <button onClick={limpiarFiltros} className="btn-clear-filters">
                Limpiar filtros
              </button>
            </div>

            <div className="filter-section">
              <h4>Categoría</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="categoria"
                    checked={!categoriaFiltro}
                    onChange={() => handleCategoriaChange('')}
                  />
                  <span>Todas</span>
                </label>
                {categorias.map((cat) => (
                  <label key={cat.id} className="filter-option">
                    <input
                      type="radio"
                      name="categoria"
                      checked={categoriaFiltro === String(cat.id)}
                      onChange={() => handleCategoriaChange(cat.id)}
                    />
                    <span>{cat.nombre}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Tipo de Servicio</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="tipo_servicio"
                    checked={!tipoServicioFiltro}
                    onChange={() => handleTipoServicioChange('')}
                  />
                  <span>Todos</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="tipo_servicio"
                    checked={tipoServicioFiltro === 'web'}
                    onChange={() => handleTipoServicioChange('web')}
                  />
                  <span>Desarrollo Web</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="tipo_servicio"
                    checked={tipoServicioFiltro === 'ia'}
                    onChange={() => handleTipoServicioChange('ia')}
                  />
                  <span>Agente de IA</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="tipo_servicio"
                    checked={tipoServicioFiltro === 'chatbot'}
                    onChange={() => handleTipoServicioChange('chatbot')}
                  />
                  <span>Chatbot</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="tipo_servicio"
                    checked={tipoServicioFiltro === 'ml'}
                    onChange={() => handleTipoServicioChange('ml')}
                  />
                  <span>Machine Learning</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="tipo_servicio"
                    checked={tipoServicioFiltro === 'mobile'}
                    onChange={() => handleTipoServicioChange('mobile')}
                  />
                  <span>App Móvil</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="tipo_servicio"
                    checked={tipoServicioFiltro === 'iot'}
                    onChange={() => handleTipoServicioChange('iot')}
                  />
                  <span>Sistema IoT</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="tipo_servicio"
                    checked={tipoServicioFiltro === 'automatizacion'}
                    onChange={() => handleTipoServicioChange('automatizacion')}
                  />
                  <span>Automatización</span>
                </label>
              </div>
            </div>

            <div className="filter-section">
              <h4>Ordenar por</h4>
              <select
                value={ordenamiento}
                onChange={(e) => handleOrdenamientoChange(e.target.value)}
                className="sort-select"
              >
                <option value="-fecha_creacion">Más recientes</option>
                <option value="fecha_creacion">Más antiguos</option>
                <option value="precio_base">Precio: Menor a Mayor</option>
                <option value="-precio_base">Precio: Mayor a Menor</option>
                <option value="tiempo_estimado_dias">Tiempo: Menor a Mayor</option>
                <option value="-tiempo_estimado_dias">Tiempo: Mayor a Menor</option>
              </select>
            </div>
          </aside>

          <div className="servicios-list">
            {loading ? (
              <div className="loading">Cargando servicios...</div>
            ) : servicios.length === 0 ? (
              <div className="no-results">
                <h3>No se encontraron servicios</h3>
                <p>Intenta con otros filtros o búsqueda</p>
                <button onClick={limpiarFiltros} className="btn-primary">
                  Ver todos los servicios
                </button>
              </div>
            ) : (
              <>
                <div className="results-count">
                  {servicios.length} servicio{servicios.length !== 1 ? 's' : ''} encontrado{servicios.length !== 1 ? 's' : ''}
                </div>

                <div className="servicios-grid">
                  {servicios.map((servicio) => (
                    <div key={servicio.id} className="servicio-card">
                      <div className="servicio-icon">
                        {getIconoServicio(servicio.tipo_servicio)}
                      </div>

                      {servicio.destacado && (
                        <span className="badge-destacado">⭐ Destacado</span>
                      )}

                      <h3 className="servicio-nombre">{servicio.nombre}</h3>
                      
                      <span className="servicio-tipo">
                        {servicio.tipo_servicio_display}
                      </span>

                      <p className="servicio-descripcion">
                        {servicio.descripcion.substring(0, 120)}...
                      </p>

                      <div className="servicio-meta">
                        <div className="meta-item">
                          <span className="meta-label">⏱️ Tiempo estimado:</span>
                          <span className="meta-value">{servicio.tiempo_estimado_dias} días</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">💰 Precio:</span>
                          {servicio.cotizacion_dinamica ? (
                            <span className="meta-value">A cotizar</span>
                          ) : (
                            <span className="meta-value">
                              Desde ${parseFloat(servicio.precio_base).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="servicio-actions">
                        <Link
                          to={`/servicios/${servicio.id}`}
                          className="btn-details"
                        >
                          Ver Detalles
                        </Link>
                        <button
                          onClick={() => handleAddToCart(servicio)}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Servicios;