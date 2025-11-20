// src/components/Quiz/QuizApp.js
import React, { useState, useEffect, useCallback } from 'react';
import { fetchQuestions } from '../../services/data';
import Header from '../shared/Header';
import QuestionDisplay from './QuestionDisplay';
import NavigatorPanel from './NavigatorPanel';

const TOTAL_TIME_SECONDS = 30; 

function QuizApp({ studentProfile, onQuizFinish }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME_SECONDS);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [allResponses, setAllResponses] = useState({}); 
  
  // Mobile Sidebar State
  const [isPaletteOpen, setIsPaletteOpen] = useState(false); 

  // Load Data
  useEffect(() => {
    fetchQuestions()
      .then(data => { setQuestions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Timer & Submit
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

  useEffect(() => {
    if (loading) return;
    if (timeRemaining <= 0) { handleFinalSubmit(); return; }
    const timer = setInterval(() => setTimeRemaining(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [loading, timeRemaining, handleFinalSubmit]);

  // Handlers
  const handleAnswerChange = useCallback((qId, opt) => {
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

  const handlePrevious = () => { if (currentQIndex > 0) setCurrentQIndex(prev => prev - 1); };
  const handleSaveNext = () => {
    if (currentQIndex < questions.length - 1) setCurrentQIndex(prev => prev + 1);
    // Do NOT close palette automatically on "Save & Next" if you want it to stay open, 
    // but usually for mobile it's better to close it to see the question.
    setIsPaletteOpen(false); 
  };
  const handleQuestionClick = (index) => {
    setCurrentQIndex(index);
    setIsPaletteOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  const currentQuestion = questions[currentQIndex];
  const currentSelectedAnswer = allResponses[currentQuestion?.id]?.answer || null;

  return (
    <div className="quiz-page">
      
      <div className="watermark-container">
        {Array.from({ length: 50 }).map((_, i) => ( <span key={i} className="watermark-text">SVV HI-TECH</span> ))}
      </div>

      <Header studentProfile={studentProfile} timeRemaining={timeRemaining} />
      
      {/* Mobile Overlay */}
      <div className={`mobile-overlay ${isPaletteOpen ? 'active' : ''}`} onClick={() => setIsPaletteOpen(false)}></div>

      <div className="quiz-main-grid">
        
        {/* Left: Question Area */}
        <div className="quiz-panel">
           <div className="panel-top-bar">
              <h3>Question {currentQIndex + 1}</h3>
              {/* ☰ THREE LINE BUTTON (Right of Q.No) */}
              <button className="palette-toggle-btn" onClick={() => setIsPaletteOpen(true)}>
                ☰ Grid
              </button>
           </div>
           
           <QuestionDisplay 
              question={currentQuestion}
              selectedAnswer={currentSelectedAnswer}
              onAnswerChange={handleAnswerChange}
           />
        </div>
        
        {/* Right: Palette (Sidebar on Mobile) */}
        <div className={`navigator-panel ${isPaletteOpen ? 'mobile-visible' : ''}`}>
          
          {/* "X" Close Button for Mobile */}
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