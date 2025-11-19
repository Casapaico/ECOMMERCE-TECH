from django.db import models
from django.contrib.auth.models import User

# Modelo de Categoría (RF6: Mínimo 5 categorías)
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    icono = models.CharField(max_length=50, blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['nombre']
    
    def __str__(self):
        return self.nombre


# Modelo de Producto (RF7: Mínimo 4 productos por categoría)
class Producto(models.Model):
    TIPO_LICENCIA_CHOICES = [
        ('perpetua', 'Licencia Perpetua'),
        ('anual', 'Licencia Anual'),
        ('mensual', 'Licencia Mensual'),
        ('trial', 'Versión de Prueba'),
    ]
    
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='productos')
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    descripcion_tecnica = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    tipo_licencia = models.CharField(max_length=20, choices=TIPO_LICENCIA_CHOICES, default='perpetua')
    
    # Información del software
    version_actual = models.CharField(max_length=20, default='1.0.0')
    archivo_descarga = models.FileField(upload_to='software/', blank=True, null=True)
    requisitos_sistema = models.TextField(blank=True, null=True)
    
    # Imágenes y capturas
    imagen_principal = models.ImageField(upload_to='productos/', blank=True, null=True)
    captura1 = models.ImageField(upload_to='productos/capturas/', blank=True, null=True)
    captura2 = models.ImageField(upload_to='productos/capturas/', blank=True, null=True)
    captura3 = models.ImageField(upload_to='productos/capturas/', blank=True, null=True)
    
    # Control
    stock = models.IntegerField(default=999)
    activo = models.BooleanField(default=True)
    destacado = models.BooleanField(default=False)
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['-destacado', '-fecha_creacion']
    
    def __str__(self):
        return f"{self.nombre} - {self.categoria.nombre}"


# Modelo de Servicio
class Servicio(models.Model):
    TIPO_SERVICIO_CHOICES = [
        ('web', 'Desarrollo Web'),
        ('ia', 'Agente de IA'),
        ('chatbot', 'Chatbot'),
        ('ml', 'Machine Learning'),
        ('mobile', 'App Móvil'),
        ('iot', 'Sistema IoT'),
        ('redes', 'Solución de Redes'),
        ('automatizacion', 'Automatización'),
        ('consultoria', 'Consultoría'),
    ]
    
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='servicios')
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    tipo_servicio = models.CharField(max_length=20, choices=TIPO_SERVICIO_CHOICES)
    precio_base = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    cotizacion_dinamica = models.BooleanField(default=False)
    tiempo_estimado_dias = models.IntegerField(default=30)
    requisitos_cliente = models.TextField(help_text="Información requerida del cliente")
    imagen_principal = models.ImageField(upload_to='servicios/', blank=True, null=True)
    activo = models.BooleanField(default=True)
    destacado = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Servicio'
        verbose_name_plural = 'Servicios'
        ordering = ['-destacado', '-fecha_creacion']
    
    def __str__(self):
        return self.nombre


# Perfil de Usuario
class Perfil(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    telefono = models.CharField(max_length=20, blank=True, null=True)
    empresa = models.CharField(max_length=200, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatares/', blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Perfil de {self.user.username}"