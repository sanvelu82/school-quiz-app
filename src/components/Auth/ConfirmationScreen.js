// src/components/Auth/ConfirmationScreen.js
import React, { useState } from 'react';

function ConfirmationScreen({ studentProfile, onConfirmStart }) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleStart = () => {
    if (isConfirmed) {
      onConfirmStart();
    }
  };

  return (
    <div className="ultimate-bg">
      <div className="glass-panel hall-ticket animate-card-entry">
        
        {/* 1. Ticket Header */}
        <div className="ticket-header">
          <div className="ticket-badge">2025 EXAM SESSION</div>
          <h3>Candidate Verification</h3>
          <p>Please verify your identity before proceeding.</p>
        </div>

        {/* 2. Candidate Grid */}
        <div className="candidate-grid">
          
          {/* Photo Column */}
          <div className="photo-section">
            <div className="photo-frame">
              <img 
                src={studentProfile.photoUrl || "https://via.placeholder.com/150"} 
                alt="Candidate" 
                className="candidate-img" 
              />
              <span className="photo-label">LIVE PHOTO</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="details-section">
            <div className="detail-row">
              <label>Candidate Name</label>
              <div className="value-box highlight-text">{studentProfile.fullName}</div>
            </div>
            
            <div className="detail-row-split">
              <div className="split-item">
                <label>Roll Number</label>
                <div className="value-box">{studentProfile.rollNo}</div>
              </div>
              <div className="split-item">
                <label>Class & Sec</label>
                
                {/* 🚨 FIX: Changed quizClass -> class and quizSection -> section */}
                <div className="value-box">
                   {studentProfile.class || studentProfile.quizClass} - {studentProfile.section || studentProfile.quizSection}
                </div>
                
              </div>
            </div>

            <div className="detail-row">
              <label>Exam Center</label>
              <div className="value-box">Computer Lab 1 (Main Block)</div>
            </div>
          </div>
        </div>

        {/* 3. Instructions */}
        <div className="instruction-box">
          <h4>⚠️ Important Instructions:</h4>
          <ul>
            <li>Do not close or refresh the browser window.</li>
            <li>Full Screen is monitored. Exiting may submit the test.</li>
            <li>Click "Submit" only after answering all questions.</li>
          </ul>
        </div>

        {/* 4. Footer */}
        <div className="confirmation-footer">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
            />
            I confirm that the details above are correct and I am ready to begin.
          </label>

          <button 
            onClick={handleStart} 
            disabled={!isConfirmed}
            className="start-btn"
          >
            Start Examination
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmationScreen;