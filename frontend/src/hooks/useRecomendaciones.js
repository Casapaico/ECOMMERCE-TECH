import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export const useRecomendacionesProducto = (productoId) => {
  return useQuery({
    queryKey: ['recomendaciones', 'producto', productoId],
    queryFn: async () => {
      const response = await api.get(`/recomendaciones/para_producto/?producto_id=${productoId}`)
      return response.data
    },
    enabled: !!productoId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

export const useRecomendacionesServicio = (servicioId) => {
  return useQuery({
    queryKey: ['recomendaciones', 'servicio', servicioId],
    queryFn: async () => {
      const response = await api.get(`/recomendaciones/para_servicio/?servicio_id=${servicioId}`)
      return response.data
    },
    enabled: !!servicioId,
    staleTime: 10 * 60 * 1000,
  })
}

export const useProductosPopulares = () => {
  return useQuery({
    queryKey: ['recomendaciones', 'populares'],
    queryFn: async () => {
      const response = await api.get('/recomendaciones/populares/')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}