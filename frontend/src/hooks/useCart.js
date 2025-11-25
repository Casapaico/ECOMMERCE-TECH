import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'

export const useCartRQ = () => {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  // Query para obtener el carrito
  const {
    data: cart,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await api.get('/carrito/mi_carrito/')
      return response.data
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutos
  })

  // Mutación para agregar item con optimistic update
  const addToCartMutation = useMutation({
    mutationFn: async (item) => {
      const response = await api.post('/carrito/agregar_item/', item)
      return response.data
    },
    onMutate: async (newItem) => {
      // Cancelar queries en progreso
      await queryClient.cancelQueries({ queryKey: ['cart'] })

      // Guardar snapshot del carrito actual
      const previousCart = queryClient.getQueryData(['cart'])

      // Optimistic update
      queryClient.setQueryData(['cart'], (old) => {
        if (!old) return old
        
        // Simular el nuevo item en el carrito
        const mockItem = {
          id: Date.now(), // ID temporal
          ...newItem,
          cantidad: newItem.cantidad || 1,
          precio_unitario: '0',
          subtotal: '0',
          producto_detalle: newItem.producto ? { id: newItem.producto, nombre: 'Cargando...' } : null,
          servicio_detalle: newItem.servicio ? { id: newItem.servicio, nombre: 'Cargando...' } : null,
        }

        return {
          ...old,
          items: [...old.items, mockItem],
          total_items: old.total_items + (newItem.cantidad || 1),
        }
      })

      return { previousCart }
    },
    onError: (err, newItem, context) => {
      // Rollback en caso de error
      queryClient.setQueryData(['cart'], context.previousCart)
    },
    onSettled: () => {
      // Refetch para asegurar sincronización
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  // Mutación para actualizar cantidad
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ item_id, cantidad }) => {
      const response = await api.patch('/carrito/actualizar_cantidad/', {
        item_id,
        cantidad,
      })
      return response.data
    },
    onMutate: async ({ item_id, cantidad }) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] })
      const previousCart = queryClient.getQueryData(['cart'])

      queryClient.setQueryData(['cart'], (old) => {
        if (!old) return old
        
        const newItems = old.items.map((item) => {
          if (item.id === item_id) {
            const precioUnitario = parseFloat(item.precio_unitario) || 0
            return {
              ...item,
              cantidad,
              subtotal: (precioUnitario * cantidad).toFixed(2)
            }
          }
          return item
        })

        const newTotal = newItems.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0)
        const newTotalItems = newItems.reduce((sum, item) => sum + item.cantidad, 0)

        return {
          ...old,
          items: newItems,
          total: newTotal.toFixed(2),
          total_items: newTotalItems
        }
      })

      return { previousCart }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['cart'], context.previousCart)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  // Mutación para eliminar item
  const removeItemMutation = useMutation({
    mutationFn: async (item_id) => {
      const response = await api.delete('/carrito/eliminar_item/', {
        data: { item_id },
      })
      return response.data
    },
    onMutate: async (item_id) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] })
      const previousCart = queryClient.getQueryData(['cart'])

      queryClient.setQueryData(['cart'], (old) => {
        if (!old) return old
        
        const newItems = old.items.filter((item) => item.id !== item_id)
        const newTotal = newItems.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0)
        const newTotalItems = newItems.reduce((sum, item) => sum + item.cantidad, 0)

        return {
          ...old,
          items: newItems,
          total: newTotal.toFixed(2),
          total_items: newTotalItems
        }
      })

      return { previousCart }
    },
    onError: (err, item_id, context) => {
      queryClient.setQueryData(['cart'], context.previousCart)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  // Mutación para vaciar carrito
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete('/carrito/vaciar/')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  return {
    cart: cart || { items: [], total: '0', total_items: 0 },
    isLoading,
    error,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeItem: removeItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeItemMutation.isPending,
  }
}