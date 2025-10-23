import React, { useState } from 'react';
import HomeHeader from "./components/HomeHeader.jsx";
import Home from "./components/Homepage.jsx";
import MovieDetail from "./components/MovieDetail.jsx";
import Booking from "./components/Booking.jsx";
import Registration from "./components/Registration.jsx";
import EditProfile from './components/EditProfile.jsx';

// This object simulates the data we get from our database for the logged-in user
// Hardcoded until we can access the database. 
const mockUserData = {
  id: 'u123',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  phone: '555-123-4567',
  homeAddress: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
  },
  paymentInfo: {
    cardType: 'visa',
    cardNumber: '************1111',
    expDate: '12/26',
    billingAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    },
  },
  wantsPromotions: true,
};

export default function App() {
  // State to track the current page, selected movie, and selected showtime.
  // This is a simple way to manage navigation without using a routing library.
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Function to handle a movie being selected on the home page.
  // It updates the state to show the Movie Detail page.
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

      )
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
      <HomeHeader onRegisterClick={handleGoToRegister}/>
      {/* The renderPage() function call determines which page is displayed to the user. */}
      {renderPage()}
    </div>
  );
}