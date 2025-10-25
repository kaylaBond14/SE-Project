import React, { useState } from 'react';
import AddressForm from './AddressForm.jsx'; 

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

  // Payment State 
  const [cardType, setCardType] = useState('visa');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState(''); // This will be "MM/YY"
  
  // State for billing address
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  // State to check if billing is same as home
  const [billingSameAsHome, setBillingSameAsHome] = useState(false);

  // --- FIX 1: Add the phone validation handler ---
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

  //  handleSubmit is now async and calls the API 
  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Validate payment info if it's being added
    let paymentCardPayload = null;
    if (showPayment) {
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expDate)) { // Regex for MM/YY
        alert("Please enter the expiration date in MM/YY format.");
        return;
      }

      const [month, year] = expDate.split('/');
      const formattedBillingAddress = formatAddressForAPI(
        billingSameAsHome ? homeAddress : billingAddress
      );

      if (!formattedBillingAddress) {
        alert("Please fill out the billing address completely.");
        return;
      }

      paymentCardPayload = {
        brand: cardType, // Map cardType to brand
        cardNumber: cardNumber,
        expMonth: month,
        expYear: `20${year}`, // Convert "25" to "2025"
        billingAddress: formattedBillingAddress,
      };
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

      // --- FIX 2: Corrected card payload logic ---
      card: paymentCardPayload ? [paymentCardPayload] : null, 
    };
    
    //  remove the address/payment fields if they are null
    // don't send empty objects to the backend.
    if (!registrationPayload.address) delete registrationPayload.address;
    if (!registrationPayload.card) delete registrationPayload.card; // This now works

    try { 
      console.log('Registering user with payload:', registrationPayload);
      
      // Call 'POST /api/register' endpoint
      const response = await fetch('/api/users/api/register', { 
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
  // --- END OF STYLES ---

  return (
    <div style={registrationContainerStyle}>
      <form style={registrationFormStyle} onSubmit={handleSubmit}>
        <h2 style={formTitleStyle}>Create Your Account</h2>
        
        {/* --- Required Info --- */}
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Required Information</legend>
          
          <label style={labelStyle}>First Name</label>
          <input style={inputStyle} type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          
          <label style={labelStyle}>Last Name</label>
          <input style={inputStyle} type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          
          <label style={labelStyle}>Email</label>
          <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          <label style={labelStyle}>Phone Number</label>
          {/* --- FIX 1: Use the handlePhoneChange handler --- */}
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

        {/* --- Home Address (using reusable component) --- */}
        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>Home Address</legend>
          <AddressForm address={homeAddress} setAddress={setHomeAddress} />
        </fieldset>

        {/* --- Promotions --- */}
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

        {/* --- Optional Payment --- */}
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

          {showPayment && (
            <div style={paymentDetailsStyle}>
              <label style={labelStyle}>Card Type</label>
              <select style={inputStyle} value={cardType} onChange={(e) => setCardType(e.target.value)}>
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
              </select>
              
              <label style={labelStyle}>Card Number</label>
              <input style={inputStyle} type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
              
              <label style={labelStyle}>Expiration Date (MM/YY)</label>
              {/* placeholder */}
              <input style={inputStyle} type="text" value={expDate} onChange={(e) => setExpDate(e.target.value)} placeholder="MM/YY" />
              
              <h4 style={{ margin: '1rem 0 0.5rem 0' }}>Billing Address</h4>
              <div style={formGroupCheckboxStyle}>
                <input 
                  style={checkboxInputStyle}
                  type="checkbox" 
                  id="billing-same"
                  checked={billingSameAsHome}
                  onChange={(e) => setBillingSameAsHome(e.target.checked)}
                />
                <label style={checkboxLabelStyle} htmlFor="billing-same">Billing address is same as home address.</label>
              </div>

              {/* Only show billing address form if NOT same as home */}
              {!billingSameAsHome && (
                <AddressForm address={billingAddress} setAddress={setBillingAddress} />
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