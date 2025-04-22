import React, { useEffect, useState } from 'react';
import InteractiveMap from './InteractiveMap';
import Checklist from './Checklist';
import ChatRoom from './ChatBoard';
import Resources from './ResourcesPage';
import ProfileModal from './ProfileModal';
import GuestPromptModal from './GuestPromptModal';
import logo from '../assets/logo.png';
import AlertsTab from './AlertsTab';
import './Dashboard.css';

export default function Dashboard({ onNavigate, user, userType }) {
  const [tab, setTab] = useState('map');
  const [locationName, setLocationName] = useState('');
  const [weather, setWeather] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  //Load weather - location in local storage
  useEffect(() => {
    const loc = localStorage.getItem('userLocation');
    if (loc) {
      setLocationName(loc);
      fetchWeather(loc);
    }
  }, []);

  //Continuously check for location updates
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

  //Fetch weather based on geocoded coordinates
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

  //Translate weather code to description
  const getWeatherDescription = (code) => {
    const map = {
      0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
      45: 'Foggy', 51: 'Drizzle', 61: 'Rain', 71: 'Snow', 95: 'Thunderstorm',
    };
    return map[code] || 'Unknown';
  };

  //Sign-out handler
  const handleSignOut = async () => {
    try {
      await fetch("http://localhost:4000/api/auth/signout", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error signing out", error);
    }

    localStorage.clear();
    onNavigate('landing');
  };

  //Render content for each tab
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
      case 'checklist':
        return <Checklist />;
      case 'resources':
        return <Resources />;
      case 'alerts':
        return <AlertsTab />;
      default:
        return null;
    }
  };

  //Front end jsx code
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="logo-title">
          <img src={logo} alt="DisasterDash Logo" className="logo" />
          <div>
            <h1>DisasterDash by ApocaTech</h1>
            <p className="weather-text">{weather}</p>
          </div>
        </div>

        <div className="user-controls">
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
            {userType === 'guest' ? 'Guest' : user?.displayName || 'User'}
          </div>

          {userType === 'authenticated' ? (
            <button className="sign-out-button" onClick={handleSignOut}>
              Sign Out
            </button>
          ) : (
            <button
              className="sign-out-button"
              onClick={() => onNavigate('landing')}
            >
              Sign In
            </button>
          )}
        </div>
      </div>

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

      <div className="dashboard-body">{renderTab()}</div>

      {showProfile && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfile(false)}
        />
      )}

      {showGuestPrompt && (
        <GuestPromptModal
          onClose={() => setShowGuestPrompt(false)}
          onLoginClick={() => {
            localStorage.clear();
            onNavigate('landing');
          }}
        />
      )}
    </div>
  );
}
