import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Only if your app uses Router
// If not using Router, you can replace <Link> with <a onClick={onGoBack}>...</a>

export default function ForgotPassword({ onGoBack }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // Backend usually returns 202 Accepted even if email doesn’t exist → treat as success
      if (res.ok || res.status === 202) {
        setSent(true);
      } else {
        const msg = await res.text();
        setError(msg || 'Failed to send reset link.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Reset Password</h2>

        {sent ? (
          <p className="text-green-600 text-center">
            If the email exists, a reset link has been sent to <b>{email}</b>.
          </p>
        ) : (
          <>
            <input
              type="email"
              id="resetEmail"
              className="w-full border rounded px-3 py-2"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white py-2 rounded`}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </>
        )}

        {/* Navigation back to Login */}
        <a
          onClick={onGoBack}
          className="text-sm text-blue-500 hover:underline block text-center cursor-pointer"
        >
          Back to Login
        </a>
      </form>
    </div>
  );
}
