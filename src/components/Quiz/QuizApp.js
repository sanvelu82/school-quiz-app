import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchQuestions } from '../../services/data';
import { getExamDurationSeconds } from '../../utils/scheduler';
import Header from '../shared/Header';
import QuestionDisplay from './QuestionDisplay';
import NavigatorPanel from './NavigatorPanel';

const BEEP_URL = "/mixkit-start-countdown-927.wav"; 

function QuizApp({ studentProfile, session, onQuizFinish }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [allResponses, setAllResponses] = useState({}); 
  const [isPaletteOpen, setIsPaletteOpen] = useState(false); 

  const beepAudio = useRef(new Audio(BEEP_URL));

  // Load Data
  useEffect(() => {
    if (session && session.questionFile) {
      fetchQuestions(session.questionFile)
        .then(data => { 
          setQuestions(data); 
          const secondsLeft = getExamDurationSeconds(session);
          setTimeRemaining(secondsLeft);
          setLoading(false); 
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [session]);

  // Core Submission Logic
  const handleFinalSubmit = useCallback(() => {
    let score = 0;
    questions.forEach(q => {
      const response = allResponses[q.id];
      if (response?.answer) {
        const positiveMark = q.marks !== undefined ? q.marks : 4;
        const negativeMark = q.negativeMarks !== undefined ? q.negativeMarks : 1;
        score += (response.answer === q.correctAnswer) ? positiveMark : -negativeMark;
      }
    });
    onQuizFinish(score, allResponses);
  }, [questions, allResponses, onQuizFinish]);

  // 🛑 NEW: Manual Submit Wrapper with Confirmation
  const handleManualSubmitButton = () => {
    // Check if time is still remaining
    if (timeRemaining > 0) {
      const confirmSubmit = window.confirm(
        "⏳ You still have time left!\n\nAre you sure you want to SUBMIT your exam now? This cannot be undone."
      );
      if (!confirmSubmit) return; // Stop if they click Cancel
    }
    // Proceed if confirmed or time is 0 (though time=0 calls handleFinalSubmit directly)
    handleFinalSubmit();
  };

  // Timer Logic
  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(); // Auto-submit when time dies
          return 0;
        }
        
        if (prev === 9) { 
           if (beepAudio.current) {
             beepAudio.current.currentTime = 0;
             beepAudio.current.play().catch(e => console.warn("Audio blocked"));
           }
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, handleFinalSubmit]);

  // Initial visited state
  useEffect(() => {
    if (!loading && questions.length > 0) {
      const currentQId = questions[currentQIndex]?.id;
      if (currentQId) {
        setAllResponses((prev) => {
          if (prev[currentQId]) return prev;
          return { ...prev, [currentQId]: { answer: null, status: 'visited' } };
        });
      }
    }
  }, [currentQIndex, questions, loading]);

  const handleAnswerChange = useCallback((qId, opt) => {
    if (beepAudio.current.paused) {
        beepAudio.current.play().then(() => {
            beepAudio.current.pause();
            beepAudio.current.currentTime = 0;
        }).catch(() => {});
    }
    setAllResponses(prev => ({ ...prev, [qId]: { ...prev[qId], answer: opt, status: 'answered' } }));
  }, []);

  const handleClearSelection = () => {
    const currentQId = questions[currentQIndex].id;
    setAllResponses(prev => ({
      ...prev,
      [currentQId]: { ...(prev[currentQId] || {}), answer: null, status: 'visited' }
    }));
  };

  const handleMarkReview = () => {
    const currentQId = questions[currentQIndex].id;
    setAllResponses(prev => ({
      ...prev,
      [currentQId]: { ...prev[currentQId], status: 'marked_review' }
    }));
  };

  const handlePrevious = () => { if (currentQIndex > 0) setCurrentQIndex(prev => prev - 1); };
  
  const handleSaveNext = () => {
    if (currentQIndex < questions.length - 1) setCurrentQIndex(prev => prev + 1);
    setIsPaletteOpen(false); 
  };
  
  const handleQuestionClick = (index) => {
    setCurrentQIndex(index);
    setIsPaletteOpen(false);
  };

  if (loading) return <div style={{padding:50, textAlign:'center'}}>Loading Exam Paper...</div>;
  
  const currentQuestion = questions[currentQIndex];
  const currentSelectedAnswer = allResponses[currentQuestion?.id]?.answer || null;

  return (
    <div className="quiz-page">
      <div className="watermark-container">
        {Array.from({ length: 150 }).map((_, i) => ( <span key={i} className="watermark-text">SVV HI-TECH</span> ))}
      </div>

      <Header studentProfile={studentProfile} timeRemaining={timeRemaining} />
      
      <div className={`mobile-overlay ${isPaletteOpen ? 'active' : ''}`} onClick={() => setIsPaletteOpen(false)}></div>

      <div className="quiz-main-grid">
        <div className="quiz-panel">
           <div className="panel-top-bar">
              <h3>
                Question {currentQIndex + 1}
                {currentQuestion && (
                  <span style={{fontSize: '0.85rem', marginLeft: '12px', fontWeight: '700'}}>
                    <span style={{color: '#16a34a'}}>(+{currentQuestion.marks || 4}</span>
                    <span style={{color: '#94a3b8'}}>, </span>
                    <span style={{color: '#dc2626'}}>-{currentQuestion.negativeMarks !== undefined ? currentQuestion.negativeMarks : 1})</span>
                  </span>
                )}
              </h3>
              <button className="palette-toggle-btn" onClick={() => setIsPaletteOpen(true)}>☰</button>
           </div>
           
           {currentQuestion && (
             <QuestionDisplay 
                question={currentQuestion}
                selectedAnswer={currentSelectedAnswer}
                onAnswerChange={handleAnswerChange}
             />
           )}
        </div>
        
        <div className={`navigator-panel ${isPaletteOpen ? 'mobile-visible' : ''}`}>
          <div className="mobile-close-btn">
            <span>Question Palette</span>
            <button onClick={() => setIsPaletteOpen(false)}>✕</button>
          </div>
          <NavigatorPanel 
            questions={questions}
            allResponses={allResponses}
            currentQIndex={currentQIndex}
            onQuestionClick={handleQuestionClick}
          />
        </div>
      </div>

      <div className="bottom-bar">
        <div className="bottom-left">
          <button className="quiz-btn btn-prev" onClick={handlePrevious} disabled={currentQIndex === 0}>←</button>
          <button className="quiz-btn btn-clear" onClick={handleClearSelection}>Clear</button>
          <button className="quiz-btn btn-mark" onClick={handleMarkReview}>Review</button>
        </div>
        <div className="bottom-right">
          <button className="quiz-btn btn-save" onClick={handleSaveNext}>Save & Next</button>
          {currentQIndex === questions.length - 1 && (
             <button 
               onClick={handleManualSubmitButton} // ⚠️ Calls the wrapper with confirmation
               style={{background:'#dc2626', color:'white', border:'none'}} 
               className="quiz-btn"
             >
               Submit
             </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizApp;