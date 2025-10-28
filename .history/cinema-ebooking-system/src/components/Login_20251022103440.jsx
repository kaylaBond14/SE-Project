import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Restore remembered email
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy logic — replace later with API call
    if (email === 'admin@cine.com' && password === 'admin123') {
      navigate('/admin');
    } else if (email === 'user@cine.com' && password === 'user123') {
      navigate('/home');
    } else {
      setError('Invalid credentials');
      return;
    }

    // Remember me
    if (remember) localStorage.setItem('rememberedEmail', email);
    else localStorage.removeItem('rememberedEmail');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded w-full p-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded w-full p-2"
        />

        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-blue-500 text-sm hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-center text-sm">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
