import { useQuery, useQueryClient } from '@tanstack/react-query'
import { categoriaService } from '../services'

export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const response = await categoriaService.getAll()
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutos (categorías no cambian mucho)
  })
}

export const useCategoriaById = (id) => {
  return useQuery({
    queryKey: ['categoria', id],
    queryFn: async () => {
      const response = await categoriaService.getById(id)
      return response.data
    },
    enabled: !!id,
  })
}

// Hook para prefetch de productos por categoría al hacer hover
export const usePrefetchCategoria = () => {
  const queryClient = useQueryClient()

  return (id) => {
    queryClient.prefetchQuery({
      queryKey: ['productos', 'categoria', id],
      queryFn: async () => {
        const response = await categoriaService.getById(id)
        return response.data
      },
      staleTime: 5 * 60 * 1000,
    })
  }
}