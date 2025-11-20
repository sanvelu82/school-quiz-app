// src/components/Auth/ConfirmationScreen.js
import React, { useState } from 'react';
import Header from '../shared/Header'; // Reusing the header component for consistent display

function ConfirmationScreen({ studentProfile, onConfirmStart }) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Use a fake time since the timer hasn't started yet
  const FAKE_TIME = 9999; 

  const handleStart = () => {
    if (isConfirmed) {
      onConfirmStart();
    }
  };

  return (
    <div className="confirmation-page">
      {/* Display info using the Header component structure */}
      <Header studentProfile={studentProfile} timeRemaining={FAKE_TIME} isConfirmation={true} />
      
      <div className="confirmation-box">
        <h3>Candidate Verification</h3>
        <p>Please review the details below before starting the examination.</p>
        
        <div className="detail-list">
          <p><strong>Roll No:</strong> {studentProfile.rollNo}</p>
          <p><strong>Name:</strong> {studentProfile.fullName}</p>
          <p><strong>Class:</strong> {studentProfile.class}-{studentProfile.section}</p>
        </div>

        <div className="confirmation-checkbox">
          <input
            type="checkbox"
            id="confirm"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
          />
          <label htmlFor="confirm">The above details are mine and confirmed.</label>
        </div>

        <button 
          onClick={handleStart} 
          disabled={!isConfirmed}
          className="start-button"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default ConfirmationScreen;