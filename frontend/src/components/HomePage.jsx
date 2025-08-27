import React from "react";
import { Link } from "react-router-dom";
import "../stylea/home.css";

const HomePage = () => {
  return (
    <div className="home-container">
      <nav className="home-navbar">
        <div className="navbar-logo">Property Finder</div>
        <div className="navbar-links">
          <Link to="/login" className="navbar-btn">Login</Link>
          <Link to="/signup" className="navbar-btn">Signup</Link>
        </div>
      </nav>
      <div className="home-overlay">
        <div className="home-content">
          <h1 className="home-title">Welcome to Property Finder</h1>
          <p className="home-subtitle">
            Discover your dream property with ease and confidence.
          </p>
          <Link to="/search" className="home-btn">
            Start Searching
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;