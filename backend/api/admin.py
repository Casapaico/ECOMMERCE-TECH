from django.contrib import admin
from .models import Categoria, Producto, Servicio, Perfil


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