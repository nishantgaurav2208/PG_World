import React, { useState } from 'react';
import axios from 'axios';
import "../stylea/search.css";

const uniqueGenders = ["Boys", "Girls", "Boys & Girls"];
const uniqueAreas = [
  "Whitefield, Bangalore", "Ramamurthy Nagar, Bangalore", "ITPL, Bangalore", "Hoodi, Bangalore",
  "Jayanagar, Bangalore", "BTM 2nd Stage, BTM Layout", "Koramangala, Bangalore", "HSR Layout, Bangalore",
  "Electronic City, Bangalore", "Indira Nagar, Bangalore East", "Hebbal, Bangalore"
];
const uniqueRoomTypes = [
  "Private Room",
  "Shared Room",
  "Double Sharing Private Room",
  "Triple Sharing Double Sharing Private Room",
  "Multi Sharing Triple Sharing Double Sharing Private Room"
];

function SearchForm() {
  const [budget, setBudget] = useState('');
  const [roomType, setRoomType] = useState('');
  const [gender, setGender] = useState('');
  const [area, setArea] = useState('');
  const [source, setSource] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [genderSuggestions, setGenderSuggestions] = useState([]);
  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [roomTypeSuggestions, setRoomTypeSuggestions] = useState([]);

  const API_BASE_URL = 'http://localhost:5000';

  const sourceUrls = {
    '99acres.com': 'https://www.99acres.com',
    'Housing.com': 'https://housing.com'
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setGender(value);
    setGenderSuggestions(
      value.length > 0
        ? uniqueGenders.filter(g => g.toLowerCase().includes(value.toLowerCase()))
        : []
    );
  };

  const handleAreaChange = (e) => {
    const value = e.target.value;
    setArea(value);
    setAreaSuggestions(
      value.length > 0
        ? uniqueAreas.filter(a => a.toLowerCase().includes(value.toLowerCase()))
        : []
    );
  };

  const handleRoomTypeChange = (e) => {
    const value = e.target.value;
    setRoomType(value);
    setRoomTypeSuggestions(
      value.length > 0
        ? uniqueRoomTypes.filter(rt => rt.toLowerCase().includes(value.toLowerCase()))
        : []
    );
  };

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
        Source: source
      });

      const data = response.data;
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        throw new Error('Unexpected data format from server.');
      }
    } catch (e) {
      setError(`❌ ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="searchform-container">
      <div className="searchform-card">
        <h1>🏡 Find Your Perfect Stay</h1>
        <form className="searchform-form" onSubmit={handleSubmit}>
          <label htmlFor="budget">💰 Budget (e.g., 20000):</label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />

          <label htmlFor="roomType">🛏 Room Type:</label>
          <div className="autocomplete-wrapper">
            <input
              type="text"
              id="roomType"
              value={roomType}
              onChange={handleRoomTypeChange}
              autoComplete="off"
            />
            {roomTypeSuggestions.length > 0 && (
              <ul className="autocomplete-list">
                {roomTypeSuggestions.map((s, idx) => (
                  <li key={idx} onClick={() => { setRoomType(s); setRoomTypeSuggestions([]); }}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label htmlFor="gender">🚻 Gender(Boys , Girls..):</label>
          <div className="autocomplete-wrapper">
            <input
              type="text"
              id="gender"
              value={gender}
              onChange={handleGenderChange}
              autoComplete="off"
            />
            {genderSuggestions.length > 0 && (
              <ul className="autocomplete-list">
                {genderSuggestions.map((s, idx) => (
                  <li key={idx} onClick={() => { setGender(s); setGenderSuggestions([]); }}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label htmlFor="area">📍 Area:</label>
          <div className="autocomplete-wrapper">
            <input
              type="text"
              id="area"
              value={area}
              onChange={handleAreaChange}
              autoComplete="off"
            />
            {areaSuggestions.length > 0 && (
              <ul className="autocomplete-list">
                {areaSuggestions.map((s, idx) => (
                  <li key={idx} onClick={() => { setArea(s); setAreaSuggestions([]); }}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? '🔎 Searching...' : '✨ Search Properties'}
          </button>
        </form>
        {error && <div className="searchform-error">{error}</div>}
      </div>

      <div className="searchform-results">
        <h2>📑 Search Results</h2>
        {loading ? (
          <p>⏳ Loading...</p>
        ) : results.length > 0 ? (
          <ul className="searchform-property-list">
            {results.map((property, index) => {
              const sourceUrl = sourceUrls[property.Source];
              return (
                <li key={index} className="searchform-property-card">
                  <strong>🏠 Property:</strong> {property['Property Name'] || 'N/A'} <br />
                  <strong>📍 Address:</strong> {property.address || 'N/A'} <br />
                  <strong>🛏 Room Type:</strong> {property.room_type || 'N/A'} <br />
                  <strong>🚻 Gender:</strong> {property.gender || 'N/A'} <br />
                  <strong>💰 Price:</strong> {property.Price_range || 'N/A'} <br />
                  <strong>🔗 Visit:</strong>{' '}
                  {sourceUrl ? (
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                      {property.Source}
                    </a>
                  ) : (
                    <span>{property.Source || 'N/A'}</span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No properties found. Try another search 🔍</p>
        )}
      </div>
    </div>
  );
}

export default SearchForm;
