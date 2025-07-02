import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegisterFormProps {
  onRegister: (data: { username: string; email: string; password: string }) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, loading, error }) => {
  const [username, setUsername] = useState('user');
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('Password123!');
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setFormError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    setFormError(null);
    try {
      await onRegister({ username: username.trim(), email: email.trim(), password });
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/login');
      }, 2000); // Show popup for 2 seconds then redirect
    } catch (err) {
      setShowSuccessPopup(false);
      setFormError('Registration failed. Please check your information or try again.');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ minWidth: 350, maxWidth: 450 }}>
        <h2 className="text-center mb-2 text-primary">Create your account</h2>
        <p className="text-center text-secondary mb-4">Fast, secure, and free!</p>
        {showSuccessPopup && (
          <div className="alert alert-success text-center mb-3">
            Registration successful! Redirecting to login page...
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-primary">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold text-primary">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="text-center mt-3">
          <span className="text-secondary">Already have an account? </span>
          <a href="/login" className="text-decoration-none text-primary">Login</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
