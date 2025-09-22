import React, { useState, useEffect } from 'react';
import MovieCard from "./MovieCard.jsx";

// Hardcoded movie data to simulate a database.
// This data will be replaced by a backend API call in a later sprint.
const allMovies = [
  {
    id: 1,
    title: "The Martian",
    description: "When astronauts blast off from the planet Mars, they leave behind Mark Watney...",
    genre: "Sci-Fi",
    rating: "PG-13",
    posterUrl: "https://i.ebayimg.com/images/g/c-gAAOSwJ4ZjBkJU/s-l1200.jpg",
    trailerUrl: "https://www.youtube.com/embed/ej3ioOneTy8",
    showtimes: ["2:00 PM", "5:00 PM", "8:00 PM"],
    isComingSoon: false,
  },
  {
    id: 2,
    title: "Despicable Me 4",
    description: "Gru welcomes a new member to the family, Gru Hr., who's intent on tormenting his dad...",
    genre: "Animation",
    rating: "PG",
    posterUrl: "https://img.vwassets.com/thevic.co.nz/vertical_40eb110a-5d4b-4f86-907b-2f37ee4ec8f0.jpg",
    trailerUrl: "https://www.youtube.com/embed/qQlr9-rF32A",
    showtimes: ["1:00 PM", "4:00 PM", "7:00 PM"],
    isComingSoon: false,
  },
  {
    id: 3,
    title: "Top Gun: Maverick",
    description: "After more than 30 years of service as one of the Navy's top aviators, Pete 'Maverick' Mitchell is where he belongs...",
    genre: "Action",
    rating: "PG-13",
    posterUrl: "https://ae01.alicdn.com/kf/Seaf229d727b84096b6be6bbffa9d0098F.jpg",
    trailerUrl: "https://www.youtube.com/embed/giXco2jaZ_4",
    showtimes: ["1:30 PM", "4:30 PM", "7:30 PM"],
    isComingSoon: false,
  },
  {
    id: 4,
    title: "The Accountant 2",
    description: "Christian Wolff applies his brilliant mind and illegal methods to reconstruct the unsolved puzzle of a Treasury chief's murder.",
    genre: "Action",
    rating: "R",
    posterUrl: "https://resizing.flixster.com/uryKtE0AZYs_so1mlw1yPA3pdSE=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzkwMmRlYWIzLThiNTQtNGIyZi05ODRlLWMxZDM3ZmY2ZTU4My5qcGc=",
    trailerUrl: "https://www.youtube.com/embed/3wRCOqyDI6E",
    showtimes: ["2:00 PM", "5:00 PM", "8:00 PM"],
    isComingSoon: true,
  },
  {
    id: 5,
    title: "Avatar 3",
    description: "Jake Sully continues his journey on Pandora.",
    genre: "Sci-Fi",
    rating: "PG-13",
    posterUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2ZoqQixChAruKeUxEacElcI6wRJr_TJVmTw&s",
    trailerUrl: "https://www.youtube.com/embed/nb_fFj_0rq8",
    showtimes: ["3:00 PM", "6:00 PM", "9:00 PM"],
    isComingSoon: true,
  },
];

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