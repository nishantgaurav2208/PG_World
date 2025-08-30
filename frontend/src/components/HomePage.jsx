import React from "react";
import "../stylea/home.css";
import "../stylea/global.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <div className="logo-icon">🧭</div>
            <h2>PG Compass</h2>
          </div>
          <div className="nav-buttons">
            <Link to="/login" className="btn btn-outline">Login</Link>
  <Link to="/signup" className="btn btn-primary">Signup</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-logo">
              <div className="main-logo">
                <div className="logo-circle">
                  <span className="logo-compass">🧭</span>
                </div>
                <div className="logo-text">
                  <h2>PG Compass</h2>
                  <span className="tagline">Find Your Perfect Home</span>
                </div>
              </div>
            </div>
            <h1 className="hero-title">
              Your Compass to the Best PG & Co-living Spaces
            </h1>
            <p className="hero-subtitle">
              We compare properties from India's top rental sites to find you the perfect home, effortlessly.
            </p>
           <Link to="/search" className="btn btn-cta">Find Your PG Now</Link>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="badge">
                <span className="badge-icon">✅</span>
                <span>Verified Properties</span>
              </div>
              <div className="badge">
                <span className="badge-icon">🔒</span>
                <span>Secure & Safe</span>
              </div>
              <div className="badge">
                <span className="badge-icon">⚡</span>
                <span>Instant Booking</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-visual">
              <div className="building-icon">🏢</div>
              <div className="floating-cards">
                <div className="property-card card-1">
                  <div className="card-header">₹8,000/month</div>
                  <div className="card-body">2BHK in Koramangala</div>
                </div>
                <div className="property-card card-2">
                  <div className="card-header">₹12,000/month</div>
                  <div className="card-body">1BHK in Indiranagar</div>
                </div>
                <div className="property-card card-3">
                  <div className="card-header">₹6,500/month</div>
                  <div className="card-body">Shared PG in BTM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos Section */}
      <section className="partners">
        <div className="container">
          <p className="partners-text">Trusted by thousands • Comparing properties from</p>
          <div className="partner-logos">
            <div className="partner-logo">
              <div className="logo-box">
                <span className="partner-icon">🏠</span>
                <span className="partner-name">Housing.com</span>
              </div>
            </div>
            <div className="partner-logo">
              <div className="logo-box">
                <span className="partner-icon">🏢</span>
                <span className="partner-name">99acres.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">📍</div>
              <h3>Search Your Location</h3>
              <p>Tell us where you want to live, and we'll scan the top listings for you.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">⚖️</div>
              <h3>Compare & Choose</h3>
              <p>We present a side-by-side comparison from sites like Housing.com, 99acres, and more.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">🏠</div>
              <h3>Move In Confidently</h3>
              <p>Select the best option with confidence, knowing you got the best deal.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose PG Compass?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Advanced filters to find exactly what you're looking for</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Compare prices across multiple platforms to get the best deal</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✅</div>
              <h3>Verified Listings</h3>
              <p>All properties are verified for authenticity and quality</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Quick Process</h3>
              <p>Find and book your perfect PG in just a few clicks</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Your Perfect PG?</h2>
            <p>Join thousands of students who found their ideal accommodation through PG Compass</p>
            <div className="cta-buttons">
              <button className="btn btn-cta">Get Started Now</button>
              <button className="btn btn-outline-white">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <h3>PG Compass</h3>
              <p>Your trusted partner in finding the perfect accommodation</p>
            </div>
            <div className="footer-right">
              <div className="footer-links">
                <a href="#about">About Us</a>
                <a href="#contact">Contact</a>
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 PG Compass. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
