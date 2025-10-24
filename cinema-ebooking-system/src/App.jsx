import React, { useState, useEffect } from 'react'; // NEW (added useEffect)
import HomeHeader from "./components/HomeHeader.jsx";
import Home from "./components/Homepage.jsx";
import MovieDetail from "./components/MovieDetail.jsx";
import Booking from "./components/Booking.jsx";
import Registration from "./components/Registration.jsx";
import EditProfile from './components/EditProfile.jsx';

export default function App() {
  // State to track the current page, selected movie, and selected showtime.
  // This is a simple way to manage navigation without using a routing library.
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // TRIAL! State for Login 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentUserId, setCurrentUserId] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null); // (was previously set to mockUserData)

  
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setCurrentPage('movie-detail');
  };

  // Function to handle a showtime being selected on the Movie Detail page.
  // It updates the state to show the Booking page.
  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
    setCurrentPage('booking');
  };

  // Function to go back to the home page from the movie detail page.
  const handleGoBackFromDetail = () => setCurrentPage('home');
  
  // Function to go back from the booking page to the movie detail page.
  const handleGoBackFromBooking = () => setCurrentPage('movie-detail');

  // Function to go to the Registration page 
  const handleGoToRegister = () => setCurrentPage('registration');

  // Function to go back from the registration page to the home page. 
  const handleGoBackFromRegistration = () => setCurrentPage('home');

  // Function to go to edit profile page
  const handleGoToProfile = () => setCurrentPage('edit-profile');

  // Function to go back to home page from edit profile page. 
  const handleGoBackFromProfile = () => setCurrentPage('home');

  // TRIAL! LOGIN Handlers
  // This is a temporary function to simulate a user logging in.
  // The real login page will set these states.
  const handleLogin = () => { 
    setIsLoggedIn(true); 
    setCurrentUserId(1); // SIMULATING LOGIN FOR USER ID 1 
    setCurrentPage('home'); 
    alert('Simulated login for User 1. Fetching profile...'); 
  };

  // This logs the user out and clears their data
  const handleLogout = () => { 
    setIsLoggedIn(false); 
    setCurrentUser(null); 
    setCurrentUserId(null); 
    setCurrentPage('home'); 
  };

  // This 'useEffect' hook runs automatically whenever 'currentUserId' changes.
  useEffect(() => { 
    // If we have a user ID (from login), fetch their profile. 
    if (currentUserId) { // NEW
      fetchUserProfile(currentUserId); 
    } 
  }, [currentUserId]); // The "dependency array": runs when this value changes 

  // This function calls GET /api/users/{id}/profile endpoint
  const fetchUserProfile = async (id) => { 
    try { 
      const response = await fetch(`/api/users/${id}/profile`); 
      if (!response.ok) { 
        throw new Error('Failed to fetch user profile.'); 
      } 
      const userData = await response.json(); 
      
      //  API returns user data, but not address or payment.
      //  add mock data for those parts so the form doesn't break.
      const fullUserData = { 
        ...userData, 
        // TODO: Replace with real data when you have address/payment APIs 
        homeAddress: { street: '456 Oak Ave', city: 'Othertown', state: 'NY', zip: '54321' }, 
        paymentInfo: { cardType: 'mastercard', cardNumber: '************5555', expDate: '11/25' }, 
      }; 

      setCurrentUser(fullUserData); 
      console.log('Fetched user profile:', fullUserData); 

    } catch (error) { 
      console.error('Error fetching profile:', error); 
      alert('Could not load user profile.'); 
    } 
  }; 

  
  // MODIFIED: This function now calls  backend API controllers.
  const handleProfileUpdate = async (updatedData) => { //(added async)
    if (!currentUser) return; //(Safety check)
    
    const id = currentUser.id; 
    let updateFailed = false; 

    // Update Basic Info (firstName, lastName, phone, promoOptIn) 
    // This creates an object that matches  'UpdateUserRequest' DTO 
    const basicsToUpdate = { 
      firstName: updatedData.firstName,
      lastName: updatedData.lastName, 
      phone: updatedData.phone, 
      promoOptIn: updatedData.promoOptIn, 
    }; 

    try { 
      console.log('Updating basic info:', basicsToUpdate); 
      //  call  PATCH endpoint 
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

    // Update Password (if provided)
    // This runs only if the user entered a new password and the first update succeeded
    if (!updateFailed && updatedData.newPassword) { 
      // This creates an object that matches  'ChangePasswordRequest' DTO 
      const passwordRequest = { 
        currentPassword: updatedData.currentPassword, 
        newPassword: updatedData.newPassword, 
      }; 

      try { 
        console.log('Changing password...'); 
        // call  POST endpoint for changing password 
        const response = await fetch(`/api/users/${id}/change-password`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(passwordRequest), 
        }); 
        
        if (!response.ok) { 
          // Get the specific error message from the backend (invaild password)
          const errorMsg = await response.text(); 
          throw new Error(errorMsg || 'Failed to change password.'); 
        } 
      } catch (error) { 
        console.error(error); 
        alert(`Error changing password: ${error.message}`); 
        updateFailed = true; 
      } 
    } 
    
    // IMPLEMENT LATER- Nothing in contoller for this.
    // Update Address & Payment
    // Will need to build controllers for these in your backend 
    /* 
    if (!updateFailed && updatedData.homeAddress) { 
      // const res = await fetch(`/api/users/${id}/address`, { ... }); 
      console.log('TODO: Save this address:', updatedData.homeAddress); 
    } 
    
    if (!updateFailed && updatedData.paymentInfo) { 
      // const res = await fetch(`/api/users/${id}/payment`, { ... }); 
      console.log('TODO: Save this payment:', updatedData.paymentInfo); 
    } 
    */ 

    //  Refetch data & go home 
    if (!updateFailed) { 
      alert('Profile Saved!'); 
      fetchUserProfile(id); // Re-fetch the user to get the confirmed changes 
      setCurrentPage('home'); 
    } 
  };


  // This function decides which page to render based on the current state.
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
      return (
        <Registration
          onGoBack={handleGoBackFromRegistration}
        />
      );
    } else if (currentPage == 'edit-profile') {
      // A loading check 
      // If the user is logged in but haven't fetched their data yet
      if (!currentUser) { 
        // Show a loading message
        return <div style={{ padding: '2rem' }}>Loading profile...</div>; 
      } 
      
      // Once 'currentUser' is fetched, render the form
      return (
        <EditProfile 
          user={currentUser} 
          onGoBack={handleGoBackFromProfile}
          onSave={handleProfileUpdate}
        />
      );
    }
  };

  const appStyle = { 
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#2c2c2c', // Dark background
    color: 'white', // Light text
    minHeight: '100vh',
  };

  return (
    <div style={appStyle}>
      <HomeHeader 
        isLoggedIn={isLoggedIn} 
        onLoginClick={handleLogin}
        onLogoutClick={handleLogout} 
        onRegisterClick={handleGoToRegister}
        onProfileClick={handleGoToProfile}
        />
      {/* The renderPage() function call determines which page is displayed to the user. */}
      {renderPage()}
    </div>
  );
}

