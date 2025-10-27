import React, { useState } from 'react';
import AddressForm from './AddressForm.jsx'; 

// This is the default "empty" state for a new card
const createNewCard = () => ({
  id: Date.now(), // A unique ID for React's key
  cardType: 'visa',
  cardNumber: '',
  expDate: '',
  billingAddress: { street: '', city: '', state: '', zip: '' },
  billingSameAsHome: false,
});

export default function Registration({ onGoBack }) {
  // State for required fields
  const [firstName, setFirstName] = useState(''); 
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State for home address
  const [homeAddress, setHomeAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  // State for promotions checkbox
  const [wantsPromotions, setWantsPromotions] = useState(false);
  
  // State to show/hide optional payment
  const [showPayment, setShowPayment] = useState(false);

  // Payment State (These are no longer used, replaced by paymentCards array)
  // const [cardType, setCardType] = useState('visa');
  // const [cardNumber, setCardNumber] = useState('');
  // const [expDate, setExpDate] = useState(''); // This will be "MM/YY"
  
  // State for billing address (This is no longer used, replaced by billingAddress inside each card)
  // const [billingAddress, setBillingAddress] = useState({
  //   street: '',
  //   city: '',
  //   state: '',
  //   zip: '',
  // });
  // State to check if billing is same as home (This is no longer used)
  // const [billingSameAsHome, setBillingSameAsHome] = useState(false);

  // This state IS used for the multi-card form
  const [paymentCards, setPaymentCards] = useState([]);
  
  
  const handlePhoneChange = (e) => {
    // This removes any character that is not a digit
    const digitsOnly = e.target.value.replace(/\D/g, '');
    setPhone(digitsOnly);
  };

  //Helper function to format address for the API
  const formatAddressForAPI = (addr) => {
    if (!addr.street || !addr.city || !addr.state || !addr.zip) {
      return null; // Don't send incomplete address
    }
    return {
      label: "Home",
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.zip, // Map zip to postalCode
     country: "USA", 
    };
  };

  // Adds a new, empty card form to the UI
  const handleAddCard = () => {
    if (paymentCards.length < 3) {
      setPaymentCards(prevCards => [...prevCards, createNewCard()]);
    }
  };

  // Removes a card form by its unique ID
  const handleRemoveCard = (id) => {
    setPaymentCards(prevCards => prevCards.filter(card => card.id !== id));
  };

  // Updates a field on a specific card (e.g., cardNumber, expDate)
  const handleCardUpdate = (id, field, value) => {
    setPaymentCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  // Special handler to update the nested billingAddress object for a card
  const handleCardBillingAddressUpdate = (id, updatedBillingAddress) => {
    setPaymentCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, billingAddress: updatedBillingAddress } : card
      )
    );
  };
  

  //  handleSubmit is now async and calls the API 
  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

     // Validate payment info if it's being added
    let paymentCardPayloads = []; // This is now an array
    if (showPayment && paymentCards.length > 0) {
      
      for (const card of paymentCards) {
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expDate)) { // Regex for MM/YY
          alert(`Please enter a valid expiration date (MM/YY) for card ending in ${card.cardNumber.slice(-4)}.`);
          return;
        }

        // Add validation for card number (must be at least 4 digits to get last4)
        if (card.cardNumber.length < 4) {
          alert("Please enter a valid card number for all cards.");
          return;
        }

        const [month, year] = card.expDate.split('/');
        
        // This validates the billing address but doesn't send it, per your setup
        const formattedBillingAddress = formatAddressForAPI(
          card.billingSameAsHome ? homeAddress : card.billingAddress
        );

        if (!formattedBillingAddress) {
          alert(`Please fill out the billing address completely for card ending in ${card.cardNumber.slice(-4)}.`);
          return;
        }

        // Get last4 from the card number
        const last4 = card.cardNumber.slice(-4);
        
        const payload = {
          brand: card.cardType,
          last4: last4,                     // DTO expects 'last4'
          expMonth: parseInt(month),        // DTO expects 'int'
          expYear: parseInt(`20${year}`),   // DTO expects 'int'
          billingAddrId: null,              // DTO expects 'Long billingAddrId' (null is ok)
          token: card.cardNumber            // DTO expects 'token' (the full PAN)
        };
        
        paymentCardPayloads.push(payload); // Add this card's payload to the array
      }
    }
    
    
    // This is the payload 'RegisterRequest' DTO is expecting
    const registrationPayload = {
      firstName,
      lastName,
      email,
      phone,
      password,
      promoOptIn: wantsPromotions,
      
      // Send formatted address (will be null if not filled)
      address: formatAddressForAPI(homeAddress),


      // Send the entire array of card payloads
      cards: paymentCardPayloads.length > 0 ? paymentCardPayloads : null, 
     
    };
    
    //  remove the address/payment fields if they are null
    // don't send empty objects to the backend.
    if (!registrationPayload.address) delete registrationPayload.address;
    if (!registrationPayload.cards) delete registrationPayload.cards; 

    try { 
      console.log('Registering user with payload:', registrationPayload);
      
      // Call 'POST /api/register' endpoint
      const response = await fetch('/api/users/register', { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
        }, 
        body: JSON.stringify(registrationPayload), 
      }); 

      if (response.status === 201) { 
        // Success!
        alert('Registration successful! Please check your email to verify your account.'); 
        onGoBack(); // Go back to the home page
      } else { 
        // Handle errors from the server (e.g., "Email already in use")
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed.');
      } 

    } catch (error) { 
      console.error('Registration Error:', error); 
      alert(`Registration failed: ${error.message}`); 
    } 
  };

  // --- STYLES ---
  const registrationContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  };
  const registrationFormStyle = {
    backgroundColor: '#3a3a3a',
    padding: '2rem',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };
  const formTitleStyle = {
    textAlign: 'center',
    marginTop: 0,
  };
  const fieldsetStyle = {
    border: '1px solid #555',
    borderRadius: '4px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };
   const legendStyle = {
    padding: '0 0.5rem',
    color: '#c7c7c7',
  };
  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '-5px',
  };
  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #777',
    backgroundColor: '#2c2c2c',
    color: 'white',
    borderRadius: '4px',
    boxSizing: 'border-box',
  };
  const formGroupCheckboxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };
  const checkboxInputStyle = {
    width: '16px',
    height: '16px',
  };
  const checkboxLabelStyle = {
    fontWeight: 'normal',
    margin: 0,
  };
  const paymentDetailsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px dashed #555',
  };
  const formButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  };
  const btnSubmitStyle = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#646cff',
    color: 'white',
  };
  const btnBackStyle = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#555',
    color: 'white',
  };
  
  // New styles for the card forms
  const cardFormContainerStyle = {
    border: '1px solid #777',
    borderRadius: '4px',
    padding: '1rem',
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: '0.5rem'
  };

  const btnRemoveStyle = {
    backgroundColor: '#8b0000',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    cursor: 'pointer',
    fontSize: '0.8rem'
  };

  const btnAddStyle = {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#444',
    color: 'white',
    marginTop: '1rem',
    alignSelf: 'flex-start'
  };
 
  // --- END OF STYLES ---

  return (
    <div style={registrationContainerStyle}>
      <form style={registrationFormStyle} onSubmit={handleSubmit}>
        <h2 style={formTitleStyle}>Create Your Account</h2>
        
        {/* Required Info */}
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Required Information</legend>
          
          <label style={labelStyle}>First Name</label>
          <input style={inputStyle} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          
          <label style={labelStyle}>Last Name</label>
          <input style={inputStyle} type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          
          <label style={labelStyle}>Email</label>
          <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          <label style={labelStyle}>Phone Number</label>
          {/* Use the handlePhoneChange handler */}
          <input 
            style={inputStyle} 
            type="tel" 
            value={phone} 
            onChange={handlePhoneChange} 
            required 
          />
          
          <label style={labelStyle}>Password</label>
          <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          <label style={labelStyle}>Confirm Password</label>
          <input style={inputStyle} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </fieldset>

        {/* Home Address (using reusable component) */}
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Home Address</legend>
          <AddressForm address={homeAddress} setAddress={setHomeAddress} />
        </fieldset>

        {/* Promotions */}
        <div style={formGroupCheckboxStyle}>
          <input 
            style={checkboxInputStyle}
            type="checkbox" 
            id="promotions"
            checked={wantsPromotions} 
            onChange={(e) => setWantsPromotions(e.target.checked)} 
          />
          <label style={checkboxLabelStyle} htmlFor="promotions">Yes, I want to receive promotions and special offers.</label>
        </div>

        {/* Optional Payment */}
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Optional: Payment Information</legend>
          <div style={formGroupCheckboxStyle}>
            <input 
              style={checkboxInputStyle}
              type="checkbox" 
              id="show-payment"
              checked={showPayment}
              onChange={(e) => setShowPayment(e.target.checked)}
            />
            <label style={checkboxLabelStyle} htmlFor="show-payment">Add a payment method now?</label>
          </div>

          {/* This block is now completely changed to render a list */}
          {showPayment && (
            <div style={paymentDetailsStyle}>
              
              {/* Loop over the paymentCards array and render a form for each */}
              {paymentCards.map((card, index) => (
                <div key={card.id} style={cardFormContainerStyle}>
                  <div style={cardHeaderStyle}>
                    <h4 style={{ margin: 0 }}>Card {index + 1}</h4>
                    <button 
                      type="button" 
                      style={btnRemoveStyle} 
                      onClick={() => handleRemoveCard(card.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <label style={labelStyle}>Card Type</label>
                  <select 
                    style={inputStyle} 
                    value={card.cardType} 
                    onChange={(e) => handleCardUpdate(card.id, 'cardType', e.target.value)}
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                  </select>
                  
                  <label style={labelStyle}>Card Number</label>
                  <input 
                    style={inputStyle} 
                    type="text" 
                    value={card.cardNumber} 
                    onChange={(e) => handleCardUpdate(card.id, 'cardNumber', e.target.value)}
                  />
                  
                  <label style={labelStyle}>Expiration Date (MM/YY)</label>
                  {/* placeholder */}
                  <input 
                    style={inputStyle} 
                    type="text" 
                    value={card.expDate} 
                    onChange={(e) => handleCardUpdate(card.id, 'expDate', e.target.value)} 
                    placeholder="MM/YY" 
                  />
                  
                  <h4 style={{ margin: '1rem 0 0.5rem 0' }}>Billing Address</h4>
                  <div style={formGroupCheckboxStyle}>
                    <input 
                      style={checkboxInputStyle}
                      type="checkbox" 
                      id={`billing-same-${card.id}`}
                      checked={card.billingSameAsHome}
                      onChange={(e) => handleCardUpdate(card.id, 'billingSameAsHome', e.target.checked)}
                    />
                    <label style={checkboxLabelStyle} htmlFor={`billing-same-${card.id}`}>
                      Billing address is same as home address.
                    </label>
                  </div>

                  {/* Only show billing address form if NOT same as home */}
                  {!card.billingSameAsHome && (
                    <AddressForm 
                      address={card.billingAddress} 
                      setAddress={(newBillingAddr) => handleCardBillingAddressUpdate(card.id, newBillingAddr)} 
                    />
                  )}
                </div>
              ))}

              {/* Show "Add Another Card" button if less than 3 cards */}
              {paymentCards.length < 3 && (
                <button 
                  type="button" 
                  style={btnAddStyle} 
                  onClick={handleAddCard}
                >
                  {paymentCards.length === 0 ? 'Add Card' : 'Add Another Card'}
                </button>
              )}
            </div>
          )}
        </fieldset>

        {/*Form Buttons */}
        <div style={formButtonsStyle}>
          <button type="submit" style={btnSubmitStyle}>Create Account</button>
          <button type="button" style={btnBackStyle} onClick={onGoBack}>Back</button>
        </div>
      </form>
    </div>
  );
}