import React from 'react';
import './Dashboard.css';

// Modal prompting guest users to sign in for full access
export default function GuestPromptModal({ onClose, onLoginClick }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Sign In Required</h2>
        <p className="modal-message">
          Login or Sign up to view user profile, set location, chat, and more.
        </p>

        <div className="modal-buttons-row">
          <button className="modal-button" onClick={onClose}>
            Close
          </button>
          <button className="modal-button primary" onClick={onLoginClick}>
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
