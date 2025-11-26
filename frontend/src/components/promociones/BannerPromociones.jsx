import { Link } from 'react-router-dom'
import { usePromociones } from '../../hooks/usePromociones'
import './BannerPromociones.css'

export default function BannerPromociones() {
  const { data: promociones, isLoading } = usePromociones()

  if (isLoading || !promociones || promociones.length === 0) {
    return null
  }

  return (
    <div className="banner-promociones">
      <div className="banner-header">
        <h2>
          <span className="icon">🎉</span>
          Promociones Activas
        </h2>
        <p>Aprovecha estos descuentos exclusivos</p>
      </div>

      <div className="promociones-slider">
        {promociones.map((promo) => (
          <div key={promo.id} className="promo-card">
            <div className="promo-badge">
              {promo.tipo_descuento === 'porcentaje' ? (
                <span className="badge-porcentaje">{promo.valor_descuento}% OFF</span>
              ) : (
                <span className="badge-monto">${promo.valor_descuento} OFF</span>
              )}
            </div>

            <div className="promo-content">
              <h3>{promo.nombre}</h3>
              <p className="promo-descripcion">{promo.descripcion}</p>
              
              <div className="promo-details">
                <div className="promo-codigo">
                  <span className="label">Código:</span>
                  <span className="codigo">{promo.codigo}</span>
                </div>
                {promo.monto_minimo > 0 && (
                  <div className="promo-minimo">
                    <span className="label">Compra mínima:</span>
                    <span className="valor">${promo.monto_minimo}</span>
                  </div>
                )}
              </div>

              <Link to="/productos" className="btn-usar-promo">
                ¡Comprar ahora!
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="banner-footer">
        <p>💡 Los códigos se aplican al momento del pago en el carrito</p>
      </div>
    </div>
  )
}