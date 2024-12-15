import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      const { data } = await api.post('/register', formData); // Enviar los datos al backend
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
      setFormData({ name: '', email: '', password: '', password_confirmation: '' }); // Limpia el formulario

      // Guardar el nombre y el token en localStorage después del registro exitoso
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name); // Guardar el nombre de usuario

    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Hubo un error durante el registro.');
      } else {
        setError('Error desconocido. Por favor, inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
      <Navbar />
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg mt-10">
        <h2 className="text-2xl text-white mb-4">Registrarse</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label className="text-gray-300 mb-2">Nombre de Usuario</label>
          <input
            type="text"
            name="name"
            className="p-2 mb-4 rounded bg-gray-700 text-white"
            placeholder="Ingrese su nombre de usuario"
            value={formData.name}
            onChange={handleChange}
          />
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
          <label className="text-gray-300 mb-2">Verificar Contraseña</label>
          <input
            type="password"
            name="password_confirmation"
            className="p-2 mb-4 rounded bg-gray-700 text-white"
            placeholder="Confirme su contraseña"
            value={formData.password_confirmation}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Registrarse
          </button>
        </form>
        <p className="text-gray-400 mt-4">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
