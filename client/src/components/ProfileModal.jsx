// client/src/components/ProfileModal.jsx
import React, { useState } from 'react';
import './ProfileModal.css';
import { updateProfile } from 'firebase/auth';

export default function ProfileModal({ user, onClose }) {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [location, setLocation] = useState(localStorage.getItem('userLocation') || '');
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    try {
      // Update Firebase displayName
      if (user && displayName !== user.displayName) {
        await updateProfile(user, { displayName });
        setStatus('Username updated.');
      }

      // Update localStorage location
      localStorage.setItem('userLocation', location);
      setStatus((prev) => prev + ' Location saved.');

      // Optional: trigger a refresh if needed
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error updating profile:', err);
      setStatus('Failed to update profile.');
    }
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <h2>User Settings</h2>

        <label>Username:</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <label>Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="modal-buttons">
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>

        {status && <p className="status-msg">{status}</p>}
      </div>
    </div>
  );
}
