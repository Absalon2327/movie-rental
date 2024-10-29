import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirige si no hay token
    }
  }, [navigate]);

  return (
    <div>
      <h1>Panel de Administración</h1>
      <p>Aquí puedes gestionar películas y usuarios.</p>
    </div>
  );
};

export default Admin;
