import React, { useState, useEffect } from 'react';

export default function Checkout({ 
  movie, 
  showtime, 
  selectedSeats, 
  ticketCounts, 
  prices, 
  onBack, 
  onConfirm 
}) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0); 
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState('new'); 
  const [newCard, setNewCard] = useState({ name: '', number: '', expiry: '', cvc: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 1. SIMULATE FETCHING SAVED CARDS ---
  useEffect(() => {
    // TODO: Replace with fetch(`/api/users/${userId}/cards`)
    const mockCards = [
      { id: 101, last4: '4242', brand: 'Visa' },
      { id: 102, last4: '8888', brand: 'MasterCard' }
    ];
    setSavedCards(mockCards);
  }, []);

  // --- 2. MATH ---
  const calculateTotal = () => {
    let subtotalCents = 0;
    Object.entries(ticketCounts).forEach(([type, count]) => {
      if (count > 0) subtotalCents += count * prices[type.toUpperCase()];
    });

    const subtotal = subtotalCents / 100; // Convert to dollars
    const tax = subtotal * 0.08; // 8% Tax
    const discountAmount = subtotal * discountPercent;
    const total = subtotal + tax - discountAmount;

    return { subtotal, tax, discountAmount, total };
  };

  const { subtotal, tax, discountAmount, total } = calculateTotal();

  // --- 3. HANDLERS ---
  const handleApplyPromo = () => {
    // TODO: Replace with fetch(`/api/promotions/${promoCode}`)
    if (promoCode === "SAVE10") {
      setDiscountPercent(0.10);
      alert("Applied: 10% Off!");
    } else {
      alert("Invalid Code (Try 'SAVE10')");
      setDiscountPercent(0);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(r => setTimeout(r, 1500));
    
    // Send data back to Booking.jsx to start the API chain
    onConfirm({
      amountCents: Math.round(total * 100), // Convert back to cents
      cardId: selectedCardId === 'new' ? null : selectedCardId
    });
  };

  // --- STYLES ---
  const containerStyle = { display: 'flex', gap: '2rem', flexWrap: 'wrap', textAlign: 'left', maxWidth: '1000px', margin: '0 auto' };
  const sectionStyle = { flex: 1, minWidth: '300px', backgroundColor: '#333', padding: '20px', borderRadius: '8px' };
  const inputStyle = { padding: '10px', width: '100%', marginBottom: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: 'white' };

  return (
    <div>
      <button onClick={onBack} style={{marginBottom: '1rem', padding: '5px 15px', cursor: 'pointer'}}>Back</button>
      <h1 style={{marginBottom: '2rem'}}>Checkout</h1>
      
      <div style={containerStyle}>
        {/* SUMMARY SECTION */}
        <div style={sectionStyle}>
          <h2>Order Summary</h2>
          <h3 style={{color: '#cc0000'}}>{movie.title}</h3>
          <p>{showtime.date} at {showtime.time}</p>
          <hr style={{borderColor: '#555'}}/>
          
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          {discountAmount > 0 && (
            <div style={{display: 'flex', justifyContent: 'space-between', color: '#4CAF50'}}><span>Discount</span><span>-${discountAmount.toFixed(2)}</span></div>
          )}
          <hr style={{borderColor: '#555'}}/>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold'}}><span>Total</span><span>${total.toFixed(2)}</span></div>

          <div style={{marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #555'}}>
            <label>Promo Code (Try 'SAVE10')</label>
            <div style={{display: 'flex', gap: '10px'}}>
              <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} style={inputStyle} />
              <button onClick={handleApplyPromo} style={{cursor: 'pointer', padding: '0 20px'}}>Apply</button>
            </div>
          </div>
        </div>

        {/* PAYMENT SECTION */}
        <div style={sectionStyle}>
          <h2>Payment</h2>
          {savedCards.map(card => (
            <div key={card.id} style={{marginBottom: '10px', padding: '10px', border: '1px solid #555', borderRadius: '4px'}}>
              <label style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                <input type="radio" name="pay" checked={selectedCardId === card.id} onChange={() => setSelectedCardId(card.id)} style={{marginRight: '10px'}}/>
                {card.brand} ****{card.last4}
              </label>
            </div>
          ))}
          <div style={{marginTop: '15px'}}>
            <label style={{cursor: 'pointer'}}><input type="radio" name="pay" checked={selectedCardId === 'new'} onChange={() => setSelectedCardId('new')} style={{marginRight: '10px'}}/> Use New Card</label>
          </div>

          {selectedCardId === 'new' && (
            <div style={{marginTop: '10px', padding: '10px', backgroundColor: '#2a2a2a', borderRadius: '4px'}}>
              <input placeholder="Name on Card" style={inputStyle} onChange={e => setNewCard({...newCard, name: e.target.value})} />
              <input placeholder="Card Number" style={inputStyle} onChange={e => setNewCard({...newCard, number: e.target.value})} />
              <div style={{display: 'flex', gap: '10px'}}>
                <input placeholder="MM/YY" style={inputStyle} onChange={e => setNewCard({...newCard, expiry: e.target.value})} />
                <input placeholder="CVC" style={inputStyle} onChange={e => setNewCard({...newCard, cvc: e.target.value})} />
              </div>
            </div>
          )}

          <button onClick={handlePay} disabled={isProcessing} style={{width: '100%', marginTop: '20px', padding: '15px', backgroundColor: '#cc0000', color: 'white', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: isProcessing ? 'not-allowed' : 'pointer', borderRadius: '4px'}}>
            {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}