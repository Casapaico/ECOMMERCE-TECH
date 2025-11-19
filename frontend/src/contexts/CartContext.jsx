import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Inicializar carrito desde localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Agregar item al carrito
  const addToCart = (item, type = 'producto') => {
    setCart((prevCart) => {
      // Verificar si el item ya existe en el carrito
      const existingIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.type === type
      );

      if (existingIndex > -1) {
        // Si existe, incrementar cantidad
        const newCart = [...prevCart];
        newCart[existingIndex].cantidad += 1;
        return newCart;
      } else {
        // Si no existe, agregarlo
        return [...prevCart, { ...item, cantidad: 1, type }];
      }
    });
  };

  // Remover item del carrito
  const removeFromCart = (itemId, type) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === itemId && item.type === type))
    );
  };

  // Actualizar cantidad de un item
  const updateQuantity = (itemId, type, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(itemId, type);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId && item.type === type
          ? { ...item, cantidad }
          : item
      )
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setCart([]);
  };

  // Obtener total de items
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.cantidad, 0);
  };

  // Obtener total del precio
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const precio = item.precio || item.precio_base || 0;
      return total + precio * item.cantidad;
    }, 0);
  };

  // Verificar si un item está en el carrito
  const isInCart = (itemId, type) => {
    return cart.some((item) => item.id === itemId && item.type === type);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};