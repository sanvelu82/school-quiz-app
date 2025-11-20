// src/components/Quiz/NavigatorPanel.js
import React, { useState } from 'react';

function NavigatorPanel({ questions, allResponses, currentQIndex, onQuestionClick }) {
  
  // State to track which section is open (default to first section, index 0)
  const [openSection, setOpenSection] = useState(0);

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
      case 'visited': return 'not-answered'; // Red/Pink
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

  // Helper to chunk questions into groups of 10
  const chunkQuestions = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const questionChunks = chunkQuestions(questions, 10);

  const toggleSection = (index) => {
    // Toggle open/close. If clicking the open one, close it (set to null).
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="navigator-panel-container">
      
      {/* --- 1. LEGEND SECTION --- */}
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
                <span className="legend-box not-answered"></span>
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

      <div className="palette-section-header">
          <h4>Choose a Question</h4>
      </div>

      {/* --- 2. QUESTION SECTIONS (Split Spaces) --- */}
      <div className="question-sections">
        {questionChunks.map((chunk, sectionIndex) => {
          // Calculate range labels (e.g., 1-10, 11-20)
          const startNum = sectionIndex * 10 + 1;
          const endNum = Math.min((sectionIndex + 1) * 10, questions.length);
          const isOpen = openSection === sectionIndex;

          return (
            <div key={sectionIndex} className="section-container">
              {/* Section Header Button (Clickable Range) */}
              <button 
                className={`section-toggle-btn ${isOpen ? 'active' : ''}`}
                onClick={() => toggleSection(sectionIndex)}
              >
                <span>Questions {startNum} - {endNum}</span>
                <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
              </button>

              {/* Section Grid (Collapsible Content) */}
              {isOpen && (
                <div className="section-grid">
                  {chunk.map((q) => {
                    // IMPORTANT: Calculate the correct index for the main array
                    const originalIndex = q.id - 1; 
                    const statusClass = getStatusClass(q.id);
                    const isCurrent = originalIndex === currentQIndex;

                    return (
                      <button
                        key={q.id}
                        className={`q-button ${statusClass} ${isCurrent ? 'current-q' : ''}`}
                        onClick={() => onQuestionClick(originalIndex)}
                      >
                        {q.id}
                        {statusClass === 'marked-answered' && <span className="btn-dot"></span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NavigatorPanel;