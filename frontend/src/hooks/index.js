/**
 * Índice central de todos los hooks personalizados
 * Facilita las importaciones desde cualquier componente
 */

// Hooks de Carrito
export {
  useCart,
} from './useCart'

// Hooks de Productos
export {
  useProducts,
  useProductById,
  usePrefetchProduct,
  useProductsByCategory,
} from './useProducts'

// Hooks de Servicios
export {
  useServicios,
  useServicioById,
  useServiciosDestacados,
  useServiciosByCategory,
  usePrefetchServicio,
} from './useServicios'

// Hooks de Categorías
export {
  useCategorias,
  useCategoriaById,
  usePrefetchCategoria,
} from './useCategorias'

// Hooks de Promociones
export {
  usePromociones,
  useValidarPromocion,
} from './usePromociones'

// Hooks de Recomendaciones
export {
  useRecomendacionesProducto,
  useRecomendacionesServicio,
  useProductosPopulares,
} from './useRecomendaciones'