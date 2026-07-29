// ProfilePage.tsx
import { useEffect, useState } from 'react';
import apiClient from '../services/auth.service';

interface Profile { username: string; role: string; }

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try { const response = await apiClient.get('/my-profile/'); setProfile(response.data); }
      catch (err) { console.error(err); setError('Failed to load profile'); }
    };
    fetchProfile();
  }, []);

  if (error) return <div className="card error-text">{error}</div>;
  if (!profile) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h2 className="card-title">🙍 Profile</h2>
      <p className="readonly-row"><strong>Username:</strong>{profile.username}</p>
      <p className="readonly-row"><strong>Role:</strong>{profile.role}</p>
    </div>
  );
};

export default ProfilePage;