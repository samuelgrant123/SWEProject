import React from 'react';
import Checklist from './Checklist';

export default function ChecklistPage({ onNavigate }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Preparedness Checklist</h1>
      <Checklist />

      <button style={{ marginTop: '20px' }} onClick={() => onNavigate('dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
}
