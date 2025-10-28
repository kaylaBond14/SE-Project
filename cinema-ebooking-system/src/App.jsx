import React, { useState, useEffect } from 'react';
import HomeHeader from "./components/HomeHeader.jsx";
import Home from "./components/Homepage.jsx";
import MovieDetail from "./components/MovieDetail.jsx";
import Booking from "./components/Booking.jsx";
import Registration from "./components/Registration.jsx";
import EditProfile from './components/EditProfile.jsx';
import Login from './components/Login.jsx'; 
import ForgotPassword from './components/forgotpassword.jsx'; 

// Component for the admin dashboard
const AdminDashboard = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Admin Dashboard</h1>
  </div>
);

export default function App() {
  // State to track the current page, selected movie, and selected showtime.
  // This is a simple way to manage navigation without using a routing library.
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

  // Function to handle a showtime being selected on the Movie Detail page.
  // It updates the state to show the Booking page.
  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
    setCurrentPage('booking');
  };

  // Function to go back to the home page and vice versa.
  const handleGoBackFromDetail = () => setCurrentPage('home');
  const handleGoBackFromBooking = () => setCurrentPage('movie-detail');
  const handleGoToRegister = () => setCurrentPage('registration');
  const handleGoBackFromRegistration = () => setCurrentPage('home');
  const handleGoToProfile = () => setCurrentPage('edit-profile');
  const handleGoBackFromProfile = () => setCurrentPage('home');

  // LOGIN HANDLERS 
  // When Login button is clicked in header, go to login page
  const handleLoginClick = () => {
    setCurrentPage('login');
  };

  // This function is called by the Login component on a successful login
  const handleLoginSuccess = (userData) => { // Expects { id, role }
    setIsLoggedIn(true);
    setCurrentUserId(userData.id); // This will trigger your profile fetch
    
    // Handle routing based on user role
    if (userData.role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('home');
    }
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
    if (currentUserId) { 
      fetchUserProfile(currentUserId); 
    } 
  }, [currentUserId]); // The "dependency array": runs when this value changes 

  // This function calls GET /api/users/{id}/profile endpoint
  const fetchUserProfile = async (id) => { 
    try { 
      // Fetch User Basics
      const userResponse = await fetch(`/api/users/${id}/profile`); 
      if (!userResponse.ok) throw new Error('Failed to fetch user profile.'); 
      const userData = await userResponse.json(); 

      // Fetch User Address (if it exists)
      let addressData = null;
      try {
        const addressResponse = await fetch(`/api/users/${id}/address`);
        if (addressResponse.ok) {
          addressData = await addressResponse.json();
        }
      } catch (e) {
        console.log("User has no address yet.");
      }

      // Fetch User Cards (if they exist)
      let cardsData = [];
      try {
        const cardsResponse = await fetch(`/api/users/${id}/cards`);
        if (cardsResponse.ok) {
          cardsData = await cardsResponse.json();
        }
      } catch (e) {
        console.log("User has no payment cards yet.");
      }
      
      // Combine all data into one user object
      //  API returns user data, but not address or payment.
      //  add mock data for those parts so the form doesn't break.
      const fullUserData = { 
        ...userData, 
        address: addressData,     // This will be an object or null
        paymentCards: cardsData,  // This will be an array
      }; 

      setCurrentUser(fullUserData); 
      console.log('Fetched full user profile:', fullUserData); 

    } catch (error) { 
      console.error('Error fetching profile:', error); 
      alert('Could not load user profile.'); 
    } 
  }; 

  // Helper function to format address for the API
  const formatAddressForAPI = (addr) => {
    if (!addr.street || !addr.city || !addr.state || !addr.zip) {
      return null;
    }
    return {
      label: "Home",
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.zip,
      country: "USA",
    };
  };
  
  // This function now calls  backend API controllers.
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
    
    //  API logic for Address
    if (!updateFailed && updatedData.homeAddress) {
      const formattedAddress = formatAddressForAPI(updatedData.homeAddress);
      if (formattedAddress) {
        try {
          let addressEndpoint = `/api/users/${id}/address`;
          let addressMethod = 'POST'; // Assume we are creating
          
          // If user already had an address, we PATCH (update) it
          if (currentUser.address && currentUser.address.id) {
            addressEndpoint = `/api/users/${id}/address/${currentUser.address.id}`;
            addressMethod = 'PATCH';
          }

          console.log(`Sending address via ${addressMethod} to ${addressEndpoint}`);
          const response = await fetch(addressEndpoint, {
            method: addressMethod,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedAddress),
          });
          if (!response.ok) throw new Error('Failed to save home address.');

        } catch (error) {
          console.error(error);
          alert('Error saving home address.');
          updateFailed = true;
        }
      }
    }
    
    // Full API logic for Payment Card 
    // This logic assumes we are only managing ONE card (the first in the list)
    if (!updateFailed) {
      const existingCard = currentUser.paymentCards ? currentUser.paymentCards[0] : null;
      const userWantsToSaveCard = updatedData.paymentInfo;

      try {
        // Case 1: User wants to save (add/update) a card
        if (userWantsToSaveCard) {
          if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(updatedData.paymentInfo.expDate)) {
             throw new Error("Please enter the expiration date in MM/YY format.");
          }
          const [month, year] = updatedData.paymentInfo.expDate.split('/');
          const formattedBillingAddress = formatAddressForAPI(
            updatedData.paymentInfo.billingAddress
          );
          if (!formattedBillingAddress) throw new Error("Please fill out billing address for card.");

          const cardPayload = {
            brand: updatedData.paymentInfo.cardType,
            cardNumber: updatedData.paymentInfo.cardNumber,
            expMonth: month,
            expYear: `20${year}`,
            billingAddress: formattedBillingAddress,
          };
          
          let cardEndpoint = `/api/users/${id}/cards`;
          let cardMethod = 'POST';

          // If a card already exists, PATCH it
          if (existingCard && existingCard.id) {
            cardEndpoint = `/api/users/${id}/cards/${existingCard.id}`;
            cardMethod = 'PATCH';
          }
          
          console.log(`Sending card via ${cardMethod} to ${cardEndpoint}`);
          const response = await fetch(cardEndpoint, {
            method: cardMethod,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cardPayload),
          });
          if (!response.ok) throw new Error('Failed to save payment card.');

        // Case 2: User unchecked the box, and a card *did* exist
        } else if (!userWantsToSaveCard && existingCard) {
          console.log(`Deleting card at /api/users/${id}/cards/${existingCard.id}`);
          const response = await fetch(`/api/users/${id}/cards/${existingCard.id}`, {
            method: 'DELETE'
          });
          if (!response.ok) throw new Error('Failed to delete payment card.');
        }
        // Case 3: User doesn't want card, and had no card. Do nothing.

      } catch (error) {
        console.error(error);
        alert(error.message);
        updateFailed = true;
      }
    }
    
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
      return (
        <Home 
          onMovieSelect={handleMovieSelect}
          isLoggedIn={isLoggedIn} // NEW
          user={currentUser} // NEW
        />
      );
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
    } else if (currentPage === 'login') {
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onGoForgot={() => setCurrentPage('forgot-password')}
          onGoSignup={handleGoToRegister} // Re-uses your existing function
        />
      );
    } else if (currentPage === 'forgot-password') {
      return (
        <ForgotPassword
          onGoBack={() => setCurrentPage('login')} //Goes back to login page
        />
      );
    } else if (currentPage === 'admin-dashboard') {
      return <AdminDashboard />;
 
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
        onLoginClick={handleLoginClick} // NEW
        onLogoutClick={handleLogout} 
        onRegisterClick={handleGoToRegister}
        onProfileClick={handleGoToProfile}
        />
      {/* The renderPage() function call determines which page is displayed to the user. */}
      {renderPage()}
    </div>
  );
}