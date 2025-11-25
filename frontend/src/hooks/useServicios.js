import { useQuery, useQueryClient } from '@tanstack/react-query'
import { servicioService } from '../services'

/**
 * Hook para obtener todos los servicios con filtros opcionales
 * @param {Object} params - Parámetros de filtrado (categoria, tipo_servicio, ordering, search, etc.)
 * @returns {Object} - { data, isLoading, error, refetch }
 */
export const useServicios = (params = {}) => {
  return useQuery({
    queryKey: ['servicios', params],
    queryFn: async () => {
      const data = await servicioService.getAll(params)
      return data
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

/**
 * Hook para obtener un servicio por ID
 * @param {number|string} id - ID del servicio
 * @returns {Object} - { data, isLoading, error }
 */
export const useServicioById = (id) => {
  return useQuery({
    queryKey: ['servicio', id],
    queryFn: async () => {
      const data = await servicioService.getById(id)
      return data
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

/**
 * Hook para obtener servicios destacados
 * @returns {Object} - { data, isLoading, error }
 */
export const useServiciosDestacados = () => {
  return useQuery({
    queryKey: ['servicios', 'destacados'],
    queryFn: async () => {
      const data = await servicioService.getDestacados()
      return data
    },
    staleTime: 1000 * 60 * 10, // 10 minutos
  })
}

/**
 * Hook para obtener servicios por categoría
 * @param {number|string} categoriaId - ID de la categoría
 * @returns {Object} - { data, isLoading, error }
 */
export const useServiciosByCategory = (categoriaId) => {
  return useQuery({
    queryKey: ['servicios', 'categoria', categoriaId],
    queryFn: async () => {
      const data = await servicioService.getAll({ categoria: categoriaId })
      return data
    },
    enabled: !!categoriaId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

/**
 * Hook para hacer prefetch de un servicio (útil para hover)
 * @returns {Function} - Función que recibe el ID del servicio para hacer prefetch
 * 
 * @example
 * const prefetchServicio = usePrefetchServicio()
 * <div onMouseEnter={() => prefetchServicio(servicio.id)}>...</div>
 */
export const usePrefetchServicio = () => {
  const queryClient = useQueryClient()

  return (id) => {
    queryClient.prefetchQuery({
      queryKey: ['servicio', id],
      queryFn: async () => {
        const data = await servicioService.getById(id)
        return data
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
    })
  }
}