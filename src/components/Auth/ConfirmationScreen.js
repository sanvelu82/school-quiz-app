import React, { useState, useEffect } from 'react';
import { getSecondsUntilStart } from '../../utils/scheduler';

function ConfirmationScreen({ studentProfile, session, onConfirmStart }) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [secondsToStart, setSecondsToStart] = useState(0);

  // Check start time every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (session) {
        const remaining = getSecondsUntilStart(session); // Pass whole session object
        setSecondsToStart(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const isExamStarted = secondsToStart <= 0;

  const handleStart = () => {
    if (isConfirmed && isExamStarted) {
      onConfirmStart();
    }
  };

  return (
    <div className="ultimate-bg">
      <div className="glass-panel hall-ticket animate-card-entry">
        
        <div className="ticket-header">
          <div className="ticket-badge">2025 EXAM SESSION</div>
          <h3>Candidate Verification</h3>
          <p>Please verify your identity before proceeding.</p>
        </div>

        <div className="candidate-grid">
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
                <div className="value-box">
                   {studentProfile.class || studentProfile.quizClass} - {studentProfile.section || studentProfile.quizSection}
                </div>
              </div>
            </div>

            <div className="detail-row">
              <label>Session</label>
              <div className="value-box">{session ? session.name : 'Unknown'}</div>
            </div>
          </div>
        </div>

        <div className="instruction-box">
          <h4>⚠️ Important Instructions:</h4>
          <ul>
            <li>Do not close or refresh the browser window.</li>
            <li>Full Screen is monitored. Exiting may submit the test.</li>
            <li>Click "Submit" only after answering all questions.</li>
          </ul>
        </div>

        <div className="confirmation-footer">
          
          {!isExamStarted ? (
              <div style={{textAlign:'center', marginBottom:'20px', color:'#dc2626', fontWeight:'bold', background:'#fff0f0', padding:'10px', borderRadius:'8px'}}>
                 ⏳ Exam starts in: {Math.floor(secondsToStart / 60)}m {secondsToStart % 60}s
              </div>
            ) : (
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                />
                I confirm that the details above are correct and I am ready to begin.
              </label>
            )}

          <button 
            onClick={handleStart} 
            disabled={!isConfirmed || !isExamStarted}
            className="start-btn"
            style={{ opacity: (!isExamStarted || !isConfirmed) ? 0.6 : 1 }}
          >
            {isExamStarted ? 'Start Examination' : `Wait for ${session.startTime}`}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmationScreen;