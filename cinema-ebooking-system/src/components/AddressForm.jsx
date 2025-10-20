import React from 'react';

// This component receives the address state object and its setter function
export default function AddressForm({ address, setAddress }) {

  // A single handler to update the correct piece of address state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prevAddress => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  // --- STYLES ---
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
  // --- END OF STYLES ---

  return (
    <div style={addressFormStyle}>
      <label style={labelStyle}>Street Address</label>
      <input 
        style={inputStyle}
        type="text" 
        name="street"
        value={address.street} 
        onChange={handleChange}
      />
      
      <label style={labelStyle}>City</label>
      <input 
        style={inputStyle}
        type="text" 
        name="city"
        value={address.city} 
        onChange={handleChange}
      />
      
      <label style={labelStyle}>State</label>
      <input 
        style={inputStyle}
        type="text" 
        name="state"
        value={address.state} 
        onChange={handleChange}
        maxLength="2" // State abbreviations
      />
      
      <label style={labelStyle}>Zip Code</label>
      <input 
        style={inputStyle}
        type="text" 
        name="zip"
        value={address.zip} 
        onChange={handleChange}
        maxLength="5"
      />
    </div>
  );
}