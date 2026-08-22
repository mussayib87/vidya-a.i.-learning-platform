export type Activity = {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: "lesson" | "quiz" | "tutor" | "streak";
};

export const recentActivity: Activity[] = [
  {
    id: "a1",
    title: "Completed \"Atomic Structure\"",
    detail: "Chemistry · scored 9/10 on the check-up quiz",
    time: "Today, 6:40 PM",
    type: "lesson",
  },
  {
    id: "a2",
    title: "Asked the AI tutor 4 questions",
    detail: "Mathematics · quadratic equations",
    time: "Today, 5:05 PM",
    type: "tutor",
  },
  {
    id: "a3",
    title: "Quiz attempt: Motion in a Straight Line",
    detail: "Physics · 7/10 correct",
    time: "Yesterday, 8:15 PM",
    type: "quiz",
  },
  {
    id: "a4",
    title: "7-day streak reached",
    detail: "You studied every day this week",
    time: "Yesterday, 9:00 PM",
    type: "streak",
  },
  {
    id: "a5",
    title: "Completed \"The Cell: Structure and Function\"",
    detail: "Biology · 12 minutes",
    time: "2 days ago",
    type: "lesson",
  },
];

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export const achievements: Achievement[] = [
  {
    id: "first-lesson",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "Sparkles",
    unlocked: true,
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Study 7 days in a row",
    icon: "Flame",
    unlocked: true,
  },
  {
    id: "quiz-ace",
    title: "Quiz Ace",
    description: "Score 90% or above on a quiz",
    icon: "Target",
    unlocked: true,
  },
  {
    id: "polyglot",
    title: "Polyglot",
    description: "Learn a lesson in two languages",
    icon: "Languages",
    unlocked: false,
  },
  {
    id: "marathon",
    title: "Marathon Mind",
    description: "Study for 10 hours in a week",
    icon: "Timer",
    unlocked: false,
  },
  {
    id: "curious",
    title: "Curious Mind",
    description: "Ask the AI tutor 50 questions",
    icon: "MessageCircleQuestion",
    unlocked: false,
  },
];

export type Task = {
  id: string;
  title: string;
  subject: string;
  due: string;
  type: "quiz" | "lesson" | "revision";
};

export const upcomingTasks: Task[] = [
  {
    id: "t1",
    title: "Trigonometric ratios practice set",
    subject: "Mathematics",
    due: "Due today",
    type: "lesson",
  },
  {
    id: "t2",
    title: "Newton's laws quiz",
    subject: "Physics",
    due: "Due tomorrow",
    type: "quiz",
  },
  {
    id: "t3",
    title: "Revise chemical bonding notes",
    subject: "Chemistry",
    due: "Due Friday",
    type: "revision",
  },
];

export const weeklyStudy = [
  { day: "Mon", minutes: 35 },
  { day: "Tue", minutes: 50 },
  { day: "Wed", minutes: 20 },
  { day: "Thu", minutes: 65 },
  { day: "Fri", minutes: 40 },
  { day: "Sat", minutes: 75 },
  { day: "Sun", minutes: 30 },
];

export const quizPerformance = [
  { subject: "Mathematics", score: 86 },
  { subject: "Physics", score: 72 },
  { subject: "Chemistry", score: 91 },
  { subject: "Biology", score: 78 },
  { subject: "English", score: 88 },
];

export const studyStats = {
  streak: 7,
  dailyGoalMinutes: 30,
  minutesToday: 22,
  lessonsCompleted: 24,
  totalLessons: 60,
  hoursThisWeek: 5.25,
};
