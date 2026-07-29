import { useEffect, useState } from 'react';
import apiClient from '../services/auth.service';
import { canEdit } from '../utils/authUtils';

interface Student { id: number; name: string; email: string; }

const API_URL = '/students/';

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const userCanEdit = canEdit();

  const fetchStudents = async () => {
    try { const res = await apiClient.get(API_URL); setStudents(res.data); }
    catch (err) { console.error(err); setError('Failed to load students'); }
  };

  useEffect(() => { fetchStudents(); }, []);

  const resetForm = () => { setName(''); setEmail(''); setEditingId(null); };

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Student name is required'); return; }
    try {
      if (editingId) await apiClient.put(`${API_URL}${editingId}/`, { name, email });
      else await apiClient.post(API_URL, { name, email });
      resetForm(); setError(''); fetchStudents();
    } catch (err) { console.error(err); setError(editingId ? 'Failed to update student' : 'Failed to add student'); }
  };

  const handleEdit = (student: Student) => { setEditingId(student.id); setName(student.name); setEmail(student.email); };

  const handleDelete = async (id: number) => {
    try { await apiClient.delete(`${API_URL}${id}/`); fetchStudents(); }
    catch (err) { console.error(err); setError('Failed to delete student'); }
  };

  return (
    <div>
      {userCanEdit && (
        <div className="card">
          <h2 className="card-title">🎓 Student Info</h2>
          <div className="form-grid">
            <div className="field"><label>Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Student name" /></div>
            <div className="field"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /></div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn-primary" onClick={handleSubmit}>{editingId ? 'UPDATE STUDENT' : 'ADD STUDENT'}</button>
          {editingId && <button className="btn-cancel" onClick={resetForm}>Cancel</button>}
        </div>
      )}

      <div className="card">
        <h2 className="card-title">📋 Student Details</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th>{userCanEdit && <th>Action</th>}</tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td><td>{student.name}</td><td>{student.email}</td>
                {userCanEdit && (
                  <td>
                    <div className="action-cell">
                      <button className="icon-btn edit" onClick={() => handleEdit(student)}>Edit</button>
                      <button className="icon-btn delete" onClick={() => handleDelete(student.id)}>Delete</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;