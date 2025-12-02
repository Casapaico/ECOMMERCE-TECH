import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../services/analytics';

/**
 * Hook para inicializar y trackear pageviews automáticamente
 * Usar en App.jsx o en el componente raíz
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Inicializar GA solo una vez
    analytics.initialize();
  }, []);

  useEffect(() => {
    // Trackear cada cambio de ruta
    analytics.pageView(location.pathname + location.search, document.title);
  }, [location]);
};

/**
 * Hook para acceder fácilmente a las funciones de analytics
 * @returns {Object} - Funciones de analytics
 */
export const useAnalytics = () => {
  return {
    // Pageviews
    pageView: analytics.pageView.bind(analytics),
    
    // Eventos generales
    event: analytics.event.bind(analytics),
    
    // E-commerce
    viewProduct: analytics.viewProduct.bind(analytics),
    addToCart: analytics.addToCart.bind(analytics),
    removeFromCart: analytics.removeFromCart.bind(analytics),
    viewCart: analytics.viewCart.bind(analytics),
    beginCheckout: analytics.beginCheckout.bind(analytics),
    purchase: analytics.purchase.bind(analytics),
    
    // Búsqueda y filtros
    searchProducts: analytics.searchProducts.bind(analytics),
    filterProducts: analytics.filterProducts.bind(analytics),
    
    // Promociones
    applyPromoCode: analytics.applyPromoCode.bind(analytics),
    
    // Usuario
    userLogin: analytics.userLogin.bind(analytics),
    userSignup: analytics.userSignup.bind(analytics),
    
    // Errores
    trackError: analytics.trackError.bind(analytics),
    
    // Performance
    timing: analytics.timing.bind(analytics),
  };
};

export default useAnalytics;