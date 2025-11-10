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


// ===================== ADMIN DASHBOARD =====================
const AdminDashboard = ({ onNavigate }) => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '2rem',
    marginTop: '2rem'
  };
  const cardStyle = {
    backgroundColor: '#3a3a3a',
    padding: '1.5rem 2rem',
    borderRadius: '12px',
    width: '300px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  };
  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  };
  const cardDescStyle = {
    fontSize: '1rem',
    color: '#ccc',
    minHeight: '40px'
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Admin Dashboard</h1>
      <div style={containerStyle}>
        <div
          style={cardStyle}
          onClick={() => onNavigate('admin-movies')}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h2 style={cardTitleStyle}>Manage Movies</h2>
          <p style={cardDescStyle}>Add, edit, or remove movie listings and showtimes.</p>
        </div>

        <div
          style={cardStyle}
          onClick={() => onNavigate('admin-showtimes')}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h2 style={cardTitleStyle}>Manage Showtimes</h2>
          <p style={cardDescStyle}>Schedule movie showtimes and manage showrooms.</p>
        </div>

        <div
          style={cardStyle}
          onClick={() => onNavigate('admin-promotions')}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <h2 style={cardTitleStyle}>Manage Promotions</h2>
          <p style={cardDescStyle}>Create, update, and manage all active promotions.</p>
        </div>

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


// ===== ADMIN SUB-PAGES =====

// 1️⃣ Manage Movies
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
        <thead><tr><th>Title</th><th>Duration</th><th>Status</th></tr></thead>
        <tbody>
          {mockMovies.map(m => (
            <tr key={m.id}><td>{m.title}</td><td>{m.duration} min</td><td>{m.status}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


// 2️⃣ Manage Showtimes
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


// 3️⃣ Manage Promotions
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


// 4️⃣ Manage Users
const AdminUsersPage = ({ onBack }) => (
  <div style={{ padding: '2rem' }}>
    <button onClick={onBack}>← Back to Dashboard</button>
    <h2>Manage Users</h2>
    <input type="text" placeholder="Search users..." style={{ margin: '1rem 0', padding: '0.5rem', width: '300px' }} />
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead><tr><th>Email</th><th>Name</th><th>Role</th><th>Opt-In</th></tr></thead>
      <tbody>
        {mockUsers.map(u => (
          <tr key={u.email}><td>{u.email}</td><td>{u.name}</td><td>{u.role}</td><td>{u.optIn ? "✅" : "❌"}</td></tr>
        ))}
      </tbody>
    </table>
  </div>
);
// ============================================================
// =============== MAIN APPLICATION FUNCTION ==================
export default function App() {

  // ===== Your existing local states =====
  const [currentPage, setCurrentPage] = useState('admin-dashboard');  // change back to 'home' after testing
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Auth and user state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // ====== Check for existing session on load ======
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      console.log('Found existing session, fetching profile...');
      setIsLoggedIn(true);
      setCurrentUserId(userId);
    }
  }, []);

  // ====== Helper: auth headers ======
  const getAuthHeaders = (includeContentType = true) => {
    const token = localStorage.getItem('jwtToken');
    const headers = {};
    if (includeContentType) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  // ====== Navigation Handlers ======
  const handleMovieSelect = (movie) => { setSelectedMovie(movie); setCurrentPage('movie-detail'); };
  const handleShowtimeSelect = (showtime) => { setSelectedShowtime(showtime); setCurrentPage('booking'); };
  const handleGoBackFromDetail = () => setCurrentPage('home');
  const handleGoBackFromBooking = () => setCurrentPage('movie-detail');
  const handleGoToRegister = () => setCurrentPage('registration');
  const handleGoBackFromRegistration = () => setCurrentPage('home');
  const handleGoToProfile = () => setCurrentPage('edit-profile');
  const handleGoBackFromProfile = () => setCurrentPage('home');

  // ===== LOGIN / LOGOUT =====
  const handleLoginClick = () => setCurrentPage('login');

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setCurrentUserId(userData.userId);
    localStorage.setItem('userId', userData.userId);
    if (userData.role === 'Admin') setCurrentPage('admin-dashboard');
    else setCurrentPage('home');
  };

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('jwtToken');
      if (!userId) return;
      await fetch('api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId: parseInt(userId) })
      });
      setIsLoggedIn(false);
      setCurrentUser(null);
      setCurrentUserId(null);
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userId');
      setCurrentPage('home');
      console.log("User logged out and session cleared.");
    } catch (error) { console.error("Error logging out:", error); }
  };

  // ===== FETCH PROFILE =====
  useEffect(() => { if (currentUserId) fetchUserProfile(currentUserId); }, [currentUserId]);

  const fetchUserProfile = async (id) => {
    try {
      const userResponse = await fetch(`/api/users/${id}/profile`, { method: 'GET', headers: getAuthHeaders(false) });
      if (!userResponse.ok) throw new Error('Failed to fetch user profile.');
      const userData = await userResponse.json();

      // Address & Cards
      let addressData = null;
      try {
        const addr = await fetch(`/api/users/${id}/address`, { method: 'GET', headers: getAuthHeaders(false) });
        if (addr.ok) addressData = await addr.json();
      } catch {}
      let cardsData = [];
      try {
        const cards = await fetch(`/api/users/${id}/cards`, { method: 'GET', headers: getAuthHeaders(false) });
        if (cards.ok) cardsData = await cards.json();
      } catch {}

      const fullUserData = { ...userData, address: addressData, paymentCards: cardsData };
      if (currentPage === 'home' && fullUserData.userTypeName === 'Admin') setCurrentPage('admin-dashboard');
      setCurrentUser(fullUserData);
    } catch (err) {
      console.error('Error fetching profile:', err);
      alert('Could not load user profile.');
    }
  };

  // ===== PROFILE UPDATE =====
  const formatAddressForAPI = (addr) => {
    if (!addr.street || !addr.city || !addr.state || !addr.zip) return null;
    return { label: "Home", street: addr.street, city: addr.city, state: addr.state, postalCode: addr.zip, country: "USA" };
  };

  const handleProfileUpdate = async (updatedData) => {
    if (!currentUser) return;
    const id = currentUser.id;
    let failed = false;

    try {
      const basics = {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        phone: updatedData.phone,
        promoOptIn: updatedData.promoOptIn,
      };
      const res = await fetch(`/api/users/${id}`, { method: 'PATCH', headers: getAuthHeaders(), body: JSON.stringify(basics) });
      if (!res.ok) throw new Error('Failed to update basics');
    } catch (e) { failed = true; alert('Error saving profile.'); }

    if (!failed && updatedData.newPassword) {
      try {
        const r = await fetch(`/api/users/${id}/change-password`, {
          method: 'POST', headers: getAuthHeaders(),
          body: JSON.stringify({ currentPassword: updatedData.currentPassword, newPassword: updatedData.newPassword })
        });
        if (!r.ok) throw new Error(await r.text());
      } catch (e) { failed = true; alert(`Password error: ${e.message}`); }
    }

    if (!failed && updatedData.homeAddress) {
      const formatted = formatAddressForAPI(updatedData.homeAddress);
      if (formatted) {
        try {
          const method = currentUser.address ? 'PATCH' : 'POST';
          const url = currentUser.address ? `/api/users/${id}/address/${currentUser.address.id}` : `/api/users/${id}/address`;
          const r = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(formatted) });
          if (!r.ok) throw new Error('Address failed');
        } catch { failed = true; alert('Address update failed'); }
      }
    }

    if (!failed) { alert('Profile Saved!'); fetchUserProfile(id); setCurrentPage('home'); }
  };

  // ===== Render Page Logic =====
  const renderPage = () => {
    if (currentPage === 'home')
      return <Home onMovieSelect={handleMovieSelect} isLoggedIn={isLoggedIn} user={currentUser} />;
    else if (currentPage === 'movie-detail')
      return <MovieDetail movie={selectedMovie} onShowtimeSelect={handleShowtimeSelect} onGoBack={handleGoBackFromDetail} />;
    else if (currentPage === 'booking')
      return <Booking movie={selectedMovie} showtime={selectedShowtime} onGoBack={handleGoBackFromBooking} />;
    else if (currentPage === 'registration')
      return <Registration onGoBack={handleGoBackFromRegistration} />;
    else if (currentPage === 'edit-profile')
      return currentUser
        ? <EditProfile user={currentUser} onGoBack={handleGoBackFromProfile} onSave={handleProfileUpdate} />
        : <div style={{ padding: '2rem' }}>Loading profile...</div>;
    else if (currentPage === 'login')
      return <Login onLoginSuccess={handleLoginSuccess} onGoForgot={() => setCurrentPage('forgot-password')} onGoSignup={handleGoToRegister} />;
    else if (currentPage === 'forgot-password')
      return <ForgotPassword onGoBack={() => setCurrentPage('login')} />;
    else if (currentPage === 'admin-dashboard')
      return <AdminDashboard onNavigate={setCurrentPage} />;
    else if (currentPage === 'admin-movies')
      return <AdminMoviesPage onBack={() => setCurrentPage('admin-dashboard')} />;
    else if (currentPage === 'admin-showtimes')
      return <AdminShowtimesPage onBack={() => setCurrentPage('admin-dashboard')} />;
    else if (currentPage === 'admin-promotions')
      return <AdminPromotionsPage onBack={() => setCurrentPage('admin-dashboard')} />;
    else if (currentPage === 'admin-users')
      return <AdminUsersPage onBack={() => setCurrentPage('admin-dashboard')} />;
    else if (currentPage === 'reset-password')
      return <ResetPassword onGoBack={() => setCurrentPage('login')} />;
  };

  // ===== Styles =====
  const appStyle = { fontFamily: 'Arial, sans-serif', backgroundColor: '#2c2c2c', color: 'white', minHeight: '100vh' };

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
