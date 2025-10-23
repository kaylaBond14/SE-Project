import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // simulate email sent
    setTimeout(() => setSent(true), 800);
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
            Reset link sent to {email}
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border rounded w-full p-2"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Send Reset Link
            </button>
          </>
        )}
        <Link to="/" className="text-sm text-blue-500 hover:underline block text-center">
          Back to Login
        </Link>
      </form>
    </div>
  );
}
