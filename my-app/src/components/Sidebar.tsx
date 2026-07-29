import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TokenService } from '../services/token.service';
import { canEdit } from '../utils/authUtils';

const adminNavItems = [
  { label: 'Setting', path: '/settings' },
  { label: 'Author', path: '/authors' },
  { label: 'Books', path: '/books' },
  { label: 'Students', path: '/students' },
  { label: 'Transaction', path: '/transactions' },
];

const studentNavItems = [
  { label: 'My Books', path: '/my-books' },
  { label: 'Profile', path: '/profile' },
  { label: 'Browse Books', path: '/books' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userCanEdit = canEdit();
  const navItems = userCanEdit ? adminNavItems : studentNavItems;

  const handleLogout = () => {
    TokenService.clearTokens();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-logo">HSMSS<br />LIBRARY</div>
        <nav className="nav-list">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Log Out
      </button>
    </div>
  );
};

export default Sidebar;