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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
            <h2 className="school-line-2">SRI VINAYAGA VIDYALAYA SCHOOL</h2>
          </div>
        </div>

        {/* Badge */}
        <div className="portal-subtitle">
           Student Portal
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Roll Number */}
          <div className={`input-container ${focusedInput === 'roll' ? 'focused' : ''}`}>
            <div className="icon-box">🆔</div>
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
          
          {/* Password */}
          <div className={`input-container ${focusedInput === 'pass' ? 'focused' : ''}`}>
            <div className="icon-box">🔐</div>
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
            {loading ? 'Checking...' : 'Secure Login >'}
          </button>
        </form>
        
        <div className="panel-footer">
          <p>100% Secure Exam Environment</p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;