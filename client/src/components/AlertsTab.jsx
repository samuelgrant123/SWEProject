import React, { useEffect, useState } from 'react';

export default function AlertsTab() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState(localStorage.getItem('userLocation') || '');

  useEffect(() => {
    if (locationName) {
      fetchCoordinatesAndAlerts(locationName);
    }
  }, [locationName]);

  const fetchCoordinatesAndAlerts = async (location) => {
    try {
      // Get coordinates from location name
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
      );
      const geoData = await geoRes.json();
      if (geoData.length === 0) {
        console.error("Location not found.");
        setLoading(false);
        return;
      }

      const { lat, lon } = geoData[0];

      // Fetch alerts from NOAA based on coordinates
      const alertRes = await fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`);
      const alertData = await alertRes.json();

      setAlerts(alertData.features || []);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content alerts-tab">
      <h2>Disaster Alerts</h2>
      {loading ? (
        <p>Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p>No active alerts in your area.</p>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert, i) => (
            <div key={i} className="alert-card">
              <h3>{alert.properties.event}</h3>
              <p><strong>Severity:</strong> {alert.properties.severity}</p>
              <p><strong>Area:</strong> {alert.properties.areaDesc}</p>
              <p><strong>Starts:</strong> {new Date(alert.properties.effective).toLocaleString()}</p>
              <p><strong>Ends:</strong> {new Date(alert.properties.ends).toLocaleString()}</p>
              <p>{alert.properties.headline}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
