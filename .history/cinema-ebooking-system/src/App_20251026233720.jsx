import React, { useState, useEffect } from 'react';
import HomeHeader from "./components/HomeHeader.jsx";
import Home from "./components/Homepage.jsx";
import MovieDetail from "./components/MovieDetail.jsx";
import Booking from "./components/Booking.jsx";
import Registration from "./components/Registration.jsx";
import EditProfile from './components/EditProfile.jsx';
import Login from './components/Login';
import ForgotPassword from './components/forgotpassword';
import Signup from './components/signup';

const AdminDashboard = () => (
  <div className="flex justify-center items-center h-screen">
    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Auth and user state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setCurrentPage('movie-detail');
  };

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
    setCurrentPage('booking');
  };

  const handleGoBackFromDetail = () => setCurrentPage('home');
  const handleGoBackFromBooking = () => setCurrentPage('movie-detail');
  const handleGoToRegister = () => setCurrentPage('registration');
  const handleGoBackFromRegistration = () => setCurrentPage('home');
  const handleGoToProfile = () => setCurrentPage('edit-profile');
  const handleGoBackFromProfile = () => setCurrentPage('home');

  // Simulated login/logout
  // When Login button is clicked in header, go to login page
const handleLoginClick = () => {
  setCurrentPage('login');
};

// (Keep a separate actual login handler if you want to simulate login later)
const handleFakeLogin = () => {
  setIsLoggedIn(true);
  setCurrentUserId(1);
  setCurrentPage('home');
  alert('Simulated login for User 1. Fetching profile...');
};


  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentUserId(null);
    setCurrentPage('home');
  };

  // Fetch user profile when logged in
  useEffect(() => {
    if (currentUserId) fetchUserProfile(currentUserId);
  }, [currentUserId]);

  const fetchUserProfile = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}/profile`);
      if (!response.ok) throw new Error('Failed to fetch user profile.');
      const userData = await response.json();

      const fullUserData = {
        ...userData,
        homeAddress: {
          street: '456 Oak Ave',
          city: 'Othertown',
          state: 'NY',
          zip: '54321',
        },
        paymentInfo: {
          cardType: 'mastercard',
          cardNumber: '************5555',
          expDate: '11/25',
        },
      };
      setCurrentUser(fullUserData);
      console.log('Fetched user profile:', fullUserData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Could not load user profile.');
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    if (!currentUser) return;
    const id = currentUser.id;
    let updateFailed = false;

    const basicsToUpdate = {
      firstName: updatedData.firstName,
      lastName: updatedData.lastName,
      phone: updatedData.phone,
      promoOptIn: updatedData.promoOptIn,
    };

    try {
      console.log('Updating basic info:', basicsToUpdate);
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basicsToUpdate),
      });
      if (!response.ok) throw new Error('Failed to update basic info.');
    } catch (error) {
      console.error(error);
      alert('Error saving profile changes. Please try again.');
      updateFailed = true;
    }

    if (!updateFailed && updatedData.newPassword) {
      const passwordRequest = {
        currentPassword: updatedData.currentPassword,
        newPassword: updatedData.newPassword,
      };
      try {
        const response = await fetch(`/api/users/${id}/change-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(passwordRequest),
        });
        if (!response.ok) {
          const errorMsg = await response.text();
          throw new Error(errorMsg || 'Failed to change password.');
        }
      } catch (error) {
        console.error(error);
        alert(`Error changing password: ${error.message}`);
        updateFailed = true;
      }
    }

    if (!updateFailed) {
      alert('Profile Saved!');
      fetchUserProfile(id);
      setCurrentPage('home');
    }
  };

  const renderPage = () => {
    if (currentPage === 'home') {
      return <Home onMovieSelect={handleMovieSelect} />;
    } else if (currentPage === 'movie-detail') {
      return (
        <MovieDetail
          movie={selectedMovie}
          onShowtimeSelect={handleShowtimeSelect}
          onGoBack={handleGoBackFromDetail}
        />
      );
    } else if (currentPage === 'booking') {
      return (
        <Booking
          movie={selectedMovie}
          showtime={selectedShowtime}
          onGoBack={handleGoBackFromBooking}
        />
      );
    } else if (currentPage === 'registration') {
      return <Registration onGoBack={handleGoBackFromRegistration} />;
    } else if (currentPage === 'edit-profile') {
      if (!currentUser)
        return <div style={{ padding: '2rem' }}>Loading profile...</div>;
      return (
        <EditProfile
          user={currentUser}
          onGoBack={handleGoBackFromProfile}
          onSave={handleProfileUpdate}
        />
      );
    } else if (currentPage === 'login') {
      return <Login onLoginSuccess={handleFakeLogin} />;
    }
  };

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
