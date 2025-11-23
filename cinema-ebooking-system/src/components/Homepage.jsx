import React, { useState, useEffect } from 'react';
import MovieCard from "./MovieCard.jsx";

export default function Home({ onMovieSelect, isLoggedIn, user }) {
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]); 
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // 1. Initial Fetch
        const [nowRes, soonRes] = await Promise.all([
          fetch('/api/movies/now-playing'),
          fetch('/api/movies/coming-soon'),
        ]);
        const nowData = await nowRes.json();
        const soonData = await soonRes.json();

        // 2. Manually fetch showtimes for "Now Playing"
        const nowMoviesWithTimes = await Promise.all(
          nowData.map(async (movie) => {
            try {
              const timeRes = await fetch(`/api/movies/${movie.id}/screening-options`);
              if (!timeRes.ok) return { ...movie, showtimes: [] };
              const options = await timeRes.json();
              // Extract time string, limit to top 3
              const times = options.map(o => o.time).slice(0, 3);
              return { ...movie, showtimes: times };
            } catch (err) {
              return { ...movie, showtimes: [] };
            }
          })
        );

        // --- RATING MAP (Based on your Database) ---
        const RATING_MAP = {
          1: "G",
          2: "PG",
          3: "PG-13",
          4: "R",
          5: "NC-17",
          6: "NR"
        };
        // -------------------------------------------

        // 3. Normalization Helper
        const norm = (m, isComingSoon, fetchedTimes) => ({
          id: m.id,
          title: m.title,
          
          // --- THE RATING FIX ---
          // Use the map to convert ID (4) to String ("R")
          rating: m.rating 
            ? m.rating 
            : (RATING_MAP[m.ratingId] || "NR"), 
          // ----------------------

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
            : (typeof m?.genre === 'string' ? m.genre : ''),
            
          isComingSoon: isComingSoon,
          showtimes: isComingSoon ? [] : (fetchedTimes || [])
        });
  
        // 4. Combine lists
        const combined = [
          ...nowMoviesWithTimes.map(m => norm(m, false, m.showtimes)),
          ...soonData.map(m => norm(m, true, [])) 
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

  // Filtering Logic
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

  // Fetch Genres
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/movies/genres');
        const list = await res.json();
        setGenres(Array.isArray(list) ? list : []);
      } catch (e) {
        setGenres([]);
      }
    })();
  }, []);

  const currentlyRunning = filteredMovies.filter(movie => !movie.isComingSoon);
  const comingSoon = filteredMovies.filter(movie => movie.isComingSoon);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  
  const toggleGenre = (g) => {
    setSelectedGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  }

  const selectedLabel = selectedGenres.length === 0 ? 'All Genres' 
    : selectedGenres.length <=2 ? selectedGenres.join(', ')
    : `${selectedGenres.length} genres selected`;
    
  const clearGenres = () => setSelectedGenres([]);

  const containerStyle = { padding: '1.5rem' };
  const headingStyle = { fontSize: '1.875rem', fontWeight: '700', marginBottom: '1rem' };
  const searchFilterContainerStyle = { display: 'flex', gap: '1rem', marginBottom: '1rem' };
  const inputStyle = { padding: '0.5rem', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' };

  return (
    <div style={containerStyle}>
      <div style={searchFilterContainerStyle}>
        <input type="text" placeholder="Search by title..." onChange={handleSearchChange} style={inputStyle} />
        <details>
          <summary style={{ cursor: 'pointer', userSelect: 'none' }}>{selectedLabel} ▾</summary>
          <div style={{ textAlign: 'left', marginTop: '0.5rem' }}>
            {genres.map(g => (
              <label key={g} style={{ display: 'block', margin: '0.25rem 0' }}>
                <input type="checkbox" checked={selectedGenres.includes(g)} onChange={() => toggleGenre(g)} />{' '}{g}
              </label>
            ))}
            {selectedGenres.length > 0 && (
              <button type="button" onClick={clearGenres} style={{ marginTop: '0.5rem' }}>Clear</button>
            )}
          </div>
        </details>    
      </div>

      <h1 style={headingStyle}>Currently Running</h1>
      <div style={gridStyle}>
        {currentlyRunning.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onMovieSelect={onMovieSelect} />
        ))}
      </div>
      
      <h1 style={headingStyle}>Coming Soon</h1>
      <div style={gridStyle}>
        {comingSoon.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onMovieSelect={onMovieSelect} />
        ))}
      </div>

      {isLoggedIn && (
        <div className="user-dashboard">
          <section className="bookings-section">
            <h2>🎟 My Bookings</h2>
            <div className="bookings-grid">
              {/* Hardcoded bookings - replace with real fetch later if needed */}
              {[
                { id: 1, movieTitle: "Inception", showDate: "2025-11-05", showTime: "19:30", seats: "A1, A2" },
                { id: 2, movieTitle: "Oppenheimer", showDate: "2025-11-10", showTime: "20:00", seats: "B5, B6" },
              ].map((b) => (
                <div key={b.id} className="booking-card">
                  <h3>{b.movieTitle}</h3>
                  <p>{b.showDate} at {b.showTime}</p>
                  <p>Seats: {b.seats}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="recommendations-section">
            <h2>✨ Recommended for You</h2>
            <div className="recs-grid">
              {[
                { id: 101, title: "Interstellar", genre: "Sci-Fi", posterUrl: "https://via.placeholder.com/200x300?text=Interstellar" },
                { id: 102, title: "Tenet", genre: "Action", posterUrl: "https://via.placeholder.com/200x300?text=Tenet" },
                { id: 103, title: "The Dark Knight", genre: "Thriller", posterUrl: "https://via.placeholder.com/200x300?text=Dark+Knight" },
              ].map((r) => (
                <div key={r.id} className="rec-card">
                  <img src={r.posterUrl} alt={r.title} />
                  <h4>{r.title}</h4>
                  <p>{r.genre}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}