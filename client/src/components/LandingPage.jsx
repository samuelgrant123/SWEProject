import React, { useState } from 'react';
import './LandingPage.css';

export default function LandingPage({ onNavigate }) {
  const [showForm, setShowForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? 'login' : 'signup';

    try{
      const response = await fetch(`http://localhost:4000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      const userData = await fetch('http://localhost:4000/api/auth/user');
      const auth = await userData.json();
      if(auth.auth && auth.auth.user){
        localStorage.setItem('current_user', auth.auth.user); 
        localStorage.setItem('current_user_type', 'user');
        localStorage.setItem('current_user_location', 'Gainesville, Florida');   
      }
      setLoading(false);
      onNavigate('dashboard');
    }catch (err){
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      <div className="navbar">
        <img src="/logo.png" alt="DisasterDash Logo" className="logo" />
      </div>

      <div className="hero animated">
        <h1 className="headline">DisasterDash</h1>
        <p className="subtext">Stay Ready. Stay Safe. Stay Connected.</p>

        {!showForm && (
          <div className="cta-buttons">
            <button className="primary" onClick={() => setShowForm(true)}>
              Get Started
            </button>
            <button
              className="secondary"
              onClick={() => {
                localStorage.setItem('current_user_type', 'guest');
                localStorage.setItem('current_user_location', 'Gainesville, Florida');
                onNavigate('dashboard');
              }}
            >
              Explore as Guest
            </button>
          </div>
        )}

        {showForm && (
          <div className="w-full max-w-md mx-auto bg-white rounded-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-center mb-4">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </h2>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full mb-4 px-4 py-2 border rounded"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              )}

              <input
                type="email"
                placeholder="Email"
                className="w-full mb-4 px-4 py-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full mb-4 px-4 py-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full mb-6 px-4 py-2 border rounded"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              )}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Loading...' : isLogin ? 'Log In' : 'Sign Up'}
              </button>
            </form>

            <p className="text-center mt-4 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                className="text-blue-500 underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>

            <button
              className="mt-6 text-sm underline text-gray-600 block mx-auto"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
