import React from 'react';
import './Dashboard.css';

export default function ProfileModal({ user, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>User Profile</h2>
        <p><strong>Username:</strong> {user?.displayName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
