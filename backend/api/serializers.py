from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Categoria, Producto, Servicio, Perfil


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