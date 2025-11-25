import { useQuery, useQueryClient } from '@tanstack/react-query'
import { productoService } from '../services'

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['productos', params],
    queryFn: async () => {
      const response = await productoService.getAll(params)
      return response.data
    },
  })
}

export const useProductById = (id) => {
  return useQuery({
    queryKey: ['producto', id],
    queryFn: async () => {
      const response = await productoService.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

// Hook para prefetch
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient()

  return (id) => {
    queryClient.prefetchQuery({
      queryKey: ['producto', id],
      queryFn: async () => {
        const response = await productoService.getById(id)
        return response.data
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
    })
  }
}

// Hook para productos por categoría
export const useProductsByCategory = (categoriaId) => {
  return useQuery({
    queryKey: ['productos', 'categoria', categoriaId],
    queryFn: async () => {
      const response = await productoService.getAll({ categoria: categoriaId })
      return response.data
    },
    enabled: !!categoriaId,
  })
}