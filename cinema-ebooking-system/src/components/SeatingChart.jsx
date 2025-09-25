import React, { useState } from 'react';

// This is the main component for the seating chart.
// It receives props for the number of rows, columns, and a list of occupied seats.
const SeatingChart = ({ rows = 8, cols = 10, occupiedSeats = [] }) => {

  // useState is a React Hook that lets you add state to a functional component.
  // selectedSeats is the state variable, and setSelectedSeats is the function to update it.
  // The state is initialized as an empty array.
  const [selectedSeats, setSelectedSeats] = useState([]);

  // This function handles the click event on a seat.
  const handleSeatClick = (seat) => {
    // If the seat is occupied, do nothing and exit the function.
    if (occupiedSeats.includes(seat)) return;

    // Check if the clicked seat is already in the selectedSeats array.
    setSelectedSeats(
      selectedSeats.includes(seat)
        ? // If it is, filter it out to deselect it.
        selectedSeats.filter(s => s !== seat)
        : // If it's not, add it to the array to select it.
        [...selectedSeats, seat]
    );
  };

  // This helper function generates a user-friendly seat name like "A1", "B2", etc.
  const generateSeatName = (row, col) => {
    const rowLetter = String.fromCharCode(65 + row); // 65 is the ASCII code for 'A'
    return `${rowLetter}${col + 1}`;
  };

  // This function renders the seats by looping through rows and columns.
  const renderSeats = () => {
    const seats = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const seatName = generateSeatName(i, j);
        const isSelected = selectedSeats.includes(seatName);
        const isOccupied = occupiedSeats.includes(seatName);

        // Define a base style object for a seat.
        const seatStyle = {
          width: '30px',
          height: '30px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '0.8em',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          userSelect: 'none',
          backgroundColor: '#e0e0e0',
          borderColor: '#bbb',
          color: '#333'
        };

        // Modify the style object based on the seat's state (selected or occupied).
        if (isSelected) {
          // Object.assign merges the new styles into the existing style object.
          Object.assign(seatStyle, {
            backgroundColor: '#4CAF50', // Green for selected
            borderColor: '#388E3C',
            color: '#fff'
          });
        } else if (isOccupied) {
          Object.assign(seatStyle, {
            backgroundColor: '#f44336', // Red for occupied
            borderColor: '#D32F2F',
            color: '#fff',
            cursor: 'not-allowed',
            opacity: '0.6'
          });
        }

        // Push the seat element with its dynamic style and click handler to the array.
        seats.push(
          <div
            key={seatName} // A unique key is required for each element in a list in React.
            style={seatStyle}
            onClick={() => handleSeatClick(seatName)}
          >
            {seatName}
          </div>
        );
      }
    }
    return seats;
  };

  // Define styles for the main container and other UI elements.
  const containerStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '600px',
    width: '90%',
    margin: '20px auto'
  };

  const headingStyle = { color: '#333', marginBottom: '20px' };
  
  const screenStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '15px 0',
    marginBottom: '30px',
    borderRadius: '5px',
    fontSize: '1.2em',
    fontWeight: 'bold'
  };

  const seatingChartStyle = {
    display: 'grid',
    gap: '10px',
    marginBottom: '20px',
    justifyContent: 'center',
    gridTemplateColumns: `repeat(${cols}, 1fr)` // Dynamically sets the number of columns
  };

  const legendStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
    fontSize: '0.9em',
    color: '#555'
  };

  const summaryStyle = {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee'
  };
  
  const selectedListStyle = {
    listStyle: 'none',
    padding: '0',
    margin: '10px 0',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '5px'
  };

  // Helper styles for the legend and list items.
  const listSeatStyle = {
    width: '20px',
    height: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    cursor: 'default'
  };
  
  const getLegendSeatStyle = (color, borderColor) => ({
    ...listSeatStyle, // Use the spread operator to inherit base styles.
    backgroundColor: color,
    borderColor: borderColor
  });

  return (
    // The main JSX structure of the component.
    <div style={containerStyle}>
      <h1 style={headingStyle}>Select Your Seats</h1>
      <div style={screenStyle}>Screen</div>
      <div style={seatingChartStyle}>
        {renderSeats()} {/* Call the function to render the seat grid */}
      </div>

      <div style={legendStyle}>
        {/* Legend for seat status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={getLegendSeatStyle('#e0e0e0', '#bbb')}></div> Available
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={getLegendSeatStyle('#4CAF50', '#388E3C')}></div> Selected
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={getLegendSeatStyle('#f44336', '#D32F2F')}></div> Occupied
        </div>
      </div>

      <div style={summaryStyle}>
        <h2>Your Selection:</h2>
        <ul style={selectedListStyle}>
          {/* Map over the selectedSeats state to display the list */}
          {selectedSeats.map(seat => (
            <li key={seat}>{seat}</li>
          ))}
        </ul>
        <p>Total Selected: <span>{selectedSeats.length}</span> seats</p>
      </div>
    </div>
  );
};

// Export the component so it can be used in other files (like Booking.jsx).
export default SeatingChart;