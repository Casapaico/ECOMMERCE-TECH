"""
Script para poblar la base de datos con datos iniciales
Ejecutar: python manage.py shell < populate_db.py
O: python manage.py shell
   exec(open('populate_db.py').read())
"""

from api.models import Categoria, Producto, Servicio
from decimal import Decimal

print("🚀 Iniciando población de base de datos...")

# Limpiar datos existentes (opcional)
# Producto.objects.all().delete()
# Servicio.objects.all().delete()
# Categoria.objects.all().delete()

# ===== CREAR 5 CATEGORÍAS (RF6) =====
categorias_data = [
    {
        'nombre': 'Sistemas para Restaurantes',
        'descripcion': 'Software especializado para gestión de restaurantes, bares y cafeterías',
        'icono': '🍽️'
    },
    {
        'nombre': 'Sistemas Empresariales',
        'descripcion': 'ERP, CRM y software de gestión empresarial',
        'icono': '💼'
    },
    {
        'nombre': 'Desarrollo de Inteligencia Artificial',
        'descripcion': 'Agentes de IA, chatbots y modelos de machine learning',
        'icono': '🤖'
    },
    {
        'nombre': 'Desarrollo Web y Móvil',
        'descripcion': 'Páginas web, aplicaciones móviles y sistemas web personalizados',
        'icono': '📱'
    },
    {
        'nombre': 'Automatización y IoT',
        'descripcion': 'Sistemas de automatización, IoT con Arduino y soluciones inteligentes',
        'icono': '⚙️'
    }
]

categorias = {}
for cat_data in categorias_data:
    categoria, created = Categoria.objects.get_or_create(
        nombre=cat_data['nombre'],
        defaults=cat_data
    )
    categorias[cat_data['nombre']] = categoria
    status = "✅ Creada" if created else "ℹ️  Ya existe"
    print(f"{status}: {categoria.nombre}")

print("\n📦 Creando productos (mínimo 4 por categoría - RF7)...\n")

# ===== CATEGORÍA 1: SISTEMAS PARA RESTAURANTES (4+ productos) =====
productos_restaurantes = [
    {
        'nombre': 'RestoPOS Pro',
        'descripcion': 'Sistema POS completo para restaurantes con gestión de mesas, comandas y facturación',
        'descripcion_tecnica': 'Sistema modular con interfaz táctil, gestión de múltiples cajas, impresión de tickets en cocina y barra',
        'precio': Decimal('2499.00'),
        'tipo_licencia': 'perpetua',
        'version_actual': '3.5.2',
        'destacado': True,
    },
    {
        'nombre': 'Delivery Manager',
        'descripcion': 'Plataforma de gestión de delivery y pedidos online integrada con apps móviles',
        'descripcion_tecnica': 'Sistema web con API REST, integración con WhatsApp, tracking GPS en tiempo real',
        'precio': Decimal('1899.00'),
        'tipo_licencia': 'anual',
        'version_actual': '2.1.0',
        'destacado': True,
    },
    {
        'nombre': 'Kitchen Display System',
        'descripcion': 'Sistema de pantallas para cocina que muestra comandas en tiempo real',
        'descripcion_tecnica': 'Compatible con tablets y pantallas táctiles, sincronización en tiempo real',
        'precio': Decimal('899.00'),
        'tipo_licencia': 'perpetua',
        'version_actual': '1.8.5',
    },
    {
        'nombre': 'RestoInventory',
        'descripcion': 'Sistema de gestión de inventario y costos para restaurantes',
        'descripcion_tecnica': 'Control de stock, recetas, costos de platos, alertas de inventario bajo',
        'precio': Decimal('1299.00'),
        'tipo_licencia': 'mensual',
        'version_actual': '2.3.1',
    },
]

for prod_data in productos_restaurantes:
    prod_data['categoria'] = categorias['Sistemas para Restaurantes']
    producto, created = Producto.objects.get_or_create(
        nombre=prod_data['nombre'],
        defaults=prod_data
    )
    status = "✅" if created else "ℹ️"
    print(f"  {status} {producto.nombre} - ${producto.precio}")

# ===== CATEGORÍA 2: SISTEMAS EMPRESARIALES (4+ productos) =====
print("\n💼 Sistemas Empresariales:")
productos_empresariales = [
    {
        'nombre': 'ERP Business Suite',
        'descripcion': 'Sistema ERP completo para gestión empresarial integral',
        'descripcion_tecnica': 'Módulos de contabilidad, ventas, compras, inventario, RRHH, facturación electrónica',
        'precio': Decimal('8999.00'),
        'tipo_licencia': 'perpetua',
        'version_actual': '5.2.0',
        'destacado': True,
    },
    {
        'nombre': 'CRM ProSales',
        'descripcion': 'Sistema de gestión de relaciones con clientes y fuerza de ventas',
        'descripcion_tecnica': 'Pipeline de ventas, seguimiento de leads, automatización de email marketing',
        'precio': Decimal('3499.00'),
        'tipo_licencia': 'anual',
        'version_actual': '4.1.3',
        'destacado': True,
    },
    {
        'nombre': 'Facturación Electrónica Plus',
        'descripcion': 'Sistema de facturación electrónica integrado con SUNAT',
        'descripcion_tecnica': 'Emisión de boletas y facturas electrónicas, reportes tributarios automáticos',
        'precio': Decimal('1799.00'),
        'tipo_licencia': 'anual',
        'version_actual': '3.0.5',
    },
    {
        'nombre': 'Sistema de Proyectos',
        'descripcion': 'Gestión de proyectos con metodologías ágiles integradas',
        'descripcion_tecnica': 'Tableros Kanban, Gantt, seguimiento de tiempo, gestión de recursos',
        'precio': Decimal('2299.00'),
        'tipo_licencia': 'mensual',
        'version_actual': '2.7.1',
    },
]

for prod_data in productos_empresariales:
    prod_data['categoria'] = categorias['Sistemas Empresariales']
    producto, created = Producto.objects.get_or_create(
        nombre=prod_data['nombre'],
        defaults=prod_data
    )
    status = "✅" if created else "ℹ️"
    print(f"  {status} {producto.nombre} - ${producto.precio}")

# ===== CATEGORÍA 3: DESARROLLO DE IA (4+ productos) =====
print("\n🤖 Desarrollo de Inteligencia Artificial:")
servicios_ia = [
    {
        'nombre': 'Chatbot Inteligente Personalizado',
        'descripcion': 'Desarrollo de chatbot con IA entrenado con los datos de tu empresa',
        'tipo_servicio': 'chatbot',
        'precio_base': Decimal('4500.00'),
        'tiempo_estimado_dias': 30,
        'requisitos_cliente': 'Documentación de la empresa, FAQs, procesos internos',
        'destacado': True,
    },
    {
        'nombre': 'Agente de IA Empresarial',
        'descripcion': 'Agente de IA que puede automatizar tareas, responder consultas y ejecutar acciones',
        'tipo_servicio': 'ia',
        'precio_base': Decimal('7500.00'),
        'tiempo_estimado_dias': 45,
        'requisitos_cliente': 'Alcance del proyecto, integraciones necesarias, datos de entrenamiento',
        'destacado': True,
    },
    {
        'nombre': 'Modelo de Machine Learning',
        'descripcion': 'Desarrollo de modelo ML personalizado para predicción y clasificación',
        'tipo_servicio': 'ml',
        'precio_base': Decimal('5500.00'),
        'tiempo_estimado_dias': 35,
        'requisitos_cliente': 'Dataset histórico, variables de entrada y salida esperadas',
    },
    {
        'nombre': 'Asistente Virtual Inteligente',
        'descripcion': 'Asistente virtual con reconocimiento de voz y procesamiento de lenguaje natural',
        'tipo_servicio': 'ia',
        'precio_base': Decimal('6200.00'),
        'tiempo_estimado_dias': 40,
        'requisitos_cliente': 'Funcionalidades requeridas, integraciones con sistemas existentes',
    },
]

for serv_data in servicios_ia:
    serv_data['categoria'] = categorias['Desarrollo de Inteligencia Artificial']
    servicio, created = Servicio.objects.get_or_create(
        nombre=serv_data['nombre'],
        defaults=serv_data
    )
    status = "✅" if created else "ℹ️"
    print(f"  {status} {servicio.nombre} - ${servicio.precio_base}")

# ===== CATEGORÍA 4: DESARROLLO WEB Y MÓVIL (4+ productos) =====
print("\n📱 Desarrollo Web y Móvil:")
servicios_web = [
    {
        'nombre': 'Página Web Profesional',
        'descripcion': 'Diseño y desarrollo de página web responsive con CMS',
        'tipo_servicio': 'web',
        'precio_base': Decimal('2500.00'),
        'tiempo_estimado_dias': 20,
        'requisitos_cliente': 'Contenido, imágenes, diseño de referencia, dominio',
        'destacado': True,
    },
    {
        'nombre': 'E-Commerce Completo',
        'descripcion': 'Tienda online con pasarela de pagos y gestión de inventario',
        'tipo_servicio': 'web',
        'precio_base': Decimal('5500.00'),
        'tiempo_estimado_dias': 45,
        'requisitos_cliente': 'Catálogo de productos, métodos de pago, logística',
        'destacado': True,
    },
    {
        'nombre': 'Aplicación Móvil Nativa',
        'descripcion': 'App móvil para iOS y Android con backend personalizado',
        'tipo_servicio': 'mobile',
        'precio_base': Decimal('8500.00'),
        'tiempo_estimado_dias': 60,
        'requisitos_cliente': 'Funcionalidades, diseño UI/UX, integraciones API',
    },
    {
        'nombre': 'Sistema Web Personalizado',
        'descripcion': 'Aplicación web a medida con React y Django',
        'tipo_servicio': 'web',
        'precio_base': Decimal('7200.00'),
        'tiempo_estimado_dias': 50,
        'requisitos_cliente': 'Requerimientos funcionales, flujo de usuarios, base de datos',
    },
]

for serv_data in servicios_web:
    serv_data['categoria'] = categorias['Desarrollo Web y Móvil']
    servicio, created = Servicio.objects.get_or_create(
        nombre=serv_data['nombre'],
        defaults=serv_data
    )
    status = "✅" if created else "ℹ️"
    print(f"  {status} {servicio.nombre} - ${servicio.precio_base}")

# ===== CATEGORÍA 5: AUTOMATIZACIÓN Y IOT (4+ productos) =====
print("\n⚙️ Automatización y IoT:")
servicios_iot = [
    {
        'nombre': 'Sistema IoT con Arduino',
        'descripcion': 'Desarrollo de sistema IoT personalizado con sensores y actuadores',
        'tipo_servicio': 'iot',
        'precio_base': Decimal('3800.00'),
        'tiempo_estimado_dias': 30,
        'requisitos_cliente': 'Descripción del sistema, sensores necesarios, alcance del proyecto',
        'destacado': True,
    },
    {
        'nombre': 'Automatización de Procesos (RPA)',
        'descripcion': 'Automatización de tareas repetitivas con bots',
        'tipo_servicio': 'automatizacion',
        'precio_base': Decimal('4200.00'),
        'tiempo_estimado_dias': 25,
        'requisitos_cliente': 'Procesos a automatizar, sistemas involucrados, credenciales',
    },
    {
        'nombre': 'Casa Inteligente',
        'descripcion': 'Sistema domótico completo con control por app y voz',
        'tipo_servicio': 'iot',
        'precio_base': Decimal('5500.00'),
        'tiempo_estimado_dias': 40,
        'requisitos_cliente': 'Planos de la casa, dispositivos a controlar, presupuesto de hardware',
    },
    {
        'nombre': 'Solución de Redes Empresarial',
        'descripcion': 'Diseño e implementación de red empresarial segura',
        'tipo_servicio': 'redes',
        'precio_base': Decimal('6500.00'),
        'tiempo_estimado_dias': 35,
        'requisitos_cliente': 'Tamaño de la empresa, ubicaciones, requerimientos de seguridad',
    },
]

for serv_data in servicios_iot:
    serv_data['categoria'] = categorias['Automatización y IoT']
    servicio, created = Servicio.objects.get_or_create(
        nombre=serv_data['nombre'],
        defaults=serv_data
    )
    status = "✅" if created else "ℹ️"
    print(f"  {status} {servicio.nombre} - ${servicio.precio_base}")

print("\n" + "="*60)
print("✅ Base de datos poblada exitosamente!")
print("="*60)
print(f"📊 Total Categorías: {Categoria.objects.count()}")
print(f"📦 Total Productos: {Producto.objects.count()}")
print(f"🛠️  Total Servicios: {Servicio.objects.count()}")
print("\n🔐 Credenciales del admin:")
print("   Usuario: admin")
print("   Password: admin123")
print("   URL Admin: http://localhost:8000/admin/")
print("="*60)