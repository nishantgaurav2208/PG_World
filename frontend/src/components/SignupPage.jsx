import React, { useState } from "react";
import "../stylea/signup.css";

const SignupPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add signup logic here
  };

  return (
    <div className="signup-container">
      {/* Left: Form Card */}
      <div className="signup-form-card">
        <div className="title">Find Your Perfect Space</div>
        <div className="subtitle">
          Sign up to explore PGS for students & professionals.
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-create">
            Create Account
          </button>
        </form>
      </div>
      {/* Right: Info Card with Image & Overlay */}
      <div className="signup-info-card">
        <div className="overlay"></div>
        <div className="info-text">
          <h2>Your New Home Awaits</h2>
          <p>
            Connecting students & employees with the best PGS and shared accommodations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;