import React, { useState, useEffect } from 'react';
import MovieCard from "./MovieCard.jsx";

// Hardcoded movie data to simulate a database.
// This data will be replaced by a backend API call in a later sprint.
const allMovies = fetch(VITE_API_URL + '/api/movies');

export default function Home({ onMovieSelect }) {
  // State to hold all movies and a filtered list of movies.
  const [filteredMovies, setFilteredMovies] = useState(allMovies);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  // The useEffect hook runs whenever searchTerm or genreFilter changes.
  // It re-filters the movie list to match the search and filter criteria.
  useEffect(() => {
    let filtered = allMovies;
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (genreFilter) {
      filtered = filtered.filter(movie => movie.genre === genreFilter);
    }
    setFilteredMovies(filtered);
  }, [searchTerm, genreFilter]);

  // Separate the filtered movies into 'Currently Running' and 'Coming Soon'.
  const currentlyRunning = filteredMovies.filter(movie => !movie.isComingSoon);
  const comingSoon = filteredMovies.filter(movie => movie.isComingSoon);

  // Event handlers for the search and filter inputs.
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleGenreChange = (e) => setGenreFilter(e.target.value);

  // Dynamically create a list of all available genres for the dropdown.
  const availableGenres = [...new Set(allMovies.map(movie => movie.genre))];

  // Inline styles for the component's layout.
  const containerStyle = { padding: '1.5rem' };
  const headingStyle = { fontSize: '1.875rem', fontWeight: '700', marginBottom: '1rem' };
  const searchFilterContainerStyle = { display: 'flex', gap: '1rem', marginBottom: '1rem' };
  const inputStyle = { padding: '0.5rem', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' };
  const selectStyle = { padding: '0.5rem', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Currently Running</h1>
      {/* Search and Filter UI */}
      <div style={searchFilterContainerStyle}>
        <input
          type="text"
          placeholder="Search by title..."
          onChange={handleSearchChange}
          style={inputStyle}
        />
        <select onChange={handleGenreChange} style={selectStyle}>
          <option value="">All Genres</option>
          {availableGenres.map(genre => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
      </div>

      {/* Grid for currently running movies */}
      <div style={gridStyle}>
        {currentlyRunning.map((movie) => (
          // When a MovieCard is clicked, the onMovieSelect function from App.jsx is called.
          <MovieCard key={movie.id} movie={movie} onMovieSelect={onMovieSelect} />
        ))}
      </div>
      
      <h1 style={headingStyle}>Coming Soon</h1>
      {/* Grid for coming soon movies */}
      <div style={gridStyle}>
        {comingSoon.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onMovieSelect={onMovieSelect} />
        ))}
      </div>
    </div>
  );
}