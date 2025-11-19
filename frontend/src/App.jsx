import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import Home from './pages/Home';
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import Register from './pages/Register';
// import Productos from './pages/Productos';
// import Servicios from './pages/Servicios';
// import ServicioDetalle from './pages/ServicioDetalle';
// import Categorias from './pages/Categorias';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                {/* Ruta principal - RF1: Home */}
                <Route path="/" element={<Home />} />

                {/* Rutas de productos - RF2: Detalle Producto */}
                {/* <Route path="/productos" element={<Productos />} /> */}
                <Route path="/productos/:id" element={<ProductoDetalle />} />

                {/* Rutas de servicios */}
                {/* <Route path="/servicios" element={<Servicios />} /> */}
                {/* <Route path="/servicios/:id" element={<ServicioDetalle />} /> */}

                {/* Rutas de categorías */}
                {/* <Route path="/categorias" element={<Categorias />} /> */}

                {/* Rutas de autenticación - RF4: Login y Registro */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Ruta del carrito - RF3: Carrito (protegida) */}
                <Route
                  path="/carrito"
                  element={
                    <PrivateRoute>
                      <Carrito />
                    </PrivateRoute>
                  }
                />

                {/* Ruta 404 */}
                <Route
                  path="*"
                  element={
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                      <h1>404 - Página no encontrada</h1>
                      <a href="/">Volver al inicio</a>
                    </div>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;