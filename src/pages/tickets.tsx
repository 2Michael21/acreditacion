import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const API_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500/'; // Base URL para las imágenes

const Tickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const storedTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    setTickets(storedTickets);
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <h2 className="text-white text-3xl mb-6">Mis Tickets</h2>
      {tickets.length === 0 ? (
        <p className="text-white">No tienes tickets comprados.</p>
      ) : (
        tickets.map((ticket, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg hover:bg-gray-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Imagen de la película a la izquierda */}
              <div className="sm:w-1/3">
                {ticket.movie_image && (
                  <img
                    src={`${API_IMAGE_BASE_URL}${ticket.movie_image}`} // Usamos la base URL para obtener la imagen
                    alt={ticket.movie_title}
                    className="rounded-lg shadow-md w-full h-auto"
                  />
                )}
              </div>

              {/* Detalles del ticket */}
              <div className="text-center sm:text-left sm:w-2/3">
                <h3 className="text-white text-xl font-semibold mb-2">{ticket.movie_title}</h3>
                <p className="text-white text-sm mb-4">Sala: {ticket.room_name}</p>
                <p className="text-white text-sm mb-4">
                  Asientos: {ticket.seat_numbers.length > 3 ? `${ticket.seat_numbers.slice(0, 3).join(', ')}...` : ticket.seat_numbers.join(', ')}
                </p>

                {/* Código QR */}
                <div className="mb-4">
                  <QRCodeCanvas
                    value={ticket.ticket_code}
                    size={160}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    style={{ borderRadius: '10px', padding: '10px' }}
                  />
                </div>

                <p className="text-white text-sm">Código de Ticket: {ticket.ticket_code}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Tickets;
