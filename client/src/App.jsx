import React, { useState } from 'react';
import ChecklistPage from './components/ChecklistPage';
import ChatBoard from './components/ChatBoard';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ResourcesPage from './components/ResourcesPage';
import UserProfile from './components/UserProfile';
//import { onAuthStateChanged } from 'firebase/auth';


function App() {
  const [screen, setScreen] = useState('landing');

  const renderScreen = () => {
    switch (screen) {
      case 'landing':
        return <LandingPage onNavigate={setScreen} />;
      case 'dashboard':
        return <Dashboard onNavigate={setScreen} />;
      case 'checklist':
        return <ChecklistPage onNavigate={setScreen} />;
      case 'chat':
        return <ChatBoard onNavigate={setScreen} />;
      case 'resources':
        return <ResourcesPage onNavigate={setScreen} />;
      case 'profile':
        return <UserProfile onNavigate={setScreen} />;
      default:
        return <LandingPage onNavigate={setScreen} />;
    }
  };

  return <div className="App">{renderScreen()}</div>;
}

export default App;

