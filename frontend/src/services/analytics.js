import ReactGA from 'react-ga4';

// Configuración de Google Analytics
const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || 'G-N1TSZPR8SS'; // Reemplazar con tu ID real

class AnalyticsService {
  constructor() {
    this.initialized = false;
  }

  /**
   * Inicializar Google Analytics
   * @param {string} trackingId - ID de seguimiento de GA4 (opcional)
   */
  initialize(trackingId = TRACKING_ID) {
    if (this.initialized) {
      console.warn('Google Analytics ya está inicializado');
      return;
    }

    try {
      ReactGA.initialize(trackingId, {
        gaOptions: {
          siteSpeedSampleRate: 100, // Trackear velocidad del sitio
        },
        gtagOptions: {
          send_page_view: false, // Controlamos manualmente las pageviews
        },
      });
      this.initialized = true;
      console.log('✅ Google Analytics inicializado:', trackingId);
    } catch (error) {
      console.error('❌ Error inicializando Google Analytics:', error);
    }
  }

  /**
   * Registrar una vista de página
   * @param {string} path - Ruta de la página
   * @param {string} title - Título de la página (opcional)
   */
  pageView(path, title) {
    if (!this.initialized) return;

    try {
      ReactGA.send({
        hitType: 'pageview',
        page: path,
        title: title || document.title,
      });
      console.log('📄 Pageview:', path);
    } catch (error) {
      console.error('Error registrando pageview:', error);
    }
  }

  /**
   * Registrar un evento personalizado
   * @param {string} category - Categoría del evento
   * @param {string} action - Acción del evento
   * @param {string} label - Etiqueta (opcional)
   * @param {number} value - Valor numérico (opcional)
   */
  event(category, action, label = '', value = undefined) {
    if (!this.initialized) return;

    try {
      ReactGA.event({
        category,
        action,
        label,
        value,
      });
      console.log('🎯 Evento:', { category, action, label, value });
    } catch (error) {
      console.error('Error registrando evento:', error);
    }
  }

  /**
   * Eventos específicos del E-commerce
   */

  // Ver producto
  viewProduct(productId, productName, category, price) {
    this.event('Ecommerce', 'view_product', `${productName} (ID: ${productId})`, price);
    
    // Evento de e-commerce mejorado
    if (this.initialized) {
      ReactGA.gtag('event', 'view_item', {
        currency: 'USD',
        value: price,
        items: [{
          item_id: productId,
          item_name: productName,
          item_category: category,
          price: price,
        }],
      });
    }
  }

  // Agregar al carrito
  addToCart(productId, productName, category, price, quantity = 1) {
    this.event('Ecommerce', 'add_to_cart', `${productName} (${quantity}x)`, price * quantity);
    
    if (this.initialized) {
      ReactGA.gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: price * quantity,
        items: [{
          item_id: productId,
          item_name: productName,
          item_category: category,
          price: price,
          quantity: quantity,
        }],
      });
    }
  }

  // Eliminar del carrito
  removeFromCart(productId, productName, category, price, quantity = 1) {
    this.event('Ecommerce', 'remove_from_cart', `${productName} (${quantity}x)`, price * quantity);
    
    if (this.initialized) {
      ReactGA.gtag('event', 'remove_from_cart', {
        currency: 'USD',
        value: price * quantity,
        items: [{
          item_id: productId,
          item_name: productName,
          item_category: category,
          price: price,
          quantity: quantity,
        }],
      });
    }
  }

  // Ver carrito
  viewCart(totalValue, itemCount) {
    this.event('Ecommerce', 'view_cart', `${itemCount} items`, totalValue);
    
    if (this.initialized) {
      ReactGA.gtag('event', 'view_cart', {
        currency: 'USD',
        value: totalValue,
      });
    }
  }

  // Iniciar checkout
  beginCheckout(totalValue, items) {
    this.event('Ecommerce', 'begin_checkout', `${items.length} items`, totalValue);
    
    if (this.initialized) {
      ReactGA.gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: totalValue,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
          quantity: item.quantity,
        })),
      });
    }
  }

  // Compra completada
  purchase(transactionId, totalValue, items, tax = 0, shipping = 0) {
    this.event('Ecommerce', 'purchase', `Transaction ${transactionId}`, totalValue);
    
    if (this.initialized) {
      ReactGA.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: totalValue,
        currency: 'USD',
        tax: tax,
        shipping: shipping,
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          price: item.price,
          quantity: item.quantity,
        })),
      });
    }
  }

  // Buscar productos
  searchProducts(searchTerm, resultsCount) {
    this.event('Search', 'product_search', searchTerm, resultsCount);
    
    if (this.initialized) {
      ReactGA.gtag('event', 'search', {
        search_term: searchTerm,
      });
    }
  }

  // Filtrar productos
  filterProducts(filterType, filterValue) {
    this.event('Filters', 'apply_filter', `${filterType}: ${filterValue}`);
  }

  // Aplicar código promocional
  applyPromoCode(promoCode, discountAmount, success) {
    const label = success ? `${promoCode} (-$${discountAmount})` : `${promoCode} (Failed)`;
    this.event('Promociones', success ? 'promo_applied' : 'promo_failed', label, discountAmount);
  }

  // Registrar login
  userLogin(method = 'email') {
    this.event('User', 'login', method);
    
    if (this.initialized) {
      ReactGA.gtag('event', 'login', {
        method: method,
      });
    }
  }

  // Registrar signup
  userSignup(method = 'email') {
    this.event('User', 'sign_up', method);
    
    if (this.initialized) {
      ReactGA.gtag('event', 'sign_up', {
        method: method,
      });
    }
  }

  // Error tracking
  trackError(errorMessage, errorLocation) {
    this.event('Error', 'application_error', `${errorLocation}: ${errorMessage}`);
  }

  // Timing events (performance)
  timing(category, variable, value, label) {
    if (!this.initialized) return;

    try {
      ReactGA.gtag('event', 'timing_complete', {
        name: variable,
        value: value,
        event_category: category,
        event_label: label,
      });
      console.log('⏱️ Timing:', { category, variable, value, label });
    } catch (error) {
      console.error('Error registrando timing:', error);
    }
  }
}

// Exportar instancia única (Singleton)
const analytics = new AnalyticsService();

export default analytics;