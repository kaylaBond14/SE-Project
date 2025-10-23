import React from 'react';

// Accept the onRegisterClick prop from App.jsx
export default function HomeHeader({ onRegisterClick, onProfileClick }) {
  const headerStyle = {
    backgroundColor: '#1a1a1a', // Dark header background
    color: 'white',
    padding: '1rem 2rem', // Added more horizontal padding
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    justifyContent: 'space-between', // Changed from 'center'
    alignItems: 'center', // Added to vertically center items
    borderBottom: '4px solid #cc0000', // Red accent
  };

  const headerTitleStyle = {
    fontSize: '1.875rem',
    fontWeight: '700',
    margin: 0, // Added to remove default h1 margin
  };

  // --- NEW STYLES FOR THE BUTTONS ---
  const navContainerStyle = {
    display: 'flex',
    gap: '1rem',
  };

  const buttonStyle = {
    background: 'none',
    border: '1px solid white',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
  };
  

  return (
    <header style={headerStyle}>
      <h1 style={headerTitleStyle}>Cinema System</h1>

      {/* Container for Register Button (Will implement into login later) */}
      <div style={navContainerStyle}>
        
        {/* Register button */}
        <button 
          style={buttonStyle}
          onClick={onRegisterClick} // Prop comes from app.jsx
        >
          Register
        </button>
        {/* Edit Profile button */}
        <button 
          style={buttonStyle}
          onClick={onProfileClick}
        >
          My Profile
        </button>
      </div>
    </header>
  );
}