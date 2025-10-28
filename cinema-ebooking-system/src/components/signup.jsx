import React from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 text-center">
        <h2 className="text-2xl font-semibold mb-4">Signup Page</h2>
        <p>Coming soon...</p>
        <Link to="/" className="text-blue-500 hover:underline block mt-4">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
