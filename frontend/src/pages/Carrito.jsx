import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartRQ } from '../hooks/useCart'
import { useToast } from '../components/Toast/Toast'
import { useAnalytics } from '../hooks/useAnalytics'
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

  // Hook de Analytics
  const {
    viewCart,
    removeFromCart: trackRemoveFromCart,
    beginCheckout
  } = useAnalytics()

  const [promocion, setPromocion] = useState(null)

  // Trackear cuando se ve el carrito
  useEffect(() => {
    if (cart && cart.items && cart.items.length > 0) {
      viewCart(
        parseFloat(cart.total),
        cart.total_items
      );
    }
  }, [cart, viewCart]);

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

    // Encontrar el item antes de eliminarlo
    const item = cart.items.find(i => i.id === itemId)
    const detalle = item?.producto_detalle || item?.servicio_detalle

    removeItem(itemId, {
      onSuccess: () => {
        // Trackear eliminación
        if (detalle) {
          trackRemoveFromCart(
            item.id,
            detalle.nombre,
            detalle.categoria_nombre || 'Sin categoría',
            parseFloat(item.precio_unitario),
            item.cantidad
          );
        }
        
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
      <div className="carrito-page">
        <div className="container">
          <div className="loading">Cargando carrito...</div>
        </div>
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
          <button onClick={handleClearCart} className="btn-clear">
            🗑️ Vaciar Carrito
          </button>
        </div>

        <div className="carrito-content">
          <div className="carrito-items">
            {cart.items.map((item) => {
              const detalle = item.producto_detalle || item.servicio_detalle
              const tipo = item.producto ? 'producto' : 'servicio'

              return (
                <div key={item.id} className="carrito-item">
                  <div className="item-image">
                    {detalle?.imagen_principal ? (
                      <img 
                        src={`http://localhost:8000${detalle.imagen_principal}`} 
                        alt={detalle.nombre} 
                      />
                    ) : (
                      <div className="no-image">
                        {tipo === 'producto' ? '📦' : '🛠️'}
                      </div>
                    )}
                  </div>

                  <div className="item-info">
                    <div className="item-type">
                      {tipo === 'producto' ? '📦 Producto' : '🛠️ Servicio'}
                    </div>
                    <h3 className="item-name">{detalle?.nombre || 'Cargando...'}</h3>
                    
                    {item.producto_detalle && (
                      <p className="item-description">
                        <span className="item-license">
                          Licencia: {item.producto_detalle.tipo_licencia}
                        </span>
                      </p>
                    )}
                    {item.servicio_detalle && (
                      <p className="item-description">
                        <span className="item-time">
                          ⏱️ Tiempo estimado: {item.servicio_detalle.tiempo_estimado_dias} días
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="item-quantity">
                    <label>Cantidad</label>
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1 || isUpdating}
                      >
                        −
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
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-price">
                    <div className="price-unit">${item.precio_unitario} c/u</div>
                    <div className="price-total">${item.subtotal}</div>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isRemoving}
                    className="btn-remove"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>

          <div className="carrito-summary">
            <h2>Resumen del Pedido</h2>
            
            <div className="summary-line">
              <span>Items:</span>
              <span>{cart.total_items}</span>
            </div>

            <div className="summary-line">
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
                  <div className="summary-line">
                    <span>🎉 Descuento ({promocion.codigo}):</span>
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                      -${descuento}
                    </span>
                  </div>
                )}
              </>
            )}

            <div className="summary-line highlight">
              <span>Total:</span>
              <span className="total-price">
                ${promocion && descuento > 0 && parseFloat(cart.total) >= parseFloat(promocion.monto_minimo) ? totalConDescuento : cart.total}
              </span>
            </div>

            <div className="summary-actions">
              <button className="btn-checkout" disabled>
                💳 Proceder al Pago
              </button>
              <p className="checkout-note">(Próximamente)</p>
            </div>

            <div className="continue-shopping">
              <Link to="/productos" className="link">
                ← Continuar Comprando
              </Link>
            </div>
          </div>
        </div>

        {/* Info boxes */}
        <div className="carrito-info">
          <div className="info-box">
            <h3>🔒 Compra Segura</h3>
            <p>Tus datos están protegidos</p>
          </div>
          <div className="info-box">
            <h3>💳 Múltiples Métodos</h3>
            <p>Acepta todas las tarjetas</p>
          </div>
          <div className="info-box">
            <h3>📞 Soporte 24/7</h3>
            <p>Estamos para ayudarte</p>
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