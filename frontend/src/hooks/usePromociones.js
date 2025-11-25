import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../services/api'

export const usePromociones = () => {
  return useQuery({
    queryKey: ['promociones'],
    queryFn: async () => {
      const response = await api.get('/promociones/')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export const useValidarPromocion = () => {
  return useMutation({
    mutationFn: async (codigo) => {
      const response = await api.post('/promociones/validar_codigo/', { codigo })
      return response.data
    },
  })
}