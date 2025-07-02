import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 font-sans" style={{ fontFamily: 'Segoe UI, Roboto, Arial, sans-serif' }}>
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6 tracking-wide">Welcome Back!</h1>
        {/* LoginForm will be rendered by router, so just a placeholder here */}
      </div>
    </div>
  );
};

export default Login;
