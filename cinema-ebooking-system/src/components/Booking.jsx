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

    if (!userId) { 
      alert("Please log in to book tickets."); 
      return; 
    }

    try {
      //  Prepare Ticket Data
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

   
      // API CALL 1: START BOOKING
   
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

      if (!startRes.ok) {
          const err = await startRes.text();
          throw new Error(`Start Booking Failed: ${err}`);
      }
      const bookingData = await startRes.json();
      const bookingId = bookingData.id;


      // API CALL 2: ASSIGN SEATS
     
      console.log(`Step 2: Assigning Seats...`);
      const assignRes = await fetch(`/api/bookings/${bookingId}/assign-seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ bookingId: bookingId, selections: ticketsPayload })
      });

      if (!assignRes.ok) throw new Error("Failed to assign seats");

      
      // API CALL 3: APPLY PROMOTION (If provided)
     
      if (paymentData.promoCode) {
        console.log(`Step 3: Applying Promo ${paymentData.promoCode}...`);
        const promoRes = await fetch(`/api/promotions/apply?bookingId=${bookingId}&code=${paymentData.promoCode}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!promoRes.ok) console.warn("Failed to apply promo code, proceeding anyway.");
      }

      
      // API CALL 4: HANDLE PAYMENT CARD
     
      let finalCardId = paymentData.paymentCardId;

      if (!finalCardId && paymentData.newCardDetails) {
        console.log("Step 4: Saving New Card...", paymentData.newCardDetails);
        
        
        // If billingAddress comes from Checkout, use it. Otherwise fallback.
        const addrData = paymentData.billingAddress || {}; 
        
        const saveCardRes = await fetch(`/api/users/${userId}/cards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                ...paymentData.newCardDetails,
                
             
                billingSameAsHome: false, 
                addressReq: {
                    label: "Billing",
                    street: addrData.street || "Unknown",
                    city: addrData.city || "Unknown",
                    state: addrData.state || "NA",
                    postalCode: addrData.zip || "00000",
                    country: "USA"
                }
               
            })
        });
        
        if (!saveCardRes.ok) {
            const errorText = await saveCardRes.text();
            throw new Error(`Card Save Failed: ${errorText}`);
        }
        
        const savedCardData = await saveCardRes.json();
        finalCardId = savedCardData.id;
      }

     
      // API CALL 5: FINAL CHECKOUT
      
      console.log("Step 5: Finalizing Checkout...");
      const checkoutRes = await fetch(`/api/bookings/${bookingId}/checkout`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ savedCardId: finalCardId }) 
      });

      if (!checkoutRes.ok) {
          const errData = await checkoutRes.text();
          throw new Error(`Checkout failed: ${errData}`);
      }
      
      
      // SUCCESS: SHOW RECEIPT
     
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
      
      {/*CONFIRMATION PAGE (The Receipt) */}
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