from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    CategoriaViewSet, ProductoViewSet, ServicioViewSet, 
    PerfilViewSet, register_view, user_profile_view
)

# Router para los ViewSets
router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'servicios', ServicioViewSet, basename='servicio')
router.register(r'perfiles', PerfilViewSet, basename='perfil')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),
    
    # Autenticación JWT (RF4: Login)
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Registro (RF4: Registro)
    path('auth/register/', register_view, name='register'),
    
    # Usuario actual
    path('auth/me/', user_profile_view, name='user_profile'),
]