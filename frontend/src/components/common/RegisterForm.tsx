import React, { useState } from 'react';

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
    await onRegister({ username: username.trim(), email: email.trim(), password });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-blue-50 to-white font-sans" style={{ fontFamily: 'Segoe UI, Roboto, Arial, sans-serif' }}>
      <header className="w-full py-6 bg-blue-600 shadow-md mb-8">
        <h1 className="text-3xl font-extrabold text-white text-center tracking-wide drop-shadow">Task Management System</h1>
      </header>
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg p-10 bg-white rounded-3xl shadow-2xl border border-blue-200 flex flex-col gap-6 animate-fade-in"
        >
          <h2 className="text-2xl font-extrabold text-blue-700 text-center mb-2 tracking-tight drop-shadow">Create your account</h2>
          <p className="text-center text-blue-400 mb-4">Fast, secure, and free!</p>
          <div className="flex flex-col gap-2">
            <label className="block font-semibold text-blue-700" htmlFor="username">Username</label>
            <input
              id="username"
              className="w-full border border-blue-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 text-base transition shadow-sm"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block font-semibold text-blue-700" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full border border-blue-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 text-base transition shadow-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block font-semibold text-blue-700" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full border border-blue-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 placeholder-blue-300 text-base transition shadow-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />
          </div>
          {(formError || error) && (
            <div className="text-red-600 text-base text-center font-semibold bg-red-50 border border-red-200 rounded-xl p-3 shadow-sm">
              {formError || error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition text-lg tracking-wide mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
