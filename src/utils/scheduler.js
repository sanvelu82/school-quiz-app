// src/utils/scheduler.js

// 📅 DEFINE YOUR SESSIONS HERE
export const EXAM_SESSIONS = [
  {
    id: 1,
    name: "Physics & Chemistry (Morning)",
    date: "2025-11-21",   // ⚠️ CHANGE THIS TO TODAY'S DATE TO TEST
    loginTime: "00:08",   // HH:MM (24-hour format)
    startTime: "00:09",   
    endTime:   "00:10",   
    questionFile: "/questions1.json"
  },
  {
    id: 2,
    name: "Biology & Maths (Afternoon)",
    date: "2025-11-25",   // ⚠️ CHANGE THIS TO TODAY'S DATE TO TEST
    loginTime: "11:30",
    startTime: "12:00",
    endTime:   "13:00",
    questionFile: "/questions2.json"
  }
];

/**
 * Helper: Combines Date string ("2025-11-25") and Time string ("09:00")
 * into a Javascript Date Object.
 */
const parseDateTime = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  // Month is 0-indexed in JS (0 = Jan, 11 = Dec)
  return new Date(year, month - 1, day, hours, minutes, 0);
};

/**
 * Checks if there is an active session RIGHT NOW.
 */
export const getCurrentSession = () => {
  const now = new Date();

  const activeSession = EXAM_SESSIONS.find(session => {
    const loginStart = parseDateTime(session.date, session.loginTime);
    const examEnd = parseDateTime(session.date, session.endTime);
    
    // Check if NOW is inside the allowed window (Login Start -> Exam End)
    return now >= loginStart && now < examEnd;
  });

  if (!activeSession) {
    return { status: 'no_contest', message: "No Contest Scheduled for this time." };
  }

  return { status: 'active', session: activeSession };
};

/**
 * Returns seconds remaining until the exam START time.
 */
export const getSecondsUntilStart = (session) => {
  if (!session) return 0;
  const now = new Date();
  const start = parseDateTime(session.date, session.startTime);
  const diff = start - now; 
  return Math.floor(diff / 1000); 
};

/**
 * Returns seconds remaining until the exam END time.
 */
export const getExamDurationSeconds = (session) => {
  if (!session) return 0;
  const now = new Date();
  const end = parseDateTime(session.date, session.endTime);
  const diff = end - now;
  return Math.max(0, Math.floor(diff / 1000)); 
};