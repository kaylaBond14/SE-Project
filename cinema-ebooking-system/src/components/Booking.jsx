import React from 'react';
import SeatingChart from './SeatingChart';

export default function Booking({ movie, showtime, onGoBack }) {
  const bookingContainerStyle = { padding: '1.5rem', textAlign: 'center' };
  const bookingHeadingStyle = { fontSize: '2rem', fontWeight: 'bold' };
  const bookingSubtitleStyle = { fontSize: '1.25rem', marginBottom: '2rem' };
  const bookingMessageStyle = { fontSize: '1.125rem', color: '#aaa' };

  // Prototype SeatingChar: Hardcode occupied seats
  // Would fetch this from Spring Boot API (DB)!
  const occupiedSeats = ["A2", "A3", "C5", "C7"];

  // Checkout button
  const checkoutButtonStyle = {
    padding: '1rem 2rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    backgroundColor: '#cc0000', // Red background for prominence
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    marginTop: '2rem', // Add some space above the button
  };

  // Dummy handler for the checkout button 
  const handleCheckout = () => {
    console.log("Checkout button clicked, but functionality is not implemented yet.");
    // Will prompt user to sign in if not, and continue to checkout page.
  };

  return (
    <div style={bookingContainerStyle}>
      {/* Button to go back to the movie detail page */}
      <button onClick={onGoBack} style={{ marginBottom: '1rem', padding: '0.5rem' }}>Back to Movie Details</button>
      <h1 style={bookingHeadingStyle}>Book Your Tickets</h1>
      <h2 style={bookingSubtitleStyle}>{movie?.title} - {showtime}</h2>
      
      {/* SeatingChart component here. Pass occupied seats as a prop to component */}
      <SeatingChart occupiedSeats={occupiedSeats} />

    {/* Checkout button */}
    <button 
        style={checkoutButtonStyle}
        onClick={handleCheckout} // Use the dummy handler
      >
        Continue to Checkout
      </button>
    </div>
  );
}