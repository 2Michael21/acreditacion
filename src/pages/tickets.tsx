import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

const Tickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>(''); // Nombre del usuario

  // Función para obtener los tickets
  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Verifica si el token está presente
  
      const response = await axios.get('https://proyectoweb2-production.up.railway.app/api/tickets/user', 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Tickets:', response.data);
      setTickets(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Aquí accedemos a las propiedades específicas de error de Axios
        console.error('Error al obtener los tickets:', error.response ? error.response.data : error.message);
      } else {
        console.error('Error inesperado:', error);
      }
      setError('Hubo un problema al obtener tus tickets.');
    }
  };
  


  useEffect(() => {
    const savedUserName = localStorage.getItem('name'); // Obtener el nombre guardado del usuario
    const token = localStorage.getItem('token'); // Verificar si hay token

    if (!token) {
      setError('No se encontró un token. Por favor, inicia sesión nuevamente.');
      return;
    }

    if (savedUserName) {
      setUserName(savedUserName); // Guardar el nombre del usuario
      fetchTickets(); // Obtener los tickets al cargar el componente
    } else {
      setError('No se encontró el nombre de usuario. Inicia sesión nuevamente.');
    }
  }, []);

  if (loading) return <p>Cargando tus tickets...</p>; // Mensaje de carga
  if (error) return <p className="text-red-500">{error}</p>; // Mensaje de error

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Mis Tickets</h1>

      {userName && <p className="text-xl mb-4">Bienvenido, {userName}!</p>} {/* Mostrar nombre del usuario */}

      {tickets.length === 0 ? (
        <p>No tienes tickets comprados.</p> // Si no hay tickets, mostrar este mensaje
      ) : (
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="ticket-card bg-gray-800 p-6 rounded-lg mb-6"
          >
            <div className="flex flex-col sm:flex-row items-center">
              {ticket.movieFunction?.movie?.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500/${ticket.movieFunction.movie.poster_path}`}
                  alt={ticket.movieFunction.movie.title || 'Póster'}
                  className="w-48 h-72 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-8"
                />
              ) : (
                <div className="w-48 h-72 bg-gray-700 flex items-center justify-center rounded-lg mb-4 sm:mb-0 sm:mr-8">
                  <p className="text-gray-400 text-center">Sin imagen</p>
                </div>
              )}
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold">
                  {ticket.movieFunction?.movie?.title || 'Título no disponible'}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {ticket.movieFunction?.movie?.description ||
                    'Descripción no disponible'}
                </p>
                <p className="mb-4">
                  Asientos:{' '}
                  {ticket.seats
                    ? Object.keys(ticket.seats)
                        .filter((key) => ticket.seats[key])
                        .join(', ') // Mostrar asientos ocupados
                    : 'No asignados'}
                </p>
                {ticket.code && (
                  <div className="mb-4">
                    <QRCodeCanvas value={ticket.code} size={128} /> {/* Mostrar código QR */}
                  </div>
                )}
                {ticket.code && (
                  <>
                    <p className="text-xl font-semibold">Código de ticket:</p>
                    <p className="text-gray-300">{ticket.code}</p> {/* Mostrar código del ticket */}
                  </>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Tickets;
