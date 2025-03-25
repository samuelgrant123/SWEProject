import React from 'react';
import { getAuth, signOut } from 'firebase/auth';

const Dashboard = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">DisasterDash</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Hello, {user?.displayName || user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Welcome to the Dashboard</h2>
          <p>You've successfully logged in to DisasterDash.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;