import React from "react";
import MovieList from "./MovieList";

export default function HomePage() {
  const movies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      genre: "Action",
      rating: "PG-13",
      posterUrl: "https://example.com/avengers.jpg",
    },
    {
      id: 2,
      title: "The Lion King",
      genre: "Animation",
      rating: "G",
      posterUrl: "https://example.com/lionking.jpg",
    },
  ];

  const containerStyle = {
    padding: '1.5rem',
  };

  const headingStyle = {
    fontSize: '1.875rem',
    fontWeight: '700',
    marginBottom: '1rem',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Currently Running</h1>
      <MovieList movies={movies} />
    </div>
  );
}