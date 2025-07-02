import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Custom login button handler
  const handleLogin = () => {
    navigate('/login');
  };

  // Đóng menu khi click ra ngoài
  React.useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-dropdown-btn') && !target.closest('.user-dropdown-menu')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <header className="bg-primary text-white shadow-sm sticky-top">
      <div className="container d-flex align-items-center justify-content-between py-3">
        <div className="d-flex align-items-center gap-3">
          <Link to="/tasklist" className="navbar-brand fw-bold fs-4 text-white" style={{ letterSpacing: 1 }}>Task Manager</Link>
          <nav className="d-none d-md-flex gap-3">
            <Link to="/tasklist" className={`nav-link text-white${location.pathname === '/tasklist' ? ' fw-bold border-bottom border-2' : ''}`}>Tasks</Link>
          </nav>
        </div>
        <div className="position-relative d-flex justify-content-center align-items-center" style={{ minWidth: 140 }}>
          {user ? (
            <>
              <button
                className="btn btn-outline-light d-flex align-items-center gap-2 user-dropdown-btn mx-auto"
                onClick={() => setMenuOpen((open) => !open)}
                style={{ minWidth: 120, justifyContent: 'center', textTransform: 'uppercase' }}
              >
                <span className="d-none d-sm-inline">{user.username?.toUpperCase()}</span>
                <i className="bi bi-person-circle fs-5"></i>
              </button>
              {menuOpen && (
                <div className="position-absolute end-0 mt-2 bg-white text-dark rounded shadow border z-3 user-dropdown-menu" style={{ minWidth: 160 }}>
                  <Link to="/profile" className="dropdown-item py-2 px-3">Profile</Link>
                  <button
                    className="dropdown-item py-2 px-3 text-danger"
                    onClick={logout}
                  >Logout</button>
                </div>
              )}
            </>
          ) : (
            <div className="d-flex gap-2">
              <button className="btn btn-outline-light" onClick={handleLogin}>Login</button>
              <Link to="/register" className="btn btn-light text-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-vh-100 d-flex flex-column bg-light">
    <Navigation />
    <main className="flex-grow-1 container py-4">
      {children}
    </main>
    <footer className="bg-primary text-white text-center py-2 mt-auto shadow-sm">&copy; {new Date().getFullYear()} Task Manager</footer>
  </div>
);

export { Navigation, Layout };
