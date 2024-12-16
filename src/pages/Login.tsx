import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

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
      const response = await api.post('/login', formData);
      const { token, role } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'empleado') {
        navigate('/employee');
      } else {
        navigate('/cartelera');
      }

      setSuccess('Inicio de sesión exitoso.');
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
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl mt-10 w-full sm:w-96">
        <h2 className="text-3xl text-white mb-6 text-center">Iniciar Sesión</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label className="text-gray-300 mb-2">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            className="p-3 mb-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese su correo electrónico"
            value={formData.email}
            onChange={handleChange}
          />
          <label className="text-gray-300 mb-2">Contraseña</label>
          <input
            type="password"
            name="password"
            className="p-3 mb-6 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese su contraseña"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="text-gray-400 mt-4 text-center">
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
