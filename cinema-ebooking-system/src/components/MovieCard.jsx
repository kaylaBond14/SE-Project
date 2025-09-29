import React from 'react';

export default function MovieCard({ movie, onMovieSelect }) {
  // Inline styles for the card.
  const cardStyle = {
    border: '1px solid #444',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    backgroundColor: '#1a1a1a', // Card background color
    cursor: 'pointer',
  };

  const posterStyle = {
    width: '100%',
    height: '16rem',
    objectFit: 'cover',
  };

  const titleStyle = {
    fontSize: '1.125rem',
    fontWeight: '700',
    marginTop: '0.5rem',
    color: '#cc0000', // Red accent
  };

  const pStyle = {
    color: '#aaa',
  };

  return (
    // The onClick handler triggers the onMovieSelect function to navigate.
    <div style={cardStyle} onClick={() => onMovieSelect(movie)}>
      <img src={movie.posterUrl} alt={movie.title} style={posterStyle} />
      <h2 style={titleStyle}>{movie.title}</h2>
      <p style={pStyle}>{movie.genres?.join(', ')} | {movie.rating}</p>
      <p style={pStyle}>Showtimes: {movie.showtimes.join(', ')}</p>
    </div>
  );
}