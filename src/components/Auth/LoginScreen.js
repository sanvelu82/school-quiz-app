// src/components/Auth/LoginScreen.js
import React, { useState } from 'react';
import { handleLogin } from '../../services/api'; 

function LoginScreen({ onLoginSuccess }) {
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // CONFIGURATION
  const LOGO_URL = "https://i.ibb.co/qYxNQQPx/Picture2.png";

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => console.log(err));
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    enterFullScreen(); // Trigger full screen on click

    if (!rollNo || !password) {
      setError('Please enter valid credentials.');
      setLoading(false);
      return;
    }

    const result = await handleLogin(rollNo, password);

    if (result.status === 'success') {
      onLoginSuccess(result.data);
    } else {
      setError(result.message || 'Login failed.');
    }
    setLoading(false);
  };

  return (
    <div className="ultimate-bg">
      <div className="glass-panel animate-card-entry">
        
        {/* Header */}
        <div className="id-header">
          <div className="logo-wrapper">
            <img src={LOGO_URL} alt="Logo" className="school-logo-img" />
          </div>
          <div className="text-wrapper">
            <h1 className="school-line-1">SVV HI-TECH</h1>
            <h2 className="school-line-2">Sri Vinayaga Vidyalaya School</h2>
          </div>
        </div>

        {/* Contest Badge */}
        <div className="portal-subtitle">
           🏆 Annual Quiz Contest 2025
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Roll Number Input */}
          <div className={`input-container ${focusedInput === 'roll' ? 'focused' : ''}`}>
            <div className="icon-box">
              {/* SVG User Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="field-wrapper">
              <label>Roll Number</label>
              <input 
                type="text" 
                value={rollNo} 
                placeholder="Ex: 1201"
                onChange={(e) => setRollNo(e.target.value)} 
                onFocus={() => setFocusedInput('roll')}
                onBlur={() => setFocusedInput(null)}
                disabled={loading} 
              />
            </div>
          </div>
          
          {/* Password Input */}
          <div className={`input-container ${focusedInput === 'pass' ? 'focused' : ''}`}>
            <div className="icon-box">
              {/* SVG Lock Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div className="field-wrapper">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                placeholder="Enter Password"
                onChange={(e) => setPassword(e.target.value)} 
                onFocus={() => setFocusedInput('pass')}
                onBlur={() => setFocusedInput(null)}
                disabled={loading} 
              />
            </div>
          </div>
          
          {error && (
            <div className="error-toast">
               ⚠️ {error}
            </div>
          )}
          
          <button type="submit" className="neon-button" disabled={loading}>
            {loading ? 'Checking details...' : 'Start Contest >'}
          </button>
        </form>
        
        <div className="panel-footer">
          <p>Official Contest Portal • Secure Mode</p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;