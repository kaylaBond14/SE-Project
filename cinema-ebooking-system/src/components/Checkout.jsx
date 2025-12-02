// src/components/Checkout.jsx
import React, { useState, useEffect } from 'react';

export default function Checkout({ 
  movie, 
  showtime, 
  ticketCounts, 
  prices, 
  onBack, 
  onConfirm 
}) {
  // FEES CONSTANTS 
  const ONLINE_FEE = 1.50;
  const PROCESSING_FEE = 0.50;


  const [promoCode, setPromoCode] = useState('');
  const [promoData, setPromoData] = useState(null); 
  const [promoMessage, setPromoMessage] = useState('');

  const [savedCards, setSavedCards] = useState([]); 
  const [selectedCardId, setSelectedCardId] = useState(''); 
  const [isNewCard, setIsNewCard] = useState(false);
  
  const [newCard, setNewCard] = useState({ 
    brand: 'VISA', 
    token: '', 
    last4: '',
    expMonth: '', 
    expYear: '' 
  });

  const [billingAddr, setBillingAddr] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('jwtToken');
      if (!userId) return;

      try {
        const res = await fetch(`/api/users/${userId}/cards`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSavedCards(data);
          if (data.length > 0) {
            setSelectedCardId(data[0].id);
            setIsNewCard(false);
          } else {
            setIsNewCard(true);
          }
        }
      } catch (err) {
        console.error("Failed to load cards", err);
      }
    };
    fetchCards();
  }, []);

  
  const calculateTotal = () => {
    let subtotalCents = 0;
    Object.entries(ticketCounts).forEach(([type, count]) => {
      if (count > 0) subtotalCents += count * prices[type.toUpperCase()];
    });

    const subtotal = subtotalCents / 100; 
    const tax = subtotal * 0.07; 
    
    let discountAmount = 0;
    if (promoData && promoData.valid) {
        discountAmount = (subtotal * (promoData.discountValue / 100));
    }

    // Add Fees to Final Total
    const total = subtotal + tax + ONLINE_FEE + PROCESSING_FEE - discountAmount;
    
    return { subtotal, tax, discountAmount, total };
  };

  const { subtotal, tax, discountAmount, total } = calculateTotal();

  const handleApplyPromo = async () => {
    if(!promoCode) return;
    setPromoMessage('Checking...');
    try {
        const res = await fetch(`/api/promotions/${promoCode}`);
        const data = await res.json(); 
        if (data.valid) {
            setPromoData(data);
            setPromoMessage(`Success: ${data.message || 'Code applied'}`);
        } else {
            setPromoData(null);
            setPromoMessage(`Error: ${data.message || 'Invalid code'}`);
        }
    } catch (err) {
        setPromoMessage("Network error checking code.");
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    
    if (isNewCard) {
        if (!newCard.token || !billingAddr.street || !billingAddr.zip) {
            alert("Please fill in all card and billing address details.");
            return;
        }
    }

    setIsProcessing(true);
    
    onConfirm({
      amountCents: Math.round(total * 100),
      paymentCardId: isNewCard ? null : selectedCardId,
      newCardDetails: isNewCard ? newCard : null,
      billingAddress: isNewCard ? billingAddr : null,
      promoCode: promoData && promoData.valid ? promoCode : null
    });
  };

  const containerStyle = { display: 'flex', gap: '2rem', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto', textAlign: 'left' };
  const sectionStyle = { flex: 1, minWidth: '300px', backgroundColor: '#333', padding: '20px', borderRadius: '8px', color: 'white' };
  const inputStyle = { padding: '10px', width: '100%', marginBottom: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#444', color: 'white' };

  return (
    <div>
      <button onClick={onBack} style={{marginBottom: '1rem', padding: '5px 15px', cursor: 'pointer'}}>Back</button>
      <h1 style={{marginBottom: '2rem'}}>Checkout</h1>
      
      <div style={containerStyle}>
        {/* SUMMARY */}
        <div style={sectionStyle}>
          <h2>Order Summary</h2>
          <h3 style={{color: '#cc0000'}}>{movie.title}</h3>
          <p>{showtime.date} at {showtime.time}</p>
          <hr style={{borderColor: '#555'}}/>
          
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Tax (7%)</span><span>${tax.toFixed(2)}</span></div>
          
          
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Online Fee</span><span>${ONLINE_FEE.toFixed(2)}</span></div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Processing Fee</span><span>${PROCESSING_FEE.toFixed(2)}</span></div>
        

          {discountAmount > 0 && (
            <div style={{display: 'flex', justifyContent: 'space-between', color: '#4CAF50'}}><span>Discount</span><span>-${discountAmount.toFixed(2)}</span></div>
          )}
          <hr style={{borderColor: '#555'}}/>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 'bold'}}><span>Total</span><span>${total.toFixed(2)}</span></div>

          <div style={{marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #555'}}>
            <label>Promotion Code</label>
            <div style={{display: 'flex', gap: '10px'}}>
              <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter Code" style={inputStyle} />
              <button onClick={handleApplyPromo} style={{padding: '0 20px', cursor: 'pointer'}}>Apply</button>
            </div>
            {promoMessage && <p style={{color: promoData?.valid ? '#4CAF50' : 'red', marginTop: '5px'}}>{promoMessage}</p>}
          </div>
        </div>

        {/* PAYMENT */}
        <div style={sectionStyle}>
          <h2>Payment Method</h2>
          
          {savedCards.map(card => (
            <div key={card.id} style={{marginBottom: '10px', padding: '10px', border: '1px solid #555', borderRadius: '4px'}}>
              <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <input 
                  type="radio" name="paymentMethod" 
                  checked={!isNewCard && selectedCardId === card.id}
                  onChange={() => { setIsNewCard(false); setSelectedCardId(card.id); }}
                  style={{marginRight: '10px'}}
                />
                {card.brand} ending in ****{card.last4}
              </label>
            </div>
          ))}

          <div style={{marginTop: '15px'}}>
            <label style={{cursor: 'pointer'}}>
              <input 
                type="radio" name="paymentMethod" 
                checked={isNewCard}
                onChange={() => setIsNewCard(true)}
                style={{marginRight: '10px'}}
              />
              Use a different card
            </label>
          </div>

          {/* NEW CARD FORM */}
          {isNewCard && (
            <div style={{backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '4px', marginTop: '10px'}}>
              <h4 style={{marginTop:0}}>Card Details</h4>
              <input 
                placeholder="Card Number" style={inputStyle} 
                onChange={e => setNewCard({...newCard, token: e.target.value, last4: e.target.value.slice(-4)})}
              />
              <div style={{display: 'flex', gap: '10px'}}>
                 <select style={inputStyle} onChange={e => setNewCard({...newCard, brand: e.target.value})}>
                     <option value="VISA">Visa</option>
                     <option value="MASTERCARD">MasterCard</option>
                     <option value="AMEX">Amex</option>
                 </select>
                 <input placeholder="MM" style={inputStyle} maxLength="2" onChange={e => setNewCard({...newCard, expMonth: parseInt(e.target.value) || ''})}/>
                 <input placeholder="YYYY" style={inputStyle} maxLength="4" onChange={e => setNewCard({...newCard, expYear: parseInt(e.target.value) || ''})}/>
              </div>

              <h4 style={{marginTop:'10px'}}>Billing Address</h4>
              <input 
                placeholder="Street Address" style={inputStyle} 
                value={billingAddr.street}
                onChange={e => setBillingAddr({...billingAddr, street: e.target.value})}
              />
              <div style={{display: 'flex', gap: '10px'}}>
                <input 
                    placeholder="City" style={inputStyle} 
                    value={billingAddr.city}
                    onChange={e => setBillingAddr({...billingAddr, city: e.target.value})}
                />
                <input 
                    placeholder="State" style={inputStyle} 
                    maxLength="2"
                    value={billingAddr.state}
                    onChange={e => setBillingAddr({...billingAddr, state: e.target.value})}
                />
              </div>
              <input 
                placeholder="Zip Code" style={inputStyle} 
                value={billingAddr.zip}
                onChange={e => setBillingAddr({...billingAddr, zip: e.target.value})}
              />
            </div>
          )}

          <button 
            onClick={handlePay}
            disabled={isProcessing}
            style={{width: '100%', marginTop: '20px', padding: '15px', backgroundColor: '#cc0000', color: 'white', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: isProcessing ? 'not-allowed' : 'pointer', borderRadius: '4px'}}
          >
            {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}