// components/Booking.jsx
import React, { useState } from 'react';
import SeatingChart from './SeatingChart';
import TicketSelection from './TicketSelection'; 
import Checkout from './Checkout';
import OrderConfirmation from './OrderConfirmation';

export default function Booking({ movie, showtime, onGoBack }) {
  
  const screeningId = showtime?.id; 
  const displayTime = showtime ? `${showtime.date} at ${showtime.time}` : "Time Selected";

  
  // New steps added: 'checkout' and 'confirmed'
  const [currentStep, setCurrentStep] = useState('seats'); 
  const [selectedSeats, setSelectedSeats] = useState([]); 
  
  // need to store counts here to pass them to the Checkout screen
  const [ticketCounts, setTicketCounts] = useState({ adult: 0, child: 0, senior: 0 });
  
  // To store the booking details for the receipt page
  const [bookingResult, setBookingResult] = useState(null);

  const PRICES_CENTS = {
    ADULT: 1500, 
    CHILD: 1000, 
    SENIOR: 1200 
  };

  // Handlers

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
  
  // From Tickets -> Checkout Page
  const handleProceedToCheckout = (counts) => {
    setTicketCounts(counts); // Save the counts for the next step
    setCurrentStep('checkout');
  };

  // From Checkout -> Back to Tickets
  const handleBackToTickets = () => setCurrentStep('tickets');

  //  THE API LOGIC (Moved here, triggered by Checkout component) 
  const handleFinalPayment = async (paymentDetails) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwtToken'); 

    if (!userId) { 
      alert("Please log in to book tickets."); 
      return; 
    }

    try {
      // Prepare Data (Same logic as before, just using state now)
      const ticketTypes = [];
      ['adult', 'child', 'senior'].forEach(type => {
        // read from the 'ticketCounts' state now
        const count = ticketCounts[type]; 
        for(let i=0; i<count; i++) {
          ticketTypes.push(type.toUpperCase());
        }
      });
      
      const ticketsPayload = selectedSeats.map((seat, index) => {
        const ageType = ticketTypes[index];
        return {
          seatId: seat.seatId,
          age: ageType,
          priceCents: PRICES_CENTS[ageType]
        };
      });

      //  Start Booking API
      console.log("Step 1: Creating Booking...");
      const startRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          screeningId: screeningId,
          tickets: ticketsPayload.map(t => ({ age: t.age, priceCents: t.priceCents }))
        })
      });

      if (!startRes.ok) throw new Error(await startRes.text());
      const bookingData = await startRes.json();
      const bookingId = bookingData.id;

      // Assign Seats API
      console.log(`Step 2: Assigning Seats...`);
      const assignRes = await fetch(`/api/bookings/${bookingId}/assign-seats`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: bookingId,
          selections: ticketsPayload
        })
      });

      if (!assignRes.ok) throw new Error("Failed to assign seats");

      // Confirm Booking API
      console.log("Step 3: Confirming...");
      const confirmRes = await fetch(`/api/bookings/${bookingId}/confirm`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!confirmRes.ok) throw new Error("Failed to confirm booking");

      // SUCCESS: Move to Confirmation Screen
      // construct the receipt data here
      setBookingResult({
        bookingNumber: bookingData.bookingNumber || `BK-${bookingId}`,
        movieTitle: movie.title,
        showtime: displayTime,
        seats: selectedSeats.map(s => s.label),
        totalCost: paymentDetails.amountCents // Passed from Checkout.jsx
      });
      
      setCurrentStep('confirmed'); // Show the receipt

    } catch (error) {
      console.error("Payment Failed:", error);
      alert(`Booking Error: ${error.message}`);
    }
  };

  // Render
  return (
    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'white' }}>
      
      {/* CONFIRMATION PAGE (The Receipt) */}
      {currentStep === 'confirmed' && bookingResult && (
        <OrderConfirmation 
          booking={bookingResult} 
          onGoHome={onGoBack} 
        />
      )}

      {/* (Hide if confirmed) */}
      {currentStep !== 'confirmed' && (
        <>
          {/* Header (Hide on checkout page to avoid clutter) */}
          {currentStep !== 'checkout' && (
            <>
              <button onClick={onGoBack} style={{ marginBottom: '1rem' }}>Back</button>
              <h1>Book Your Tickets</h1>
              <h2>{movie?.title}</h2>
              <h3>{displayTime}</h3>
            </>
          )}

          {/* SEATS */}
          {!screeningId ? (
             <div style={{color: 'red'}}>Error: No Screening ID found.</div>
          ) : (
            currentStep === 'seats' && (
              <>
                <SeatingChart 
                  screeningId={screeningId}
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

          {/* TICKETS */}
          {currentStep === 'tickets' && (
            <TicketSelection
              selectedSeats={selectedSeats.map(s => s.label)} 
              onGoBack={handleBackToSeats}
              onCheckout={handleProceedToCheckout} // Calls the function that switches step
            />
          )}

          {/* CHECKOUT */}
          {currentStep === 'checkout' && (
            <Checkout 
              movie={movie} 
              showtime={showtime} 
              selectedSeats={selectedSeats} 
              ticketCounts={ticketCounts} 
              prices={PRICES_CENTS} 
              onBack={handleBackToTickets} 
              onConfirm={handleFinalPayment} // Calls the API logic
            />
          )}
        </>
      )}
    </div>
  );
}