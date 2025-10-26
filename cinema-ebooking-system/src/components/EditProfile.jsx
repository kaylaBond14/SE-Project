import React, { useState } from 'react';
import AddressForm from './AddressForm.jsx'; 

export default function EditProfile({ user, onGoBack, onSave }) {
  
  // Initialize state from the 'user' prop
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phone, setPhone] = useState(user.phone);
  
  const [homeAddress, setHomeAddress] = useState(user.homeAddress || { street: '', city: '', state: '', zip: '' });
  
  const [currentPassword, setCurrentPassword] = useState(''); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [wantsPromotions, setWantsPromotions] = useState(user.promoOptIn);
  
  // Payment state
  const [showPayment, setShowPayment] = useState(!!user.paymentInfo); 
  const [cardType, setCardType] = useState(user.paymentInfo?.cardType || 'visa');
  const [cardNumber, setCardNumber] = useState(user.paymentInfo?.cardNumber || '');
  const [expDate, setExpDate] = useState(user.paymentInfo?.expDate || '');
  
  // Billing address state
  const [billingAddress, setBillingAddress] = useState(user.paymentInfo?.billingAddress || {
    street: '', city: '', state: '', zip: '',
  });


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

    // This object contains ALL data from the form
    const updatedData = { 
      firstName, 
      lastName, 
      phone, 
      promoOptIn: wantsPromotions, 
      currentPassword: currentPassword, 
      newPassword: newPassword, 
      homeAddress, 
      paymentInfo: showPayment ? { 
        cardType, 
        cardNumber, 
        expDate, 
        billingAddress: billingAddress, 
      } : null,  
    };
    
    // Send all data to App.jsx for processing
    onSave(updatedData); 
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
          <input style={inputStyle} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          
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
            readOnly={false}
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
            <label style={checkboxLabelStyle} htmlFor="show-payment">Update payment method?</label>
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
              <input style={inputStyle} type="text" value={expDate} onChange={(e) => setExpDate(e.target.value)} placeholder="MM/YY" />
              
              <h4 style={{ margin: '1rem 0 0.5rem 0' }}>Billing Address</h4>
              <AddressForm 
                address={billingAddress} 
                setAddress={setBillingAddress} 
                readOnly={false}
              />
            </div>
          )}
        </fieldset>

        <div style={formButtonsStyle}>
          <button type="submit" style={btnSubmitStyle}>Save Changes</button>
          <button type="button" style={btnBackStyle} onClick={onGoBack}>Back</button>
        </div>
      </form>
    </div>
  );
}

