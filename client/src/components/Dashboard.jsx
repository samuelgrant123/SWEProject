import React, { useEffect, useState } from 'react';
import InteractiveMap from './InteractiveMap';
import Checklist from './Checklist';
import ChatRoom from './ChatBoard';
import Resources from './ResourcesPage';
import GuestPromptModal from './GuestPromptModal';
import './Dashboard.css';

export default function Dashboard({ onNavigate }) {
  const [tab, setTab] = useState('map');
  const [locationName, setLocationName] = useState('');
  const [weather, setWeather] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const userType = localStorage.getItem('current_user_type'); // Get current user type from localStorage

  //Initial load for location
  useEffect(() => {
    const fetchLocation = async () => {
      try{
        const userEmail = localStorage.getItem('current_user_email');
        const response = await fetch(`http://localhost:4000/api/user/getLocation/${userEmail}`);
        if (!response.ok){
          throw new Error('Error in API fetching the location of user');
        }
        const data = await response.json();
        const loc = data.location;
        if (loc){
          setLocationName(loc);
          fetchWeather(loc);
        }
      }catch (error) {
        console.error('Error fetching location in Dashboard.jsx:', error);
      }
    };
    fetchLocation();
  }, []);
  

  //Sync with localStorage updates for location
  useEffect(() => {
    const updateLocation = async () => {
      try {
        const userEmail = localStorage.getItem('current_user_email');
        const response = await fetch(`http://localhost:4000/api/user/getLocation/${userEmail}`);
        if (!response.ok) {
          throw new Error('Error in API fetching the location of user');
        }
        const data = await response.json();
        const newLoc = data.location;
        if (newLoc && newLoc !== locationName){
          setLocationName(newLoc);
          fetchWeather(newLoc);
        }
      } catch (error) {
        console.error('Location update failure in Dashboard.jsx', error);
      }
    };
  
    window.addEventListener('storage', updateLocation);
    const interval = setInterval(updateLocation, 1000);
  
    return () => {
      window.removeEventListener('storage', updateLocation);
      clearInterval(interval);
    };
  }, [locationName]);
  

  //Calling the weather API
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
          {'Profile'}
        </div>
        <div>
        {userType !== 'guest' && (
            <button
              className="sign-out-button"
              onClick={async () => {
                try{
                  await fetch("http://localhost:4000/api/auth/signout", {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  localStorage.removeItem('current_user_location');
                  localStorage.removeItem('current_user_email');
                  onNavigate('landing'); // Navigate to the landing page
                }catch(error){
                  console.error("Error on the frontend side of signing out");
                }
              }}
            >
              Sign Out
            </button>
        )}
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


      {/* Guest Prompt Modal */}
      {showGuestPrompt && (
        <GuestPromptModal
          onClose={() => setShowGuestPrompt(false)}
          onLoginClick={() => {
            localStorage.removeItem('current_user_type');
            localStorage.removeItem('current_user_email');
            onNavigate('landing'); // Go back to landing page
          }}
        />
      )}
    </div>
  );
}