import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">Task Manager</Link>
        <Link to="/" className="hover:underline hidden sm:inline">Dashboard</Link>
        {/* Add more navigation links as needed */}
      </div>
      <div className="relative">
        {user ? (
          <>
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="hidden sm:inline">{user.username}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow z-10">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={logout}
                >Logout</button>
              </div>
            )}
          </>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-100">
    <Navigation />
    <main className="flex-1 w-full max-w-6xl mx-auto p-4">
      {children}
    </main>
    <footer className="bg-gray-800 text-white text-center py-2 mt-8">&copy; {new Date().getFullYear()} Task Manager</footer>
  </div>
);

export { Navigation, Layout };
