import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getMovies from '../api'; // Llama a la función del archivo api.js para obtener las películas
import axios from 'axios'; // Asegúrate de tener axios instalado

export const API_BASE_URL = 'https://proyectoweb2-production.up.railway.app/api'; // Asegúrate de que la URL esté correcta

interface Movie {
  id: number;
  title: string;
  synopsis: string;
  image: string;
  availableDays: string[];
}

const MovieSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true); // Mostrar el estado de carga
        const response = await getMovies('movies/popular'); // Llamada a la API mediante api.js
        const moviesData = response.data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          synopsis: movie.overview,
          image: movie.poster_full_path, // Usamos la ruta completa de la imagen desde la API
          availableDays: [], // Puedes ajustar esto según tus datos
        }));
        setMovies(moviesData); // Asignar los datos al estado
        setFilteredMovies(moviesData); // Inicializar el estado con todas las películas
      } catch (err: any) {
        setError('Hubo un error al cargar la cartelera. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false); // Ocultar el estado de carga
      }
    };

    fetchMovies();
  }, []);

  // Filtrar las películas en función del término de búsqueda
  const handleSearchSubmit = () => {
    if (searchTerm.trim() === '') {
      setFilteredMovies(movies); // Si no hay término de búsqueda, mostrar todas las películas
    } else {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(filtered); // Filtrar las películas
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Actualizar el estado del término de búsqueda
  };

  const handleDayClick = (movieId: number, day: string) => {
    navigate(`/purchase/${movieId}/${day}`);
  };

  if (loading) return <p className="text-white">Cargando cartelera...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="bg-gray-800 p-4">
        <div className="max-w-screen-xl mx-auto flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar película..."
              className="w-full p-2 rounded-lg text-black"
            />
            <button
              onClick={handleSearchSubmit}
              className="absolute top-0 right-0 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Cartelera de Películas */}
      <div className="bg-gray-900 min-h-screen p-8">
        <h1 className="text-white text-3xl mb-6">Peliculas existentes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredMovies.length === 0 ? (
            <p className="text-white">No se encontraron películas con ese nombre.</p>
          ) : (
            filteredMovies.map((movie) => (
              <div key={movie.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="rounded mb-4 w-64 h-96 object-cover"
                />
                <h2 className="text-white text-2xl mb-2">{movie.title}</h2>
                <p className="text-gray-400 mb-4">{movie.synopsis}</p>
                <div className="flex gap-2 flex-wrap">
                  {/* Itera sobre los días disponibles */}
                  {movie.availableDays.map((day) => (
                    <button
                      key={day}
                      onClick={() => handleDayClick(movie.id, day)}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieSchedule;
