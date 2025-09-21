import React from "react";

export default function HomeHeader() {
  const headerStyle = {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    justifyContent: 'center',
    borderBottom: '4px solid #d1d5db',
  };

  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: '700',
  };

  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>Cinema System</h1>
    </header>
  );
}