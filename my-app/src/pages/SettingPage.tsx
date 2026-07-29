import { useEffect, useState } from 'react';
import apiClient from '../services/auth.service';
import { isAdmin } from '../utils/authUtils';

interface Setting { id: number; library_name: string; max_books_per_student: number; loan_duration_days: number; }

const SETTINGS_URL = '/settings/';

const SettingPage = () => {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const userIsAdmin = isAdmin();

  const fetchSetting = async () => {
    try {
      const response = await apiClient.get(SETTINGS_URL);
      if (response.data.length > 0) setSetting(response.data[0]);
      else setError('No settings found.');
    } catch (err) { console.error(err); setError('Failed to load settings'); }
  };

  useEffect(() => { fetchSetting(); }, []);

  const handleSave = async () => {
    if (!setting) return;
    try {
      await apiClient.put(`${SETTINGS_URL}${setting.id}/`, setting);
      setSaved(true); setError('');
      setTimeout(() => setSaved(false), 2000);
    } catch (err) { console.error(err); setError('Failed to save settings'); }
  };

  if (!setting) return <div className="card">{error || 'Loading...'}</div>;

  return (
    <div className="card">
      <h2 className="card-title">⚙️ Library Settings</h2>
      {userIsAdmin ? (
        <>
          <div className="form-grid single-col">
            <div className="field"><label>Library Name</label><input type="text" value={setting.library_name} onChange={(e) => setSetting({ ...setting, library_name: e.target.value })} /></div>
            <div className="field"><label>Max Books per Student</label><input type="number" value={setting.max_books_per_student} onChange={(e) => setSetting({ ...setting, max_books_per_student: Number(e.target.value) })} /></div>
            <div className="field"><label>Loan Duration (days)</label><input type="number" value={setting.loan_duration_days} onChange={(e) => setSetting({ ...setting, loan_duration_days: Number(e.target.value) })} /></div>
          </div>
          <button className="btn-primary" onClick={handleSave}>SAVE SETTINGS</button>
          {saved && <p style={{ color: '#2E7D32', marginTop: '10px' }}>Saved!</p>}
        </>
      ) : (
        <div>
          <p className="readonly-row"><strong>Library Name:</strong>{setting.library_name}</p>
          <p className="readonly-row"><strong>Max Books:</strong>{setting.max_books_per_student}</p>
          <p className="readonly-row"><strong>Loan Duration:</strong>{setting.loan_duration_days} days</p>
        </div>
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default SettingPage;