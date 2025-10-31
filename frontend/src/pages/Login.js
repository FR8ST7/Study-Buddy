import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithPassword } from '../utils/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // needed if backend uses cookies for session
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Optionally handle setting user state or auth tokens here
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch {
      setError('Login failed');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--page-bg)]">
      <div className="p-8 border-2 border-[var(--border)] rounded-lg shadow-lg w-96 bg-[var(--card-bg)]">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
        {error && <div className="mb-4 p-3 border-2 border-red-400 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border-2 border-[var(--border)] rounded-lg focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border-2 border-[var(--border)] rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[var(--accent)] border-2 border-[var(--border)] rounded-lg font-semibold hover:brightness-90 transition"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-700 font-semibold underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
