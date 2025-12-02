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


# Modelo de Promoción (Marketing)
class Promocion(models.Model):
    TIPO_DESCUENTO_CHOICES = [
        ('porcentaje', 'Porcentaje'),
        ('monto_fijo', 'Monto Fijo'),
    ]
    
    codigo = models.CharField(max_length=50, unique=True, help_text="Código de la promoción")
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()
    tipo_descuento = models.CharField(max_length=20, choices=TIPO_DESCUENTO_CHOICES, default='porcentaje')
    valor_descuento = models.DecimalField(max_digits=10, decimal_places=2, help_text="Porcentaje (0-100) o monto fijo")
    
    # Aplicable a
    productos = models.ManyToManyField(Producto, blank=True, related_name='promociones')
    servicios = models.ManyToManyField(Servicio, blank=True, related_name='promociones')
    aplica_todo = models.BooleanField(default=False, help_text="Aplica a todos los productos/servicios")
    
    # Restricciones
    monto_minimo = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Monto mínimo de compra")
    usos_maximos = models.IntegerField(default=0, help_text="0 = ilimitado")
    usos_actuales = models.IntegerField(default=0)
    
    # Vigencia
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    activo = models.BooleanField(default=True)
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Promoción'
        verbose_name_plural = 'Promociones'
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"{self.codigo} - {self.nombre}"
    
    def esta_vigente(self):
        from django.utils import timezone
        now = timezone.now()
        return self.activo and self.fecha_inicio <= now <= self.fecha_fin
    
    def puede_usar(self):
        if self.usos_maximos == 0:
            return True
        return self.usos_actuales < self.usos_maximos


# Modelo de Carrito
class Carrito(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='carrito')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Carrito de {self.user.username}"
    
    def get_total(self):
        items = self.items.all()
        return sum(item.get_subtotal() for item in items)
    
    def get_total_items(self):
        return sum(item.cantidad for item in self.items.all())


# Modelo de Item del Carrito
class ItemCarrito(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE, related_name='items')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, null=True, blank=True)
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, null=True, blank=True)
    cantidad = models.IntegerField(default=1)
    fecha_agregado = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Item del Carrito'
        verbose_name_plural = 'Items del Carrito'
        unique_together = [['carrito', 'producto'], ['carrito', 'servicio']]
    
    def __str__(self):
        item_name = self.producto.nombre if self.producto else self.servicio.nombre
        return f"{self.cantidad}x {item_name}"
    
    def get_precio_unitario(self):
        if self.producto:
            return self.producto.precio
        elif self.servicio:
            return self.servicio.precio_base or 0
        return 0
    
    def get_subtotal(self):
        return self.get_precio_unitario() * self.cantidad
    
    def clean(self):
        from django.core.exceptions import ValidationError
        # Validar que tenga producto O servicio, no ambos ni ninguno
        if not self.producto and not self.servicio:
            raise ValidationError("Debe especificar un producto o un servicio")
        if self.producto and self.servicio:
            raise ValidationError("No puede tener producto y servicio al mismo tiempo")
        
        # Validar stock si es producto
        if self.producto and self.cantidad > self.producto.stock:
            raise ValidationError(f"Stock insuficiente. Disponible: {self.producto.stock}")


# Modelo de Recomendación (Sistema de recomendación simple)
class Recomendacion(models.Model):
    producto_origen = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='recomendaciones_desde', null=True, blank=True)
    servicio_origen = models.ForeignKey(Servicio, on_delete=models.CASCADE, related_name='recomendaciones_desde', null=True, blank=True)
    
    producto_recomendado = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='recomendaciones_hacia', null=True, blank=True)
    servicio_recomendado = models.ForeignKey(Servicio, on_delete=models.CASCADE, related_name='recomendaciones_hacia', null=True, blank=True)
    
    score = models.IntegerField(default=1, help_text="Mayor score = mayor relevancia")
    motivo = models.CharField(max_length=200, help_text="Ej: Complementario, Similar, Popular")
    activo = models.BooleanField(default=True)
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Recomendación'
        verbose_name_plural = 'Recomendaciones'
        ordering = ['-score', '-fecha_creacion']
    
    def __str__(self):
        origen = self.producto_origen or self.servicio_origen
        destino = self.producto_recomendado or self.servicio_recomendado
        return f"{origen} → {destino}"


# Modelo de Análisis de Comportamiento (para mejorar recomendaciones)
class EventoUsuario(models.Model):
    TIPO_EVENTO_CHOICES = [
        ('view', 'Visualización'),
        ('cart_add', 'Agregar al Carrito'),
        ('cart_remove', 'Remover del Carrito'),
        ('purchase', 'Compra'),
        ('search', 'Búsqueda'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100, help_text="Para usuarios no autenticados")
    tipo_evento = models.CharField(max_length=20, choices=TIPO_EVENTO_CHOICES)
    
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, null=True, blank=True)
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE, null=True, blank=True)
    
    metadata = models.JSONField(null=True, blank=True, help_text="Datos adicionales del evento")
    fecha_evento = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Evento de Usuario'
        verbose_name_plural = 'Eventos de Usuario'
        ordering = ['-fecha_evento']
        indexes = [
            models.Index(fields=['user', 'tipo_evento']),
            models.Index(fields=['session_id', 'tipo_evento']),
        ]
    
    def __str__(self):
        usuario = self.user.username if self.user else f"Session {self.session_id[:8]}"
        item = self.producto or self.servicio
        return f"{usuario} - {self.get_tipo_evento_display()} - {item}"


# Modelo de Pedido (Historial de Compras)
class Pedido(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('procesando', 'Procesando'),
        ('completado', 'Completado'),
        ('cancelado', 'Cancelado'),
        ('reembolsado', 'Reembolsado'),
    ]
    
    METODO_PAGO_CHOICES = [
        ('tarjeta', 'Tarjeta de Crédito/Débito'),
        ('google_pay', 'Google Pay'),
        ('apple_pay', 'Apple Pay'),
        ('paypal', 'PayPal'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pedidos')
    numero_orden = models.CharField(max_length=50, unique=True, editable=False)
    
    # Montos
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    descuento = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Información de pago
    metodo_pago = models.CharField(max_length=20, choices=METODO_PAGO_CHOICES)
    stripe_payment_intent = models.CharField(max_length=200, blank=True, null=True)
    stripe_charge_id = models.CharField(max_length=200, blank=True, null=True)
    
    # Promoción aplicada
    codigo_promocion = models.CharField(max_length=50, blank=True, null=True)
    
    # Estado y fechas
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    fecha_completado = models.DateTimeField(blank=True, null=True)
    fecha_cancelado = models.DateTimeField(blank=True, null=True)
    
    # Información adicional
    notas = models.TextField(blank=True, null=True)
    direccion_envio = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
        ordering = ['-fecha_pedido']
    
    def __str__(self):
        return f"Pedido {self.numero_orden} - {self.user.username}"
    
    def save(self, *args, **kwargs):
        if not self.numero_orden:
            # Generar número de orden único
            import uuid
            from django.utils import timezone
            timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
            unique_id = str(uuid.uuid4())[:8].upper()
            self.numero_orden = f"ORD-{timestamp}-{unique_id}"
        super().save(*args, **kwargs)


# Modelo de Item del Pedido
class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='items')
    
    # Puede ser producto o servicio
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True, blank=True)
    servicio = models.ForeignKey(Servicio, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Información del momento de la compra (para mantener histórico)
    nombre_item = models.CharField(max_length=200)
    descripcion_item = models.TextField(blank=True, null=True)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    cantidad = models.IntegerField(default=1)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Tipo de item
    tipo_item = models.CharField(max_length=20, choices=[('producto', 'Producto'), ('servicio', 'Servicio')])
    
    class Meta:
        verbose_name = 'Item del Pedido'
        verbose_name_plural = 'Items del Pedido'
    
    def __str__(self):
        return f"{self.cantidad}x {self.nombre_item} - Pedido {self.pedido.numero_orden}"
    
    def save(self, *args, **kwargs):
        # Guardar información del item en el momento de la compra
        if self.producto and not self.nombre_item:
            self.nombre_item = self.producto.nombre
            self.descripcion_item = self.producto.descripcion
            self.precio_unitario = self.producto.precio
            self.tipo_item = 'producto'
        elif self.servicio and not self.nombre_item:
            self.nombre_item = self.servicio.nombre
            self.descripcion_item = self.servicio.descripcion
            self.precio_unitario = self.servicio.precio_base or 0
            self.tipo_item = 'servicio'
        
        self.subtotal = self.precio_unitario * self.cantidad
        super().save(*args, **kwargs)