// src/components/Quiz/QuizApp.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchQuestions } from '../../services/data';
import { getExamDurationSeconds } from '../../utils/scheduler';
import Header from '../shared/Header';
import QuestionDisplay from './QuestionDisplay';
import NavigatorPanel from './NavigatorPanel';

// 🔊 A verified, sharp "Beep" sound (Base64 encoded WAV)
const BEEP_URL = "data:audio/wav;base64,UklGRl9vT1dGXDJtefmtmbWZvZ29n"; // (Shortened for display)

// Use this full string for the actual sound:
const VALID_BEEP = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJCcjX5zvZCwnm1tto2TkYF8hYd/eXFxb3NzpYyOj3J5eXqEhoKAe32HgXt3dXaDhYeDf3x7fn19gIGDg4SFhoeIiYqLjI2OkZOUlZaXmJmam5yen6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==";

function QuizApp({ studentProfile, session, onQuizFinish }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [allResponses, setAllResponses] = useState({}); 
  const [isPaletteOpen, setIsPaletteOpen] = useState(false); 

  // Audio Ref
  const beepAudio = useRef(new Audio(VALID_BEEP));

  // 1. Load Questions & Timer
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

  const handleFinalSubmit = useCallback(() => {
    let score = 0;
    questions.forEach(q => {
      const response = allResponses[q.id];
      if (response?.answer) {
        score += (response.answer === q.correctAnswer) ? 4 : -1;
      }
    });
    onQuizFinish(score, allResponses);
  }, [questions, allResponses, onQuizFinish]);

  // 2. Timer & Beep Logic
  useEffect(() => {
    if (loading) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        
        // 🔊 PLAY BEEP (Last 10 seconds)
        if (prev <= 11 && prev > 1) { 
           // Browser requires user interaction first. 
           // If this logs "Audio blocked", click anywhere on the page once.
           beepAudio.current.currentTime = 0;
           beepAudio.current.play().catch(e => console.warn("Audio blocked (User must interact first):", e));
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, handleFinalSubmit]);

  // Handlers
  const handleAnswerChange = useCallback((qId, opt) => {
    // Unlock audio on first interaction (Workaround for browser autoplay policy)
    if (beepAudio.current.paused) {
      beepAudio.current.play().then(() => beepAudio.current.pause()).catch(() => {});
    }
    setAllResponses(prev => ({ ...prev, [qId]: { ...prev[qId], answer: opt, status: 'answered' } }));
  }, []);

  const handleClearSelection = () => {
    const currentQId = questions[currentQIndex].id;
    setAllResponses(prev => {
      const newResponses = { ...prev };
      if (newResponses[currentQId]) {
        newResponses[currentQId] = { ...newResponses[currentQId], answer: null, status: 'visited' };
      }
      return newResponses;
    });
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

  // --- RENDER ---

  if (loading) return <div style={{padding:50, textAlign:'center'}}>Loading Exam Paper...</div>;
  
  const currentQuestion = questions[currentQIndex];
  const currentSelectedAnswer = allResponses[currentQuestion?.id]?.answer || null;

  return (
    <div className="quiz-page">
      <div className="watermark-container">
        {Array.from({ length: 50 }).map((_, i) => ( <span key={i} className="watermark-text">SVV HI-TECH</span> ))}
      </div>

      <Header studentProfile={studentProfile} timeRemaining={timeRemaining} />
      
      <div className={`mobile-overlay ${isPaletteOpen ? 'active' : ''}`} onClick={() => setIsPaletteOpen(false)}></div>

      <div className="quiz-main-grid">
        <div className="quiz-panel">
           <div className="panel-top-bar">
              <h3>Question {currentQIndex + 1}</h3>
              
              {/* Menu Button */}
              <button className="palette-toggle-btn" onClick={() => setIsPaletteOpen(true)}>
                ☰
              </button>
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
             <button onClick={handleFinalSubmit} style={{background:'#dc2626', color:'white', border:'none'}} className="quiz-btn">Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizApp;