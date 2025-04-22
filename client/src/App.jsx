import React, { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

function App() {
  const [screen, setScreen] = useState(() => localStorage.getItem('currentScreen') || 'landing');
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('guest');

  //Initial load
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedType = localStorage.getItem('userType');
    const storedName = localStorage.getItem('userDisplayName');

    if (storedType === 'authenticated' && storedEmail) {
      setUser({ email: storedEmail, displayName: storedName || 'User' });
      setUserType('authenticated');
    } else {
      setUser(null);
      setUserType('guest');
    }
  }, []);

  //Re-check on custom event
  useEffect(() => {
    const handleUserLogin = () => {
      const storedEmail = localStorage.getItem('userEmail');
      const storedType = localStorage.getItem('userType');
      const storedName = localStorage.getItem('userDisplayName');

      if (storedType === 'authenticated' && storedEmail) {
        setUser({ email: storedEmail, displayName: storedName || 'User' });
        setUserType('authenticated');
      } else {
        setUser(null);
        setUserType('guest');
      }
    };

    window.addEventListener('user-login', handleUserLogin);
    return () => window.removeEventListener('user-login', handleUserLogin);
  }, []);

  const handleNavigate = (nextScreen) => {
    localStorage.setItem('currentScreen', nextScreen);
    setScreen(nextScreen);
  };

  return screen === 'dashboard' ? (
    <Dashboard
      onNavigate={handleNavigate}
      user={user}
      userType={userType}
    />
  ) : (
    <LandingPage onNavigate={handleNavigate} />
  );
}

export default App;
