// src/services/data.js

export const fetchQuestions = async () => {
  try {
    // Looks for the questions.json file in the public folder
    const response = await fetch('/questions.json'); 
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Could not fetch questions:", error);
    return [];
  }
};