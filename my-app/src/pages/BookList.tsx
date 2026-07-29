import { useEffect, useState } from 'react';
import apiClient from '../services/auth.service';
import { canEdit } from '../utils/authUtils';

interface Author { id: number; name: string; }
interface Book { id: number; title: string; author: number; isbn: string; genre: string; quantity: number; }

const BOOKS_URL = '/books/';
const AUTHORS_URL = '/authors/';

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState<number | ''>('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const userCanEdit = canEdit();

  const fetchBooks = async () => {
    try { const res = await apiClient.get(BOOKS_URL); setBooks(res.data); }
    catch (err) { console.error(err); setError('Failed to load books'); }
  };
  const fetchAuthors = async () => {
    try { const res = await apiClient.get(AUTHORS_URL); setAuthors(res.data); }
    catch (err) { console.error(err); setError('Failed to load authors'); }
  };

  useEffect(() => { fetchBooks(); fetchAuthors(); }, []);

  const resetForm = () => { setTitle(''); setAuthorId(''); setIsbn(''); setGenre(''); setQuantity(1); setEditingId(null); };

  const handleSubmit = async () => {
    if (!title.trim() || !authorId) { setError('Title and Author are required'); return; }
    try {
      const payload = { title, author: authorId, isbn, genre, quantity };
      if (editingId) await apiClient.put(`${BOOKS_URL}${editingId}/`, payload);
      else await apiClient.post(BOOKS_URL, payload);
      resetForm(); setError(''); fetchBooks();
    } catch (err) { console.error(err); setError('Failed to save book'); }
  };

  const handleEdit = (book: Book) => {
    setEditingId(book.id); setTitle(book.title); setAuthorId(book.author);
    setIsbn(book.isbn); setGenre(book.genre); setQuantity(book.quantity);
  };

  const handleDelete = async (id: number) => {
    try { await apiClient.delete(`${BOOKS_URL}${id}/`); fetchBooks(); }
    catch (err) { console.error(err); setError('Failed to delete book'); }
  };

  const getAuthorName = (id: number) => authors.find((a) => a.id === id)?.name || 'Unknown';

  return (
    <div>
      {userCanEdit && (
        <div className="card">
          <h2 className="card-title">📚 Books Details</h2>
          <div className="form-grid">
            <div className="field"><label>Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book title" /></div>
            <div className="field"><label>ISBN</label><input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="ISBN" /></div>
            <div className="field">
              <label>Author</label>
              <select value={authorId} onChange={(e) => setAuthorId(e.target.value ? Number(e.target.value) : '')}>
                <option value="">Select Author</option>
                {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="field"><label>Genre</label><input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" /></div>
            <div className="field"><label>Quantity</label><input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /></div>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn-primary" onClick={handleSubmit}>{editingId ? 'UPDATE BOOK' : 'ADD BOOK'}</button>
          {editingId && <button className="btn-cancel" onClick={resetForm}>Cancel</button>}
        </div>
      )}

      <div className="card">
        <h2 className="card-title">📖 Book Lists</h2>
        <table>
          <thead>
            <tr>
              <th>Book ID</th><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Quantity</th>
              {userCanEdit && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td><td>{book.title}</td><td>{getAuthorName(book.author)}</td>
                <td>{book.genre}</td><td>{book.isbn}</td><td>{book.quantity}</td>
                {userCanEdit && (
                  <td>
                    <div className="action-cell">
                      <button className="icon-btn edit" onClick={() => handleEdit(book)}>Edit</button>
                      <button className="icon-btn delete" onClick={() => handleDelete(book.id)}>Delete</button>
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

export default BookList;