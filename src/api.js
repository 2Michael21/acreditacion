import axios from 'axios';

const api = axios.create({
  baseURL: 'https://proyectoweb2-production.up.railway.app/api', // Base URL de tu backend
  timeout: 5000, // Tiempo máximo de espera para las solicitudes
});

// Función para obtener películas populares
export const getMovies = async () => {
  try {
    const response = await api.get('/movies/popular'); // Usar la instancia `api` simplifica la URL
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error; // Manejar errores en el componente que llama a esta función
  }
};

// Función para obtener funciones de películas (requiere autenticación)
export const getMovieFunctions = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const response = await api.get('/movie-functions', {
      headers: {
        Authorization: `Bearer ${token}`, // Añadir el token a las cabeceras
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie functions:', error);
    throw error; // Manejar errores en el componente que llama a esta función
  }
};

export default api;
