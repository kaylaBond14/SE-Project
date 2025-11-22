
import React, { useState } from "react";

// ===== MOCK DATA (temporary — replace with API later) =====
export const mockMovies = [
  { id: 1, title: "Inception", duration: 148, status: "NOW_PLAYING" },
  { id: 2, title: "Interstellar", duration: 169, status: "COMING_SOON" },
];
export const mockShowrooms = [
  { id: 1, name: "Showroom 1", capacity: 100 },
  { id: 2, name: "Showroom 2", capacity: 150 },
  { id: 3, name: "Showroom 3", capacity: 200 },
];
export const mockPromotions = [
  { code: "NEWYEAR25", discount: 25, start: "2025-01-01", end: "2025-01-15" },
];
export const mockUsers = [
  { email: "admin@cine.com", name: "Admin", role: "Admin", optIn: true },
  { email: "user@cine.com", name: "John Doe", role: "User", optIn: false },
];

// ===== ADMIN DASHBOARD =====
export const AdminDashboard = ({ onNavigate }) => {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "2rem",
    marginTop: "2rem",
  };

  const cardStyle = {
    backgroundColor: "#3a3a3a",
    padding: "1.5rem 2rem",
    borderRadius: "12px",
    width: "300px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    cursor: "pointer",
    transition: "transform 0.2s",
  };

  const cardTitleStyle = { fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" };
  const cardDescStyle = { fontSize: "1rem", color: "#ccc", minHeight: "40px" };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Admin Dashboard</h1>

      <div style={containerStyle}>
        {[
          { label: "Manage Movies", desc: "Add, edit, or remove movies.", page: "admin-movies" },
          { label: "Manage Showtimes", desc: "Schedule movie showtimes.", page: "admin-showtimes" },
          { label: "Manage Promotions", desc: "Create and manage promotions.", page: "admin-promotions" },
          { label: "Manage Users", desc: "View and edit user accounts.", page: "admin-users" },
        ].map((item, i) => (
          <div
            key={i}
            style={cardStyle}
            onClick={() => onNavigate(item.page)}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h2 style={cardTitleStyle}>{item.label}</h2>
            <p style={cardDescStyle}>{item.desc}</p>
          </div>
        ))}

        <div
          style={cardStyle}
          onClick={() => alert("Manage Tickets feature coming soon!")}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <h2 style={cardTitleStyle}>Manage Tickets</h2>
          <p style={cardDescStyle}>View, refund, or modify booked tickets. (Coming soon)</p>
        </div>
      </div>
    </div>
  );
};

// ===== Manage Movies =====
export const AdminMoviesPage = ({ onBack }) => {
  const [currentMode, setCurrentMode] = useState("menu");
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "2rem",
    marginTop: "2rem",
  };
  const cardStyle = {
    backgroundColor: "#3a3a3a",
    padding: "1.5rem 2rem",
    borderRadius: "12px",
    width: "300px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    cursor: "pointer",
    transition: "transform 0.2s",
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log("[DEBUG] Movie form submitted:", data);
    alert("Mock: Movie added successfully!");
  };

  if (currentMode === "menu") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <button onClick={onBack} style={{ marginBottom: "1rem" }}>← Back to Dashboard</button>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Manage Movies</h1>
        <div style={containerStyle}>
          {[
            { label: "Add Movie", desc: "Create a new movie.", action: () => setCurrentMode("add") },
            { label: "Edit Movie", desc: "Modify details (coming soon).", action: () => alert("Edit feature coming soon!") },
            { label: "Delete Movie", desc: "Remove a movie (coming soon).", action: () => alert("Delete feature coming soon!") },
          ].map((item, i) => (
            <div key={i} style={cardStyle} onClick={item.action}>
              <h2>{item.label}</h2>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={() => setCurrentMode("menu")} style={{ marginBottom: "1rem" }}>
        ← Back to Manage Movies
      </button>
      <h2>Add Movie</h2>
      <form onSubmit={handleAddSubmit} style={{ maxWidth: "500px", marginTop: "1rem" }}>
        <label>Title*</label>
        <input name="title" required />
        <label>Description*</label>
        <textarea name="description" required rows={3} />
        <label>Genre(s)*</label>
        <input name="genres" required placeholder="e.g. Action, Drama" />
        <label>Duration (minutes)*</label>
        <input name="duration" type="number" required />
        <label>Rating*</label>
        <input name="rating" required />
        <label>Release Date*</label>
        <input name="releaseDate" type="date" required />
        <label>Poster URL*</label>
        <input name="posterUrl" type="url" required />
        <label>Status*</label>
        <select name="status" required>
          <option value="">Select status</option>
          <option value="NOW_PLAYING">Now Playing</option>
          <option value="COMING_SOON">Coming Soon</option>
        </select>
        <button type="submit" style={{ marginTop: "1rem" }}>Save Movie (Mock)</button>
      </form>

      <h3 style={{ marginTop: "2rem" }}>Existing Movies (Mock Data)</h3>
      <table style={{ width: "100%", marginTop: "0.5rem" }}>
        <thead><tr><th>Title</th><th>Duration</th><th>Status</th></tr></thead>
        <tbody>
          {mockMovies.map((m) => (
            <tr key={m.id}><td>{m.title}</td><td>{m.duration} min</td><td>{m.status}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ===== Manage Showtimes =====
export const AdminShowtimesPage = ({ onBack }) => {
  const mockShowtimes = [
    { movie: "Inception", showroom: "Showroom 1", datetime: "2025-11-06 19:30" },
    { movie: "Interstellar", showroom: "Showroom 2", datetime: "2025-11-07 18:00" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const conflict = mockShowtimes.some(
      (s) => s.showroom === data.showroom && s.datetime === data.datetime
    );
    if (conflict) alert("❌ Conflict detected!");
    else alert("✅ Mock: Showtime scheduled successfully!");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={onBack}>← Back to Dashboard</button>
      <h2>Schedule Movie Showtimes</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px", marginTop: "1rem" }}>
        <label>Movie*</label>
        <select name="movie" required>
          <option value="">Select movie</option>
          {mockMovies.map((m) => (
            <option key={m.id}>{m.title}</option>
          ))}
        </select>
        <label>Showroom*</label>
        <select name="showroom" required>
          <option value="">Select showroom</option>
          {mockShowrooms.map((r) => (
            <option key={r.id}>{r.name} (Seats: {r.capacity})</option>
          ))}
        </select>
        <label>Date & Time*</label>
        <input name="datetime" type="datetime-local" required />
        <button type="submit" style={{ marginTop: "1rem" }}>Schedule (Mock)</button>
      </form>
    </div>
  );
};

// ===== Manage Promotions =====
export const AdminPromotionsPage = ({ onBack }) => {
  const handleCreatePromo = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    alert("Mock: Promotion saved!");
  };
  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={onBack}>← Back to Dashboard</button>
      <h2>Manage Promotions</h2>
      <form onSubmit={handleCreatePromo} style={{ maxWidth: "500px", marginTop: "1rem" }}>
        <label>Promo Code*</label>
        <input name="code" required />
        <label>Discount %*</label>
        <input name="discount" type="number" min="1" max="100" required />
        <label>Start Date*</label>
        <input name="start" type="date" required />
        <label>End Date*</label>
        <input name="end" type="date" required />
        <button type="submit" style={{ marginTop: "1rem" }}>Save Promotion (Mock)</button>
      </form>
      <h3 style={{ marginTop: "2rem" }}>Active Promotions (Mock Data)</h3>
      <ul>
        {mockPromotions.map((p) => (
          <li key={p.code}>{p.code} — {p.discount}% ({p.start} → {p.end})</li>
        ))}
      </ul>
    </div>
  );
};

// ===== Manage Users =====
export const AdminUsersPage = ({ onBack }) => (
  <div style={{ padding: "2rem" }}>
    <button onClick={onBack}>← Back to Dashboard</button>
    <h2>Manage Users</h2>
    <input type="text" placeholder="Search users..." style={{ margin: "1rem 0", padding: "0.5rem", width: "300px" }} />
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Opt-In</th></tr></thead>
      <tbody>
        {mockUsers.map((u) => (
          <tr key={u.email}><td>{u.email}</td><td>{u.name}</td><td>{u.role}</td><td>{u.optIn ? "✅" : "❌"}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);