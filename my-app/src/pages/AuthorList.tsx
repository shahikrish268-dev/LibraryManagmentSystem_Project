import { useEffect, useState } from 'react';
import apiClient from '../services/auth.service';
import { canEdit } from '../utils/authUtils';

interface Author {
  id: number;
  name: string;
  bio: string;
}

const API_URL = '/authors/';

const AuthorList = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const userCanEdit = canEdit();

  const fetchAuthors = async () => {
    try {
      const response = await apiClient.get(API_URL);
      setAuthors(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load authors');
    }
  };

  useEffect(() => { fetchAuthors(); }, []);

  const resetForm = () => { setName(''); setBio(''); setEditingId(null); };

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Author name is required'); return; }
    try {
      if (editingId) await apiClient.put(`${API_URL}${editingId}/`, { name, bio });
      else await apiClient.post(API_URL, { name, bio });
      resetForm(); setError(''); fetchAuthors();
    } catch (err) {
      console.error(err);
      setError(editingId ? 'Failed to update author' : 'Failed to add author');
    }
  };

  const handleEdit = (author: Author) => {
    setEditingId(author.id); setName(author.name); setBio(author.bio);
  };

  const handleDelete = async (id: number) => {
    try { await apiClient.delete(`${API_URL}${id}/`); fetchAuthors(); }
    catch (err) { console.error(err); setError('Failed to delete author'); }
  };

  return (
    <div>
      {userCanEdit && (
        <div className="card">
          <h2 className="card-title">👤 Author Info</h2>
          <div className="form-grid">
            <div className="field">
              <label>Author Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter author name" />
            </div>
            <div className="field">
              <label>Bio</label>
              <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short bio" />
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn-primary" onClick={handleSubmit}>
            {editingId ? 'UPDATE AUTHOR' : 'ADD AUTHOR'}
          </button>
          {editingId && <button className="btn-cancel" onClick={resetForm}>Cancel</button>}
        </div>
      )}

      <div className="card">
        <h2 className="card-title">📖 Author Details</h2>
        <table>
          <thead>
            <tr>
              <th>Author ID</th>
              <th>Name</th>
              <th>Bio</th>
              {userCanEdit && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <tr key={author.id}>
                <td>{author.id}</td>
                <td>{author.name}</td>
                <td>{author.bio}</td>
                {userCanEdit && (
                  <td>
                    <div className="action-cell">
                      <button className="icon-btn edit" onClick={() => handleEdit(author)}>Edit</button>
                      <button className="icon-btn delete" onClick={() => handleDelete(author.id)}>Delete</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {!userCanEdit && authors.length === 0 && <p style={{ color: '#6B7280' }}>No authors found.</p>}
      </div>
    </div>
  );
};

export default AuthorList;