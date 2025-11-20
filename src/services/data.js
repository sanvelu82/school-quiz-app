// src/services/data.js

export const fetchQuestions = async (fileName) => {
  try {
    // Use the filename provided by the session, or default to 'questions.json'
    const targetFile = fileName || '/questions.json'; 
    
    console.log(`Fetching questions from: ${targetFile}`);
    
    const response = await fetch(targetFile); 
    
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