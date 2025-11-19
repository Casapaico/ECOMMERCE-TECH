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