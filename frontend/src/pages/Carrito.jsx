import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Carrito.css';

const Carrito = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCart();

  const handleQuantityChange = (itemId, type, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
      updateQuantity(itemId, type, quantity);
    }
  };

  const handleRemove = (itemId, type) => {
    if (window.confirm('¿Eliminar este item del carrito?')) {
      removeFromCart(itemId, type);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('¿Vaciar todo el carrito?')) {
      clearCart();
    }
  };

  if (cart.length === 0) {
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
            Vaciar Carrito
          </button>
        </div>

        <div className="carrito-content">
          {/* Lista de Items */}
          <div className="carrito-items">
            {cart.map((item) => {
              const precio = item.precio || item.precio_base || 0;
              const isServicio = item.type === 'servicio';

              return (
                <div key={`${item.type}-${item.id}`} className="carrito-item">
                  {/* Imagen */}
                  <div className="item-image">
                    {item.imagen_principal ? (
                      <img
                        src={`http://localhost:8000${item.imagen_principal}`}
                        alt={item.nombre}
                      />
                    ) : (
                      <div className="no-image">
                        {isServicio ? '🛠️' : '📦'}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="item-info">
                    <div className="item-type">
                      {isServicio ? '🛠️ Servicio' : '📦 Producto'}
                    </div>
                    <h3 className="item-name">{item.nombre}</h3>
                    <p className="item-description">
                      {item.descripcion?.substring(0, 100)}...
                    </p>
                    
                    {isServicio && item.tiempo_estimado_dias && (
                      <p className="item-time">
                        ⏱️ Tiempo estimado: {item.tiempo_estimado_dias} días
                      </p>
                    )}

                    {!isServicio && item.tipo_licencia && (
                      <p className="item-license">
                        Licencia: {item.tipo_licencia}
                      </p>
                    )}
                  </div>

                  {/* Cantidad */}
                  <div className="item-quantity">
                    <label>Cantidad:</label>
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.type, item.cantidad - 1)
                        }
                        disabled={item.cantidad <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) =>
                          handleQuantityChange(item.id, item.type, e.target.value)
                        }
                      />
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.type, item.cantidad + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="item-price">
                    <div className="price-unit">
                      ${parseFloat(precio).toFixed(2)}
                    </div>
                    <div className="price-total">
                      ${(parseFloat(precio) * item.cantidad).toFixed(2)}
                    </div>
                  </div>

                  {/* Eliminar */}
                  <button
                    onClick={() => handleRemove(item.id, item.type)}
                    className="btn-remove"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>

          {/* Resumen */}
          <div className="carrito-summary">
            <h2>Resumen del Pedido</h2>

            <div className="summary-line">
              <span>Total de items:</span>
              <strong>{getTotalItems()}</strong>
            </div>

            <div className="summary-line">
              <span>Subtotal:</span>
              <strong>${getTotalPrice().toFixed(2)}</strong>
            </div>

            <div className="summary-line highlight">
              <span>Total:</span>
              <strong className="total-price">
                ${getTotalPrice().toFixed(2)}
              </strong>
            </div>

            <div className="summary-actions">
              <button className="btn-checkout" disabled>
                Proceder al Pago
              </button>
              <p className="checkout-note">
                * El proceso de pago estará disponible en la próxima fase
              </p>
            </div>

            <div className="continue-shopping">
              <Link to="/productos" className="link">
                ← Continuar comprando
              </Link>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="carrito-info">
          <div className="info-box">
            <h3>🔒 Compra Segura</h3>
            <p>Todas las transacciones están protegidas y encriptadas</p>
          </div>
          <div className="info-box">
            <h3>💳 Métodos de Pago</h3>
            <p>Aceptamos tarjetas de crédito, débito y transferencias</p>
          </div>
          <div className="info-box">
            <h3>📧 Soporte</h3>
            <p>¿Necesitas ayuda? Contáctanos en soporte@techstore.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;