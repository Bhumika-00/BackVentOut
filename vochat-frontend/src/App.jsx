import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SelectRole from './pages/SelectRole';
import Chat from './pages/Chat';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import GetStarted from './pages/GetStarted';
function App() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(sw => {
          console.log('✅ Service Worker registered', sw);
        })
        .catch(err => {
          console.error('❌ Service Worker error:', err);
        });
    }

    // Request Notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/login" element={<Login />} />
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/chat" element={<Chat />} />
       <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
