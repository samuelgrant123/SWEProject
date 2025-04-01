import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import InteractiveMap from './InteractiveMap';
import Checklist from './Checklist';
import ChatRoom from './ChatBoard';
import Resources from './ResourcesPage';
import ProfileModal from './ProfileModal';
import GuestPromptModal from './GuestPromptModal';
import './Dashboard.css';

export default function Dashboard({ onNavigate }) {
  const [tab, setTab] = useState('map');
  const [locationName, setLocationName] = useState('');
  const [weather, setWeather] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const userType = localStorage.getItem('userType');
  const user = auth.currentUser;
  const displayName = userType === 'guest' ? 'guest' : user?.displayName || 'user';

  // Initial load
  useEffect(() => {
    const loc = localStorage.getItem('userLocation');
    if (loc) {
      setLocationName(loc);
      fetchWeather(loc);
    }
  }, []);

  // Sync with localStorage updates
  useEffect(() => {
    const updateLocation = () => {
      const newLoc = localStorage.getItem('userLocation');
      if (newLoc && newLoc !== locationName) {
        setLocationName(newLoc);
        fetchWeather(newLoc);
      }
    };

    window.addEventListener('storage', updateLocation);
    const interval = setInterval(updateLocation, 1000);

    return () => {
      window.removeEventListener('storage', updateLocation);
      clearInterval(interval);
    };
  }, [locationName]);

  const fetchWeather = async (location) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
      );
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`
        );
        const weatherData = await weatherRes.json();
        const temp = weatherData.current_weather?.temperature;
        const code = weatherData.current_weather?.weathercode;
        const desc = getWeatherDescription(code);
        setWeather(`${temp}°F - ${desc}`);
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
    }
  };

  const getWeatherDescription = (code) => {
    const map = {
      0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
      45: 'Foggy', 51: 'Drizzle', 61: 'Rain', 71: 'Snow', 95: 'Thunderstorm',
    };
    return map[code] || 'Unknown';
  };

  const renderTab = () => {
    switch (tab) {
      case 'map':
        return (
          <div className="tab-content">
            <p className="location-text">Location: {locationName}</p>
            <InteractiveMap />
          </div>
        );
      case 'chat':
        return <ChatRoom />;
      case 'alerts':
        return (
          <div className="tab-content alert-tab">
            Tornado Warning in your area
          </div>
        );
      case 'checklist':
        return <Checklist />;
      case 'resources':
        return <Resources />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="logo-title">
          <img src="/logo.png" alt="Logo" className="dashboard-logo" />
          <div>
            <h1>DisasterDash by ApocaTech</h1>
            <p className="weather-text">{weather}</p>
          </div>
        </div>
        <div
          className="user-badge"
          onClick={() => {
            if (userType === 'guest') {
              setShowGuestPrompt(true);
            } else {
              setShowProfile(true);
            }
          }}
        >
          {displayName}
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        {['map', 'chat', 'alerts', 'checklist', 'resources'].map((t) => (
          <button
            key={t}
            className={`tab-button ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="dashboard-body">
        {renderTab()}
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}

      {/* Guest Prompt Modal */}
      {showGuestPrompt && (
        <GuestPromptModal
          onClose={() => setShowGuestPrompt(false)}
          onLoginClick={() => {
            localStorage.removeItem('userType'); // Optional cleanup
            onNavigate('landing'); // Go back to landing page
          }}
        />
      )}
    </div>
  );
}
