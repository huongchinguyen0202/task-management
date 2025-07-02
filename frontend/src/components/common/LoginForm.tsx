import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onLogin: (data: { email: string; password: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading, error }) => {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('Password123!');
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/tasklist');
    }
  }, [user, navigate]);

  const handleInputChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setFormError('Email and password are required.');
      return;
    }
    setFormError(null);
    try {
      await onLogin({ email: email.trim(), password });
    } catch (err) {
      setFormError('Login failed. Please check your credentials.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-blue-100 mt-12 font-sans"
      style={{ fontFamily: 'Segoe UI, Roboto, Arial, sans-serif' }}
    >
      <h2 className="text-2xl font-bold text-blue-600 text-center mb-4 tracking-wide">Sign in to your account</h2>
      <div>
        <label className="block mb-1 font-semibold text-blue-700">Email</label>
        <input
          type="email"
          className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition"
          value={email}
          onChange={handleInputChange(setEmail)}
          placeholder="you@email.com"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold text-blue-700">Password</label>
        <input
          type="password"
          className="w-full border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 transition"
          value={password}
          onChange={handleInputChange(setPassword)}
          placeholder="Your password"
          required
        />
      </div>
      {(formError || error) && (
        <div className="text-red-600 text-sm text-center font-medium bg-red-50 border border-red-200 rounded p-2">
          {formError || error}
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed text-lg tracking-wide"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
