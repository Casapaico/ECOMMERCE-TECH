import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './components/Toast/Toast';
import { usePageTracking } from './hooks/useAnalytics'; // ← CORRECTO
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import Home from './pages/Home';
import ProductoDetalle from './pages/ProductoDetalle';
import Productos from './pages/Productos';
import ProductosPorCategoria from './pages/ProductosPorCategoria';
import Servicios from './pages/Servicios';
import ServicioDetalle from './pages/ServicioDetalle';
import Categorias from './pages/Categorias';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import Register from './pages/Register';

import './App.css';

// Componente interno para usar el hook de tracking
function AppContent() {
  // Tracking automático de pageviews
  usePageTracking();

  return (
    <>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/:categoriaId/productos" element={<ProductosPorCategoria />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/servicios/:id" element={<ServicioDetalle />} />
          <Route path="/carrito" element={<PrivateRoute><Carrito /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </CartProvider>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;