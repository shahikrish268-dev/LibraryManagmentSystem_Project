import { useEffect, useState } from 'react';
import apiClient from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get('/user/dashboard');
        setData(response.data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        setError('Failed to load dashboard data');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    TokenService.clearTokens();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}>Log Out</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Dashboard;