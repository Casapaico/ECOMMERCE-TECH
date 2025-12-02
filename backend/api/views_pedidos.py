from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from decimal import Decimal

from .models import Pedido, ItemPedido, Carrito
from .serializers import (
    PedidoSerializer, PedidoListSerializer, 
    CrearPedidoSerializer, ItemPedidoSerializer
)


class PedidoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar pedidos (historial de compras)
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PedidoListSerializer
        elif self.action == 'create_from_cart':
            return CrearPedidoSerializer
        return PedidoSerializer
    
    def get_queryset(self):
        # Solo mostrar pedidos del usuario actual
        return Pedido.objects.filter(user=self.request.user).prefetch_related('items')
    
    @action(detail=False, methods=['post'])
    def create_from_cart(self, request):
        """
        Crear un pedido desde el carrito actual del usuario
        """
        serializer = CrearPedidoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        # Obtener carrito
        try:
            carrito = Carrito.objects.get(user=user)
        except Carrito.DoesNotExist:
            return Response(
                {'error': 'No tienes un carrito activo'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verificar que el carrito tenga items
        items_carrito = carrito.items.all()
        if not items_carrito.exists():
            return Response(
                {'error': 'El carrito está vacío'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calcular subtotal
        subtotal = Decimal('0.00')
        for item in items_carrito:
            subtotal += item.get_subtotal()
        
        # Aplicar descuento si hay código de promoción
        descuento = Decimal('0.00')
        codigo_promocion = serializer.validated_data.get('codigo_promocion', '')
        
        if codigo_promocion:
            # Validar promoción (puedes agregar lógica más compleja)
            from .models import Promocion
            try:
                promocion = Promocion.objects.get(
                    codigo=codigo_promocion,
                    activo=True
                )
                if promocion.esta_vigente() and promocion.puede_usar():
                    if promocion.tipo_descuento == 'porcentaje':
                        descuento = subtotal * (promocion.valor_descuento / Decimal('100'))
                    else:
                        descuento = min(promocion.valor_descuento, subtotal)
                    
                    # Incrementar uso de promoción
                    promocion.usos_actuales += 1
                    promocion.save()
            except Promocion.DoesNotExist:
                pass
        
        total = subtotal - descuento
        
        # Crear pedido
        pedido = Pedido.objects.create(
            user=user,
            subtotal=subtotal,
            descuento=descuento,
            total=total,
            metodo_pago=serializer.validated_data['metodo_pago'],
            stripe_payment_intent=serializer.validated_data.get('stripe_payment_intent', ''),
            codigo_promocion=codigo_promocion,
            direccion_envio=serializer.validated_data.get('direccion_envio', ''),
            notas=serializer.validated_data.get('notas', ''),
            estado='completado'  # Por ahora marcamos como completado directamente
        )
        
        # Crear items del pedido
        for item_carrito in items_carrito:
            ItemPedido.objects.create(
                pedido=pedido,
                producto=item_carrito.producto,
                servicio=item_carrito.servicio,
                cantidad=item_carrito.cantidad
            )
        
        # Vaciar carrito
        items_carrito.delete()
        
        # Marcar fecha de completado
        pedido.fecha_completado = timezone.now()
        pedido.save()
        
        # Retornar pedido creado
        response_serializer = PedidoSerializer(pedido)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        """
        Cancelar un pedido
        """
        pedido = self.get_object()
        
        if pedido.estado == 'cancelado':
            return Response(
                {'error': 'El pedido ya está cancelado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if pedido.estado == 'completado':
            return Response(
                {'error': 'No se puede cancelar un pedido completado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        pedido.estado = 'cancelado'
        pedido.fecha_cancelado = timezone.now()
        pedido.save()
        
        serializer = PedidoSerializer(pedido)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        """
        Obtener estadísticas de compras del usuario
        """
        pedidos = self.get_queryset()
        
        total_pedidos = pedidos.count()
        total_gastado = sum(p.total for p in pedidos.filter(estado='completado'))
        
        # Pedidos por estado
        pedidos_por_estado = {}
        for choice in Pedido.ESTADO_CHOICES:
            estado_key = choice[0]
            pedidos_por_estado[estado_key] = pedidos.filter(estado=estado_key).count()
        
        return Response({
            'total_pedidos': total_pedidos,
            'total_gastado': str(total_gastado),
            'pedidos_por_estado': pedidos_por_estado
        })