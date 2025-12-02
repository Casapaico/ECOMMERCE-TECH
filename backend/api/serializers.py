from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Categoria, Producto, Servicio, Perfil, Pedido, ItemPedido
)


class CategoriaSerializer(serializers.ModelSerializer):
    # Contar productos y servicios por categoría
    total_productos = serializers.SerializerMethodField()
    total_servicios = serializers.SerializerMethodField()
    
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion', 'icono', 'activo', 'fecha_creacion', 
                  'total_productos', 'total_servicios']
    
    def get_total_productos(self, obj):
        return obj.productos.filter(activo=True).count()
    
    def get_total_servicios(self, obj):
        return obj.servicios.filter(activo=True).count()


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    
    class Meta:
        model = Producto
        fields = ['id', 'categoria', 'categoria_nombre', 'nombre', 'descripcion', 
                  'descripcion_tecnica', 'precio', 'tipo_licencia', 'version_actual',
                  'archivo_descarga', 'requisitos_sistema', 'imagen_principal',
                  'captura1', 'captura2', 'captura3', 'stock', 'activo', 'destacado',
                  'fecha_creacion', 'fecha_actualizacion']
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']


class ProductoListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listado (Home)"""
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'precio', 'imagen_principal', 
                  'categoria_nombre', 'destacado', 'tipo_licencia', 'version_actual']


class ServicioSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    tipo_servicio_display = serializers.CharField(source='get_tipo_servicio_display', read_only=True)
    
    class Meta:
        model = Servicio
        fields = ['id', 'categoria', 'categoria_nombre', 'nombre', 'descripcion',
                  'tipo_servicio', 'tipo_servicio_display', 'precio_base', 
                  'cotizacion_dinamica', 'tiempo_estimado_dias', 'requisitos_cliente',
                  'imagen_principal', 'activo', 'destacado', 'fecha_creacion']
        read_only_fields = ['fecha_creacion']


class ServicioListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listado"""
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    tipo_servicio_display = serializers.CharField(source='get_tipo_servicio_display', read_only=True)
    
    class Meta:
        model = Servicio
        fields = ['id', 'nombre', 'descripcion', 'precio_base', 'cotizacion_dinamica',
                  'imagen_principal', 'categoria_nombre', 'tipo_servicio_display', 
                  'tiempo_estimado_dias']


class PerfilSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Perfil
        fields = ['id', 'username', 'email', 'telefono', 'empresa', 
                  'direccion', 'avatar', 'fecha_creacion']
        read_only_fields = ['fecha_creacion']


class UserSerializer(serializers.ModelSerializer):
    perfil = PerfilSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'perfil']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        # Crear perfil automáticamente
        Perfil.objects.create(user=user)
        return user


# ============ NUEVOS SERIALIZERS PARA SEMANA ACTUAL ============

from .models import Carrito, ItemCarrito, Promocion, Recomendacion, EventoUsuario


class ItemCarritoSerializer(serializers.ModelSerializer):
    producto_detalle = serializers.SerializerMethodField()
    servicio_detalle = serializers.SerializerMethodField()
    precio_unitario = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True, source='get_precio_unitario')
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True, source='get_subtotal')
    
    class Meta:
        model = ItemCarrito
        fields = ['id', 'producto', 'servicio', 'producto_detalle', 'servicio_detalle',
                  'cantidad', 'precio_unitario', 'subtotal', 'fecha_agregado']
        read_only_fields = ['id', 'fecha_agregado']
    
    def get_producto_detalle(self, obj):
        if obj.producto:
            return {
                'id': obj.producto.id,
                'nombre': obj.producto.nombre,
                'imagen': obj.producto.imagen_principal.url if obj.producto.imagen_principal else None,
                'precio': str(obj.producto.precio),
                'stock': obj.producto.stock,
                'tipo_licencia': obj.producto.tipo_licencia,
                'tipo': 'producto'
            }
        return None
    
    def get_servicio_detalle(self, obj):
        if obj.servicio:
            return {
                'id': obj.servicio.id,
                'nombre': obj.servicio.nombre,
                'imagen': obj.servicio.imagen_principal.url if obj.servicio.imagen_principal else None,
                'precio': str(obj.servicio.precio_base) if obj.servicio.precio_base else '0',
                'tiempo_estimado': obj.servicio.tiempo_estimado_dias,
                'tipo': 'servicio'
            }
        return None
    
    def validate(self, data):
        # Validar que tenga producto O servicio
        if not data.get('producto') and not data.get('servicio'):
            raise serializers.ValidationError("Debe especificar un producto o servicio")
        if data.get('producto') and data.get('servicio'):
            raise serializers.ValidationError("No puede agregar producto y servicio juntos")
        
        # Validar cantidad
        if data.get('cantidad', 1) < 1:
            raise serializers.ValidationError("La cantidad debe ser al menos 1")
        
        # Validar stock
        if data.get('producto'):
            if data['cantidad'] > data['producto'].stock:
                raise serializers.ValidationError(f"Stock insuficiente. Disponible: {data['producto'].stock}")
        
        return data


class CarritoSerializer(serializers.ModelSerializer):
    items = ItemCarritoSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True, source='get_total')
    total_items = serializers.IntegerField(read_only=True, source='get_total_items')
    
    class Meta:
        model = Carrito
        fields = ['id', 'user', 'items', 'total', 'total_items', 'fecha_creacion', 'fecha_actualizacion']
        read_only_fields = ['id', 'user', 'fecha_creacion', 'fecha_actualizacion']


class PromocionSerializer(serializers.ModelSerializer):
    vigente = serializers.BooleanField(read_only=True, source='esta_vigente')
    puede_usar = serializers.BooleanField(read_only=True, source='puede_usar')
    
    class Meta:
        model = Promocion
        fields = ['id', 'codigo', 'nombre', 'descripcion', 'tipo_descuento', 
                  'valor_descuento', 'monto_minimo', 'fecha_inicio', 'fecha_fin',
                  'vigente', 'puede_usar', 'activo', 'aplica_todo']
        read_only_fields = ['id']


class RecomendacionSerializer(serializers.ModelSerializer):
    producto_recomendado_detalle = serializers.SerializerMethodField()
    servicio_recomendado_detalle = serializers.SerializerMethodField()
    
    class Meta:
        model = Recomendacion
        fields = ['id', 'producto_recomendado', 'servicio_recomendado',
                  'producto_recomendado_detalle', 'servicio_recomendado_detalle',
                  'score', 'motivo']
    
    def get_producto_recomendado_detalle(self, obj):
        if obj.producto_recomendado:
            return {
                'id': obj.producto_recomendado.id,
                'nombre': obj.producto_recomendado.nombre,
                'precio': str(obj.producto_recomendado.precio),
                'imagen': obj.producto_recomendado.imagen_principal.url if obj.producto_recomendado.imagen_principal else None,
                'destacado': obj.producto_recomendado.destacado
            }
        return None
    
    def get_servicio_recomendado_detalle(self, obj):
        if obj.servicio_recomendado:
            return {
                'id': obj.servicio_recomendado.id,
                'nombre': obj.servicio_recomendado.nombre,
                'precio': str(obj.servicio_recomendado.precio_base) if obj.servicio_recomendado.precio_base else '0',
                'imagen': obj.servicio_recomendado.imagen_principal.url if obj.servicio_recomendado.imagen_principal else None,
                'destacado': obj.servicio_recomendado.destacado
            }
        return None


class EventoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventoUsuario
        fields = ['tipo_evento', 'producto', 'servicio', 'metadata']
        read_only_fields = ['fecha_evento']


# Serializers para Pedidos
class ItemPedidoSerializer(serializers.ModelSerializer):
    """Serializer para items individuales de un pedido"""
    class Meta:
        model = ItemPedido
        fields = [
            'id', 'producto', 'servicio', 'nombre_item', 'descripcion_item',
            'precio_unitario', 'cantidad', 'subtotal', 'tipo_item'
        ]
        read_only_fields = ['nombre_item', 'descripcion_item', 'precio_unitario', 'subtotal', 'tipo_item']


class PedidoSerializer(serializers.ModelSerializer):
    """Serializer completo para pedidos (con items)"""
    items = ItemPedidoSerializer(many=True, read_only=True)
    user_nombre = serializers.CharField(source='user.username', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    metodo_pago_display = serializers.CharField(source='get_metodo_pago_display', read_only=True)
    
    class Meta:
        model = Pedido
        fields = [
            'id', 'numero_orden', 'user', 'user_nombre',
            'subtotal', 'descuento', 'total',
            'metodo_pago', 'metodo_pago_display',
            'stripe_payment_intent', 'stripe_charge_id',
            'codigo_promocion',
            'estado', 'estado_display',
            'fecha_pedido', 'fecha_completado', 'fecha_cancelado',
            'notas', 'direccion_envio',
            'items'
        ]
        read_only_fields = [
            'numero_orden', 'fecha_pedido', 'fecha_completado', 'fecha_cancelado'
        ]


class PedidoListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listado de pedidos"""
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    metodo_pago_display = serializers.CharField(source='get_metodo_pago_display', read_only=True)
    total_items = serializers.SerializerMethodField()
    
    class Meta:
        model = Pedido
        fields = [
            'id', 'numero_orden',
            'total', 'estado', 'estado_display',
            'metodo_pago_display',
            'fecha_pedido',
            'total_items'
        ]
    
    def get_total_items(self, obj):
        return obj.items.count()


class CrearPedidoSerializer(serializers.Serializer):
    """Serializer para crear un pedido desde el carrito"""
    metodo_pago = serializers.ChoiceField(
        choices=['tarjeta', 'google_pay', 'apple_pay', 'paypal']
    )
    stripe_payment_intent = serializers.CharField(required=False, allow_blank=True)
    codigo_promocion = serializers.CharField(required=False, allow_blank=True)
    direccion_envio = serializers.CharField(required=False, allow_blank=True)
    notas = serializers.CharField(required=False, allow_blank=True)