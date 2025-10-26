import React, { useState, useEffect } from 'react';
import './Login.css'; // 👈 add this line

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

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
  onLoginSuccess?.('admin');
} else if (email === 'user@cine.com' && password === 'user123') {
  onLoginSuccess?.('user');
}
 else {
      setError('Invalid email or password');
      return;
    }

    if (remember) localStorage.setItem('rememberedEmail', email);
    else localStorage.removeItem('rememberedEmail');
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-card">
        <h2 className="login-title">Welcome Back</h2>

        {error && <p className="error-text">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="options">
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
            />
            Remember me
          </label>
          <a href="#" className="forgot-link" onClick={onGoForgot}>
  Forgot Password?
</a>
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>

        <p className="signup-text">
          Don’t have an account?{' '}
          <a href="#" className="signup-link" onClick={onGoSignup}>
  Sign up
</a>
        </p>
      </form>
    </div>
  );
}
