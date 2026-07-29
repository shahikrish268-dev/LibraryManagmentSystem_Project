import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AuthRoute from './routes/AuthRoute';
import Login from './pages/Login';
import AuthorList from './pages/AuthorList';
import StudentList from './pages/StudentList';
import BookList from './pages/BookList';
import TransactionList from './pages/TransactionList';
import SettingPage from './pages/SettingPage';
import { Navigate } from 'react-router-dom';
import MyBooksPage from './pages/MyBooksPage';
import ProfilePage from './pages/ProfilePage';


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthRoute type="public" />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<AuthRoute type="protected" />}>
          <Route element={<Layout />}>
            <Route path="/authors" element={<AuthorList />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/" element={<Navigate to="/authors" replace />} />
            <Route path="/my-books" element={<MyBooksPage />} />
<Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;