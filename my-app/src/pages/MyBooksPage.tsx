import { useEffect, useState } from 'react';
import apiClient from '../services/auth.service';

interface Book { id: number; title: string; }
interface Transaction { id: number; student: number; book: number; issue_date: string; return_date: string | null; }

const MyBooksPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [txRes, bookRes] = await Promise.all([
        apiClient.get('/my-transactions/'),
        apiClient.get('/books/'),
      ]);
      setTransactions(txRes.data);
      setBooks(bookRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load your books');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleReturn = async (transactionId: number) => {
    try {
      await apiClient.post(`/my-transactions/${transactionId}/return/`);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to return book');
    }
  };

  const getBookTitle = (id: number) => books.find((b) => b.id === id)?.title || 'Unknown';

  return (
    <div className="card">
      <h2 className="card-title">📚 My Books</h2>
      {error && <p className="error-text">{error}</p>}
      <table>
        <thead>
          <tr><th>Book</th><th>Issue Date</th><th>Return Date</th><th>Action</th></tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{getBookTitle(t.book)}</td>
              <td>{t.issue_date}</td>
              <td>{t.return_date || 'Not returned'}</td>
              <td>
                {!t.return_date && (
                  <button className="icon-btn edit" onClick={() => handleReturn(t.id)}>
                    Return
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {transactions.length === 0 && !error && <p style={{ color: '#6B7280' }}>No books currently issued.</p>}
    </div>
  );
};

export default MyBooksPage;