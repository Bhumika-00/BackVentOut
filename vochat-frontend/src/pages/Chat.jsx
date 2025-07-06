// === FRONTEND ===
// File: Chat.jsx

import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000', { withCredentials: true });

const Chat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, role } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [matchedWith, setMatchedWith] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
  if (!userId || !role) return navigate('/');

  socket.emit('register', { role, userId });

  socket.on('matched', ({ userId: matchedUserId }) => {
    setMatchedWith(matchedUserId);
  });

  socket.on('receive_message', (data) => {
    setMessages((prev) => [...prev, data]);

    // 🔔 Push Notification
    if (Notification.permission === 'granted') {
      new Notification('New Message', {
        body: data.message || 'Voice message received',
      });
    }
  });

  return () => {
    socket.disconnect();
  };
}, []);

  

  const sendMessage = () => {
  if (!input.trim()) return;
  socket.emit('send_message', { to: matchedWith, message: input });
  setInput('');
};

const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorderRef.current = new MediaRecorder(stream);
  mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
  mediaRecorderRef.current.onstop = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    audioChunksRef.current = [];
    const formData = new FormData();
    formData.append('voice', audioBlob, 'voice.webm');
    const res = await axios.post('http://localhost:3000/upload-voice', formData);
    const voiceUrl = res.data.url;
    socket.emit('send_voice', { to: matchedWith, url: voiceUrl });
  };
  mediaRecorderRef.current.start();
};


  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Private Chat</h2>
      <div style={{ border: '1px solid #ccc', padding: 10, height: '300px', overflowY: 'auto', marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <b>{msg.from === userId ? 'me' : 'them'}:</b>
            {msg.message && <span> {msg.message}</span>}
            {msg.voiceUrl && <audio controls src={msg.voiceUrl} />}
          </p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
        style={{ width: '80%', padding: 8 }}
      />
      <button onClick={sendMessage} style={{ padding: 8, marginLeft: 5 }}>
        Send
      </button>
      <br />
      <button onClick={startRecording} style={{ marginTop: 10 }}>🎙 Start Voice</button>
      <button onClick={stopRecording} style={{ marginLeft: 5 }}>⏹ Stop & Send</button>
    </div>
  );
};

export default Chat;
