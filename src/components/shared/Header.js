// src/components/shared/Header.js

// Add isConfirmation prop
function Header({ studentProfile, timeRemaining, isConfirmation }) {
const formatTime = (seconds) => {
    // Math.floor ensures you get integer hours, minutes, seconds
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    // padStart ensures 05, 09 instead of 5, 9
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="app-header">
      <img src={studentProfile.photoUrl} alt="Student" className="header-photo" />
      <div className="student-info">
        <span>Name: {studentProfile.fullName}</span>
        <span>Class/Sec: {studentProfile.class}-{studentProfile.section}</span>
      </div>
      
      {/* Only display the timer if NOT on the confirmation screen */}
      {!isConfirmation && (
        <div className="timer">
          Time Left: <strong>{formatTime(timeRemaining)}</strong>
        </div>
      )}
    </div>
  );
}

export default Header;