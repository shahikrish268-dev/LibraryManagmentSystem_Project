import { useEffect, useState } from 'react';
import apiClient from '../services/auth.service';
import { canEdit } from '../utils/authUtils';

interface Student { id: number; name: string; }
interface Book { id: number; title: string; }
interface Transaction { id: number; student: number; book: number; issue_date: string; return_date: string | null; }

const TRANSACTIONS_URL = '/transactions/';
const STUDENTS_URL = '/students/';
const BOOKS_URL = '/books/';

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');
  const [studentId, setStudentId] = useState<number | ''>('');
  const [bookId, setBookId] = useState<number | ''>('');
  const userCanEdit = canEdit();

  const fetchAll = async () => {
    try {
      const [txRes, stuRes, bookRes] = await Promise.all([
        apiClient.get(TRANSACTIONS_URL), apiClient.get(STUDENTS_URL), apiClient.get(BOOKS_URL),
      ]);
      setTransactions(txRes.data); setStudents(stuRes.data); setBooks(bookRes.data);
    } catch (err) { console.error(err); setError('Failed to load data'); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleIssue = async () => {
    if (!studentId || !bookId) { setError('Select both a student and a book'); return; }
    try {
      await apiClient.post(TRANSACTIONS_URL, { student: studentId, book: bookId });
      setStudentId(''); setBookId(''); setError(''); fetchAll();
    } catch (err) { console.error(err); setError('Failed to issue book'); }
  };

  const handleReturn = async (transaction: Transaction) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await apiClient.patch(`${TRANSACTIONS_URL}${transaction.id}/`, { return_date: today });
      fetchAll();
    } catch (err) { console.error(err); setError('Failed to mark as returned'); }
  };

  const handleDelete = async (id: number) => {
    try { await apiClient.delete(`${TRANSACTIONS_URL}${id}/`); fetchAll(); }
    catch (err) { console.error(err); setError('Failed to delete transaction'); }
  };

  const getStudentName = (id: number) => students.find((s) => s.id === id)?.name || 'Unknown';
  const getBookTitle = (id: number) => books.find((b) => b.id === id)?.title || 'Unknown';

  return (
    <div>
      {userCanEdit && (
        <div className="card">
          <h2 className="card-title">📗 Issue Book</h2>
          <div className="form-grid">
            <div className="field">
              <label>Student</label>
              <select value={studentId} onChange={(e) => setStudentId(e.target.value ? Number(e.target.value) : '')}>
                <option value="">Select Student</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Book</label>
              <select value={bookId} onChange={(e) => setBookId(e.target.value ? Number(e.target.value) : '')}>
                <option value="">Select Book</option>
                {books.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
              </select>
            </div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn-primary" onClick={handleIssue}>BORROW</button>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">📑 Transaction</h2>
        <table>
          <thead>
            <tr>
              <th>T.ID</th><th>Student</th><th>Book</th><th>Issue Date</th><th>Return Date</th>
              {userCanEdit && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td><td>{getStudentName(t.student)}</td><td>{getBookTitle(t.book)}</td>
                <td>{t.issue_date}</td><td>{t.return_date || 'Not returned'}</td>
                {userCanEdit && (
                  <td>
                    <div className="action-cell">
                      {!t.return_date && <button className="icon-btn edit" onClick={() => handleReturn(t)}>Return</button>}
                      <button className="icon-btn delete" onClick={() => handleDelete(t.id)}>Delete</button>
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

export default TransactionList;