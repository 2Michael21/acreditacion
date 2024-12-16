import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Ticket {
  code: string;
  movie_title: string;
  room_name: string;
  seat_numbers: string[];
}

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [ticketCode, setTicketCode] = useState<string>('');
  const [ticketInfo, setTicketInfo] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Obtener el token y el nombre del comprador desde localStorage
  const token = localStorage.getItem('auth_token');
  const buyerName = localStorage.getItem('user_name'); // Nombre del comprador

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://proyectoweb2-production.up.railway.app/api/tickets/codigo/${ticketCode.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`  // Agregar token en las cabeceras
          }
        }
      );
      setTicketInfo(response.data);  // Establecer la información del ticket
      setError(null);  // Limpiar cualquier error previo
    } catch (err) {
      setTicketInfo(null);  // Limpiar la información del ticket
      setError('No se encontró información para el código ingresado.');
    }
  };

  const handleLogout = () => {
    navigate('/');  // Redirigir al inicio
  };

  return (
    <div className="flex">
      {/* Navegador lateral */}
      <div className="bg-gray-800 w-64 min-h-screen p-4">
        <h1 className="text-white text-2xl mb-6">Empleado</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded mt-6"
        >
          Salir
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 bg-gray-900 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Validación de Tickets</h2>
        
        {/* Mostrar el nombre del comprador */}
        {buyerName && (
          <p className="text-white mb-6">
            <strong>Comprador:</strong> {buyerName}
          </p>
        )}
        
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <label htmlFor="ticketCode" className="text-white mb-2 block">
            Código del Ticket:
          </label>
          <input
            type="text"
            id="ticketCode"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
            placeholder="Ingrese el código del ticket"
            className="p-2 rounded bg-gray-700 text-white w-full mb-4"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
          >
            Buscar
          </button>
        </div>

        {/* Resultado */}
        {ticketInfo && (
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg mt-6">
            <h3 className="text-xl font-bold text-white mb-4">Información del Ticket</h3>
            <p className="text-gray-300">
              <strong>Película:</strong> {ticketInfo.movie_title}
            </p>
            <p className="text-gray-300">
              <strong>Sala:</strong> {ticketInfo.room_name}
            </p>
            <p className="text-gray-300">
              <strong>Asientos:</strong> {ticketInfo.seat_numbers.join(', ')}
            </p>
          </div>
        )}

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mt-6">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
