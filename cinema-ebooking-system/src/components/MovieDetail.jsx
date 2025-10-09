import React from 'react';

export default function MovieDetail({ movie, onShowtimeSelect, onGoBack }) {
  // A check to prevent errors if the movie data is not available yet.
  if (!movie) {
    return <div>Loading...</div>;
  }

  // Helper function to extract the YouTube video ID from a URL.
  const getYouTubeId = (url) => {
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const videoId = getYouTubeId(movie.trailerUrl);

  // Inline styles for the component's layout.
  const containerStyle = { padding: '1.5rem' };
  const flexContainer = { display: 'flex', gap: '2rem', flexWrap: 'wrap' };
  const posterStyle = { width: '300px', height: 'auto' };
  const detailStyle = { flexGrow: 1 };
  const titleStyle = { fontSize: '2.25rem', fontWeight: 'bold', color: '#cc0000' };
  const pStyle = { color: '#aaa' };
  const showtimeButtonStyle = {
    padding: '0.5rem',
    marginRight: '0.5rem',
    border: '1px solid #cc0000',
    cursor: 'pointer',
    backgroundColor: '#1a1a1a',
    color: 'white',
  };
  const trailerContainerStyle = { marginTop: '2rem' };

  return (
    <div style={containerStyle}>
      {/* Button to navigate back to the home page */}
      <button onClick={onGoBack} style={{ marginBottom: '1rem', padding: '0.5rem' }}>Back to Home</button>
      <div style={flexContainer}>
        <img src={movie.posterUrl} alt={movie.title} style={posterStyle} />
        <div style={detailStyle}>
          <h1 style={titleStyle}>{movie.title}</h1>
          <p style={pStyle}><strong>Rating:</strong> {movie.rating}</p>
          <p style={pStyle}><strong>Genre:</strong> {movie.genres?.join(', ')}</p>
          <p style={pStyle}><strong>Description:</strong> {movie.description}</p>
          <h3>Showtimes:</h3>
          <div>
            {/* Renders a button for each showtime */}
            {movie.showtimes.map((showtime) => (
              <button
                key={showtime}
                style={showtimeButtonStyle}
                onClick={() => onShowtimeSelect(showtime)}
              >
                {showtime}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Renders the YouTube trailer iframe if a video ID is found */}
      {videoId && (
        <div style={trailerContainerStyle}>
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