import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  role?: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('clients');
  const [clients, setClients] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [newRoomName, setNewRoomName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'empleado', // Puedes cambiar esto dependiendo de los roles disponibles
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Redirigiendo a la página de inicio.');
      navigate('/login');
    } else {
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No se encontró token de autenticación');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [clientsResponse, adminsResponse, roomsResponse] = await Promise.all([
        axios.get('https://proyectoweb2-production.up.railway.app/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('https://proyectoweb2-production.up.railway.app/api/accounts', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('https://proyectoweb2-production.up.railway.app/api/rooms', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setClients(clientsResponse.data);
      setAdmins(adminsResponse.data);
      setRooms(roomsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al obtener datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    const token = localStorage.getItem('token');
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.password_confirmation) {
      alert('Por favor, completa todos los campos del formulario.');
      return;
    }

    if (newUser.password !== newUser.password_confirmation) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      await axios.post(
        'https://proyectoweb2-production.up.railway.app/api/accounts',
        newUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Usuario agregado exitosamente.');
      fetchData(); // Actualiza la lista de usuarios
      setNewUser({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'empleado',
      }); // Resetear el formulario
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      alert('Hubo un error al agregar el usuario.');
    }
  };
  const handleDeleteRoom = async (roomId: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://proyectoweb2-production.up.railway.app/api/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(rooms.filter((room) => room.id !== roomId));
    } catch (error) {
      console.error('Error al eliminar la sala:', error);
      alert('Hubo un error al eliminar la sala.');
    }
  };

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) {
      alert('Por favor ingresa un nombre para la sala.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'https://proyectoweb2-production.up.railway.app/api/rooms',
        { name: newRoomName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewRoomName('');
      fetchData();
    } catch (error) {
      console.error('Error al agregar la sala:', error);
      alert('Hubo un error al agregar la sala.');
    }
  };

  const handleDeleteClient = async (clientId: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://proyectoweb2-production.up.railway.app/api/user/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClients(clients.filter((client) => client.id !== clientId));
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      alert('Hubo un error al eliminar el cliente.');
    }
  };

  const handleDeleteAdmin = async (adminId: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://proyectoweb2-production.up.railway.app/api/accounts/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(admins.filter((admin) => admin.id !== adminId));
    } catch (error) {
      console.error('Error al eliminar el administrador:', error);
      alert('Hubo un error al eliminar el administrador.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-white">Cargando...</p>;
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    switch (activeTab) {
      case 'clients':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white">Clientes Registrados</h2>
            <table className="table-auto w-full mt-4 text-white">
              <thead>
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Nombre</th>
                  <th className="border px-4 py-2">Correo</th>
                  <th className="border px-4 py-2">Fecha de Registro</th>
                  <th className="border px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="border px-4 py-2">{client.id}</td>
                    <td className="border px-4 py-2">{client.name}</td>
                    <td className="border px-4 py-2">{client.email}</td>
                    <td className="border px-4 py-2">{client.created_at}</td>
                    <td className="border px-4 py-2">
                      <button className="text-blue-500">Editar</button>
                      <button
                        className="text-red-500 ml-2"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'admins':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white">Administradores</h2>
            <table className="table-auto w-full mt-4 text-white">
              <thead>
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Nombre</th>
                  <th className="border px-4 py-2">Correo</th>
                  <th className="border px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="border px-4 py-2">{admin.id}</td>
                    <td className="border px-4 py-2">{admin.name}</td>
                    <td className="border px-4 py-2">{admin.email}</td>
                    <td className="border px-4 py-2">
                      <button className="text-blue-500">Editar</button>
                      <button
                        className="text-red-500 ml-2"
                        onClick={() => handleDeleteAdmin(admin.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'rooms':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white">Salas</h2>
            <div className="mt-4 flex items-center">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Nombre de la nueva sala"
                className="p-2 rounded text-black"
              />
              <button
                onClick={handleAddRoom}
                className="ml-2 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Agregar Sala
              </button>
            </div>

            <table className="table-auto w-full mt-4 text-white">
              <thead>
                <tr>
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Nombre</th>
                  <th className="border px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td className="border px-4 py-2">{room.id}</td>
                    <td className="border px-4 py-2">{room.name}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={(room)}
                        className="text-blue-500"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="text-red-500 ml-2"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'addUser':
        return (
          <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Agregar Usuario</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="email"
                  placeholder="Correo"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <input
                  type="password"
                  placeholder="Confirmar Contraseña"
                  value={newUser.password_confirmation}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password_confirmation: e.target.value })
                  }
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                  <option value="empleado">Empleado</option>
                  <option value="admin">Administrador</option>
                </select>
                <button
                  onClick={handleAddUser}
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 rounded-lg"
                >
                  Agregar Usuario
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <div className="bg-gray-800 w-64 min-h-screen p-4">
        <h1 className="text-white text-2xl mb-6">Panel de Administración</h1>
        <button
          onClick={() => setActiveTab('clients')}
          className={`w-full text-left py-2 px-4 mb-2 rounded ${activeTab === 'clients' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
        >
          Ver Clientes
        </button>
        <button
          onClick={() => setActiveTab('admins')}
          className={`w-full text-left py-2 px-4 mb-2 rounded ${activeTab === 'admins' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
        >
          Ver Administradores
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`w-full text-left py-2 px-4 mb-2 rounded ${activeTab === 'rooms' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
        >
          Ver Salas
        </button>
        <button
          onClick={() => setActiveTab('addUser')}
          className={`w-full text-left py-2 px-4 mb-2 rounded ${activeTab === 'addUser' ? 'bg-blue-500' : 'bg-gray-700'} text-white`}
        >
          Agregar Usuario
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded mt-6"
        >
          Salir
        </button>
      </div>
      <div className="flex-1 p-4 bg-gray-900">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
