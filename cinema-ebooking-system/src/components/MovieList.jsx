import React from "react";
import MovieCard from "./MovieCard.jsx";

export default function MovieList({ movies }) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '1rem',
  };

  return (
    <div style={gridStyle}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}