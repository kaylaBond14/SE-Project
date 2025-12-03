// components/Booking.jsx
import React, { useState } from 'react';
import SeatingChart from './SeatingChart';
import TicketSelection from './TicketSelection'; 
import Checkout from './Checkout';
import OrderConfirmation from './OrderConfirmation';

export default function Booking({ movie, showtime, onGoBack }) {
  
  const screeningId = showtime?.id; 
  const displayTime = showtime ? `${showtime.date} at ${showtime.time}` : "Time Selected";

  // STATE 
  const [currentStep, setCurrentStep] = useState('seats'); 
  const [selectedSeats, setSelectedSeats] = useState([]); 
  const [ticketCounts, setTicketCounts] = useState({ adult: 0, child: 0, senior: 0 });
  const [bookingResult, setBookingResult] = useState(null);

  // Hardcoded prices (Must match backend)
  const PRICES_CENTS = {
    ADULT: 1500, 
    CHILD: 1000, 
    SENIOR: 1200 
  };

  //  NAVIGATION HANDLERS 
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
  
  const handleProceedToCheckout = (counts) => {
    setTicketCounts(counts); 
    setCurrentStep('checkout');
  };

  const handleBackToTickets = () => setCurrentStep('tickets');

  //  THE FINAL API ORCHESTRATION 
 const handleFinalPayment = async (paymentData) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwtToken'); 

    if (!userId) { alert("Please log in."); return; }

    try {
      // 1. Prepare Tickets
      const ticketTypes = [];
      ['adult', 'child', 'senior'].forEach(type => {
        const count = ticketCounts[type]; 
        for(let i=0; i<count; i++) ticketTypes.push(type.toUpperCase());
      });
      
      const ticketsPayload = selectedSeats.map((seat, index) => ({
        seatId: seat.seatId,
        age: ticketTypes[index],
        priceCents: PRICES_CENTS[ticketTypes[index]]
      }));

      // 2. Start Booking
      console.log("Step 1: Creating Booking...");
      const startRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          userId: parseInt(userId),
          screeningId: screeningId,
          tickets: ticketsPayload.map(t => ({ age: t.age, priceCents: t.priceCents }))
        })
      });
      if (!startRes.ok) throw new Error(await startRes.text());
      const bookingData = await startRes.json();
      const bookingId = bookingData.id;

      // 3. Assign Seats
      console.log(`Step 2: Assigning Seats...`);
      const assignRes = await fetch(`/api/bookings/${bookingId}/assign-seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ bookingId, selections: ticketsPayload })
      });
      if (!assignRes.ok) throw new Error("Failed to assign seats");

      // 4. Apply Promotion (Pre-check)
      if (paymentData.promoCode) {
        console.log(`Step 3: Applying Promo ${paymentData.promoCode}...`);
        await fetch(`/api/promotions/apply?bookingId=${bookingId}&code=${paymentData.promoCode}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      // STEP 5: FINAL CHECKOUT 
      console.log("Step 5: Finalizing Checkout...");

      // 1. DEFINE THE PAYLOAD VARIABLE (This fixes the error)
      const checkoutPayload = {
          promotionCode: paymentData.promoCode || null 
      };

      // 2. Add the Payment Method
      if (paymentData.paymentCardId) {
          // Case A: User picked a Saved Card
          // We map 'paymentCardId' -> 'savedCardId' to match Backend DTO
          checkoutPayload.savedCardId = paymentData.paymentCardId;
      } 
      else if (paymentData.newCardDetails) {
          // Case B: User typed a New Card
          // We map the fields to the 'NewCardInfo' DTO structure
          checkoutPayload.newCard = {
              brand: paymentData.newCardDetails.brand,
              token: paymentData.newCardDetails.token,
              last4: paymentData.newCardDetails.last4,
              expMonth: paymentData.newCardDetails.expMonth,
              expYear: paymentData.newCardDetails.expYear
          };
      } else {
          throw new Error("No payment method selected");
      }

      // 3. Send the variable we just created
      const checkoutRes = await fetch(`/api/bookings/${bookingId}/checkout`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(checkoutPayload) // <--- Now this works!
      });

      if (!checkoutRes.ok) {
          const errData = await checkoutRes.text();
          throw new Error(`Checkout failed: ${errData}`);
      }
      


      // SUCCESS
      setBookingResult({
        bookingNumber: bookingData.bookingNumber || `BK-${bookingId}`,
        movieTitle: movie.title,
        showtime: displayTime,
        seats: selectedSeats.map(s => s.label),
        totalCost: paymentData.amountCents 
      });
      
      setCurrentStep('confirmed'); 

    } catch (error) {
      console.error("Checkout Failed:", error);
      alert(`Booking Error: ${error.message}`);
    }
  };

  // RENDER 
  return (
    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'white' }}>
      
      {/*CONFIRMATION PAGE */}
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

          {/*TICKETS */}
          {currentStep === 'tickets' && (
            <TicketSelection
              selectedSeats={selectedSeats.map(s => s.label)} 
              onGoBack={handleBackToSeats}
              onCheckout={handleProceedToCheckout} 
            />
          )}

          {/*CHECKOUT */}
          {currentStep === 'checkout' && (
            <Checkout 
              movie={movie} 
              showtime={showtime} 
              selectedSeats={selectedSeats}
              ticketCounts={ticketCounts} 
              prices={PRICES_CENTS} 
              onBack={handleBackToTickets} 
              onConfirm={handleFinalPayment} 
            />
          )}
        </>
      )}
    </div>
  );
}