
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('isAdmin') !== 'true') navigate('/admin-login');

    axios.get('http://localhost:3000/api/admin/users').then(res => setUsers(res.data));
    axios.get('http://localhost:3000/api/admin/voices').then(res => setVoices(res.data));
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>Admin Dashboard</h2>

      <h3>👤 Registered Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u._id}>{u.name} ({u.email})</li>
        ))}
      </ul>

      <h3>🎙 Voice Uploads</h3>
      <ul>
        {voices.map((v, idx) => (
          <li key={idx}><a href={v} target="_blank" rel="noopener noreferrer">{v}</a></li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
