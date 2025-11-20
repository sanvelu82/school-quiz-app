import React, { useState, useEffect, useRef } from 'react';
import LoginScreen from './components/Auth/LoginScreen';
import ConfirmationScreen from './components/Auth/ConfirmationScreen';
import QuizApp from './components/Quiz/QuizApp'; 
import { handleSubmitResults } from './services/api';

// 🔊 DEFINE AUDIO HERE (Ensure file exists in public folder)
const BEEP_URL = "/beep.mp3"; 

function App() {
  const [studentProfile, setStudentProfile] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [currentSession, setCurrentSession] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(true); 

  // 🔊 CREATE AUDIO PLAYER ONCE
  const beepAudio = useRef(new Audio(BEEP_URL));

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen().catch(err => console.log(err));
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  };

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

  const handleLoginSuccess = (profileData, sessionData) => {
    setStudentProfile(profileData);
    setCurrentSession(sessionData); 
    setSubmissionStatus('idle');
    enterFullScreen();
  };
  
  const handleStartQuiz = () => {
    setIsConfirmed(true);
    enterFullScreen();

    // 🔊 UNLOCK AUDIO: Play and immediately pause
    // This tells the browser "The user wants this sound," so the timer can play it later.
    const audio = beepAudio.current;
    if (audio) {
      audio.volume = 1.0;
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(error => console.log("Audio Unlock Failed (Check file path):", error));
    }
  };

  const handleQuizFinish = async (finalScore, detailedResponses) => {
    setSubmissionStatus('submitting');
    const result = await handleSubmitResults(studentProfile, finalScore, detailedResponses);
    if (result && result.status === 'success') {
      setSubmissionStatus('success');
    } else {
      alert('Submission failed! Please contact invigilator.');
      setSubmissionStatus('error');
    }
  };

  const handleLogout = () => {
    setStudentProfile(null);
    setCurrentSession(null);
    setIsConfirmed(false);
    setSubmissionStatus('idle');
    if (document.exitFullscreen) document.exitFullscreen().catch(e => {});
  };

  if (studentProfile && !isFullScreen && submissionStatus !== 'success') {
    return (
      <div className="violation-overlay">
        <div className="violation-box">
          <h1>⚠️ ACTION REQUIRED</h1>
          <p>To continue the quiz, you must return to Full Screen mode.</p>
          <button onClick={enterFullScreen} className="return-btn">Return to Exam</button>
        </div>
      </div>
    );
  }

  if (!studentProfile) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />; 
  }

  if (studentProfile && !isConfirmed) {
    return (
      <ConfirmationScreen 
         studentProfile={studentProfile} 
         session={currentSession}
         onConfirmStart={handleStartQuiz} 
      />
    );
  }

  if (submissionStatus === 'submitting') {
    return <div className="app-container" style={{textAlign: 'center', marginTop: '50px'}}><h2>Submitting...</h2></div>;
  }

  if (submissionStatus === 'success') {
    return (
      <div className="app-container" style={{textAlign: 'center', marginTop: '50px'}}>
        <h1 style={{color: 'green'}}>Submitted Successfully!</h1>
        <button onClick={handleLogout} style={{padding: '10px 20px', marginTop: '20px'}}>Return to Home</button>
      </div>
    );
  }

  return (
    <QuizApp 
      studentProfile={studentProfile} 
      session={currentSession}
      onQuizFinish={handleQuizFinish}
      beepAudio={beepAudio.current} // 🔊 PASS UNLOCKED AUDIO DOWN
    />
  );
}

export default App;