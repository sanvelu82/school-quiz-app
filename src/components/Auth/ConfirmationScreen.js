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
      {/* Reusing glass-panel but adding 'hall-ticket' class for specific width */}
      <div className="glass-panel hall-ticket animate-card-entry">
        
        {/* 1. Ticket Header */}
        <div className="ticket-header">
          <div className="ticket-badge">2025 EXAM SESSION</div>
          <h3>Candidate Verification</h3>
          <p>Please verify your identity before proceeding.</p>
        </div>

        <div className="ticket-divider"></div>

        {/* 2. Candidate Grid (Photo + Details) */}
        <div className="candidate-grid">
          
          {/* Photo Column: Box Type with Radius */}
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

          {/* Details Column: Professional Alignment */}
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
                <div className="value-box">{studentProfile.quizClass} - {studentProfile.quizSection}</div>
              </div>
            </div>

            <div className="detail-row">
              <label>Exam Center</label>
              <div className="value-box">Computer Lab 1 (Main Block)</div>
            </div>
          </div>
        </div>

        {/* 3. Instructions Box */}
        <div className="instruction-box">
          <h4>⚠️ Important Instructions:</h4>
          <ul>
            <li>Do not close or refresh the browser window.</li>
            <li>Using strict mode: Exiting full screen will pause the exam.</li>
            <li>Click "Submit" only after answering all questions.</li>
          </ul>
        </div>

        {/* 4. Confirmation & Button */}
        <div className="confirmation-footer">
          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
            />
            <span className="checkmark"></span>
            I confirm that the details above are correct and I am ready to begin.
          </label>

          <button 
            onClick={handleStart} 
            disabled={!isConfirmed}
            className="neon-button start-btn"
          >
            Start Examination
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmationScreen;