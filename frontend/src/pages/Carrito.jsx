import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartRQ } from '../hooks/useCart'
import { useToast } from '../components/Toast/Toast'
import PromocionInput from '../components/promociones/PromocionInput'
import Recomendaciones from '../components/recomendaciones/Recomendaciones'
import './Carrito.css'

const Carrito = () => {
  const navigate = useNavigate()
  const { success, error: showError } = useToast()
  const {
    cart,
    isLoading,
    updateQuantity,
    removeItem,
    clearCart,
    isUpdating,
    isRemoving,
  } = useCartRQ()

  const [promocion, setPromocion] = useState(null)

  // Calcular descuento
  const calcularDescuento = () => {
    if (!promocion) return 0
    
    const total = parseFloat(cart.total || 0)
    
    // Validar monto mínimo
    if (total < parseFloat(promocion.monto_minimo || 0)) {
      return 0
    }
    
    if (promocion.tipo_descuento === 'porcentaje') {
      return (total * parseFloat(promocion.valor_descuento) / 100).toFixed(2)
    } else {
      return Math.min(parseFloat(promocion.valor_descuento), total).toFixed(2)
    }
  }

  const descuento = calcularDescuento()
  const totalConDescuento = (parseFloat(cart.total || 0) - parseFloat(descuento)).toFixed(2)

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    updateQuantity(
      { item_id: itemId, cantidad: newQuantity },
      {
        onSuccess: () => {
          success('Cantidad actualizada')
        },
        onError: (err) => {
          showError(err.response?.data?.error || 'Error al actualizar')
        },
      }
    )
  }

  const handleRemoveItem = (itemId) => {
    if (!window.confirm('¿Eliminar este item del carrito?')) return

    removeItem(itemId, {
      onSuccess: () => {
        success('Item eliminado del carrito')
      },
      onError: (err) => {
        showError(err.response?.data?.error || 'Error al eliminar')
      },
    })
  }

  const handleClearCart = () => {
    if (!window.confirm('¿Vaciar todo el carrito?')) return

    clearCart(undefined, {
      onSuccess: () => {
        success('Carrito vaciado')
        setPromocion(null)
      },
      onError: (err) => {
        showError('Error al vaciar el carrito')
      },
    })
  }

  if (isLoading) {
    return (
      <div className="carrito-container">
        <div className="loading">Cargando carrito...</div>
      </div>
    )
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="carrito-empty">
        <div className="empty-content">
          <div className="empty-icon">🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos o servicios para comenzar tu compra</p>
          <div className="empty-actions">
            <Link to="/productos" className="btn-primary">
              Ver Productos
            </Link>
            <Link to="/servicios" className="btn-secondary">
              Ver Servicios
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-page">
      <div className="container">
        <div className="carrito-header">
          <h1>🛒 Mi Carrito</h1>
          <button onClick={handleClearCart} className="btn-clear-cart">
            🗑️ Vaciar Carrito
          </button>
        </div>

        <div className="carrito-content">
          <div className="carrito-items">
            {cart.items.map((item) => {
              const detalle = item.producto_detalle || item.servicio_detalle
              const tipo = detalle?.tipo

              return (
                <div key={item.id} className="carrito-item">
                  <div className="carrito-item-imagen">
                    {detalle?.imagen ? (
                      <img src={detalle.imagen} alt={detalle.nombre} />
                    ) : (
                      <div className="imagen-placeholder">
                        {tipo === 'producto' ? '📦' : '🛠️'}
                      </div>
                    )}
                  </div>

                  <div className="carrito-item-info">
                    <h3>{detalle?.nombre || 'Cargando...'}</h3>
                    <span className="carrito-item-tipo">
                      {tipo === 'producto' ? '📦 Producto' : '🛠️ Servicio'}
                    </span>
                    {item.producto_detalle && (
                      <p className="carrito-item-meta">
                        Stock: {item.producto_detalle.stock} | 
                        Licencia: {item.producto_detalle.tipo_licencia}
                      </p>
                    )}
                    {item.servicio_detalle && (
                      <p className="carrito-item-meta">
                        ⏱️ Tiempo estimado: {item.servicio_detalle.tiempo_estimado} días
                      </p>
                    )}
                  </div>

                  <div className="carrito-item-cantidad">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                      disabled={item.cantidad <= 1 || isUpdating}
                      className="btn-cantidad"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (val > 0) handleUpdateQuantity(item.id, val)
                      }}
                      min="1"
                      disabled={isUpdating}
                    />
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.cantidad + 1)}
                      disabled={isUpdating}
                      className="btn-cantidad"
                    >
                      +
                    </button>
                  </div>

                  <div className="carrito-item-precio">
                    <p className="precio-unitario">${item.precio_unitario}</p>
                    <p className="subtotal">${item.subtotal}</p>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isRemoving}
                    className="btn-eliminar"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>

          <div className="carrito-resumen">
            <div className="resumen-card">
              <h2>Resumen del Pedido</h2>
              
              <div className="resumen-linea">
                <span>Items:</span>
                <span>{cart.total_items}</span>
              </div>

              <div className="resumen-linea">
                <span>Subtotal:</span>
                <span>${cart.total}</span>
              </div>

              {/* Componente de Promoción */}
              <PromocionInput 
                onPromocionAplicada={setPromocion} 
                totalCarrito={cart.total || 0}
              />

              {promocion && descuento > 0 && (
                <>
                  {parseFloat(cart.total) < parseFloat(promocion.monto_minimo) ? (
                    <div className="promocion-advertencia">
                      ⚠️ Monto mínimo: ${promocion.monto_minimo}
                    </div>
                  ) : (
                    <div className="resumen-linea descuento">
                      <span>🎉 Descuento ({promocion.codigo}):</span>
                      <span className="descuento-valor">-${descuento}</span>
                    </div>
                  )}
                </>
              )}

              <div className="resumen-linea total">
                <span>Total:</span>
                <span>${promocion && descuento > 0 && parseFloat(cart.total) >= parseFloat(promocion.monto_minimo) ? totalConDescuento : cart.total}</span>
              </div>

              <button className="btn btn-primary btn-block btn-checkout" disabled>
                💳 Proceder al Pago
                <br />
                <small>(Próximamente)</small>
              </button>

              <Link to="/productos" className="btn btn-secondary-outline btn-block">
                ← Continuar Comprando
              </Link>
            </div>

            <div className="info-boxes">
              <div className="info-box">
                <span>🔒</span>
                <p>Compra Segura</p>
              </div>
              <div className="info-box">
                <span>💳</span>
                <p>Múltiples Métodos de Pago</p>
              </div>
              <div className="info-box">
                <span>📞</span>
                <p>Soporte 24/7</p>
              </div>
            </div>

            {/* Códigos de promoción disponibles */}
            <div className="promociones-disponibles">
              <h3>🎁 Promociones Disponibles</h3>
              <ul>
                <li><strong>BLACKFRIDAY2024</strong> - 25% desc. (Min. $1000)</li>
                <li><strong>NUEVO2024</strong> - 15% desc. (Min. $500)</li>
                <li><strong>AHORRA200</strong> - $200 desc. (Min. $3000)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recomendaciones basadas en el carrito */}
        {cart.items.length > 0 && cart.items[0].producto && (
          <Recomendaciones 
            productoId={cart.items[0].producto} 
            tipo="producto" 
          />
        )}
      </div>
    </div>
  );
};

export default Carrito;