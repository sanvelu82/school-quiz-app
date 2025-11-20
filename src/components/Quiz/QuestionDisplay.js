// src/components/Quiz/QuestionDisplay.js
import React from 'react';

// Props received:
// 1. question: The current question object (from questions.json)
// 2. selectedAnswer: The answer the student previously selected for this question (or null)
// 3. onAnswerChange: A function to call when the student selects a new option
function QuestionDisplay({ question, selectedAnswer, onAnswerChange }) {
  // Ensure we have a question before rendering
  if (!question) {
    return <div>Select a question to view.</div>;
  }

  // Generate a unique name for the radio button group (important for selection)
  const radioGroupName = `question-${question.id}`;

  return (
    <div className="question-display">
      <div className="question-header">
        <span className="subject-tag">{question.subject}</span>
      </div>
      
      {/* Question Text */}
      <div className="question-text">
        <p>{question.text}</p>
      </div>

      {/* Options as Radio Buttons */}
      <div className="options-list">
        {question.options.map((option, index) => (
          <div key={index} className="option-item">
            <input
              type="radio"
              id={`${radioGroupName}-option-${index}`}
              name={radioGroupName}
              value={option}
              checked={selectedAnswer === option} // Checks the radio button if it matches the current selection
              onChange={() => onAnswerChange(question.id, option)} // Calls the handler in QuizApp
            />
            <label htmlFor={`${radioGroupName}-option-${index}`}>{option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionDisplay;