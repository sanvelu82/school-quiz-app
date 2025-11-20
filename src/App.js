// src/App.js
import React, { useState, useEffect } from 'react';
import LoginScreen from './components/Auth/LoginScreen';
import ConfirmationScreen from './components/Auth/ConfirmationScreen';
import QuizApp from './components/Quiz/QuizApp'; 
import { handleSubmitResults } from './services/api';
import './App.css'; // Ensure CSS is imported

function App() {
  const [studentProfile, setStudentProfile] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  
  // STRICT MODE STATE
  const [isFullScreen, setIsFullScreen] = useState(true); 

  // --- 1. Full Screen Helper Function ---
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => console.log(err));
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  };

  // --- 2. Strict Mode Listener ---
  useEffect(() => {
    const handleFullScreenChange = () => {
      const isFull = !!document.fullscreenElement || !!document.webkitFullscreenElement;
      setIsFullScreen(isFull);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
    };
  }, []);

  const handleLoginSuccess = (profileData) => {
    setStudentProfile(profileData);
    setSubmissionStatus('idle');
    enterFullScreen();
  };
  
  const handleStartQuiz = () => {
    setIsConfirmed(true);
    enterFullScreen();
  };

  const handleQuizFinish = async (finalScore, detailedResponses) => {
    setSubmissionStatus('submitting');
    
    // Exit full screen safely before alert (optional, keeps UX clean)
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});

    const result = await handleSubmitResults(studentProfile, finalScore, detailedResponses);
    
    if (result && result.status === 'success') {
      setSubmissionStatus('success');
    } else {
      alert('Submission failed! Please contact the invigilator.');
      setSubmissionStatus('error');
    }
  };

  const handleLogout = () => {
    setStudentProfile(null);
    setIsConfirmed(false);
    setSubmissionStatus('idle');
  };

  // --- 3. STRICT MODE VIOLATION SCREEN ---
  if (studentProfile && !isFullScreen && submissionStatus !== 'success') {
    return (
      <div className="violation-overlay">
        <div className="violation-box">
          <h1>⚠️ ACTION REQUIRED</h1>
          <p>You are attempting to exit the secure exam environment.</p>
          <p>To continue the quiz, you must return to Full Screen mode.</p>
          <button onClick={enterFullScreen} className="return-btn">
            Return to Exam
          </button>
        </div>
      </div>
    );
  }

  // --- NORMAL RENDERING LOGIC ---

  // 1. Login Screen
  if (!studentProfile) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />; 
  }

  // 2. Confirmation / Hall Ticket
  if (studentProfile && !isConfirmed) {
    return <ConfirmationScreen studentProfile={studentProfile} onConfirmStart={handleStartQuiz} />;
  }

  // 3. Submitting State (Styled with Ultimate UI)
  if (submissionStatus === 'submitting') {
    return (
      <div className="ultimate-bg">
        <div className="glass-panel animate-card-entry" style={{textAlign: 'center'}}>
          <div className="spinner" style={{margin: '20px auto'}}></div> {/* Add a CSS spinner if you have one, or just text */}
          <h2 style={{color: '#1e293b'}}>Submitting Results...</h2>
          <p style={{color: '#64748b'}}>Please do not close this window.</p>
        </div>
      </div>
    );
  }

  // 4. Success State (Styled with Ultimate UI)
  if (submissionStatus === 'success') {
    return (
      <div className="ultimate-bg">
        <div className="glass-panel animate-card-entry" style={{textAlign: 'center'}}>
          <div style={{fontSize: '4rem', marginBottom: '20px'}}>🎉</div>
          <h2 style={{color: '#10b981', fontWeight: '900', marginBottom: '10px'}}>Submission Successful!</h2>
          <p style={{color: '#334155', fontSize: '1.1rem', marginBottom: '30px'}}>
             Thank you, <strong>{studentProfile.fullName}</strong>.
             <br/>Your exam responses have been securely recorded.
          </p>
          <button onClick={handleLogout} className="neon-button">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // 5. Main Quiz App
  return <QuizApp studentProfile={studentProfile} onQuizFinish={handleQuizFinish} />;
}

export default App;