import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/common/LoginForm';
import RegisterForm from '../components/common/RegisterForm';
import NotFound from '../pages/NotFound';
import TaskListPage from '../pages/TaskList';
import { Layout } from '../components/common/Layout';

function ProtectedRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function AuthRoute() {
  const { user } = useAuth();
  return !user ? <Outlet /> : <Navigate to="/tasklist" replace />;
}

const AppRouter: React.FC = () => {
  const { login, register, loading, error } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout><Outlet /></Layout>}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/tasklist" replace />} />
            <Route path="/tasklist" element={<TaskListPage />} />
          </Route>
          <Route element={<AuthRoute />}>
            <Route path="/login" element={<LoginForm onLogin={login} loading={loading} error={error} />} />
            <Route path="/register" element={<RegisterForm onRegister={register} loading={loading} error={error} />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
