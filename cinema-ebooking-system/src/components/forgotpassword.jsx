import React, { useState } from 'react';

// This component expects an 'onGoBack' prop from App.jsx
export default function ForgotPassword({ onGoBack }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Clear previous messages
    setMessage('');
    setIsError(false);

    // 2. Client-side validation
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setIsError(true);
      return;
    }

    setIsLoading(true);

    // 3. Prepare payload for the backend DTO
    // This matches your ResetPasswordRequest(String email, String newPassword)
    const payload = {
      email: email,
      newPassword: newPassword
    };

    try {
      // 4. Make the API call
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Success!
        setMessage('Password reset successfully! You can now go back to login.');
        setIsError(false);
        // Clear the form on success
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        // Handle server errors
        const errorText = await response.text();
        setMessage(errorText || 'An error occurred. Please try again.');
        setIsError(true);
      }

    } catch (error) {
      // Handle network errors
      console.error('Reset password fetch error:', error);
      setMessage('Could not connect to the server. Please check your connection.');
      setIsError(true);
    } finally {
      // Re-enable button
      setIsLoading(false);
    }
  };

  // --- STYLES ---
  // Using inline styles to match the red/black/grey theme

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    minHeight: '80vh' // Use minHeight to center vertically
  };

  const cardStyle = {
    backgroundColor: '#3a3a3a', // bg-gray-800
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    width: '100%',
    maxWidth: '448px', // max-w-md
    color: '#e5e7eb' // text-gray-200
  };

  const titleStyle = {
    fontSize: '1.875rem', // text-3xl
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: '1.5rem' // mb-6
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem', // text-sm
    fontWeight: '500',
    marginBottom: '0.5rem' // mb-2
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem', // px-4 py-2
    backgroundColor: '#4b5563', // bg-gray-700
    border: '1px solid #6b7280', // border-gray-600
    borderRadius: '0.375rem', // rounded-lg
    color: 'white',
    boxSizing: 'border-box' // Ensures padding doesn't affect width
  };
  
  const buttonStyle = {
    width: '100%',
    backgroundColor: isLoading ? '#991b1b' : '#dc2626', // bg-red-700 / hover:bg-red-600
    color: 'white',
    fontWeight: 'bold',
    padding: '0.75rem 1rem', // py-2 px-4
    borderRadius: '0.375rem', // rounded-lg
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s'
  };

  const backLinkStyle = {
    display: 'block',
    textAlign: 'center',
    color: '#f87171', // text-red-400
    marginTop: '1.5rem', // mt-6
    cursor: 'pointer'
  };
  
  const messageStyle = {
    textAlign: 'center',
    fontSize: '0.875rem', // text-sm
    marginBottom: '1rem', // mb-4
    minHeight: '1.25rem', // h-5
    color: isError ? '#f87171' : '#4ade80' // text-red-400 or text-green-400
  };

  // --- END STYLES ---

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Reset Password</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="resetEmail" style={labelStyle}>Your Email</label>
            <input
              type="email"
              id="resetEmail"
              style={inputStyle}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="newPassword" style={labelStyle}>New Password</label>
            <input
              type="password"
              id="newPassword"
              style={inputStyle}
              placeholder="Enter a strong new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="confirmPassword" style={labelStyle}>Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              style={inputStyle}
              placeholder="Re-type your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <p id="resetMessage" style={messageStyle}>
            {message}
          </p>

          <button type="submit" style={buttonStyle} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Reset Password'}
          </button>
        </form>

        <a onClick={onGoBack} style={backLinkStyle}>
          Back to Login
        </a>
      </div>
    </div>
  );
}
