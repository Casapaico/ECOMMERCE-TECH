from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend

from .models import Categoria, Producto, Servicio, Perfil
from .serializers import (
    CategoriaSerializer, ProductoSerializer, ProductoListSerializer,
    ServicioSerializer, ServicioListSerializer, PerfilSerializer,
    UserSerializer, RegisterSerializer
)


class CategoriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar categorías.
    GET /api/categorias/ - Listar todas
    GET /api/categorias/{id}/ - Ver detalle
    POST /api/categorias/ - Crear (admin)
    PUT /api/categorias/{id}/ - Actualizar (admin)
    DELETE /api/categorias/{id}/ - Eliminar (admin)
    """
    queryset = Categoria.objects.filter(activo=True)
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    @action(detail=True, methods=['get'])
    def productos(self, request, pk=None):
        """Obtener todos los productos de una categoría"""
        categoria = self.get_object()
        productos = categoria.productos.filter(activo=True)
        serializer = ProductoListSerializer(productos, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def servicios(self, request, pk=None):
        """Obtener todos los servicios de una categoría"""
        categoria = self.get_object()
        servicios = categoria.servicios.filter(activo=True)
        serializer = ServicioListSerializer(servicios, many=True, context={'request': request})
        return Response(serializer.data)


class ProductoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar productos (software).
    RF1, RF2: Home y Detalle de producto
    """
    queryset = Producto.objects.filter(activo=True)
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'tipo_licencia', 'destacado']
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['precio', 'fecha_creacion', 'nombre']
    ordering = ['-destacado', '-fecha_creacion']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProductoListSerializer
        return ProductoSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    @action(detail=False, methods=['get'])
    def destacados(self, request):
        """Obtener productos destacados para el home"""
        productos = self.queryset.filter(destacado=True)[:8]
        serializer = ProductoListSerializer(productos, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recientes(self, request):
        """Obtener productos más recientes"""
        productos = self.queryset.order_by('-fecha_creacion')[:8]
        serializer = ProductoListSerializer(productos, many=True, context={'request': request})
        return Response(serializer.data)


class ServicioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar servicios tecnológicos.
    """
    queryset = Servicio.objects.filter(activo=True)
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'tipo_servicio', 'destacado', 'cotizacion_dinamica']
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['precio_base', 'fecha_creacion', 'tiempo_estimado_dias']
    ordering = ['-destacado', '-fecha_creacion']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ServicioListSerializer
        return ServicioSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [AllowAny()]
    
    @action(detail=False, methods=['get'])
    def destacados(self, request):
        """Obtener servicios destacados"""
        servicios = self.queryset.filter(destacado=True)[:6]
        serializer = ServicioListSerializer(servicios, many=True, context={'request': request})
        return Response(serializer.data)


class PerfilViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar perfiles de usuario.
    """
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Los usuarios solo pueden ver su propio perfil
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(user=self.request.user)
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        """Obtener o actualizar el perfil del usuario actual"""
        perfil, created = Perfil.objects.get_or_create(user=request.user)
        
        if request.method == 'GET':
            serializer = self.get_serializer(perfil)
            return Response(serializer.data)
        
        elif request.method in ['PUT', 'PATCH']:
            serializer = self.get_serializer(perfil, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Endpoint para registrar nuevos usuarios.
    RF4: Registro de usuarios
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "Usuario registrado exitosamente",
            "user": UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """
    Obtener información del usuario actual
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# CAMBIOS ========================================================================================

# ============ NUEVAS VIEWS PARA SEMANA ACTUAL ============

from .models import Carrito, ItemCarrito, Promocion, Recomendacion, EventoUsuario
from .serializers import (
    CarritoSerializer, ItemCarritoSerializer, PromocionSerializer,
    RecomendacionSerializer, EventoUsuarioSerializer
)


class CarritoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar el carrito de compras.
    NUEVO: Requerido para semana actual con React Query
    """
    serializer_class = CarritoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Carrito.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def mi_carrito(self, request):
        """Obtener el carrito del usuario actual"""
        carrito, created = Carrito.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(carrito)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def agregar_item(self, request):
        """Agregar un item al carrito"""
        carrito, created = Carrito.objects.get_or_create(user=request.user)
        
        producto_id = request.data.get('producto')
        servicio_id = request.data.get('servicio')
        cantidad = int(request.data.get('cantidad', 1))
        
        # Validaciones
        if not producto_id and not servicio_id:
            return Response(
                {'error': 'Debe especificar un producto o servicio'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if producto_id and servicio_id:
            return Response(
                {'error': 'No puede agregar producto y servicio juntos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Verificar si ya existe
            if producto_id:
                producto = Producto.objects.get(id=producto_id, activo=True)
                
                # Validar stock
                if cantidad > producto.stock:
                    return Response(
                        {'error': f'Stock insuficiente. Disponible: {producto.stock}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                item, item_created = ItemCarrito.objects.get_or_create(
                    carrito=carrito,
                    producto=producto,
                    defaults={'cantidad': cantidad}
                )
                if not item_created:
                    # Validar stock al incrementar
                    if item.cantidad + cantidad > producto.stock:
                        return Response(
                            {'error': f'Stock insuficiente. Disponible: {producto.stock}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    item.cantidad += cantidad
                    item.save()
                
                # Registrar evento
                EventoUsuario.objects.create(
                    user=request.user,
                    tipo_evento='cart_add',
                    producto=producto
                )
            else:
                servicio = Servicio.objects.get(id=servicio_id, activo=True)
                item, item_created = ItemCarrito.objects.get_or_create(
                    carrito=carrito,
                    servicio=servicio,
                    defaults={'cantidad': cantidad}
                )
                if not item_created:
                    item.cantidad += cantidad
                    item.save()
                
                # Registrar evento
                EventoUsuario.objects.create(
                    user=request.user,
                    tipo_evento='cart_add',
                    servicio=servicio
                )
            
            serializer = ItemCarritoSerializer(item)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except (Producto.DoesNotExist, Servicio.DoesNotExist):
            return Response(
                {'error': 'Producto o servicio no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['patch'])
    def actualizar_cantidad(self, request):
        """Actualizar cantidad de un item"""
        item_id = request.data.get('item_id')
        nueva_cantidad = int(request.data.get('cantidad'))
        
        if nueva_cantidad < 1:
            return Response(
                {'error': 'La cantidad debe ser al menos 1'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            item = ItemCarrito.objects.get(
                id=item_id,
                carrito__user=request.user
            )
            
            # Validar stock
            if item.producto and nueva_cantidad > item.producto.stock:
                return Response(
                    {'error': f'Stock insuficiente. Disponible: {item.producto.stock}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            item.cantidad = nueva_cantidad
            item.save()
            
            serializer = ItemCarritoSerializer(item)
            return Response(serializer.data)
        
        except ItemCarrito.DoesNotExist:
            return Response(
                {'error': 'Item no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['delete'])
    def eliminar_item(self, request):
        """Eliminar un item del carrito"""
        item_id = request.data.get('item_id')
        
        try:
            item = ItemCarrito.objects.get(
                id=item_id,
                carrito__user=request.user
            )
            
            # Registrar evento
            EventoUsuario.objects.create(
                user=request.user,
                tipo_evento='cart_remove',
                producto=item.producto,
                servicio=item.servicio
            )
            
            item.delete()
            
            # Retornar carrito actualizado
            carrito = Carrito.objects.get(user=request.user)
            serializer = CarritoSerializer(carrito)
            return Response(serializer.data)
        
        except ItemCarrito.DoesNotExist:
            return Response(
                {'error': 'Item no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['delete'])
    def vaciar(self, request):
        """Vaciar el carrito"""
        carrito, created = Carrito.objects.get_or_create(user=request.user)
        carrito.items.all().delete()
        
        serializer = CarritoSerializer(carrito)
        return Response(serializer.data)


class PromocionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para gestionar promociones (Marketing).
    NUEVO: Sistema de promociones y descuentos
    """
    queryset = Promocion.objects.all()
    serializer_class = PromocionSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Solo mostrar promociones vigentes y activas
        from django.utils import timezone
        now = timezone.now()
        return super().get_queryset().filter(
            activo=True,
            fecha_inicio__lte=now,
            fecha_fin__gte=now
        )
    
    @action(detail=False, methods=['post'])
    def validar_codigo(self, request):
        """Validar un código de promoción"""
        codigo = request.data.get('codigo', '').strip().upper()
        
        if not codigo:
            return Response(
                {'valido': False, 'mensaje': 'Debe ingresar un código'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            promocion = Promocion.objects.get(codigo=codigo)
            
            if not promocion.esta_vigente():
                return Response(
                    {'valido': False, 'mensaje': 'Promoción no vigente o expirada'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not promocion.puede_usar():
                return Response(
                    {'valido': False, 'mensaje': 'Promoción agotada'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = self.get_serializer(promocion)
            return Response({
                'valido': True,
                'mensaje': 'Código válido',
                'promocion': serializer.data
            })
        
        except Promocion.DoesNotExist:
            return Response(
                {'valido': False, 'mensaje': 'Código inválido'},
                status=status.HTTP_404_NOT_FOUND
            )


class RecomendacionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para sistema de recomendaciones.
    NUEVO: Recomendaciones de productos/servicios
    """
    queryset = Recomendacion.objects.filter(activo=True)
    serializer_class = RecomendacionSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def para_producto(self, request):
        """Obtener recomendaciones para un producto"""
        producto_id = request.query_params.get('producto_id')
        
        if not producto_id:
            return Response(
                {'error': 'Se requiere producto_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        recomendaciones = self.get_queryset().filter(
            producto_origen_id=producto_id
        ).order_by('-score')[:6]
        
        serializer = self.get_serializer(recomendaciones, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def para_servicio(self, request):
        """Obtener recomendaciones para un servicio"""
        servicio_id = request.query_params.get('servicio_id')
        
        if not servicio_id:
            return Response(
                {'error': 'Se requiere servicio_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        recomendaciones = self.get_queryset().filter(
            servicio_origen_id=servicio_id
        ).order_by('-score')[:6]
        
        serializer = self.get_serializer(recomendaciones, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def populares(self, request):
        """Obtener productos/servicios más populares basado en eventos"""
        from django.db.models import Count
        
        # Productos más vistos
        productos_populares = EventoUsuario.objects.filter(
            tipo_evento__in=['view', 'cart_add'],
            producto__isnull=False
        ).values('producto').annotate(
            total=Count('id')
        ).order_by('-total')[:6]
        
        productos_ids = [p['producto'] for p in productos_populares]
        productos = Producto.objects.filter(id__in=productos_ids, activo=True)
        
        return Response({
            'productos': ProductoListSerializer(productos, many=True).data
        })


class EventoUsuarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para registrar eventos de usuario (Analytics).
    NUEVO: Tracking de comportamiento para analytics y recomendaciones
    """
    serializer_class = EventoUsuarioSerializer
    permission_classes = [AllowAny]  # Permitir registrar eventos sin auth
    
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return EventoUsuario.objects.filter(user=self.request.user)
        return EventoUsuario.objects.none()
    
    def perform_create(self, serializer):
        # Guardar usuario o session_id
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            # Generar o usar session_id
            session_id = self.request.session.session_key
            if not session_id:
                self.request.session.create()
                session_id = self.request.session.session_key
            serializer.save(session_id=session_id)

# FIN CAMBIOS ========================================================================================