import React from 'react';

// Accept a new prop, 'readOnly', with a default value of false
export default function AddressForm({ address, setAddress, readOnly = false }) {

 const handleChange = (e) => {
    // If it's read-only, do nothing on change
    if (readOnly) return; 
    
    const { name, value } = e.target;

    // We build the new address object ourselves
    // We use the 'address' prop as the base
    const newAddress = {
      ...address,
      [name]: value,
    };
    
    // Call setAddress with the new object, NOT a function
    setAddress(newAddress);
  };

  // Styles
  const addressFormStyle = {
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
  
  // Add a new style for read-only inputs
  const inputReadOnlyStyle = {
    ...inputStyle,
    backgroundColor: '#4f4f4f',
    color: '#aaa',
    cursor: 'not-allowed',
  };
  
  //  Decide which style to use
  const activeInputStyle = readOnly ? inputReadOnlyStyle : inputStyle;
  // End of styles

  return (
    <div style={addressFormStyle}>
      <label style={labelStyle}>Street Address</label>
      <input 
        style={activeInputStyle} //  Use the active style
        type="text" 
        name="street"
        value={address.street || ''} 
        onChange={handleChange}
        readOnly={readOnly} // Add the readOnly HTML attribute
        disabled={readOnly} // Add disabled to prevent focus/clicks
      />
      
      <label style={labelStyle}>City</label>
      <input 
        style={activeInputStyle}
        type="text" 
        name="city"
        value={address.city || ''} 
        onChange={handleChange}
        readOnly={readOnly}
        disabled={readOnly}
      />
      
      <label style={labelStyle}>State</label>
      <input 
        style={activeInputStyle}
        type="text" 
        name="state"
        value={address.state || ''} 
        onChange={handleChange}
        maxLength="2"
        readOnly={readOnly}
        disabled={readOnly}
      />
      
      <label style={labelStyle}>Zip Code</label>
      <input 
        style={activeInputStyle}
        type="text" 
        name="zip"
        value={address.zip || ''} 
        onChange={handleChange}
        maxLength="5"
        readOnly={readOnly}
        disabled={readOnly}
      />
    </div>
  );
}