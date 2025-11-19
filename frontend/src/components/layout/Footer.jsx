import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🚀 TechStore</h3>
            <p>Tu tienda tecnológica de confianza</p>
          </div>

          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul>
              <li><a href="/productos">Productos</a></li>
              <li><a href="/servicios">Servicios</a></li>
              <li><a href="/categorias">Categorías</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contacto</h4>
            <p>📧 info@techstore.com</p>
            <p>📱 +51 999 999 999</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 TechStore. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;