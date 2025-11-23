// components/SeatingChart.jsx
import React, { useState, useEffect } from 'react';

const SeatingChart = ({ 
  screeningId, 
  selectedSeats, 
  onSeatClick 
}) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gridDimensions, setGridDimensions] = useState({ rows: 0, cols: 0 });

  // --- YOUR FETCH LOGIC GOES HERE ---
  useEffect(() => {
    // Prevent fetching if ID is missing
    if (!screeningId) {
        console.error("SeatingChart: screeningId is missing!");
        setLoading(false); 
        return;
    }

    const fetchSeats = async () => {
      try {
        console.log(`Fetching seats for screening: ${screeningId}`); 
        const response = await fetch(`/api/screenings/${screeningId}/seatmap`);
        
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API Error: ${response.status} - ${text}`);
        }
        
        const data = await response.json();
        console.log("Seats loaded:", data); 
        
        // Calculate grid size dynamically based on max row/col returned
        const maxRow = Math.max(...data.map(s => s.rowNum));
        const maxCol = Math.max(...data.map(s => s.colNum));
        
        setGridDimensions({ rows: maxRow, cols: maxCol });
        setSeats(data);
      } catch (error) {
        console.error("Error loading seat map:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchSeats();
  }, [screeningId]);
  // ----------------------------------

  const handleSeatClick = (seat) => {
    if (seat.reserved) return;
    onSeatClick(seat); 
  };

  // --- STYLES ---
  const containerStyle = {
    textAlign: 'center',
    margin: '20px auto',
    maxWidth: '800px',
    overflowX: 'auto' 
  };

  const gridStyle = {
    display: 'grid',
    // Dynamically set columns based on data
    gridTemplateColumns: `repeat(${gridDimensions.cols}, 40px)`, 
    gap: '10px',
    justifyContent: 'center',
    marginTop: '20px'
  };

  const screenStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    marginBottom: '30px',
    borderRadius: '0 0 50% 50%', 
    width: '80%',
    margin: '0 auto'
  };

  if (loading) return <div style={{color:'white'}}>Loading Seat Map...</div>;

  return (
    <div style={containerStyle}>
      <div style={screenStyle}>SCREEN</div>
      
      {seats.length === 0 ? (
        <div style={{color: 'white'}}>No seats found for this screening.</div>
      ) : (
        <div style={gridStyle}>
          {seats.map(seat => {
            // Check if this specific seat object is inside the selectedSeats array
            // We compare by ID to be safe
            const isSelected = selectedSeats.some(s => s.seatId === seat.seatId);
            
            return (
              <div
                key={seat.seatId}
                onClick={() => handleSeatClick(seat)}
                style={{
                  gridColumn: seat.colNum, // API determines position
                  gridRow: seat.rowNum,
                  width: '35px',
                  height: '35px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  cursor: seat.reserved ? 'not-allowed' : 'pointer',
                  backgroundColor: seat.reserved 
                    ? '#d32f2f' // Red (Reserved)
                    : isSelected 
                      ? '#388e3c' // Green (Selected)
                      : '#e0e0e0', // Grey (Available)
                  color: isSelected || seat.reserved ? '#fff' : '#333',
                  border: isSelected ? '2px solid #1b5e20' : '1px solid #ccc'
                }}
              >
                {seat.label}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Legend */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center', color: 'white' }}>
        <span><span style={{color: '#d32f2f'}}>■</span> Reserved</span>
        <span><span style={{color: '#388e3c'}}>■</span> Selected</span>
        <span><span style={{color: '#e0e0e0'}}>■</span> Available</span>
      </div>
    </div>
  );
};

// THIS IS THE LINE THAT FIXES YOUR ERROR:
export default SeatingChart;