import api from './api';

// ========== CATEGORÍAS ==========
export const categoriaService = {
  // Obtener todas las categorías
  getAll: async () => {
    const response = await api.get('/categorias/');
    return response.data;
  },

  // Obtener categoría por ID
  getById: async (id) => {
    const response = await api.get(`/categorias/${id}/`);
    return response.data;
  },

  // Obtener productos de una categoría
  getProductos: async (id) => {
    const response = await api.get(`/categorias/${id}/productos/`);
    return response.data;
  },

  // Obtener servicios de una categoría
  getServicios: async (id) => {
    const response = await api.get(`/categorias/${id}/servicios/`);
    return response.data;
  },
};

// ========== PRODUCTOS ==========
export const productoService = {
  // Obtener todos los productos (con filtros opcionales)
  getAll: async (params = {}) => {
    const response = await api.get('/productos/', { params });
    return response.data;
  },

  // Obtener producto por ID
  getById: async (id) => {
    const response = await api.get(`/productos/${id}/`);
    return response.data;
  },

  // Obtener productos destacados
  getDestacados: async () => {
    const response = await api.get('/productos/destacados/');
    return response.data;
  },

  // Obtener productos recientes
  getRecientes: async () => {
    const response = await api.get('/productos/recientes/');
    return response.data;
  },

  // Buscar productos
  search: async (query) => {
    const response = await api.get('/productos/', {
      params: { search: query },
    });
    return response.data;
  },
};

// ========== SERVICIOS ==========
export const servicioService = {
  // Obtener todos los servicios (con filtros opcionales)
  getAll: async (params = {}) => {
    const response = await api.get('/servicios/', { params });
    return response.data;
  },

  // Obtener servicio por ID
  getById: async (id) => {
    const response = await api.get(`/servicios/${id}/`);
    return response.data;
  },

  // Obtener servicios destacados
  getDestacados: async () => {
    const response = await api.get('/servicios/destacados/');
    return response.data;
  },
};

// ========== AUTENTICACIÓN ==========
export const authService = {
  // Registrar nuevo usuario
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    const { access, refresh } = response.data;
    
    // Guardar tokens en localStorage
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // Obtener perfil del usuario actual
  getProfile: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },
};

// ========== PERFIL ==========
export const perfilService = {
  // Obtener mi perfil
  getMe: async () => {
    const response = await api.get('/perfiles/me/');
    return response.data;
  },

  // Actualizar mi perfil
  updateMe: async (data) => {
    const response = await api.put('/perfiles/me/', data);
    return response.data;
  },
};