import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Asientos = () => {
  const { functionId } = useParams<{ functionId: string }>();
  const navigate = useNavigate();

  const [functionData, setFunctionData] = useState<any>(null);
  const [seats, setSeats] = useState<{ [key: string]: boolean }>({});
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]); // Estado para los asientos seleccionados
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFunctionDetails = async () => {
      try {
        const response = await axios.get(
          `https://proyectoweb2-production.up.railway.app/api/movie-functions/${functionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        console.log('Response from API:', response.data);
        setFunctionData(response.data);

        const roomSeats = response.data.room.seats;

        // Verificar si los asientos están en formato JSON (string) o ya son un objeto
        if (typeof roomSeats === 'string') {
          // Si es un string, lo parseamos a objeto
          setSeats(JSON.parse(roomSeats));
        } else {
          // Si ya es un objeto, lo usamos directamente
          setSeats(roomSeats);
        }
      } catch (error) {
        console.error('Error al obtener la función:', error);
      }
    };

    if (functionId) {
      fetchFunctionDetails();
    }
  }, [functionId]);

  if (!functionData || seats === null) {
    return <p>Cargando...</p>;
  }

  // Convertir el objeto de asientos en un arreglo para poder iterar
  const seatEntries = Object.entries(seats);

  // Manejar la selección de asientos
  const handleSeatClick = (seatNumber: string, isOccupied: boolean) => {
    if (isOccupied) return; // Si el asiento está ocupado, no hacer nada

    setSelectedSeats(prevSelectedSeats => {
      if (prevSelectedSeats.includes(seatNumber)) {
        // Si el asiento ya está seleccionado, lo deseleccionamos
        return prevSelectedSeats.filter(seat => seat !== seatNumber);
      } else {
        // Si el asiento no está seleccionado, lo seleccionamos
        return [...prevSelectedSeats, seatNumber];
      }
    });
  };

  // Finalizar la compra
  const handleFinalizePurchase = async () => {
    if (selectedSeats.length === 0) {
      alert('Por favor, selecciona al menos un asiento.');
      return;
    }

    const functionIdNumber = functionId ? parseInt(functionId, 10) : null;
    if (functionIdNumber === null) {
      setError('ID de función no válido');
      return;
    }

    const requestData = {
      movie_function_id: functionIdNumber,
      seat_numbers: selectedSeats,
    };

    console.log('Datos enviados:', requestData);

    try {
      setLoading(true);
      const response = await axios.post(
        `https://proyectoweb2-production.up.railway.app/api/tickets`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Compra exitosa:', response.data);

      // Guardar los tickets en el localStorage
      const existingTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
      const newTicket = {
        ticket_code: response.data.ticket_code,
        movie_title: response.data.movie_title,
        room_name: response.data.room_name,
        seat_numbers: response.data.seat_numbers,
      };
      localStorage.setItem('tickets', JSON.stringify([...existingTickets, newTicket]));

      navigate('/cartelera');
    } catch (error: any) {
      console.error('Error al finalizar la compra:', error?.response?.data);
      setError('Error al procesar la compra. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="bg-gray-900 text-white p-4">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/cartelera')} className="hover:text-gray-400">
            Regresar a la cartelera
          </button>
          <h1 className="text-2xl font-bold">Selección de Asientos</h1>
        </div>
      </nav>

      <div className="bg-gray-900 min-h-screen p-8">
        <h2 className="text-white text-3xl mb-6">Detalles de la Función</h2>
        <p className="text-white mb-4">{functionData.movie.title}</p>

        <div>
          <h3 className="text-white text-xl mb-4">Asientos disponibles:</h3>
          <div className="flex flex-wrap justify-center">
            {seatEntries.map(([seatNumber, isOccupied]) => (
              <div
                key={seatNumber}
                className={`seat p-4 m-2 rounded-lg text-white cursor-pointer 
                  ${isOccupied ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}
                  ${selectedSeats.includes(seatNumber) ? 'bg-blue-500' : ''} 
                  ${isOccupied ? 'cursor-not-allowed' : ''}`}
                onClick={() => handleSeatClick(seatNumber, Boolean(isOccupied))}
              >
                {seatNumber}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-white text-xl">Asientos seleccionados:</h4>
          <p className="text-white">{selectedSeats.join(', ')}</p>
        </div>

        <div className="mt-6">
          {error && <p className="text-red-500">{error}</p>}
          <button
            onClick={handleFinalizePurchase}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? 'Finalizando compra...' : 'Finalizar Compra'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Asientos;
