// src/utils/scheduler.js

// 📅 DEFINE YOUR SESSIONS HERE
export const EXAM_SESSIONS = [
  {
    id: 1,
    name: "QUIZ CONTEST (ROUND 1)",
    date: "2025-11-28",   // 🗓️ Update this to your test date
    loginTime: "10:38",   // Can enter app
    startTime: "10:40",   // Can click Start
    endTime:   "10:42",   // Auto-submit
    questionFile: "/questions1.json"
  },
  {
    id: 2,
    name: "Maths (Afternoon)",
    date: "2025-11-26",
    loginTime: "01:29",   // Can enter app
    startTime: "01:31",   // Can click Start
    endTime:   "23:34",
    questionFile: "/questions1.json"
  },
  {
    id: 3,
    name: "Computer Science (Next Day)",
    date: "2025-11-27",
    loginTime: "01:29",   // Can enter app
    startTime: "01:31",   // Can click Start
    endTime:   "23:34",
    questionFile: "/questions1.json"
  }
];

const parseDateTime = (dateStr, timeStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0);
};

export const getCurrentSession = () => {
  const now = new Date();
  const activeSession = EXAM_SESSIONS.find(session => {
    const loginStart = parseDateTime(session.date, session.loginTime);
    const examEnd = parseDateTime(session.date, session.endTime);
    return now >= loginStart && now < examEnd;
  });

  if (!activeSession) {
    return { status: 'no_contest', message: "No Contest Scheduled for this time." };
  }
  return { status: 'active', session: activeSession };
};

export const getSecondsUntilStart = (session) => {
  if (!session) return 0;
  const now = new Date();
  const start = parseDateTime(session.date, session.startTime);
  const diff = start - now; // ✅ Typo Fixed
  return Math.floor(diff / 1000); 
};

export const getExamDurationSeconds = (session) => {
  if (!session) return 0;
  const now = new Date();
  const end = parseDateTime(session.date, session.endTime);
  const diff = end - now;
  return Math.max(0, Math.floor(diff / 1000)); 
};