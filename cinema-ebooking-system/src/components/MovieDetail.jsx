import React, { useState, useEffect } from 'react';

export default function MovieDetail({ movie, onShowtimeSelect, onGoBack }) {
  const [screeningOptions, setScreeningOptions] = useState([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(true);

  // 1. MODIFY THE EFFECT: Only fetch if the movie is NOT coming soon
  useEffect(() => {
    // Safety check + Business Logic Check
    if (movie?.id && !movie.isComingSoon) {
      setIsLoadingTimes(true);
      fetch(`/api/movies/${movie.id}/screening-options`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch showtimes");
          return res.json();
        })
        .then(data => {
          setScreeningOptions(data);
          setIsLoadingTimes(false);
        })
        .catch(err => {
          console.error(err);
          setIsLoadingTimes(false);
        });
    } else {
      // If it IS coming soon, ensure we aren't loading anything
      setIsLoadingTimes(false);
    }
  }, [movie]);

  if (!movie) return <div>Loading...</div>;

  const getYouTubeId = (url) => {
    if (!url) return null;
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const videoId = getYouTubeId(movie.trailerUrl);

  const containerStyle = { padding: '1.5rem', color: 'white' };
  const flexContainer = { display: 'flex', gap: '2rem', flexWrap: 'wrap' };
  const posterStyle = { width: '300px', height: 'auto' };
  const detailStyle = { flexGrow: 1 };
  const titleStyle = { fontSize: '2.25rem', fontWeight: 'bold', color: '#cc0000' };
  const pStyle = { color: '#aaa' };
  
  const showtimeButtonStyle = {
    padding: '0.8rem 1.2rem',
    marginRight: '0.8rem',
    marginBottom: '0.8rem',
    border: '1px solid #cc0000',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#1a1a1a',
    color: 'white',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <button onClick={onGoBack} style={{ marginBottom: '1rem', padding: '0.5rem' }}>Back to Home</button>
      
      <div style={flexContainer}>
        <img src={movie.posterUrl} alt={movie.title} style={posterStyle} />
        
        <div style={detailStyle}>
          <h1 style={titleStyle}>{movie.title}</h1>
          <p style={pStyle}><strong>Rating:</strong> {movie.rating}</p>
          <p style={pStyle}><strong>Genre:</strong> {movie.genres?.join(', ')}</p>
          <p style={pStyle}><strong>Description:</strong> {movie.description}</p>
          
          {/* 2. LOGIC CHANGE: Check isComingSoon flag for the UI */}
          {movie.isComingSoon ? (
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              backgroundColor: '#333', 
              borderLeft: '5px solid #cc0000',
              fontSize: '1.2rem'
            }}>
              <h3>Coming Soon</h3>
              <p>Tickets are not yet available for this movie.</p>
            </div>
          ) : (
            <>
              <h3>Select a Showtime:</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {isLoadingTimes && <p>Loading showtimes...</p>}
                
                {!isLoadingTimes && screeningOptions.length === 0 && (
                   <p style={{color: '#aaa'}}>No upcoming showtimes scheduled.</p>
                )}

                {screeningOptions.map((option) => (
                  <button
                    key={option.id}
                    style={showtimeButtonStyle}
                    onClick={() => onShowtimeSelect(option)} 
                  >
                    <div style={{fontWeight:'bold'}}>{option.time}</div>
                    <div style={{fontSize: '0.8em', color: '#ccc'}}>{option.date}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {videoId && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Trailer</h3>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={`${movie.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}