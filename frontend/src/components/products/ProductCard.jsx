// En ProductCard.jsx
const queryClient = useQueryClient()

const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: ['producto', productId],
    queryFn: () => fetchProductoById(productId),
    staleTime: 5 * 60 * 1000 // 5 minutos
  })
}