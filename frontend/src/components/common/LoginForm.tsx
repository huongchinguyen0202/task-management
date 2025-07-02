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
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ minWidth: 350, maxWidth: 400 }}>
        <h2 className="text-center mb-4 text-primary">Sign in to your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-primary">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={handleInputChange(setEmail)}
              placeholder="you@email.com"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold text-primary">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={handleInputChange(setPassword)}
              placeholder="Password"
              required
            />
          </div>
          {(formError || error) && (
            <div className="alert alert-danger py-2 text-center mb-3">
              {formError || error}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="text-center mt-3">
          <span className="text-secondary">Don't have an account? </span>
          <a href="/register" className="text-decoration-none text-primary">Register</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
