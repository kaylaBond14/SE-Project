import React from 'react';

export default function OrderConfirmation({ booking, onGoHome }) {
  const containerStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: 'white',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    maxWidth: '600px',
    margin: '2rem auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
  };

  const receiptStyle = {
    textAlign: 'left',
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '8px',
    margin: '20px 0',
    border: '1px solid #444'
  };

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}></div>
      <h1 style={{ color: '#4CAF50', marginBottom: '0.5rem' }}>Booking Confirmed!</h1>
      <p style={{ color: '#ccc' }}>Thank you for your purchase.</p>

      <div style={receiptStyle}>
        <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '10px', marginTop: 0 }}>
          Booking #{booking.bookingNumber}
        </h3>
        <p><strong>Movie:</strong> {booking.movieTitle}</p>
        <p><strong>Time:</strong> {booking.showtime}</p>
        <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
        <hr style={{ borderColor: '#555' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
          <span>Total Paid:</span>
          <span>${(booking.totalCost / 100).toFixed(2)}</span>
        </div>
      </div>

      <button 
        onClick={onGoHome}
        style={{
          marginTop: '1rem',
          padding: '1rem 3rem',
          backgroundColor: '#cc0000',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}
      >
        Return to Home
      </button>
    </div>
  );
}