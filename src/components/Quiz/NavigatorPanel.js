// src/components/Quiz/NavigatorPanel.js
import React from 'react';

function NavigatorPanel({ questions, allResponses, currentQIndex, onQuestionClick }) {
  
  // Helper to get status of a specific question
  const getStatus = (qId) => {
    const response = allResponses[qId];
    if (!response) return 'unvisited';
    return response.status || 'unvisited';
  };

  // Function to determine the CSS class based on the response status
  const getStatusClass = (qId) => {
    const status = getStatus(qId);
    
    switch (status) {
      case 'marked_answered': return 'marked-answered'; // Purple
      case 'answered': return 'answered'; // Green
      case 'marked_review': return 'marked-review'; // Orange/Red
      case 'visited': return 'not-answered'; // Red/Pink (defined in your CSS/logic)
      default: return 'unvisited'; // Grey
    }
  };

  // Helper to calculate counts for the legend
  const getCount = (statusType) => {
    return questions.filter(q => {
      const status = getStatus(q.id);
      if (statusType === 'unvisited') return status === 'unvisited';
      if (statusType === 'answered') return status === 'answered';
      if (statusType === 'marked_review') return status === 'marked_review';
      if (statusType === 'marked_answered') return status === 'marked_answered';
      if (statusType === 'not_answered') return status === 'visited';
      return false;
    }).length;
  };

  return (
    <div className="navigator-panel-container">
      
      {/* --- 1. LEGEND SECTION (Matches Image Layout) --- */}
      <div className="palette-legend">
        <div className="legend-row">
            <div className="legend-item">
                <span className="legend-box answered"></span>
                <div className="legend-info">
                    <span className="legend-count">{getCount('answered')}</span>
                    <span className="legend-text">Answered</span>
                </div>
            </div>
            <div className="legend-item">
                <span className="legend-box unvisited" style={{backgroundColor: '#ff4d4d', color:'white'}}></span> {/* Custom Red for Not Answered if needed */}
                <div className="legend-info">
                    <span className="legend-count">{getCount('not_answered')}</span>
                    <span className="legend-text">Not Answered</span>
                </div>
            </div>
        </div>
        
        <div className="legend-row">
             <div className="legend-item">
                <span className="legend-box unvisited"></span>
                <div className="legend-info">
                    <span className="legend-count">{getCount('unvisited')}</span>
                    <span className="legend-text">Not Visited</span>
                </div>
            </div>
            <div className="legend-item">
                <span className="legend-box marked-review"></span>
                <div className="legend-info">
                    <span className="legend-count">{getCount('marked_review')}</span>
                    <span className="legend-text">Marked for Review</span>
                </div>
            </div>
        </div>
        
        <div className="legend-row one-col">
            <div className="legend-item">
                <span className="legend-box marked-answered"></span>
                <div className="legend-info">
                    <span className="legend-count">{getCount('marked_answered')}</span>
                    <span className="legend-text full">Answered & Marked for Review (will be considered for evaluation)</span>
                </div>
            </div>
        </div>
      </div>

      {/* --- 2. SECTION HEADERS --- */}
      <div className="palette-section-header">
          <h4>Choose a Question</h4>
      </div>
      <h5 className="section-subheader">Section A</h5>

      {/* --- 3. QUESTION GRID --- */}
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
              onClick={() => onQuestionClick(index)}
            >
              {index + 1}
              {/* Optional: Add small dot for marked-answered if needed */}
              {statusClass === 'marked-answered' && <span className="btn-dot"></span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default NavigatorPanel;