// src/components/Quiz/QuizApp.js
import React, { useState, useEffect, useCallback } from 'react';
import { fetchQuestions } from '../../services/data';
import Header from '../shared/Header';
import QuestionDisplay from './QuestionDisplay';
import NavigatorPanel from './NavigatorPanel';

const TOTAL_TIME_SECONDS = 30; // Set to 30 seconds for testing

function QuizApp({ studentProfile, onQuizFinish }) {
  // 1. Define State Variables FIRST
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME_SECONDS);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [allResponses, setAllResponses] = useState({}); 

  // 2. Load Questions Effect
  useEffect(() => {
    fetchQuestions()
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to load questions:", error);
        setLoading(false);
      });
  }, []);

  // 3. Define Final Scoring Logic
  const handleFinalSubmit = useCallback(() => {
    let score = 0;
    
    questions.forEach(q => {
      const response = allResponses[q.id];
      if (response && response.answer) {
        // Check correctness
        // Note: Ensure your questions.json 'correctAnswer' matches the option text exactly
        if (response.answer === q.correctAnswer) {
          score += 4; // Correct
        } else {
          score -= 1; // Incorrect
        }
      }
      // Unattempted gets 0
    });

    // Call the parent handler (App.js) to submit to Google Sheets
    onQuizFinish(score, allResponses);
  }, [questions, allResponses, onQuizFinish]);

  // 4. Timer Effect (Now calls handleFinalSubmit)
  useEffect(() => {
    if (loading ) return;
    if (timeRemaining <= 0) {
      handleFinalSubmit(); // Trigger submission
      return; // Stop the timer logic
    }
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => prevTime - 1);
    }, 1000);

    if (timeRemaining <= 0) {
      clearInterval(timer);
      handleFinalSubmit(); // Auto-submit on timeout
    }

    return () => clearInterval(timer);
  }, [loading, timeRemaining, handleFinalSubmit]);

  // 5. Handlers
  const handleAnswerChange = useCallback((questionId, selectedOption) => {
    setAllResponses(prevResponses => {
      const existing = prevResponses[questionId] || {};
      return {
        ...prevResponses,
        [questionId]: {
          ...existing,
          answer: selectedOption,
          status: existing.status === 'marked_review' ? 'marked_answered' : 'answered', 
        }
      };
    });
  }, []); 

  const handleNext = (save) => {
    // Move to next question
    const nextIndex = (currentQIndex + 1) % questions.length;
    setCurrentQIndex(nextIndex);
  };
  
  const handleMarkForReview = () => {
    const currentQId = questions[currentQIndex].id;
    setAllResponses(prevResponses => ({
        ...prevResponses,
        [currentQId]: {
            ...(prevResponses[currentQId] || {}),
            status: prevResponses[currentQId]?.answer ? 'marked_answered' : 'marked_review', 
        }
    }));
    handleNext(false); 
  };

  const handleQuestionClick = (index) => {
    setCurrentQIndex(index);
  };

  // 6. Render Logic
  if (loading) {
    return <div style={{padding: '20px'}}>Loading Quiz Questions...</div>;
  }

  // Safety check if questions failed to load
  if (questions.length === 0) {
    return <div>Error: No questions loaded.</div>;
  }

  const currentQuestion = questions[currentQIndex];
  const currentSelectedAnswer = allResponses[currentQuestion?.id]?.answer || null;
  
  return (
    <div className="quiz-page">
      <Header studentProfile={studentProfile} timeRemaining={timeRemaining} />
      
      <div className="quiz-main-grid">
        <div className="quiz-panel">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h3>Question {currentQIndex + 1} of {questions.length}</h3>
            {/* Final Submit Button (Top Right) */}
            <button 
                onClick={handleFinalSubmit}
                style={{backgroundColor: 'green', color: 'white', padding: '5px 10px', border: 'none', cursor:'pointer'}}
            >
                Final Submit
            </button>
          </div>
          
          <QuestionDisplay 
            question={currentQuestion}
            selectedAnswer={currentSelectedAnswer}
            onAnswerChange={handleAnswerChange}
          />

          <div className="action-buttons">
            <button onClick={handleMarkForReview} className="btn-review">
              Mark for Review & Next
            </button>
            <button onClick={() => handleNext(true)} className="btn-save-next">
              Save & Next
            </button>
          </div>
        </div>
        
        <div className="navigator-panel">
          <NavigatorPanel 
            questions={questions}
            allResponses={allResponses}
            currentQIndex={currentQIndex}
            onQuestionClick={handleQuestionClick}
          />
        </div>
      </div>
    </div>
  );
}

export default QuizApp;