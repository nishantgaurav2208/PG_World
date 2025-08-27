// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your Home component for the root path

import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import SearchPage from './components/searchform';


function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* The root path "/" will render the Home component */}
        <Route path="/" element={<HomePage/>}/>
        
       <Route path="/login" element={<LoginPage/>}/>
       <Route path="/signup" element={<SignupPage/>}/>
       <Route path="/search" element={<SearchPage/>}/>
        

        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;