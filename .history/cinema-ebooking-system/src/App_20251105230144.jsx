import React, { useState, useEffect } from 'react';
import HomeHeader from "./components/HomeHeader.jsx";
import Home from "./components/Homepage.jsx";
import MovieDetail from "./components/MovieDetail.jsx";
import Booking from "./components/Booking.jsx";
import Registration from "./components/Registration.jsx";
import EditProfile from './components/EditProfile.jsx';
import Login from './components/Login.jsx'; 
import ForgotPassword from './components/forgotpassword.jsx'; 
import ResetPassword from './components/resetpassword.jsx';


// ===== MOCK DATA (temporary — replace with API later) =====
const mockMovies = [
  { id: 1, title: "Inception", duration: 148, status: "NOW_PLAYING" },
  { id: 2, title: "Interstellar", duration: 169, status: "COMING_SOON" },
];
const mockShowrooms = ["Showroom 1", "Showroom 2", "Showroom 3"];
const mockPromotions = [
  { code: "NEWYEAR25", discount: 25, start: "2025-01-01", end: "2025-01-15" },
];
const mockUsers = [
  { email: "admin@cine.com", name: "Admin", role: "Admin", optIn: true },
  { email: "user@cine.com", name: "John Doe", role: "User", optIn: false },
];


// Component for the admin dashboard
const AdminDashboard = ({ onNavigate }) => {
  // Style for the outer container
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap', // Added to help if you add more cards
    gap: '2rem', // Space between cards
    marginTop: '2rem'
  };

  // Style for each card
  const cardStyle = {
    backgroundColor: '#3a3a3a', // A slightly lighter dark shade
    padding: '1.5rem 2rem',
    borderRadius: '12px',
    width: '300px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  };
  
  // Style for card titles
  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  };

  // Style for card descriptions
  const cardDescStyle = {
    fontSize: '1rem',
    color: '#ccc', // Lighter text for description
    minHeight: '40px'
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>
        Admin Dashboard
      </h1>

      <div style={containerStyle}>
        {/* Manage Movies Card */}
        <div 
          style={cardStyle}
          onClick={() => onNavigate('admin-movies')}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h2 style={cardTitleStyle}>Manage Movies</h2>
          <p style={cardDescStyle}>Add, edit, or remove movie listings and showtimes.</p>
        </div>

        {/* Manage Showtimes Card */}
        <div 
          style={cardStyle}
          onClick={() => onNavigate('admin-showtimes')}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h2 style={cardTitleStyle}>Manage Showtimes</h2>
          <p style={cardDescStyle}>Schedule movie showtimes and manage showrooms.</p>
        </div>

        {/* Manage Promotions Card */}
        <div 
          style={cardStyle}
          onClick={() => onNavigate('admin-promotions')}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h2 style={cardTitleStyle}>Manage Promotions</h2>
          <p style={cardDescStyle}>Create, update, and manage all active promotions.</p>
        </div>

        {/* Manage Users Card */}
        <div 
          style={cardStyle}
          onClick={() => onNavigate('admin-users')}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h2 style={cardTitleStyle}>Manage Users</h2>
          <p style={cardDescStyle}>Search, view, and edit user accounts and permissions.</p>
        </div>
      </div>
    </div>
  );
};


// ===== ADMIN SUB-PAGES (mock skeletons) =====

// 1. Manage Movies
const AdminMoviesPage = ({ onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log("[DEBUG] Movie form submitted:", data);
    alert("Mock: Movie added successfully!");
  };

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={onBack}>← Back to Dashboard</button>
      <h2>Add / Manage Movies</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', marginTop: '1rem' }}>
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
        <button type="submit">Save Movie (Mock)</button>
      </form>

      <h3 style={{ marginTop: '2rem' }}>Existing Movies (Mock Data)</h3>
      <table style={{ width: '100%', marginTop: '0.5rem' }}>
        <thead>
          <tr><th>Title</th><th>Duration</th><th>Status</th></tr>
        </thead>
        <tbody>
          {mockMovies.map(m => (
            <tr key={m.id}>
              <td>{m.title}</td>
              <td>{m.duration} min</td>
              <td>{m.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 2. Manage Showtimes
const AdminShowtimesPage = ({ onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log("[DEBUG] Showtime form submitted:", data);
    alert("Mock: Showtime scheduled!");
  };

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={onBack}>← Back to Dashboard</button>
      <h2>Schedule Movie Showtimes</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', marginTop: '1rem' }}>
        <label>Movie*</label>
        <select name="movie" required>
          <option value="">Select movie</option>
          {mockMovies.map(m => <option key={m.id}>{m.title}</option>)}
        </select>
        <label>Showroom*</label>
        <select name="showroom" required>
          <option value="">Select showroom</option>
          {mockShowrooms.map(r => <option key={r}>{r}</option>)}
        </select>
        <label>Date & Time*</label>
        <input name="datetime" type="datetime-local" required />
        <button type="submit">Schedule (Mock)</button>
      </form>
      <h3 style={{ marginTop: '2rem' }}>Existing Showtimes (Mock Data)</h3>
      <table style={{ width: '100%', marginTop: '0.5rem' }}>
        <thead><tr><th>Movie</th><th>Showroom</th><th>Date & Time</th></tr></thead>
        <tbody>
          <tr><td>Inception</td><td>Showroom 1</td><td>2025-11-06 19:30</td></tr>
        </tbody>
      </table>
      <div style={{ color: 'red', marginTop: '1rem' }}>No conflicts detected. (Mock)</div>
    </div>
  );
};

// 3. Manage Promotions
const AdminPromotionsPage = ({ onBack }) => {
  const handleCreatePromo = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    console.log("[DEBUG] Promotion created:", data);
    alert("Mock: Promotion saved!");
  };

  const handleSendPromo = (e) => {
    e.preventDefault();
    console.log("[DEBUG] Send promotion email to subscribed users.");
    alert("Mock: Promotion email sent!");
  };

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={onBack}>← Back to Dashboard</button>
      <h2>Manage Promotions</h2>
      <form onSubmit={handleCreatePromo} style={{ maxWidth: '500px', marginTop: '1rem' }}>
        <label>Promo Code*</label>
        <input name="code" required />
        <label>Discount %*</label>
        <input name="discount" type="number" min="1" max="100" required />
        <label>Start Date*</label>
        <input name="start" type="date" required />
        <label>End Date*</label>
        <input name="end" type="date" required />
        <button type="submit">Save Promotion (Mock)</button>
      </form>

      <h3 style={{ marginTop: '2rem' }}>Active Promotions (Mock Data)</h3>
      <ul>
        {mockPromotions.map(p => (
          <li key={p.code}>{p.code} — {p.discount}% ({p.start} → {p.end})</li>
        ))}
      </ul>

      <form onSubmit={handleSendPromo} style={{ marginTop: '2rem', maxWidth: '500px' }}>
        <h3>Email Promotion</h3>
        <label>Subject*</label>
        <input name="subject" required />
        <label>Body*</label>
        <textarea name="body" rows={3} required />
        <button type="submit">Send to Subscribed Users (Mock)</button>
      </form>
    </div>
  );
};

// 4. Manage Users
const AdminUsersPage = ({ onBack }) => (
  <div style={{ padding: '2rem' }}>
    <button onClick={onBack}>← Back to Dashboard</button>
    <h2>Manage Users</h2>
    <input
      type="text"
      placeholder="Search users..."
      style={{ margin: '1rem 0', padding: '0.5rem', width: '300px' }}
    />
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Opt-In</th></tr></thead>
      <tbody>
        {mockUsers.map(u => (
          <tr key={u.email}>
            <td>{u.email}</td>
            <td>{u.name}</td>
            <td>{u.role}</td>
            <td>{u.optIn ? "✅" : "❌"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);



// ========== YOUR EXISTING FULL APP CODE (unchanged except dashboard navigation below) ==========
export default function App() {
  // (ALL YOUR EXISTING CODE HERE — kept unchanged)

  // ... (everything from your state variables, useEffects, handlers, etc.)

  // Update only this small part inside renderPage()
  const renderPage = () => {
    if (currentPage === 'home') {
      return (<Home onMovieSelect={handleMovieSelect} isLoggedIn={isLoggedIn} user={currentUser} />);
    } else if (currentPage === 'movie-detail') {
      return (<MovieDetail movie={selectedMovie} onShowtimeSelect={handleShowtimeSelect} onGoBack={handleGoBackFromDetail} />);
    } else if (currentPage === 'booking') {
      return (<Booking movie={selectedMovie} showtime={selectedShowtime} onGoBack={handleGoBackFromBooking} />);
    } else if (currentPage === 'registration') {
      return (<Registration onGoBack={handleGoBackFromRegistration} />);
    } else if (currentPage == 'edit-profile') {
      if (!currentUser) return <div style={{ padding: '2rem' }}>Loading profile...</div>;
      return (<EditProfile user={currentUser} onGoBack={handleGoBackFromProfile} onSave={handleProfileUpdate} />);
    } else if (currentPage === 'login') {
      return (<Login onLoginSuccess={handleLoginSuccess} onGoForgot={() => setCurrentPage('forgot-password')} onGoSignup={handleGoToRegister} />);
    } else if (currentPage === 'forgot-password') {
      return (<ForgotPassword onGoBack={() => setCurrentPage('login')} />);
    } else if (currentPage === 'admin-dashboard') {
      return <AdminDashboard onNavigate={setCurrentPage} />;
    } else if (currentPage === 'admin-movies') {
      return <AdminMoviesPage onBack={() => setCurrentPage('admin-dashboard')} />;
    } else if (currentPage === 'admin-showtimes') {
      return <AdminShowtimesPage onBack={() => setCurrentPage('admin-dashboard')} />;
    } else if (currentPage === 'admin-promotions') {
      return <AdminPromotionsPage onBack={() => setCurrentPage('admin-dashboard')} />;
    } else if (currentPage === 'admin-users') {
      return <AdminUsersPage onBack={() => setCurrentPage('admin-dashboard')} />;
    } else if (currentPage === 'reset-password') {
      return (<ResetPassword onGoBack={() => setCurrentPage('login')} />);
    }
  };

  // (Everything else below remains unchanged)
  const appStyle = { 
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#2c2c2c',
    color: 'white',
    minHeight: '100vh',
  };

  return (
    <div style={appStyle}>
      <HomeHeader 
        isLoggedIn={isLoggedIn} 
        onLoginClick={handleLoginClick} 
        onLogoutClick={handleLogout} 
        onRegisterClick={handleGoToRegister}
        onProfileClick={handleGoToProfile}
      />
      {renderPage()}
    </div>
  );
}
