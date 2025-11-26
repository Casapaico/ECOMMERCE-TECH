import { useQuery, useQueryClient } from '@tanstack/react-query'
import { productoService } from '../services'

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['productos', params],
    queryFn: async () => {
      return await productoService.getAll(params)
    },
  })
}

export const useProductById = (id) => {
  return useQuery({
    queryKey: ['producto', id],
    queryFn: async () => {
      return await productoService.getById(id)
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
        return await productoService.getById(id)
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
      return await productoService.getAll({ categoria: categoriaId })
    },
    enabled: !!categoriaId,
  })
}