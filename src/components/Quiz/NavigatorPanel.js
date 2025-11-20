// src/components/Quiz/NavigatorPanel.js
import React, { useState } from 'react';

function NavigatorPanel({ questions, allResponses, currentQIndex, onQuestionClick }) {
  const [openSection, setOpenSection] = useState(0);

  const getStatus = (qId) => {
    const response = allResponses[qId];
    if (!response) return 'unvisited';
    return response.status || 'unvisited';
  };

  // Status to CSS mapping
  const getStatusClass = (qId) => {
    const status = getStatus(qId);
    switch (status) {
      case 'answered': return 'answered'; // Green
      case 'marked_review': return 'marked-review'; // Purple/Orange
      case 'visited': return 'not-answered'; // Red
      default: return 'unvisited'; // Grey
    }
  };

  // Count Helper
  const getCount = (statusType) => {
    return questions.filter(q => {
      const status = getStatus(q.id);
      if (statusType === 'unvisited') return status === 'unvisited';
      if (statusType === 'answered') return status === 'answered';
      if (statusType === 'marked_review') return status === 'marked_review';
      if (statusType === 'not_answered') return status === 'visited';
      return false;
    }).length;
  };

  // Chunk questions for accordion
  const chunkQuestions = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const questionChunks = chunkQuestions(questions, 10);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="navigator-panel-container">
      
      {/* --- UPDATED LEGEND (4 ITEMS) --- */}
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
      </div>

      <div className="palette-section-header">
          <h4>Choose a Question</h4>
      </div>

      <div className="question-sections">
        {questionChunks.map((chunk, sectionIndex) => {
          const startNum = sectionIndex * 10 + 1;
          const endNum = Math.min((sectionIndex + 1) * 10, questions.length);
          const isOpen = openSection === sectionIndex;

          return (
            <div key={sectionIndex} className="section-container">
              <button 
                className={`section-toggle-btn ${isOpen ? 'active' : ''}`}
                onClick={() => toggleSection(sectionIndex)}
              >
                <span>Questions {startNum} - {endNum}</span>
                <span className="toggle-icon">{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen && (
                <div className="section-grid">
                  {chunk.map((q) => {
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