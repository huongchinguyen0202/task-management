import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';
import LoginForm from '../components/common/LoginForm';
import RegisterForm from '../components/common/RegisterForm';
import NotFound from '../pages/NotFound';

function ProtectedRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function AuthRoute() {
  const { user } = useAuth();
  return !user ? <Outlet /> : <Navigate to="/" replace />;
}

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <Link to="/" className="font-bold text-lg">Task Manager</Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span>{user.username}</span>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const AppRouter: React.FC = () => {
  const { login, register, loading, error } = useAuth();
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<LoginForm onLogin={login} loading={loading} error={error} />} />
          <Route path="/register" element={<RegisterForm onRegister={register} loading={loading} error={error} />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
