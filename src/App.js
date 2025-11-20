import React, { useState } from 'react';
import LoginScreen from './components/Auth/LoginScreen';
import ConfirmationScreen from './components/Auth/ConfirmationScreen';
import QuizApp from './components/Quiz/QuizApp'; 
import { handleSubmitResults } from './services/api'; // Import the API submission function

function App() {
  // State to track the student's session
  const [studentProfile, setStudentProfile] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  // State to track the submission process
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'

  const handleLoginSuccess = (profileData) => {
    setStudentProfile(profileData);
    setSubmissionStatus('idle'); // Reset status on new login
  };
  
  const handleStartQuiz = () => {
    setIsConfirmed(true); // Move to the quiz screen
  };

  const handleQuizFinish = async (finalScore, detailedResponses) => {
    // 1. Update UI to show loading state
    setSubmissionStatus('submitting');

    // 2. Send data to Google Sheets via Apps Script
    const result = await handleSubmitResults(studentProfile, finalScore, detailedResponses);

    // 3. Handle the response
    if (result && result.status === 'success') {
      setSubmissionStatus('success');
    } else {
      alert('Submission failed! Please try again or contact the invigilator.');
      setSubmissionStatus('error');
    }
    
    // We do NOT reset studentProfile immediately, so we can show the "Thank You" screen
  };

  const handleLogout = () => {
    setStudentProfile(null);
    setIsConfirmed(false);
    setSubmissionStatus('idle');
  };

  // --- RENDERING LOGIC ---

  // 1. Show Login Screen if no student data
  if (!studentProfile) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />; 
  }

  // 2. Show Confirmation Screen after login (before quiz starts)
  if (studentProfile && !isConfirmed) {
    return <ConfirmationScreen 
            studentProfile={studentProfile} 
            onConfirmStart={handleStartQuiz} 
          />;
  }

  // 3. Handle Submission States (Loading / Success / Error)
  if (submissionStatus === 'submitting') {
    return (
      <div className="app-container" style={{textAlign: 'center', marginTop: '50px'}}>
        <h2>Submitting your results...</h2>
        <p>Please do not close this window.</p>
      </div>
    );
  }

  if (submissionStatus === 'success') {
    return (
      <div className="app-container" style={{textAlign: 'center', marginTop: '50px', fontFamily: 'Arial'}}>
        <h1 style={{color: 'green'}}>Test Submitted Successfully!</h1>
        <p>Thank you, <strong>{studentProfile.fullName}</strong>.</p>
        <p>Your response has been recorded.</p>
        <button 
          onClick={handleLogout} 
          style={{padding: '10px 20px', marginTop: '20px', cursor: 'pointer'}}
        >
          Return to Home
        </button>
      </div>
    );
  }

  // 4. Show Quiz App (The Main Exam Interface)
  return (
    <QuizApp 
      studentProfile={studentProfile} 
      onQuizFinish={handleQuizFinish} 
    />
  );
}

export default App;