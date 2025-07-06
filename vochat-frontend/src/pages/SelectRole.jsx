import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SelectRole() {
  const [role, setRole] = useState('Talker');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch logged-in user ID from session
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3000/auth/me', { withCredentials: true });
        setUserId(res.data._id);
      } catch (err) {
        console.error('Not logged in');
        navigate('/');
      }
    };
    fetchUser();
  }, []);

  const handleRoleSubmit = async () => {
    try {
      await axios.post('http://localhost:3000/auth/set-role', { role }, { withCredentials: true });
      navigate('/chat', { state: { userId, role } }); // Navigate with session data
    } catch (err) {
      alert('Failed to set role');
    }
  };

  return (
    <div>
      <h2>Select Role</h2>
      <select onChange={(e) => setRole(e.target.value)} value={role}>
        <option value="Talker">Talker</option>
        <option value="Listener">Listener</option>
      </select>
      <button onClick={handleRoleSubmit} disabled={!userId}>Submit</button>
    </div>
  );
}

export default SelectRole;
