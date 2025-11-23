import { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { productoService, servicioService } from '../services';

/**
 * Hook para validar y sincronizar items del carrito con el backend
 * Verifica que los productos/servicios aún existan y estén disponibles
 */
export const useCartValidation = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  useEffect(() => {
    const validateCart = async () => {
      if (cart.length === 0) return;

      for (const item of cart) {
        try {
          if (item.type === 'producto') {
            // Verificar que el producto aún existe
            const producto = await productoService.getById(item.id);
            
            // Verificar si está activo
            if (!producto.activo) {
              console.warn(`Producto ${item.nombre} ya no está disponible`);
              removeFromCart(item.id, item.type);
              // Aquí podrías mostrar una notificación al usuario
            }
            
            // Verificar stock (si la cantidad en carrito excede el stock)
            if (producto.stock < item.cantidad) {
              console.warn(`Stock insuficiente para ${item.nombre}`);
              // Ajustar cantidad al stock disponible
              if (producto.stock > 0) {
                updateQuantity(item.id, item.type, producto.stock);
              } else {
                removeFromCart(item.id, item.type);
              }
            }
            
          } else if (item.type === 'servicio') {
            // Verificar que el servicio aún existe
            const servicio = await servicioService.getById(item.id);
            
            if (!servicio.activo) {
              console.warn(`Servicio ${item.nombre} ya no está disponible`);
              removeFromCart(item.id, item.type);
            }
          }
        } catch (error) {
          // Si el producto/servicio ya no existe (404)
          console.error(`Item ${item.nombre} no encontrado, removiendo del carrito`);
          removeFromCart(item.id, item.type);
        }
      }
    };

    // Validar carrito cuando se carga el componente
    validateCart();
    
    // Opcional: Validar periódicamente cada 5 minutos
    const interval = setInterval(validateCart, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []); // Solo ejecutar al montar el componente

  return null;
};

export default useCartValidation;