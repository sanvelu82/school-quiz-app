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
  const [isPaletteOpen, setIsPaletteOpen] = useState(false); // Mobile Toggle

  // --- 1. Load Data ---
  useEffect(() => {
    fetchQuestions()
      .then(data => { setQuestions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // --- 2. Timer & Auto Submit ---
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

  // --- 3. Handlers ---
  const handleAnswerChange = useCallback((qId, opt) => {
    setAllResponses(prev => ({
      ...prev,
      [qId]: { ...prev[qId], answer: opt, status: 'answered' }
    }));
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
      
      {/* --- WATERMARK LAYER (Denser Loop) --- */}
      <div className="watermark-container">
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i} className="watermark-text">SVV HI-TECH</span>
        ))}
      </div>

      {/* --- HEADER (Pass toggle function) --- */}
      <Header 
        studentProfile={studentProfile} 
        timeRemaining={timeRemaining} 
        onOpenPalette={() => setIsPaletteOpen(true)} 
      />
      
      {/* --- MOBILE OVERLAY --- */}
      <div 
        className={`mobile-overlay ${isPaletteOpen ? 'active' : ''}`} 
        onClick={() => setIsPaletteOpen(false)}
      ></div>

      {/* --- MAIN GRID --- */}
      <div className="quiz-main-grid">
        
        {/* Left: Question Area */}
        <div className="quiz-panel">
           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
              <h3>Question {currentQIndex + 1}</h3>
           </div>
           
           <QuestionDisplay 
              question={currentQuestion}
              selectedAnswer={currentSelectedAnswer}
              onAnswerChange={handleAnswerChange}
           />
        </div>
        
        {/* Right: Palette (Sidebar on Mobile) */}
        <div className={`navigator-panel ${isPaletteOpen ? 'mobile-visible' : ''}`}>
          
          {/* Mobile Close Button */}
          <div className="mobile-close-btn">
            <button onClick={() => setIsPaletteOpen(false)}>✕ CLOSE</button>
          </div>

          <NavigatorPanel 
            questions={questions}
            allResponses={allResponses}
            currentQIndex={currentQIndex}
            onQuestionClick={handleQuestionClick}
          />
        </div>
      </div>

      {/* --- BOTTOM ACTION BAR --- */}
      <div className="bottom-bar">
        <div className="bottom-left">
          <button 
            className="quiz-btn btn-prev" 
            onClick={handlePrevious}
            disabled={currentQIndex === 0}
          >
            ← Previous
          </button>
          <button 
            className="quiz-btn btn-clear" 
            onClick={handleClearSelection}
          >
            Clear
          </button>
        </div>

        <div className="bottom-right">
          <button 
             className="quiz-btn btn-save" 
             onClick={handleSaveNext}
          >
            Save & Next →
          </button>
          {currentQIndex === questions.length - 1 && (
             <button 
               onClick={handleFinalSubmit}
               style={{background:'#dc2626', color:'white', border:'none'}} 
               className="quiz-btn"
             >
               Final Submit
             </button>
          )}
        </div>
      </div>

    </div>
  );
}

export default QuizApp;