// components/Booking.jsx
import React, { useState, useEffect } from 'react';
import SeatingChart from './SeatingChart';
import TicketSelection from './TicketSelection'; 

export default function Booking({ movie, showtime, onGoBack }) {
  

  // If showtime is an object (from MovieDetail), use .id
  // If showtime is undefined, return null
  const screeningId = showtime?.id; 
  
  // Format the display string
  const displayTime = showtime 
    ? `${showtime.date} at ${showtime.time}` 
    : "Time Selected";

  const [currentStep, setCurrentStep] = useState('seats'); 
  const [selectedSeats, setSelectedSeats] = useState([]); 

  // Hardcoded prices 
  const PRICES_CENTS = {
    ADULT: 1500, 
    CHILD: 1000, 
    SENIOR: 1200 
  };

  const handleSeatClick = (seat) => {
    const exists = selectedSeats.find(s => s.seatId === seat.seatId);
    if (exists) {
      setSelectedSeats(selectedSeats.filter(s => s.seatId !== seat.seatId));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleContinueToTickets = () => setCurrentStep('tickets');
  const handleBackToSeats = () => setCurrentStep('seats');

  const handleCheckout = async (counts) => {
    
    const userId = localStorage.getItem('userId');
    if (!userId) { alert("Please log in."); return; }

    // Map counts to array
    const ticketTypes = [];
    ['adult', 'child', 'senior'].forEach(type => {
        for(let i=0; i<counts[type]; i++) ticketTypes.push(type.toUpperCase());
    });
    
    // Zip with seats
    const ticketsWithSeats = selectedSeats.map((seat, index) => ({
        seatId: seat.seatId,
        age: ticketTypes[index],
        priceCents: PRICES_CENTS[ticketTypes[index]]
    }));

    // Start Booking API Call
    // ... fetch logic ...
    // alert("Success");
    // onGoBack();
  };

  return (
    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'white' }}>
      <button onClick={onGoBack} style={{ marginBottom: '1rem' }}>Back</button>
      
      <h1>Book Your Tickets</h1>
      <h2>{movie?.title}</h2>
      <h3>{displayTime}</h3>

      {/* Safety Check: Only render chart if we have an ID */}
      {!screeningId ? (
         <div style={{color: 'red'}}>Error: No Screening ID found.</div>
      ) : (
        currentStep === 'seats' && (
          <>
            <SeatingChart 
              screeningId={screeningId} // Pass the ID 
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
            />
            <button 
              style={{
                padding: '1rem 2rem',
                backgroundColor: selectedSeats.length > 0 ? '#cc0000' : '#555',
                color: 'white',
                border: 'none',
                cursor: selectedSeats.length > 0 ? 'pointer' : 'not-allowed',
                marginTop: '20px'
              }}
              onClick={handleContinueToTickets}
              disabled={selectedSeats.length === 0}
            >
              Continue to Tickets
            </button>
          </>
        )
      )}

      {currentStep === 'tickets' && (
        <TicketSelection
          selectedSeats={selectedSeats.map(s => s.label)} 
          onGoBack={handleBackToSeats}
          onCheckout={handleCheckout} 
        />
      )}
    </div>
  );
}