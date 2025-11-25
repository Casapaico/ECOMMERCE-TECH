import { Link } from 'react-router-dom'
import { useRecomendacionesProducto, useRecomendacionesServicio } from '../../hooks/useRecomendaciones'
import './Recomendaciones.css'

export default function Recomendaciones({ productoId, servicioId, tipo = 'producto' }) {
  const { data: recomendacionesProducto, isLoading: loadingProducto } = useRecomendacionesProducto(productoId)
  const { data: recomendacionesServicio, isLoading: loadingServicio } = useRecomendacionesServicio(servicioId)

  const recomendaciones = tipo === 'producto' ? recomendacionesProducto : recomendacionesServicio
  const isLoading = tipo === 'producto' ? loadingProducto : loadingServicio

  if (isLoading) {
    return (
      <div className="recomendaciones-container">
        <h2>También te puede interesar</h2>
        <div className="recomendaciones-loading">Cargando recomendaciones...</div>
      </div>
    )
  }

  if (!recomendaciones || recomendaciones.length === 0) {
    return null
  }

  return (
    <div className="recomendaciones-container">
      <h2>
        <span>✨</span> También te puede interesar
      </h2>
      <div className="recomendaciones-grid">
        {recomendaciones.map((rec) => {
          const item = rec.producto_recomendado_detalle || rec.servicio_recomendado_detalle
          if (!item) return null

          const itemTipo = rec.producto_recomendado ? 'producto' : 'servicio'
          const rutaDetalle = itemTipo === 'producto' 
            ? `/productos/${item.id}` 
            : `/servicios/${item.id}`

          return (
            <Link 
              key={`${itemTipo}-${item.id}`} 
              to={rutaDetalle} 
              className="recomendacion-card"
            >
              <div className="recomendacion-imagen">
                {item.imagen ? (
                  <img src={item.imagen} alt={item.nombre} />
                ) : (
                  <div className="imagen-placeholder">
                    {itemTipo === 'producto' ? '📦' : '🛠️'}
                  </div>
                )}
                {item.destacado && (
                  <span className="badge-destacado">⭐ Destacado</span>
                )}
              </div>
              <div className="recomendacion-info">
                <h3>{item.nombre}</h3>
                <p className="recomendacion-motivo">{rec.motivo}</p>
                <div className="recomendacion-footer">
                  <span className="precio">${item.precio}</span>
                  <span className="ver-mas">Ver más →</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}