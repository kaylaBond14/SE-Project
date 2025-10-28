import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 add this import
import MovieCard from "./MovieCard.jsx";

export default function Home({ onMovieSelect }) {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState(allMovies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate(); // 👈 navigation hook for routing

  // ===== Fetch Movies =====
  useEffect(() => {
    (async () => {
      try {
        const [nowRes, soonRes] = await Promise.all([
          fetch('/api/movies/now-playing'),
          fetch('/api/movies/coming-soon'),
        ]);
        const [nowData, soonData] = await Promise.all([
          nowRes.json(),
          soonRes.json(),
        ]);

        const norm = (m, isComingSoon) => ({
          id: m.id,
          title: m.title,
          rating: m.rating,
          posterUrl: m.posterUrl ?? m.poster_url,
          trailerUrl: m.trailerUrl ?? m.trailer_url,
          description: m.synopsis,
          genres: Array.isArray(m?.genres)
            ? m.genres
            : (typeof m?.genre === 'string'
              ? m.genre.split(',').map(s => s.trim()).filter(Boolean)
              : []),
          genre: Array.isArray(m?.genres)
            ? m.genres.join(', ')
            : (typeof m?.genre === 'string'
              ? m.genre
              : ''),
          isComingSoon,
          showtimes: isComingSoon
            ? []
            : m.showtimes ?? ['2:00 PM', '5:00 PM', '8:00 PM'],
        });

        const combined = [
          ...(Array.isArray(nowData) ? nowData.map(m => norm(m, false)) : []),
          ...(Array.isArray(soonData) ? soonData.map(m => norm(m, true)) : []),
        ];

        setAllMovies(combined);
        setFilteredMovies(combined);
      } catch (e) {
        console.error('Failed to load movies', e);
        setAllMovies([]);
        setFilteredMovies([]);
      }
    })();
  }, []);

  // ===== Filtering Logic =====
  useEffect(() => {
    let base = allMovies;
    if (selectedGenres.length > 0) {
      const selected = new Set(selectedGenres);
      base = base.filter(m => [...selected].every(g => (m.genres || []).includes(g)));
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      base = base.filter(m => m.title.toLowerCase().includes(q));
    }
    setFilteredMovies(base);
  }, [allMovies, selectedGenres, searchTerm]);

  // ===== Fetch Genres =====
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/movies/genres');
        const list = await res.json();
        setGenres(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error('Failed to load genres', e);
        setGenres([]);
      }
    })();
  }, []);

  // ===== Genre Selection =====
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const toggleGenre = (g) => {
    setSelectedGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  };
  const clearGenres = () => setSelectedGenres([]);
  const selectedLabel =
    selectedGenres.length === 0
      ? 'All Genres'
      : selectedGenres.length <= 2
        ? selectedGenres.join(', ')
        : `${selectedGenres.length} genres selected`;

  const currentlyRunning = filteredMovies.filter(movie => !movie.isComingSoon);
  const comingSoon = filteredMovies.filter(movie => movie.isComingSoon);

  // ===== Styles =====
  const containerStyle = { padding: '1.5rem', position: 'relative' };
  const headingStyle = { fontSize: '1.875rem', fontWeight: '700', marginBottom: '1rem' };
  const searchFilterContainerStyle = { display: 'flex', gap: '1rem', marginBottom: '1rem' };
  const inputStyle = { padding: '0.5rem', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' };

  // ===== Render =====
  return (
    <div style={containerStyle}>
      {/* === Login Button (Top Right) === */}
      <button
        onClick={() => navigate('/login')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600'
        }}
      >
        Log In
      </button>

      {/* Search and Filter */}
      <div style={searchFilterContainerStyle}>
        <input
          type="text"
          placeholder="Search by title..."
          onChange={handleSearchChange}
          style={inputStyle}
        />
        <details>
          <summary style={{ cursor: 'pointer', userSelect: 'none' }}>
            {selectedLabel} ▾
          </summary>
          <div style={{ textAlign: 'left', marginTop: '0.5rem' }}>
            {genres.map(g => (
              <label key={g} style={{ display: 'block', margin: '0.25rem 0' }}>
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(g)}
                  onChange={() => toggleGenre(g)}
                />{' '}
                {g}
              </label>
            ))}
            {selectedGenres.length > 0 && (
              <button
                type="button"
                onClick={clearGenres}
                style={{
                  marginTop: '0.5rem',
                  padding: '5px 10px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#555',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            )}
          </div>
        </details>
      </div>

      {/* Currently Running */}
      <h1 style={headingStyle}>Currently Running</h1>
      <div style={gridStyle}>
        {currentlyRunning.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onMovieSelect={onMovieSelect} />
        ))}
      </div>

      {/* Coming Soon */}
      <h1 style={headingStyle}>Coming Soon</h1>
      <div style={gridStyle}>
        {comingSoon.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onMovieSelect={onMovieSelect} />
        ))}
      </div>
    </div>
  );
}
