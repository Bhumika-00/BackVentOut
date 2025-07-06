// src/pages/GetStarted.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <h2>Who are you?</h2>
      <p>Please select your role to proceed:</p>
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={() => navigate('/admin-login')}
          style={{ padding: '12px 25px', margin: '10px' }}
        >
          I am Admin
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{ padding: '12px 25px', margin: '10px' }}
        >
          I am User
        </button>
      </div>
    </div>
  );
};

export default GetStarted;
