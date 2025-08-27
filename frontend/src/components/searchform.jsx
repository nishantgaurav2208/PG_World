// src/SearchForm.js

import React, { useState } from 'react';
import axios from 'axios'; // Import axios

function SearchForm() {
  const [budget, setBudget] = useState('');
  const [roomType, setRoomType] = useState('');
  const [gender, setGender] = useState('');
  const [area, setArea] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5000'; // Or your deployed backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      if (budget === '' || isNaN(Number(budget))) {
        throw new Error('Please enter a valid budget.');
      }

      const response = await axios.post(`${API_BASE_URL}/search`, {
        budget: Number(budget),
        room_type: roomType,
        gender: gender,
        area: area,
      });

      const data = response.data;
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        throw new Error('Received unexpected data format from the server.');
      }
      
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        setError(`Error: ${e.response.status} - ${e.response.data.error || e.message}`);
      } else {
        setError(`Failed to fetch data: ${e.message}. Please check if the backend server is running.`);
      }
      console.error("Axios request failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1>Property Search</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="budget" style={{ display: 'block' }}>Budget (e.g., 20000): </label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="roomType" style={{ display: 'block' }}>Room Type (e.g., 1BHK): </label>
          <input
            type="text"
            id="roomType"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="gender" style={{ display: 'block' }}>Gender (e.g., Girls, Boys): </label>
          <input
            type="text"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="area" style={{ display: 'block' }}>Area (e.g., Whitefield): </label>
          <input
            type="text"
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px' }}>
          {loading ? 'Searching...' : 'Search Properties'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
      
      <h2 style={{ marginTop: '30px' }}>Search Results</h2>
      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {results.map((property, index) => (
            <li key={index} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
              <strong>Property Name:</strong> {property['Property Name'] || 'N/A'}<br />
              <strong>Address:</strong> {property.address || 'N/A'}<br />
              <strong>Room Type:</strong> {property.room_type || 'N/A'}<br />
              <strong>Gender:</strong> {property.gender || 'N/A'}<br />
              <strong>Price:</strong> {property.Price_range || 'N/A'} {/* Displaying the original Price_range */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No properties found. Please try a different search query.</p>
      )}
    </div>
  );
}

export default SearchForm;