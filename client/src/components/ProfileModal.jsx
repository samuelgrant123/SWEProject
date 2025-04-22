// client/src/components/ProfileModal.jsx
import React, { useState } from 'react';
import './ProfileModal.css';

export default function ProfileModal({ user, onClose }) {
  const [displayName, setDisplayName] = useState(localStorage.getItem('userDisplayName') || user?.displayName || '');
  const [location, setLocation] = useState(localStorage.getItem('userLocation') || '');
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    try {
      //Update display name if it changed
      if (user?.email && displayName !== user.displayName) {
        await fetch(`http://localhost:4000/api/user/updateName/${user.email}/${displayName}`, {
          method: 'PATCH',
        });

        localStorage.setItem('userDisplayName', displayName);
        setStatus('Username updated.');
      }

      //Update location in backend and local storage
      if (location){
        await fetch(`http://localhost:4000/api/user/updateLocation/${user.email}/${location}`, {
          method: 'PATCH',
        });

        localStorage.setItem('userLocation', location);
        setStatus((prev) => `${prev} Location saved.`);
      }

      //Trigger UI refresh
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error updating profile:', err);
      setStatus('Failed to update profile.');
    }
  };

  //Front end jsx code
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
