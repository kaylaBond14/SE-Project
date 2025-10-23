import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'admin@cine.com' && password === 'admin123') {
      navigate('/admin');
    } else if (email === 'user@cine.com' && password === 'user123') {
      navigate('/home');
    } else {
      setError('Invalid email or password');
      return;
    }

    if (remember) localStorage.setItem('rememberedEmail', email);
    else localStorage.removeItem('rememberedEmail');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <div className="bg-gray-900/70 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-400">Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <label className="block mb-2 text-sm font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-blue-500"
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-lg font-semibold text-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
