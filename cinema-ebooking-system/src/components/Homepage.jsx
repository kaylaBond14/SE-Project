import React, { useState, useEffect } from 'react';
import MovieCard from "./MovieCard.jsx";


export default function Home({ onMovieSelect }) {
  // State to hold all movies and a filtered list of movies.
  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState(allMovies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]); //array of strings
  const [genres, setGenres] = useState([]);


  useEffect(() => {
    (async () => {
      try {
        // fetch both "now playing" and "coming soon"
        const [nowRes, soonRes] = await Promise.all([
          fetch('/api/movies/now-playing'),
          fetch('/api/movies/coming-soon'),
        ]);
        const [nowData, soonData] = await Promise.all([
          nowRes.json(),
          soonRes.json(),
        ]);
  
        // helper to normalize a movie object into the shape your UI expects
        const norm = (m, isComingSoon) => ({
          id: m.id,
          title: m.title,
          rating: m.rating,
          posterUrl: m.posterUrl ?? m.poster_url,
          trailerUrl: m.trailerUrl ?? m.trailer_url,
          description: m.synopsis,
          //genre: m.genre ?? '', //OLD CODE
          //NEW CODE: Genre array for UI filtering
          genres: Array.isArray(m?.genres)
            ? m.genres
            : (typeof m?.genre === 'string' 
              ? m.genre.split(',').map(s => s.trim()).filter(Boolean)
              : []),
          //OLD STRING if still needed
          genre: Array.isArray(m?.genres)
            ? m.genres.join(', ')
            : (typeof m?.genre === 'string' 
              ? m.genre
              : ''),
          isComingSoon:
          isComingSoon,                                 //mark which section it belongs to
          showtimes: isComingSoon 
          ? [] // Set to an empty array (or null) if the movie is coming soon
      : m.showtimes ?? ['2:00 PM', '5:00 PM', '8:00 PM'], // Use actual showtimes (m.showtimes) or the hardcoded fallback
 // hardcoded showtimes
        });
  
        // combine both lists into one array
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

  // filtering

  useEffect(() => {
    //start from all movies)
    let base = allMovies;
    // genre OR-logic: include a movie if it has ALL of the selected genres
    if (selectedGenres.length > 0) {
      const selected = new Set(selectedGenres); 
      base = base.filter(m => [...selected].every(g => (m.genres || []).includes(g)));
    }

    // search term (applied on top of genre filter)
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      base = base.filter(m => m.title.toLowerCase().includes(q));
    }

   setFilteredMovies(base);
 }, [allMovies, selectedGenres, searchTerm]);


  
  /*
  useEffect(() => {
    (async () => {
      try {
        if (genreFilter) {
          const res = await fetch(`/api/movies/filter?genre=${encodeURIComponent(genreFilter)}`);
          const data = await res.json();
  
          // preserve flags from initial combined list
          const byId = Object.fromEntries(allMovies.map(m => [m.id, m]));
  
          const normalized = data.map(m => {
            const original = byId[m.id];
            return {
              id: m.id,
              title: m.title,
              rating: m.rating,
              posterUrl: m.posterUrl ?? m.poster_url,
              trailerUrl: m.trailerUrl ?? m.trailer_url,
              description: m.synopsis,
              genre: m.genre ?? '',
              isComingSoon: original?.isComingSoon ?? false,                 
              showtimes: original?.showtimes ?? ['2:00 PM','5:00 PM','8:00 PM'], 
            };
          });
  
          setFilteredMovies(normalized);
        } else {
          setFilteredMovies(allMovies);
        }
      } catch (e) {
        console.error("Filter fetch failed", e);
        setFilteredMovies([]);
      }
    })();
  }, [genreFilter, allMovies]);
  */

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
  
  /*
  useEffect(() => {
    let filtered = allMovies;
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredMovies(filtered);
  }, [searchTerm, allMovies]);
  */

  // Separate the filtered movies into 'Currently Running' and 'Coming Soon'.
  const currentlyRunning = filteredMovies.filter(movie => !movie.isComingSoon);
  const comingSoon = filteredMovies.filter(movie => movie.isComingSoon);

  // Event handlers for the search and filter inputs.
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  
  //Added: toggle genre selection
  const toggleGenre = (g) => {
    setSelectedGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  }
  //Added: Label for dropdown button
  const selectedLabel =
    selectedGenres.length === 0 ? 'All Genres' 
    : selectedGenres.length <=2 ? selectedGenres.join(', ')
    : `${selectedGenres.length} genres selected`;
  const clearGenres = () => setSelectedGenres([]);

  // Dynamically create a list of all available genres for the dropdown.
  //const availableGenres = [...new Set(allMovies.map(movie => movie.genre))];

  // Inline styles for the component's layout.
  const containerStyle = { padding: '1.5rem' };
  const headingStyle = { fontSize: '1.875rem', fontWeight: '700', marginBottom: '1rem' };
  const searchFilterContainerStyle = { display: 'flex', gap: '1rem', marginBottom: '1rem' };
  const inputStyle = { padding: '0.5rem', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' };
  const selectStyle = { padding: '0.5rem', border: '1px solid #444', backgroundColor: '#1a1a1a', color: 'white' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' };

  return (
    <div style={containerStyle}>
      {/* Search and Filter UI */}
      <div style={searchFilterContainerStyle}>
        <input
          type="text"
          placeholder="Search by title..."
          onChange={handleSearchChange}
          style={inputStyle}
        />
        {/* ADDED */}
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
                      <button type="button" onClick={clearGenres} style={{ marginTop: '0.5rem' }}>
                        Clear
                        </button>
                      )}
                      </div>
                      </details>
        {/*CHANGED THIS<select
          multiple
          value={selectedGenres}
          onChange={handleGenresChange}
          style={{...selectStyle, height: '8rem'}}
        >
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>  */}    
      </div>
      <h1 style={headingStyle}>Currently Running</h1>
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
