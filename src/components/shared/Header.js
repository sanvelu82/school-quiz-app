// src/components/shared/Header.js
import React from 'react';

const LOGO_URL = "https://i.ibb.co/qYxNQQPx/Picture2.png";

function Header({ studentProfile, timeRemaining }) {
  
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="quiz-header">
      
      {/* 1. BRANDING ROW (Always Top) */}
      <div className="quiz-brand">
        <div className="logo-wrapper" style={{width:'50px', height:'50px'}}> 
           <img src={LOGO_URL} alt="Logo" className="school-logo-img" />
        </div>
        <div className="text-wrapper">
          <h1 className="school-line-1" style={{fontSize: '1.2rem'}}>SVV HI-TECH</h1>
          <h2 className="school-line-2">Sri Vinayaga Vidyalaya</h2>
        </div>
      </div>

      {/* 2. DESKTOP INFO (Hidden on Mobile via CSS) */}
      <div className="right-header-group">
        <div className="student-badge-desktop">
          <div className="student-photo-small">
            <img src={studentProfile.photoUrl || "https://via.placeholder.com/150"} alt="Profile" />
          </div>
          <div className="student-text-desktop">
             <div className="detail-line-top">{studentProfile.fullName}</div>
             <div className="detail-line-bottom">{studentProfile.rollNo}</div>
          </div>
        </div>
        <div className="quiz-timer">{formatTime(timeRemaining)}</div>
      </div>

      {/* 3. MOBILE INFO ROW (Visible ONLY on Mobile) */}
      {/* This solves the "Hidden Info" issue */}
      <div className="student-info-row">
         <div className="student-photo-mobile">
            <img src={studentProfile.photoUrl || "https://via.placeholder.com/150"} alt="Profile" />
         </div>
         <div className="student-text-mobile">
            <div className="info-name">{studentProfile.fullName}</div>
            <div className="info-meta">
               {studentProfile.rollNo} • {studentProfile.class}-{studentProfile.section}
            </div>
         </div>
         <div className="mobile-timer">
            {formatTime(timeRemaining)}
         </div>
      </div>

    </div>
  );
}

export default Header;