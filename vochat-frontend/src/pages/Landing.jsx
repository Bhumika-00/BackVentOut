// src/pages/Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to VOChat 💬</h1>
      <p>A safe, real-time space to talk or listen. Choose your role and start chatting.</p>
      <button
        onClick={() => navigate('/get-started')}
        style={{ padding: '10px 20px', marginTop: '20px' }}
      >
        Get Started
      </button>
    </div>
  );
};

export default Landing;
