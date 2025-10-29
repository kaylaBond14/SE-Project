import React, { useState } from 'react';
import AddressForm from './AddressForm.jsx'; 

// Helper to map backend card data to the form's state
const mapBackendCardToFormState = (card) => ({
  id: card.id,       // The real database ID
  tempId: card.id,   // Use the real ID for React's key
  cardType: card.brand,
  cardNumber: '',    // For security, always start blank
  last4: card.last4, // To use as a placeholder
  expDate: `${String(card.expMonth).padStart(2, '0')}/${String(card.expYear).slice(-2)}`, // Format MM/YY
  // Assume billing address must be re-entered or is same as home
  billingAddress: { street: '', city: '', state: '', zip: '' }, 
  billingSameAsHome: true, 
});

// Helper to create a blank card (for "Add Card")
const createNewCard = () => ({
  id: null, // This is a NEW card, no database ID
  tempId: Date.now(), // A unique ID for React's key
  cardType: 'visa',
  cardNumber: '',
  last4: '', // No last4 yet
  expDate: '',
  billingAddress: { street: '', city: '', state: '', zip: '' },
  billingSameAsHome: true, // Default to true
});


export default function EditProfile({ user, onGoBack, onSave }) {
  
  // Initialize state from the 'user' prop
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone || ''); // Use default
  
  // Initialize homeAddress from user.address
  const [homeAddress, setHomeAddress] = useState(
    user.address 
    ? { 
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        zip: user.address.postalCode || '' // Map postalCode -> zip
      }
    : { street: '', city: '', state: '', zip: '' }
  );
  
  const [currentPassword, setCurrentPassword] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [wantsPromotions, setWantsPromotions] = useState(user.promoOptIn);
  
  // Payment state is now an array
  const [paymentCards, setPaymentCards] = useState(
    () => user.paymentCards ? user.paymentCards.map(mapBackendCardToFormState) : []
  );
  
  // Checkbox to show/hide the whole payment section
  const [showPayment, setShowPayment] = useState(paymentCards.length > 0); 

  // Copied from Registration.jsx
  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '');
    setPhone(digitsOnly);
  };

  // Copied from Registration.jsx
  const handleAddCard = () => {
    if (paymentCards.length < 3) {
      setPaymentCards(prevCards => [...prevCards, createNewCard()]);
    }
  };

  // Copied from Registration.jsx
  const handleRemoveCard = (tempId) => {
    setPaymentCards(prevCards => prevCards.filter(card => card.tempId !== tempId));
  };

  // Copied from Registration.jsx
  const handleCardUpdate = (tempId, field, value) => {
    setPaymentCards(prevCards =>
      prevCards.map(card =>
        card.tempId === tempId ? { ...card, [field]: value } : card
      )
    );
  };

  // Copied from Registration.jsx
  const handleCardBillingAddressUpdate = (tempId, updatedBillingAddress) => {
    setPaymentCards(prevCards =>
      prevCards.map(card =>
        card.tempId === tempId ? { ...card, billingAddress: updatedBillingAddress } : card
      )
    );
  };
  

  const handleSubmit = (e) => { 
    e.preventDefault();
    
    if (newPassword && newPassword !== confirmNewPassword) { 
      alert("New passwords don't match!"); 
      return; 
    }
    
    if (newPassword && !currentPassword) { 
      alert("Please enter your current password to change it."); 
      return; 
    }
    
    // Validate all visible payment cards
    if (showPayment) {
      for (const card of paymentCards) {
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expDate)) { // Regex for MM/YY
          alert(`Please enter a valid expiration date (MM/YY) for card ending in ${card.last4 || '...'}.`);
          return;
        }

        // A new card (id: null) requires a card number.
        // An existing card only requires a number if the user is trying to change it.
        if (card.id === null && !card.cardNumber) {
          alert("Please enter a card number for all new cards.");
          return;
        }
        
        const billingAddr = card.billingSameAsHome ? homeAddress : card.billingAddress;
        if (!billingAddr.street || !billingAddr.city || !billingAddr.state || !billingAddr.zip) {
           alert(`Please fill out the billing address for card ending in ${card.last4 || '...'}.`);
           return;
        }
      }
    }

    // This object contains ALL data from the form
    const updatedData = { 
      firstName, 
      lastName, 
      phone, 
      promoOptIn: wantsPromotions, 
      currentPassword: currentPassword, 
      newPassword: newPassword, 
      homeAddress, // App.jsx formats this for the API
      
      // Pass the whole array. Send empty array if user unchecks "showPayment"
      paymentCards: showPayment ? paymentCards : [],
    };
    
    // Send all data to App.jsx for processing
    onSave(updatedData); 
  };

  // --- STYLES ---
  // (Using styles from Registration.jsx for consistency)
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
  const inputReadOnlyStyle = { 
    ...inputStyle, 
    backgroundColor: '#4f4f4f', 
    color: '#aaa', 
    cursor: 'not-allowed', 
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
  
  // Styles copied from Registration.jsx
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
        <h2 style={formTitleStyle}>Edit Your Profile</h2>
        
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Account Details</legend>
          
          <label style={labelStyle}>Email (Cannot be changed)</label>
          <input style={inputReadOnlyStyle} type="email" value={user.email} readOnly disabled />
          
          <label style={labelStyle}>Phone</label>
          <input style={inputStyle} type="tel" value={phone} onChange={handlePhoneChange} />
          
          <label style={labelStyle}>First Name</label>
          <input style={inputStyle} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          
          <label style={labelStyle}>Last Name</label>
          <input style={inputStyle} type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </fieldset>
        
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Home Address</legend>
          <AddressForm 
            address={homeAddress} 
            setAddress={setHomeAddress} 
          />
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Change Password (Optional)</legend>
          
          <label style={labelStyle}>Current Password</label>
          <input 
            style={inputStyle} 
            type="password" 
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
            placeholder="Enter current password to change"
          /> 
          
          <label style={labelStyle}>New Password</label>
          <input style={inputStyle} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          
          <label style={labelStyle}>Confirm New Password</label>
          <input style={inputStyle} type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
        </fieldset>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Promotions</legend>
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
        </fieldset>

        {/*UPDATED PAYMENT FIELDSET (copied from Registration.jsx) */}
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Payment Information</legend>
          <div style={formGroupCheckboxStyle}>
            <input 
              style={checkboxInputStyle}
              type="checkbox" 
              id="show-payment"
              checked={showPayment}
              onChange={(e) => setShowPayment(e.target.checked)}
            />
            <label style={checkboxLabelStyle} htmlFor="show-payment">
              {user.paymentCards.length > 0 ? 'Edit payment methods' : 'Add payment methods'}
            </label>
          </div>

          {showPayment && (
            <div style={paymentDetailsStyle}>
              
              {/* Loop over the paymentCards array */}
              {paymentCards.map((card, index) => (
                <div key={card.tempId} style={cardFormContainerStyle}>
                  <div style={cardHeaderStyle}>
                    <h4 style={{ margin: 0 }}>Card {index + 1}</h4>
                    <button 
                      type="button" 
                      style={btnRemoveStyle} 
                      onClick={() => handleRemoveCard(card.tempId)}
                    >
                      Remove
                    </button>
                  </div>

                  <label style={labelStyle}>Card Type</label>
                  <select 
                    style={inputStyle} 
                    value={card.cardType} 
                    onChange={(e) => handleCardUpdate(card.tempId, 'cardType', e.target.value)}
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
                    onChange={(e) => handleCardUpdate(card.tempId, 'cardNumber', e.target.value)}
                    placeholder={card.last4 ? `•••• ${card.last4}` : 'Enter full card number'}
                  />
                  
                  <label style={labelStyle}>Expiration Date (MM/YY)</label>
                  <input 
                    style={inputStyle} 
                    type="text" 
                    value={card.expDate} 
                    onChange={(e) => handleCardUpdate(card.tempId, 'expDate', e.target.value)} 
                    placeholder="MM/YY" 
                  />
                  
                  <h4 style={{ margin: '1rem 0 0.5rem 0' }}>Billing Address</h4>
                  <div style={formGroupCheckboxStyle}>
                    <input 
                      style={checkboxInputStyle}
                      type="checkbox" 
                      id={`billing-same-${card.tempId}`}
                      checked={card.billingSameAsHome}
                      onChange={(e) => handleCardUpdate(card.tempId, 'billingSameAsHome', e.target.checked)}
                    />
                    <label style={checkboxLabelStyle} htmlFor={`billing-same-${card.tempId}`}>
                      Billing address is same as home address.
                    </label>
                  </div>

                  {!card.billingSameAsHome && (
                    <AddressForm 
                      address={card.billingAddress} 
                      setAddress={(newBillingAddr) => handleCardBillingAddressUpdate(card.tempId, newBillingAddr)} 
                    />
                  )}
                </div>
              ))}

              {/* Show "Add Another Card" button */}
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
        {/* END OF UPDATED FIELDSET */}

        <div style={formButtonsStyle}>
          <button type="submit" style={btnSubmitStyle}>Save Changes</button>
          <button type="button" style={btnBackStyle} onClick={onGoBack}>Back</button>
        </div>
      </form>
    </div>
  );
}