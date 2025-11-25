from django.contrib import admin
from .models import (Categoria, Producto, Servicio, Perfil, 
                     Carrito, ItemCarrito, Promocion, Recomendacion, EventoUsuario) # Nuevos modelos para semana actual


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'activo', 'total_productos', 'total_servicios', 'fecha_creacion']
    list_filter = ['activo', 'fecha_creacion']
    search_fields = ['nombre', 'descripcion']
    list_editable = ['activo']
    
    def total_productos(self, obj):
        return obj.productos.count()
    total_productos.short_description = 'Total Productos'
    
    def total_servicios(self, obj):
        return obj.servicios.count()
    total_servicios.short_description = 'Total Servicios'


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'categoria', 'precio', 'tipo_licencia', 'version_actual', 
                    'stock', 'destacado', 'activo', 'fecha_creacion']
    list_filter = ['categoria', 'tipo_licencia', 'destacado', 'activo', 'fecha_creacion']
    search_fields = ['nombre', 'descripcion']
    list_editable = ['precio', 'destacado', 'activo', 'stock']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('categoria', 'nombre', 'descripcion', 'descripcion_tecnica')
        }),
        ('Precio y Licencia', {
            'fields': ('precio', 'tipo_licencia', 'stock')
        }),
        ('Información Técnica', {
            'fields': ('version_actual', 'archivo_descarga', 'requisitos_sistema')
        }),
        ('Imágenes', {
            'fields': ('imagen_principal', 'captura1', 'captura2', 'captura3')
        }),
        ('Configuración', {
            'fields': ('activo', 'destacado', 'fecha_creacion', 'fecha_actualizacion')
        }),
    )


@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'categoria', 'tipo_servicio', 'precio_base', 
                    'cotizacion_dinamica', 'tiempo_estimado_dias', 'destacado', 
                    'activo', 'fecha_creacion']
    list_filter = ['categoria', 'tipo_servicio', 'cotizacion_dinamica', 'destacado', 
                   'activo', 'fecha_creacion']
    search_fields = ['nombre', 'descripcion']
    list_editable = ['destacado', 'activo']
    readonly_fields = ['fecha_creacion']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('categoria', 'nombre', 'descripcion', 'tipo_servicio')
        }),
        ('Precio y Tiempo', {
            'fields': ('precio_base', 'cotizacion_dinamica', 'tiempo_estimado_dias')
        }),
        ('Requisitos', {
            'fields': ('requisitos_cliente',)
        }),
        ('Imagen', {
            'fields': ('imagen_principal',)
        }),
        ('Configuración', {
            'fields': ('activo', 'destacado', 'fecha_creacion')
        }),
    )


@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = ['user', 'telefono', 'empresa', 'fecha_creacion']
    search_fields = ['user__username', 'user__email', 'empresa']
    readonly_fields = ['fecha_creacion']

# CAMBIOS A PARTIR DE AQUÍ========================================================================================

# ============ NUEVOS ADMINS PARA SEMANA ACTUAL ============

@admin.register(Carrito)
class CarritoAdmin(admin.ModelAdmin):
    list_display = ['user', 'get_total_items', 'get_total', 'fecha_creacion', 'fecha_actualizacion']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['fecha_creacion', 'fecha_actualizacion']
    
    def get_total_items(self, obj):
        return obj.get_total_items()
    get_total_items.short_description = 'Total Items'


@admin.register(ItemCarrito)
class ItemCarritoAdmin(admin.ModelAdmin):
    list_display = ['carrito', 'get_item_name', 'cantidad', 'get_subtotal', 'fecha_agregado']
    list_filter = ['fecha_agregado']
    search_fields = ['carrito__user__username', 'producto__nombre', 'servicio__nombre']
    readonly_fields = ['fecha_agregado']
    
    def get_item_name(self, obj):
        return obj.producto.nombre if obj.producto else obj.servicio.nombre
    get_item_name.short_description = 'Item'


@admin.register(Promocion)
class PromocionAdmin(admin.ModelAdmin):
    list_display = ['codigo', 'nombre', 'tipo_descuento', 'valor_descuento', 
                    'fecha_inicio', 'fecha_fin', 'esta_vigente', 'activo']
    list_filter = ['activo', 'tipo_descuento', 'fecha_inicio', 'fecha_fin']
    search_fields = ['codigo', 'nombre', 'descripcion']
    list_editable = ['activo']
    filter_horizontal = ['productos', 'servicios']
    readonly_fields = ['fecha_creacion', 'usos_actuales']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('codigo', 'nombre', 'descripcion')
        }),
        ('Descuento', {
            'fields': ('tipo_descuento', 'valor_descuento')
        }),
        ('Aplicable a', {
            'fields': ('aplica_todo', 'productos', 'servicios')
        }),
        ('Restricciones', {
            'fields': ('monto_minimo', 'usos_maximos', 'usos_actuales')
        }),
        ('Vigencia', {
            'fields': ('fecha_inicio', 'fecha_fin', 'activo')
        }),
        ('Información', {
            'fields': ('fecha_creacion',)
        }),
    )
    
    def esta_vigente(self, obj):
        return obj.esta_vigente()
    esta_vigente.boolean = True
    esta_vigente.short_description = 'Vigente'


@admin.register(Recomendacion)
class RecomendacionAdmin(admin.ModelAdmin):
    list_display = ['get_origen', 'get_destino', 'score', 'motivo', 'activo']
    list_filter = ['activo', 'motivo', 'score']
    search_fields = ['motivo', 'producto_origen__nombre', 'servicio_origen__nombre']
    list_editable = ['score', 'activo']
    readonly_fields = ['fecha_creacion']
    
    fieldsets = (
        ('Origen', {
            'fields': ('producto_origen', 'servicio_origen')
        }),
        ('Destino (Recomendado)', {
            'fields': ('producto_recomendado', 'servicio_recomendado')
        }),
        ('Configuración', {
            'fields': ('score', 'motivo', 'activo', 'fecha_creacion')
        }),
    )
    
    def get_origen(self, obj):
        return obj.producto_origen or obj.servicio_origen
    get_origen.short_description = 'Desde'
    
    def get_destino(self, obj):
        return obj.producto_recomendado or obj.servicio_recomendado
    get_destino.short_description = 'Recomienda'


@admin.register(EventoUsuario)
class EventoUsuarioAdmin(admin.ModelAdmin):
    list_display = ['get_usuario', 'tipo_evento', 'get_item', 'fecha_evento']
    list_filter = ['tipo_evento', 'fecha_evento']
    search_fields = ['user__username', 'session_id', 'producto__nombre', 'servicio__nombre']
    readonly_fields = ['fecha_evento']
    
    fieldsets = (
        ('Usuario', {
            'fields': ('user', 'session_id')
        }),
        ('Evento', {
            'fields': ('tipo_evento', 'producto', 'servicio', 'metadata')
        }),
        ('Información', {
            'fields': ('fecha_evento',)
        }),
    )
    
    def get_usuario(self, obj):
        return obj.user.username if obj.user else f'Session: {obj.session_id[:10]}...'
    get_usuario.short_description = 'Usuario'
    
    def get_item(self, obj):
        return obj.producto or obj.servicio
    get_item.short_description = 'Item'

# FIN CAMBIOS ========================================================================================