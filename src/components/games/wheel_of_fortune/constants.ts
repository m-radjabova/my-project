import type { Question } from "./types";

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "q1",
    question: "O'zbekiston poytaxti qayer?",
    options: ["Samarqand", "Buxoro", "Toshkent", "Xiva"],
    answerIndex: 2,
    points: 100,
    category: "Geografiya",
    timeLimit: 30,
  },
  {
    id: "q2",
    question: "9 ning kvadrati nechiga teng?",
    options: ["72", "81", "99", "91"],
    answerIndex: 1,
    points: 80,
    category: "Matematika",
    timeLimit: 25,
  },
  {
    id: "q3",
    question: "Eng katta okean qaysi?",
    options: ["Atlantika", "Tinch okeani", "Hind okeani", "Shimoliy muz"],
    answerIndex: 1,
    points: 120,
    category: "Geografiya",
    timeLimit: 35,
  },
  {
    id: "q4",
    question: "Qaysi hayvon 'sahro kemasi' deb ataladi?",
    options: ["Ot", "Sigir", "Tuya", "Eshak"],
    answerIndex: 2,
    points: 90,
    category: "Biologiya",
    timeLimit: 30,
  },
  {
    id: "q5",
    question: "20 + 35 - 12 = ?",
    options: ["43", "41", "45", "47"],
    answerIndex: 0,
    points: 70,
    category: "Matematika",
    timeLimit: 20,
  },
];

export const WHEEL_COLORS = [
  "#3b82f6",
  "#14b8a6",
  "#22c55e",
  "#eab308",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#a855f7",
  "#6366f1",
  "#06b6d4",
  "#84cc16",
  "#f59e0b",
  "#f43f5e",
  "#d946ef",
  "#8b5cf6",
  "#0ea5e9",
];

export const WHEEL_OF_FORTUNE_GAME_KEY = "wheel_of_fortune";
export const EMPTY_OPTIONS: [string, string, string, string] = ["", "", "", ""];
