import React, { useState, useEffect } from 'react';

export default function UserProfile({ onNavigate }) {
  const [location, setLocation] = useState('');

  // Load saved location
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  const handleSave = () => {
    if (location.trim() === '') return;
    localStorage.setItem('userLocation', location.trim());
    alert('Location saved!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Profile</h2>

      <label htmlFor="location">Your Location (City or ZIP):</label>
      <input
        type="text"
        id="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="e.g., Orlando or 32801"
        style={{ display: 'block', marginTop: '10px', padding: '8px', width: '300px' }}
      />

      <button onClick={handleSave} style={{ marginTop: '15px' }}>
        Save Location
      </button>

      <button onClick={() => onNavigate('dashboard')} style={{ marginTop: '20px' }}>
        Back to Dashboard
      </button>
    </div>
  );
}
