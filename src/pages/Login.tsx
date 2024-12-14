import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { useNavigate } from 'react-router-dom'; // Agregado para la redirección

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();  // Usando useNavigate para la redirección

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/login', formData); // Solicitud al endpoint de login
      const { token } = response.data;
      localStorage.setItem('token', token); // Guarda el token en localStorage
      setSuccess('Inicio de sesión exitoso.');
      navigate('/cartelera'); // Usando navigate para redirigir a la cartelera
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Error en las credenciales.');
      } else {
        setError('Error desconocido. Por favor, inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
      <Navbar />
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg mt-10">
        <h2 className="text-2xl text-white mb-4">Iniciar Sesión</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label className="text-gray-300 mb-2">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            className="p-2 mb-4 rounded bg-gray-700 text-white"
            placeholder="Ingrese su correo electrónico"
            value={formData.email}
            onChange={handleChange}
          />
          <label className="text-gray-300 mb-2">Contraseña</label>
          <input
            type="password"
            name="password"
            className="p-2 mb-4 rounded bg-gray-700 text-white"
            placeholder="Ingrese su contraseña"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="text-gray-400 mt-4">
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
