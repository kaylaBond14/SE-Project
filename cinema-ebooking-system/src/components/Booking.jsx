import React from 'react';

export default function Booking({ movie, showtime, onGoBack }) {
  const bookingContainerStyle = { padding: '1.5rem', textAlign: 'center' };
  const bookingHeadingStyle = { fontSize: '2rem', fontWeight: 'bold' };
  const bookingSubtitleStyle = { fontSize: '1.25rem', marginBottom: '2rem' };
  const bookingMessageStyle = { fontSize: '1.125rem', color: '#aaa' };

  return (
    <div style={bookingContainerStyle}>
      {/* Button to go back to the movie detail page */}
      <button onClick={onGoBack} style={{ marginBottom: '1rem', padding: '0.5rem' }}>Back to Movie Details</button>
      <h1 style={bookingHeadingStyle}>Book Your Tickets</h1>
      <h2 style={bookingSubtitleStyle}>{movie?.title} - {showtime}</h2>
      <p style={bookingMessageStyle}>
        [ Booking UI goes here. Seat selection, pricing, and checkout logic will be implemented in later sprints. ]
      </p>
    </div>
  );
}