export const TEAM_AVATARS = ["🦉", "🦜"];

export const TEAM_COLORS = [
  {
    primary: "from-orange-400 to-amber-400",
    text: "text-orange-300",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
  {
    primary: "from-teal-400 to-cyan-400",
    text: "text-teal-300",
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
  },
];

export const COLORS = [
  {
    id: 1,
    name: "Qizil",
    emoji: "🔴",
    color: "bg-red-500",
    border: "border-red-600",
    glow: "shadow-red-500/50",
    text: "text-red-500",
  },
  {
    id: 2,
    name: "Ko'k",
    emoji: "🔵",
    color: "bg-blue-500",
    border: "border-blue-600",
    glow: "shadow-blue-500/50",
    text: "text-blue-500",
  },
  {
    id: 3,
    name: "Sariq",
    emoji: "🟡",
    color: "bg-yellow-500",
    border: "border-yellow-600",
    glow: "shadow-yellow-500/50",
    text: "text-yellow-500",
  },
];

const RED = "🔴";
const BLUE = "🔵";
const YELLOW = "🟡";

export const PUZZLE_TEMPLATES = [
  {
    grid: [
      [RED, null, YELLOW],
      [YELLOW, RED, null],
      [null, YELLOW, RED],
    ],
    solution: [
      [RED, BLUE, YELLOW],
      [YELLOW, RED, BLUE],
      [BLUE, YELLOW, RED],
    ],
  },
  {
    grid: [
      [BLUE, YELLOW, null],
      [RED, null, YELLOW],
      [null, RED, BLUE],
    ],
    solution: [
      [BLUE, YELLOW, RED],
      [RED, BLUE, YELLOW],
      [YELLOW, RED, BLUE],
    ],
  },
  {
    grid: [
      [null, RED, BLUE],
      [BLUE, null, RED],
      [RED, BLUE, null],
    ],
    solution: [
      [YELLOW, RED, BLUE],
      [BLUE, YELLOW, RED],
      [RED, BLUE, YELLOW],
    ],
  },
];
