import React from 'react';
import HomeHeader from "./components/HomeHeader.jsx";
import HomePage from './components/Homepage.jsx';

function App() {
  const appStyle = {
    fontFamily: 'Arial, sans-serif'
  };
  
  return (
    <div style={appStyle}>
      <HomeHeader />
      <HomePage />
    </div>
  );
}

export default App;