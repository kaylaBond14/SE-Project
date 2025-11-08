// Booking.jsx
import React, { useState } from 'react'; // <-- Import useState
import SeatingChart from './SeatingChart';
import TicketSelection from './TicketSelection'; // <-- Import new component

export default function Booking({ movie, showtime, onGoBack }) {
  
  // 'seats' or 'tickets'
  const [currentStep, setCurrentStep] = useState('seats'); 
  // This state is "lifted up" from SeatingChart
  const [selectedSeats, setSelectedSeats] = useState([]); 

  const bookingContainerStyle = { padding: '1.5rem', textAlign: 'center' };
  const bookingHeadingStyle = { fontSize: '2rem', fontWeight: 'bold' };
  const bookingSubtitleStyle = { fontSize: '1.25rem', marginBottom: '2rem' };

  // Prototype SeatingChart: Hardcode occupied seats
  const occupiedSeats = ["A2", "A3", "C5", "C7"];

  // === NEW HANDLER for SeatingChart ===
  const handleSeatClick = (seat) => {
    // Logic moved from SeatingChart to here
    setSelectedSeats(
      selectedSeats.includes(seat)
        ? selectedSeats.filter(s => s !== seat)
        : [...selectedSeats, seat]
    );
  };

  // For navigation
  const handleContinueToTickets = () => {
    setCurrentStep('tickets');
  };

  const handleBackToSeats = () => {
    setCurrentStep('seats');
  };

  // This is the FINAL checkout click
  const handleCheckout = () => {
    console.log("Checkout button clicked!");
    console.log("Selected Seats:", selectedSeats);
    // In a real app, you'd also get the ticket counts from TicketSelection,
    // but for now, this logic lives inside TicketSelection.
    // To pass data up, TicketSelection's onCheckout would pass the 'counts' object.
    // e.g., onClick={() => onCheckout(counts)}
    alert("Proceeding to payment (not implemented).");
  };

  // Style for the "Continue" button
  const continueButtonStyle = {
    padding: '1rem 2rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    backgroundColor: '#cc0000', // Red background for prominence
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    marginTop: '2rem',
  };
  
  const disabledButtonStyle = {
     backgroundColor: '#aaa',
     cursor: 'not-allowed'
  };


  return (
    <div style={bookingContainerStyle}>
      {/* Button to go back to the movie detail page */}
      <button onClick={onGoBack} style={{ marginBottom: '1rem', padding: '0.5rem' }}>Back to Movie Details</button>
      <h1 style={bookingHeadingStyle}>Book Your Tickets</h1>
      <h2 style={bookingSubtitleStyle}>{movie?.title} - {showtime}</h2>
      
      
      
      {currentStep === 'seats' && (
        <>
          <SeatingChart 
            occupiedSeats={occupiedSeats}
            selectedSeats={selectedSeats}     // <-- Pass state down
            onSeatClick={handleSeatClick}   // <-- Pass handler down
          />
          <button 
            style={
              selectedSeats.length > 0 
                ? continueButtonStyle 
                : { ...continueButtonStyle, ...disabledButtonStyle }
            }
            onClick={handleContinueToTickets}
            disabled={selectedSeats.length === 0} // <-- Disable if no seats
          >
            Continue
          </button>
        </>
      )}
      
      {currentStep === 'tickets' && (
        <TicketSelection
          selectedSeats={selectedSeats}
          onGoBack={handleBackToSeats}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}