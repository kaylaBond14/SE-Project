import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomeHeader from "./components/HomeHeader.jsx";
import Home from "./components/Homepage.jsx";
import MovieDetail from "./components/MovieDetail.jsx";
import Booking from "./components/Booking.jsx";

import Login from './components/Login';
import ForgotPassword from './components/forgotpassword';
import Signup from './components/signup';

const AdminDashboard = () => (
  <div className="flex justify-center items-center h-screen">
    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
  </div>
);

export default function App() {
  // ===== your existing local state =====
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

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

  // ===== function that renders Home / Movie / Booking =====
  const renderHomeFlow = () => {
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
    }
  };

  const appStyle = { 
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#2c2c2c',
    color: 'white',
    minHeight: '100vh',
  };

  // ===== return block =====
  return (
    <BrowserRouter>
      <Routes>
        {/* Login & Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin placeholder */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Main movie-booking flow */}
        <Route
          path="/home"
          element={
            <div style={appStyle}>
              <HomeHeader />
              {renderHomeFlow()}
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
