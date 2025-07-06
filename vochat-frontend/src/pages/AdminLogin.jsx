
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      alert('Wrong admin password');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <h2>Admin Login</h2>
      <input
        type="password"
        placeholder="Enter admin password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: 8 }}
      />
      <br />
      <button onClick={handleLogin} style={{ marginTop: 10, padding: '8px 20px' }}>
        Login
      </button>
    </div>
  );
};

export default AdminLogin;
