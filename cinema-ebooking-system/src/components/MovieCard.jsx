import React from "react";

export default function MovieCard({ movie }) {
  const cardStyle = {
    border: '1px solid #e5e7eb',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
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
  };

  return (
    <div style={cardStyle}>
      <img src={movie.posterUrl} alt={movie.title} style={posterStyle} />
      <h2 style={titleStyle}>{movie.title}</h2>
      <p>{movie.genre} | {movie.rating}</p>
      <p>Showtimes: 2:00 PM, 5:00 PM, 8:00 PM</p>
    </div>
  );
}