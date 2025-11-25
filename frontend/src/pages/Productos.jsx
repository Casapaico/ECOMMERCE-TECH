import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productoService, categoriaService } from '../services';
import { useCart } from '../contexts/CartContext';
import { usePrefetchProduct } from '../hooks/useProducts';
import './Productos.css';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { addToCart, isInCart } = useCart();
  const prefetchProduct = usePrefetchProduct();

  // Obtener filtros de la URL
  const categoriaFiltro = searchParams.get('categoria') || '';
  const tipoLicenciaFiltro = searchParams.get('tipo_licencia') || '';
  const ordenamiento = searchParams.get('ordering') || '-fecha_creacion';
  const busqueda = searchParams.get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Cargar categorías
        const categoriasData = await categoriaService.getAll();
        setCategorias(categoriasData);

        // Cargar productos con filtros
        const params = {};
        if (categoriaFiltro) params.categoria = categoriaFiltro;
        if (tipoLicenciaFiltro) params.tipo_licencia = tipoLicenciaFiltro;
        if (ordenamiento) params.ordering = ordenamiento;
        if (busqueda) params.search = busqueda;

        const productosData = await productoService.getAll(params);
        setProductos(productosData);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoriaFiltro, tipoLicenciaFiltro, ordenamiento, busqueda]);

  const handleCategoriaChange = (categoriaId) => {
    if (categoriaId) {
      searchParams.set('categoria', categoriaId);
    } else {
      searchParams.delete('categoria');
    }
    setSearchParams(searchParams);
  };

  const handleTipoLicenciaChange = (tipo) => {
    if (tipo) {
      searchParams.set('tipo_licencia', tipo);
    } else {
      searchParams.delete('tipo_licencia');
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

  const handleAddToCart = (producto) => {
    addToCart(producto, 'producto');
  };

  return (
    <div className="productos-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1>📦 Productos de Software</h1>
          <p>Explora nuestra colección completa de software profesional</p>
        </div>

        {/* Búsqueda */}
        <div className="search-bar">
          <form onSubmit={handleBusquedaSubmit}>
            <input
              type="text"
              name="search"
              placeholder="Buscar productos..."
              defaultValue={busqueda}
            />
            <button type="submit">🔍 Buscar</button>
          </form>
        </div>

        <div className="productos-content">
          {/* Sidebar con Filtros */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Filtros</h3>
              <button onClick={limpiarFiltros} className="btn-clear-filters">
                Limpiar filtros
              </button>
            </div>

            {/* Filtro por Categoría */}
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

            {/* Filtro por Tipo de Licencia */}
            <div className="filter-section">
              <h4>Tipo de Licencia</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="tipo_licencia"
                    checked={!tipoLicenciaFiltro}
                    onChange={() => handleTipoLicenciaChange('')}
                  />
                  <span>Todas</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="tipo_licencia"
                    checked={tipoLicenciaFiltro === 'perpetua'}
                    onChange={() => handleTipoLicenciaChange('perpetua')}
                  />
                  <span>Perpetua</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="tipo_licencia"
                    checked={tipoLicenciaFiltro === 'anual'}
                    onChange={() => handleTipoLicenciaChange('anual')}
                  />
                  <span>Anual</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="tipo_licencia"
                    checked={tipoLicenciaFiltro === 'mensual'}
                    onChange={() => handleTipoLicenciaChange('mensual')}
                  />
                  <span>Mensual</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="tipo_licencia"
                    checked={tipoLicenciaFiltro === 'trial'}
                    onChange={() => handleTipoLicenciaChange('trial')}
                  />
                  <span>Prueba</span>
                </label>
              </div>
            </div>

            {/* Ordenamiento */}
            <div className="filter-section">
              <h4>Ordenar por</h4>
              <select
                value={ordenamiento}
                onChange={(e) => handleOrdenamientoChange(e.target.value)}
                className="sort-select"
              >
                <option value="-fecha_creacion">Más recientes</option>
                <option value="fecha_creacion">Más antiguos</option>
                <option value="precio">Precio: Menor a Mayor</option>
                <option value="-precio">Precio: Mayor a Menor</option>
                <option value="nombre">Nombre: A-Z</option>
                <option value="-nombre">Nombre: Z-A</option>
              </select>
            </div>
          </aside>

          {/* Lista de Productos */}
          <div className="productos-list">
            {loading ? (
              <div className="loading">Cargando productos...</div>
            ) : productos.length === 0 ? (
              <div className="no-results">
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros filtros o búsqueda</p>
                <button onClick={limpiarFiltros} className="btn-primary">
                  Ver todos los productos
                </button>
              </div>
            ) : (
              <>
                <div className="results-count">
                  {productos.length} producto{productos.length !== 1 ? 's' : ''} encontrado{productos.length !== 1 ? 's' : ''}
                </div>

                <div className="productos-grid">
                  {productos.map((producto) => (
                    <div 
                      key={producto.id} 
                      className="producto-card"
                      onMouseEnter={() => prefetchProduct(producto.id)}
                    >
                      <Link to={`/productos/${producto.id}`} className="producto-image">
                        {producto.imagen_principal ? (
                          <img
                            src={`http://localhost:8000${producto.imagen_principal}`}
                            alt={producto.nombre}
                          />
                        ) : (
                          <div className="no-image">📦</div>
                        )}
                        {producto.destacado && (
                          <span className="badge-destacado">⭐ Destacado</span>
                        )}
                      </Link>

                      <div className="producto-info">
                        <span className="producto-categoria">
                          {producto.categoria_nombre}
                        </span>
                        
                        <Link to={`/productos/${producto.id}`}>
                          <h3 className="producto-nombre">{producto.nombre}</h3>
                        </Link>

                        <p className="producto-descripcion">
                          {producto.descripcion.substring(0, 100)}...
                        </p>

                        <div className="producto-meta">
                          <span className="producto-version">
                            v{producto.version_actual}
                          </span>
                          <span className="producto-licencia">
                            {producto.tipo_licencia}
                          </span>
                        </div>

                        <div className="producto-footer">
                          <span className="producto-precio">
                            ${parseFloat(producto.precio).toFixed(2)}
                          </span>
                          
                          <div className="producto-actions">
                            <Link
                              to={`/productos/${producto.id}`}
                              className="btn-details-small"
                            >
                              Ver
                            </Link>
                            <button
                              onClick={() => handleAddToCart(producto)}
                              className={`btn-cart-small ${
                                isInCart(producto.id, 'producto') ? 'in-cart' : ''
                              }`}
                            >
                              {isInCart(producto.id, 'producto') ? '✓' : '🛒'}
                            </button>
                          </div>
                        </div>
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

export default Productos;