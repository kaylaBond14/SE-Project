import React, { useMemo, useState } from 'react';

export default function ResetPassword({ onGoBack }) {
  const [token, setToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('token') || '';
  });
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pw1 !== pw2) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: pw1 }),
      });
      if (res.status === 204) {
        setDone(true);
      } else {
        const msg = await res.text();
        setError(msg || 'Failed to reset password.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-red-600 mb-4">Invalid or missing reset token.</p>
          <button
            onClick={onGoBack}
            className="text-blue-600 underline hover:text-blue-800"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Set New Password</h2>

        {done ? (
          <p className="text-green-600 text-center">
            Password updated successfully! You can now log in.
          </p>
        ) : (
          <>
            <input
              type="password"
              placeholder="New password"
              value={pw1}
              onChange={(e) => setPw1(e.target.value)}
              required
              minLength={8}
              className="border rounded w-full p-2"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              required
              minLength={8}
              className="border rounded w-full p-2"
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
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </>
        )}

        <button
          onClick={onGoBack}
          type="button"
          className="text-sm text-blue-500 hover:underline block text-center"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}
