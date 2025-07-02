import React from 'react';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskManagerContext';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TaskProvider>
        <div className="min-h-screen bg-gray-100">
          <AppRouter />
        </div>
      </TaskProvider>
    </AuthProvider>
  );
};

export default App;
