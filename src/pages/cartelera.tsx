import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const API_BASE_URL = 'https://proyectoweb2-production.up.railway.app/api';

interface Movie {
  id: number;
  title: string;
  description: string;
  image_path: string;  // Usamos este campo para las imágenes
}

interface Room {
  id: number;
  name: string;
}

interface MovieFunction {
  id: number;
  movie: Movie;
  room: Room;
  start_time: string;
  end_time: string;
}

const Cartelera: React.FC = () => {
  const navigate = useNavigate();
  const [movieFunctions, setMovieFunctions] = useState<MovieFunction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');  
  const [filteredFunctions, setFilteredFunctions] = useState<MovieFunction[]>([]);

  useEffect(() => {
    const fetchFunctions = async () => {
      const token = localStorage.getItem('auth_token');  // Cambié aquí a 'auth_token'
      if (!token) {
        console.error('No hay token de autenticación. Redirigiendo al login...');
        navigate('/login');  // Redirige al login si no hay token
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/movie-functions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        
        setMovieFunctions(response.data);
        setFilteredFunctions(response.data);  // Inicializa con todos los datos
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.error('Token inválido o sin permisos. Redirigiendo al login...');
          localStorage.removeItem('auth_token');  // Elimina el token inválido
          navigate('/login');  // Redirige al login
        } else {
          console.error('Error al cargar las funciones:', err);
          setError('Hubo un error al cargar la cartelera. Por favor, intenta de nuevo.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFunctions();
  }, [navigate]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    if (value.trim() === '') {
      setFilteredFunctions(movieFunctions);
    } else {
      const filtered = movieFunctions.filter((func) =>
        func.movie.title.toLowerCase().includes(value)
      );
      setFilteredFunctions(filtered);
    }
  };

  const handleSearchClick = () => {
    // Filtrar las funciones cuando el usuario haga clic en el botón de búsqueda
    if (searchTerm.trim() === '') {
      setFilteredFunctions(movieFunctions);
    } else {
      const filtered = movieFunctions.filter((func) =>
        func.movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFunctions(filtered);
    }
  };

  const handleDayClick = (functionId: number) => {
    navigate(`/seat-selection/${functionId}`);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token'); // Cambio aquí
      if (token) {
        console.log('Token encontrado:', token);
        const response = await axios.post(`${API_BASE_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Logout exitoso', response.data);
      }

      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
      alert('Error al cerrar sesión. Intenta nuevamente.');
    }
  };

  if (loading) return <p className="text-white">Cargando cartelera...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {/* Navbar */}
      <div className="bg-gray-900 text-white p-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Cine Uleam</h1>
          <div className="flex gap-6">
            <button onClick={() => navigate('/tickets')} className="hover:text-gray-400">
              Mis Tickets
            </button>
            <button onClick={handleLogout} className="hover:text-gray-400">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-gray-800 p-4">
        <div className="max-w-screen-xl mx-auto flex justify-center">
          <div className="relative flex w-full max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar película..."
              className="w-full p-2 rounded-lg text-black"
            />
            <button
              onClick={handleSearchClick}
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-lg"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Cartelera */}
      <div className="bg-gray-900 min-h-screen p-8">
        <h1 className="text-white text-3xl mb-6">Cartelera</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredFunctions.length === 0 ? (
            <p className="text-white">No se encontraron funciones.</p>
          ) : (
            filteredFunctions.map((func) => (
              <div key={func.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <img
                  src={func.movie.image_path}  // Usar directamente la URL completa
                  alt={func.movie.title}
                  className="rounded mb-4 w-64 h-96 object-cover"
                />
                <h2 className="text-white text-2xl mb-2">{func.movie.title}</h2>
                <p className="text-gray-400 mb-4">{func.movie.description}</p>
                <p className="text-gray-300 mb-2">
                  Sala: <strong>{func.room.name}</strong>
                </p>
                <p className="text-gray-300 mb-4">
                  Horario: <strong>{new Date(func.start_time).toLocaleString()}</strong> -{' '}
                  <strong>{new Date(func.end_time).toLocaleString()}</strong>
                </p>
                <button
                  onClick={() => handleDayClick(func.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Comprar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Cartelera;
