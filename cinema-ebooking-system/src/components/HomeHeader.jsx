import React from 'react';
export default function HomeHeader({ 
  isLoggedIn, 
  onLoginClick, 
  onLogoutClick, 
  onRegisterClick,
  onProfileClick 
}) {
  
  // Styles
  const headerStyle = {
    backgroundColor: '#1a1a1a', 
    color: 'white',
    padding: '1rem 2rem', 
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', 
    borderBottom: '4px solid #cc0000',
  };
  const headerTitleStyle = {
    fontSize: '1.875rem',
    fontWeight: '700',
    margin: 0, 
  };
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
  // end of styles

  return (
    <header style={headerStyle}>
      <h1 style={headerTitleStyle}>Cinema System</h1>

      {/*This navigation container is now fully dynamic */}
      <div style={navContainerStyle}>
        {isLoggedIn ? ( 
          // SHOW THESE BUTTONS IF LOGGED IN (TRIAL FOR LOGIN STUFF)
          <> 
            <button  
              style={buttonStyle} 
              onClick={onProfileClick} 
            > 
              Edit Profile
            </button> 
            <button 
              style={buttonStyle}
              onClick={onLogoutClick} 
            > 
              Logout
            </button> 
          </> 
        ) : ( 
          //SHOW THESE BUTTONS IF LOGGED OUT 
          <> 
            <button 
              style={buttonStyle} 
              onClick={onLoginClick} 
            > 
              Login
            </button> 
            {/* <button 
              style={buttonStyle}
              onClick={onRegisterClick} 
            >
              Register
            </button> */}
          </> 
        )} 
      </div>
    </header>
  );
}