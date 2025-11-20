// src/services/api.js

// 🚨 Your Verified URL
const webAppURL = 'https://script.google.com/macros/s/AKfycbxoKGdFznkKtAfKjnu73CLO83bJpdCJKcpjbwhk0q0GprP4zij-MSkVc-H97OUflbrO/exec'; 

/**
 * Login Function (Renamed from testLogin to handleLogin)
 */
export const handleLogin = async (rollNo, password) => {
  const params = new URLSearchParams();
  params.append('action', 'login'); 
  params.append('rollNo', rollNo);
  params.append('password', password);

  console.log('Attempting Login with RollNo:', rollNo);
  
  try {
    const response = await fetch(webAppURL + '?' + params.toString(), {
      method: 'POST',
    });
    
    const data = await response.json(); 
    return data; 
  } catch (error) {
    console.error('Error during Login request:', error);
    return { status: 'error', message: 'Network or script execution failed.' };
  }
};

/**
 * Submission Function (Renamed & adapted to accept specific arguments)
 */
export const handleSubmitResults = async (studentProfile, finalScore, detailedResponses) => {
  const params = new URLSearchParams();
  params.append('action', 'submit');

  // Map the incoming arguments to the URL parameters
  params.append('rollNo', studentProfile.rollNo);
  params.append('fullName', studentProfile.fullName);
  params.append('quizClass', studentProfile.class);
  params.append('quizSection', studentProfile.section);
  params.append('totalScore', finalScore);
  
  // Convert the detailed responses object to a string
  params.append('detailedResponses', JSON.stringify(detailedResponses)); 
  
  console.log('Attempting Submission...');

  try {
    const response = await fetch(webAppURL + '?' + params.toString(), {
      method: 'POST',
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during Submission request:', error);
    return { status: 'error', message: 'Network or script execution failed.' };
  }
};