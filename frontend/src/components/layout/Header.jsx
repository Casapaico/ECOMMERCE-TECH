import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">TechStore</span>
          </Link>

          {/* Navigation */}
          <nav className="nav">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/productos" className="nav-link">Productos</Link>
            <Link to="/servicios" className="nav-link">Servicios</Link>
            <Link to="/categorias" className="nav-link">Categorías</Link>
          </nav>

          {/* User Actions */}
          <div className="user-actions">
            {/* Cart */}
            <Link to="/carrito" className="cart-button">
              <span className="cart-icon">🛒</span>
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-name">👋 {user?.username}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn-register">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;