// src/components/shared/Header.js
import React from 'react';

// Use the exact same logo URL
const LOGO_URL = "https://i.ibb.co/qYxNQQPx/Picture2.png";

function Header({ studentProfile, timeRemaining }) {
  
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isUrgent = timeRemaining < 300; 

  return (
    <div className="quiz-header">
      
      {/* Left: Branding (Matches Login Styles) */}
      <div className="quiz-brand">
        {/* Reusing logo-wrapper class from Login for consistency */}
        <div className="logo-wrapper" style={{width:'50px', height:'50px'}}> 
           <img src={LOGO_URL} alt="Logo" className="school-logo-img" />
        </div>
        <div className="text-wrapper">
          <h1 className="school-line-1" style={{fontSize: '1.2rem'}}>SVV HI-TECH</h1>
          <h2 className="school-line-2">Sri Vinayaga Vidyalaya</h2>
        </div>
      </div>

      {/* Right: Student Info & Timer */}
      <div className="right-header-group">
        
        <div className="student-badge-container">
          {/* Box Photo */}
          <div className="student-photo-box">
            <img 
              src={studentProfile.photoUrl || "https://via.placeholder.com/150"} 
              alt="Profile" 
            />
          </div>
          
          {/* Split Info: Name/Roll (Top) | Class/Sec (Bottom) */}
          <div className="student-details">
            <div className="detail-line-top">
               {studentProfile.fullName} 
               <span className="roll-badge">{studentProfile.rollNo}</span>
            </div>
            <div className="detail-line-bottom">
               CLASS: {studentProfile.class || studentProfile.quizClass} - {studentProfile.section || studentProfile.quizSection}
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className={`quiz-timer ${isUrgent ? 'timer-warning' : ''}`}>
          {formatTime(timeRemaining)}
        </div>

      </div>
    </div>
  );
}

export default Header;