// TicketSelection.jsx
import React, { useState, useMemo } from 'react';

// Hardcoded prices 
const TICKET_PRICES = {
  child: 10,
  adult: 15,
  senior: 12,
};

// Styles for this component
const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    color: '#333',
    maxWidth: '600px',
    width: '90%',
    margin: '20px auto',
    textAlign: 'center',
  },
  heading: { color: '#333', marginBottom: '20px' },
  summary: { fontSize: '1.2em', margin: '20px 0' },
  seatList: {
    listStyle: 'none',
    padding: '0',
    margin: '10px 0 20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '8px',
    color: '#555'
  },
  seatItem: {
    backgroundColor: '#eee',
    padding: '5px 10px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  ticketRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #eee'
  },
  ticketType: { fontSize: '1.1em', fontWeight: 'bold' },
  ticketPrice: { fontSize: '1em', color: '#555' },
  controls: { display: 'flex', alignItems: 'center', gap: '10px' },
  controlButton: {
    width: '30px',
    height: '30px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    border: '1px solid #ccc',
    borderRadius: '50%',
    backgroundColor: '#f4f4f4',
    cursor: 'pointer'
  },
  count: { fontSize: '1.2em', minWidth: '25px' },
  totalSummary: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    fontSize: '1.3em',
    fontWeight: 'bold'
  },
  checkoutButton: {
    padding: '1rem 2rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    backgroundColor: '#cc0000',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    marginTop: '2rem',
  },
  disabledButton: {
    backgroundColor: '#aaa',
    cursor: 'not-allowed'
  },
  backButton: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: '1px solid #ccc',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    marginRight: '1rem',
    marginBottom: '20px'
  }
};

const TicketSelection = ({ selectedSeats, onGoBack, onCheckout }) => {
  const [counts, setCounts] = useState({
    child: 0,
    adult: 0,
    senior: 0,
  });

  const totalSeats = selectedSeats.length;
  const totalSelectedTickets = counts.child + counts.adult + counts.senior;

  // Calculate if the user has reached the seat limit
  const isAtLimit = totalSelectedTickets >= totalSeats;
  
  // Calculate if the user has assigned all seats
  const isSelectionComplete = totalSelectedTickets === totalSeats;

  // Calculate total price using useMemo to avoid recalculating on every render
  const totalPrice = useMemo(() => {
    return (
      counts.child * TICKET_PRICES.child +
      counts.adult * TICKET_PRICES.adult +
      counts.senior * TICKET_PRICES.senior
    );
  }, [counts]);

  // Handler to increase a ticket type count
  const handleIncrement = (type) => {
    if (!isAtLimit) {
      setCounts((prevCounts) => ({
        ...prevCounts,
        [type]: prevCounts[type] + 1,
      }));
    }
  };

  // Handler to decrease a ticket type count
  const handleDecrement = (type) => {
    if (counts[type] > 0) {
      setCounts((prevCounts) => ({
        ...prevCounts,
        [type]: prevCounts[type] - 1,
      }));
    }
  };

  // Helper component for each ticket row
  const TicketCounter = ({ type, name, age, price }) => (
    <div style={styles.ticketRow}>
      <div>
        <div style={styles.ticketType}>{name}</div>
        <div style={styles.ticketPrice}>{age} (${price.toFixed(2)})</div>
      </div>
      <div style={styles.controls}>
        <button
          style={styles.controlButton}
          onClick={() => handleDecrement(type)}
          disabled={counts[type] === 0}
        >
          -
        </button>
        <span style={styles.count}>{counts[type]}</span>
        <button
          style={styles.controlButton}
          onClick={() => handleIncrement(type)}
          disabled={isAtLimit}
        >
          +
        </button>
      </div>
    </div>
  );
  
  return (
    <div style={styles.container}>
      <button onClick={onGoBack} style={styles.backButton}>Back to Seats</button>
      <h1 style={styles.heading}>Select Ticket Types</h1>
      
      <p style={styles.summary}>
        You have selected {totalSeats} seats. 
        Please select a ticket type for each seat.
      </p>
      
      <ul style={styles.seatList}>
        {selectedSeats.map(seat => <li key={seat} style={styles.seatItem}>{seat}</li>)}
      </ul>
      
      <div>
        <TicketCounter 
          type="child" 
          name="Child" 
          age="Ages 2-17" 
          price={TICKET_PRICES.child} 
        />
        <TicketCounter 
          type="adult" 
          name="Adult" 
          age="Ages 18-59" 
          price={TICKET_PRICES.adult} 
        />
        <TicketCounter 
          type="senior" 
          name="Senior" 
          age="Ages 60+" 
          price={TICKET_PRICES.senior} 
        />
      </div>
      
      <div style={styles.totalSummary}>
        <div>Total Tickets: {totalSelectedTickets} / {totalSeats}</div>
        <div>Total Price: ${totalPrice.toFixed(2)}</div>
      </div>
      
      <button
        style={
          isSelectionComplete && totalSeats > 0
            ? styles.checkoutButton
            : { ...styles.checkoutButton, ...styles.disabledButton }
        }
        onClick={onCheckout}
        disabled={!isSelectionComplete || totalSeats === 0} // This is the logic you wanted
      >
        Checkout
      </button>
    </div>
  );
};

export default TicketSelection;