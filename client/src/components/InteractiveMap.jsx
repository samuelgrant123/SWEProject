import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// 👇 Helper to extract just city and state
const simplifyAddress = (address) => {
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    '';
  const state = address.state || address.region || '';
  return [city, state].filter(Boolean).join(', ');
};

// 👇 Auto-center the map when coords update
function MapCenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 10);
    }
  }, [coords, map]);
  return null;
}

// 👇 Double-click to update location
function LocationSelector({ setUserCoords, setUserLocation }) {
  useMapEvents({
    dblclick: async (e) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;
      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const simplified = simplifyAddress(res.data.address);
        if (simplified) {
          localStorage.setItem('userLocation', simplified);
          setUserCoords([lat, lon]);
          setUserLocation(simplified);
          alert(`Location updated to: ${simplified}`);
        } else {
          alert('Could not extract city/state from that location.');
        }
      } catch (err) {
        console.error('Reverse geocoding error:', err);
      }
    },
  });
  return null;
}

// 👇 Search bar in top-right corner
function SearchBar({ setUserCoords, setUserLocation }) {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&limit=1&addressdetails=1`
      );
      if (res.data.length > 0) {
        const { lat, lon, address } = res.data[0];
        const simplified = simplifyAddress(address);
        if (simplified) {
          //localStorage.setItem('userLocation', simplified);
          const email = localStorage.getItem('current_user_email');
          await fetch(
            `http://localhost:4000/api/user/updateLocation/${encodeURIComponent(email)}/${encodeURIComponent(simplified)}`,
            {
              method: 'PATCH',
            }
          );
          setUserCoords([parseFloat(lat), parseFloat(lon)]);
          setUserLocation(simplified);
          alert(`Location updated to: ${simplified}`);
          setQuery('');
        } else {
          alert('Could not extract city/state from that location.');
        }
      } else {
        alert('Location not found.');
      }
    } catch (err) {
      console.error('Search geocoding error:', err);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <input
        type="text"
        placeholder="Search a location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '6px', width: '200px' }}
      />
      <button type="submit" style={{ marginLeft: '8px' }}>
        Go
      </button>
    </form>
  );
}

export default function InteractiveMap() {
  const [userCoords, setUserCoords] = useState(null);
 
  const [userLocation, setUserLocation] = useState('');

  //Get the location of current user with useEffect hook (has to be like this because can't do async in React components)
  useEffect(() => {
    const userEmail = localStorage.getItem('current_user_email');
    const fetchUserLocation = async () => {
      try{
        const response = await fetch(
          `http://localhost:4000/api/user/getLocation/${userEmail}`
        );
        if (!response.ok){
          throw new Error('Failed to fetch location');
        }
        const data = await response.json();
        const location = data.location;
        setUserLocation(location || '');
      }catch (err){
        console.error(err);
      }
    };
    fetchUserLocation();
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            userLocation
          )}&format=json&limit=1`
        );
        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setUserCoords([parseFloat(lat), parseFloat(lon)]);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    };

    fetchCoordinates();
  }, [userLocation]);

  const fallbackCenter = [28.5383, -81.3792];
  const center = userCoords || fallbackCenter;

  return (
    <div style={{ height: '500px', width: '100%', marginTop: '20px', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        doubleClickZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <LocationSelector
          setUserCoords={setUserCoords}
          setUserLocation={setUserLocation}
        />
        <MapCenter coords={userCoords} />
        <SearchBar
          setUserCoords={setUserCoords}
          setUserLocation={setUserLocation}
        />

        {userCoords && (
          <Marker position={userCoords}>
            <Popup>
              Your Location: <strong>{userLocation}</strong>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
