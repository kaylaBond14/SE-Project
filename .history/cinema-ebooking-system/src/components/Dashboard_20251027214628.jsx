import React, { useEffect, useState } from 'react';

export default function Dashboard({ user }) {
  const [bookings, setBookings] = useState([]);
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    // fetch user's bookings
    fetch(`http://localhost:8080/api/bookings?userId=${user.id}`)
      .then(res => res.json())
      .then(setBookings)
      .catch(err => console.error('Error fetching bookings', err));

    // fetch personalized recommendations
    fetch(`http://localhost:8080/api/recommendations?userId=${user.id}`)
      .then(res => res.json())
      .then(setRecs)
      .catch(err => console.error('Error fetching recs', err));
  }, [user]);

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name || user.email}</h1>

      <section className="bookings">
        <h2>🎟 My Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <ul>
            {bookings.map(b => (
              <li key={b.id}>
                <strong>{b.movieTitle}</strong> — {b.showDate} at {b.showTime}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="recommendations">
        <h2>✨ Recommendations for You</h2>
        {recs.length === 0 ? (
          <p>Loading suggestions...</p>
        ) : (
          <div className="rec-grid">
            {recs.map(r => (
              <div key={r.id} className="rec-card">
                <img src={r.posterUrl} alt={r.title} />
                <p>{r.title}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
