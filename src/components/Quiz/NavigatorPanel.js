// src/components/Quiz/NavigatorPanel.js
import React from 'react';

function NavigatorPanel({ questions, allResponses, currentQIndex, onQuestionClick }) {
  
  // Function to determine the CSS class based on the response status
  const getStatusClass = (qId) => {
    const response = allResponses[qId];
    if (!response) {
      return 'unvisited'; // Grey/White
    }
    
    // Check if answered and marked for review (Highest priority)
    if (response.status === 'marked_answered') {
      return 'marked-answered'; // Purple/Blue
    }
    // Check if only answered (Second priority)
    if (response.status === 'answered') {
      return 'answered'; // Green
    }
    // Check if only marked for review (Third priority)
    if (response.status === 'marked_review') {
      return 'marked-review'; // Red
    }
    
    return 'visited'; // Fallback for visited but not answered (Light Grey)
  };

  return (
    <div className="navigator-panel-container">
      <h3>Question Palette</h3>
      <div className="question-grid">
        {questions.map((q, index) => {
          const qId = q.id;
          const isCurrent = index === currentQIndex;
          const statusClass = getStatusClass(qId);
          
          return (
            <button
              key={qId}
              // Combine status class with 'current' class for border effect
              className={`q-button ${statusClass} ${isCurrent ? 'current-q' : ''}`}
              onClick={() => onQuestionClick(index)} // Navigate to this question index
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      
      {/* Legend (for good UX) */}
      <div className="legend">
        <div className="legend-item"><span className="q-button answered"></span> Answered</div>
        <div className="legend-item"><span className="q-button marked-review"></span> Marked for Review</div>
        <div className="legend-item"><span className="q-button marked-answered"></span> Answered & Marked</div>
        <div className="legend-item"><span className="q-button unvisited"></span> Not Visited</div>
      </div>
    </div>
  );
}

export default NavigatorPanel;