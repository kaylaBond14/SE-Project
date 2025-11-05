import React, { useState, useEffect } from 'react';
import './Login.css'; 

export default function Login({ onLoginSuccess, onGoForgot, onGoSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // NEW: For loading feedback

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  // Made the function async to await the API call
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true); // Show loading state

    // This object matches LoginRequest DTO
    const loginRequest = {
      email: email,
      password: password,
    };

    // All backend logic is in this try/catch block
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest),
      });

      if (response.ok) {
        // --- Login Successful ---
        // This 'data' object will be { id, email, token, role }
        const data = await response.json(); 
        
        // Store the token to use for other API calls
        localStorage.setItem('jwtToken', data.token);

        // This 'remember me' logic was already correct
        if (remember) localStorage.setItem('rememberedEmail', email);
        else localStorage.removeItem('rememberedEmail');

        // Pass the *entire* user object (with the role) to the parent
        onLoginSuccess?.(data);

      } else {
        // --- Login Failed ---
        // Get the error message from backend
        const errorText = await response.text();
        setError(errorText || 'Invalid email or password');
      }
    } catch (err) {
      // Handle network errors (e.g., server is down)
      console.error('Login request failed:', err);
      setError('Could not connect to the server. Please try again later.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-card">
        <h2 className="login-title">Welcome!</h2>

        {error && <p className="error-text">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading} // Disable while loading
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading} // Disable while loading
        />

        <div className="options">
          <label>
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              disabled={isLoading} // Disable while loading
            />
            Remember me
          </label>
          <a href="#" className="forgot-link" onClick={onGoForgot}>
            Forgot Password?
          </a>
        </div>

        {/* Disable button and show loading text */}
        <button type="submit" className="login-btn" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className="signup-text">
          Don’t have an account?{' '}
          <a href="#" className="signup-link" onClick={onGoSignup}>
            Create Account
          </a>
        </p>
      </form>
    </div>
  );
}