// client/src/App.jsx
import React, { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

import { auth } from './Firebase'; // ✅ Now imported from firebase.js
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [screen, setScreen] = useState(() => {
    return localStorage.getItem('currentScreen') || 'landing';
  });
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userType, setUserType] = useState('guest');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        setUserType('authenticated');
        localStorage.setItem('userType', 'authenticated');
        localStorage.setItem('userLocation', 'Gainesville, Florida');
        localStorage.setItem('current_user', JSON.stringify({
          displayName: user.displayName,
          email: user.email,
        }));
      } else {
        setFirebaseUser(null);
        const storedType = localStorage.getItem('userType');
        setUserType(storedType === 'authenticated' ? 'authenticated' : 'guest');
      }
    });
  
    return () => unsubscribe();
  }, []);

  const handleNavigate = (nextScreen) => {
    localStorage.setItem('currentScreen', nextScreen);
    if (nextScreen === 'dashboard' && localStorage.getItem('userType') === 'guest') {
      setUserType('guest');
      setFirebaseUser(null);
    }
    setScreen(nextScreen);
  };

  const renderScreen = () => {
    if (screen === 'dashboard') {
      return (
        <Dashboard
          onNavigate={handleNavigate}
          user={firebaseUser}
          userType={userType}
        />
      );
    }

    return <LandingPage onNavigate={handleNavigate} />;
  };

  return <div>{renderScreen()}</div>;
}

export default App;
