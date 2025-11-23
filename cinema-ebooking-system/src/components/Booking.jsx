// components/Booking.jsx
import React, { useState, useEffect } from 'react';
import SeatingChart from './SeatingChart';
import TicketSelection from './TicketSelection'; 

export default function Booking({ movie, showtime, onGoBack }) {
  
  // If showtime is an object (from MovieDetail), use .id
  const screeningId = showtime?.id; 
  
  // Format the display string
  const displayTime = showtime 
    ? `${showtime.date} at ${showtime.time}` 
    : "Time Selected";

  const [currentStep, setCurrentStep] = useState('seats'); 
  const [selectedSeats, setSelectedSeats] = useState([]); 

  // Hardcoded prices (Must match backend expectations)
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

  // --- THE FULL CHECKOUT LOGIC ---
  const handleCheckout = async (counts) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwtToken'); // Get token if available

    if (!userId) { 
      alert("Please log in to book tickets."); 
      return; 
    }

    try {
      // Prepare Data: Convert counts (2 Adults) into Array ["ADULT", "ADULT"]
      const ticketTypes = [];
      ['adult', 'child', 'senior'].forEach(type => {
        const count = counts[type];
        for(let i=0; i<count; i++) {
          ticketTypes.push(type.toUpperCase());
        }
      });
      
      // Prepare Payload: Zip the ticket types with the selected seat IDs
      const ticketsPayload = selectedSeats.map((seat, index) => {
        const ageType = ticketTypes[index];
        return {
          seatId: seat.seatId,
          age: ageType,
          priceCents: PRICES_CENTS[ageType]
        };
      });

      console.log("Step 1: Creating Booking...");
      
      // API CALL 1: START BOOKING 
      const startRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          screeningId: screeningId, // Use the extracted ID
          tickets: ticketsPayload.map(t => ({ 
            age: t.age, 
            priceCents: t.priceCents 
          }))
        })
      });

      if (!startRes.ok) {
        const errText = await startRes.text();
        throw new Error(`Failed to create booking: ${errText}`);
      }

      const bookingData = await startRes.json();
      const bookingId = bookingData.id;

      // API CALL 2: ASSIGN SEATS 
      console.log(`Step 2: Assigning Seats to Booking ${bookingId}...`);
      
      const assignRes = await fetch(`/api/bookings/${bookingId}/assign-seats`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: bookingId,
          selections: ticketsPayload // Contains seatId, age, price
        })
      });

      if (!assignRes.ok) throw new Error("Failed to assign seats");

      // API CALL 3: CONFIRM BOOKING 
      console.log("Step 3: Confirming Booking...");
      
      const confirmRes = await fetch(`/api/bookings/${bookingId}/confirm`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });

      if (!confirmRes.ok) throw new Error("Failed to confirm booking");

      
      alert("Success! Your seats are reserved.");
      onGoBack(); // Navigate back to the movie page

    } catch (error) {
      console.error("Checkout Failed:", error);
      alert(`Booking Error: ${error.message}`);
    }
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