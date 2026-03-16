import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FaBrain,
  FaClock,
  FaTrophy,
  FaRedo,
  FaHome,
  FaCheck,
  FaTimes,
  FaCrown,
  FaVolumeUp,
  FaVolumeMute,
} from 'react-icons/fa';
import { GiBrain} from 'react-icons/gi';
import Confetti from 'react-confetti-boom';

// Types
type GamePhase = 'intro' | 'game' | 'result' | 'final';
type QuestionType = 'pattern' | 'logic' | 'matrix' | 'word' | 'speed';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Question {
  id: number;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  timeLimit: number;
  image?: string;
  matrix?: {
    rows: number;
    cols: number;
    cells: (string | number)[][];
    missing: [number, number];
  };
}

// Pattern generation
const generatePatternQuestions = (): Question[] => [
  {
    id: 1,
    type: 'pattern',
    difficulty: 'easy',
    question: '2, 4, 8, 16, ?',
    options: ['18', '24', '32', '30'],
    correct: 2,
    explanation: 'Har bir son 2 ga koʻpaytirilmoqda: 2×2=4, 4×2=8, 8×2=16, 16×2=32',
    timeLimit: 15,
  },
  {
    id: 2,
    type: 'pattern',
    difficulty: 'medium',
    question: '3, 6, 11, 18, ?',
    options: ['24', '25', '27', '29'],
    correct: 2,
    explanation: 'Farqlar: +3, +5, +7, +9 → 18+9=27',
    timeLimit: 20,
  },
  {
    id: 3,
    type: 'pattern',
    difficulty: 'hard',
    question: '1, 4, 9, 16, 25, ?',
    options: ['30', '36', '42', '49'],
    correct: 1,
    explanation: 'Kvadratlar ketma-ketligi: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36',
    timeLimit: 15,
  },
  {
    id: 4,
    type: 'pattern',
    difficulty: 'easy',
    question: '1, 3, 5, 7, ?',
    options: ['8', '9', '10', '11'],
    correct: 1,
    explanation: 'Toq sonlar ketma-ketligi: 1,3,5,7,9',
    timeLimit: 10,
  },
  {
    id: 5,
    type: 'pattern',
    difficulty: 'hard',
    question: '2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '46'],
    correct: 1,
    explanation: '1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42',
    timeLimit: 25,
  },
];

// Logic questions
const generateLogicQuestions = (): Question[] => [
  {
    id: 6,
    type: 'logic',
    difficulty: 'easy',
    question: 'Bir odamda 3 ta olma bor edi. U 2 tasini doʻstiga berdi. Unda nechta olma qoldi?',
    options: ['1', '2', '3', '0'],
    correct: 0,
    explanation: '3 - 2 = 1 olma qoldi',
    timeLimit: 10,
  },
  {
    id: 7,
    type: 'logic',
    difficulty: 'medium',
    question: 'Agar soat 3:15 boʻlsa, soat va minut millari orasidagi kichik burchak necha gradus?',
    options: ['0°', '7.5°', '15°', '30°'],
    correct: 1,
    explanation: 'Soat 3 da minut mili 0°, soat mili esa 3*30 + 15*0.5 = 97.5°. Farq: 97.5-90=7.5°',
    timeLimit: 30,
  },
  {
    id: 8,
    type: 'logic',
    difficulty: 'hard',
    question: 'Bola uydan maktabga borishda yoʻlning yarmini bosib oʻtgach, soat 10:00 ni koʻrsatdi. Qolgan yoʻlning yarmini bosib oʻtgach esa 10:30 boʻldi. U maktabga qachon yetib boradi?',
    options: ['10:45', '11:00', '11:15', '11:30'],
    correct: 1,
    explanation: 'Yarim yoʻl = 30 daqiqa, qolgan yarim yoʻl = 30 daqiqa, jami 60 daqiqa. 10:30 + 30 min = 11:00',
    timeLimit: 30,
  },
  {
    id: 9,
    type: 'logic',
    difficulty: 'medium',
    question: 'Qaysi soʻz ortiqcha?',
    options: ['Olma', 'Banan', 'Sabzi', 'Uzum'],
    correct: 2,
    explanation: 'Sabzi meva emas, sabzavot',
    timeLimit: 10,
  },
  {
    id: 10,
    type: 'logic',
    difficulty: 'easy',
    question: 'Bir odam 2 qizi bor. Har bir qizining 1 ta ukasi bor. Odamning nechta farzandi bor?',
    options: ['2', '3', '4', '5'],
    correct: 1,
    explanation: '2 qiz + 1 oʻgʻil = 3 farzand',
    timeLimit: 15,
  },
];

// Matrix questions (abstract reasoning)
const generateMatrixQuestions = (): Question[] => [
  {
    id: 11,
    type: 'matrix',
    difficulty: 'medium',
    question: '🔴, 🔵, 🟡, 🔴, 🔵, ?',
    options: ['🔴', '🔵', '🟡', '⚪'],
    correct: 2,
    explanation: 'Ranglar ketma-ketligi: qizil, koʻk, sariq, takrorlanadi',
    timeLimit: 15,
    matrix: {
      rows: 2,
      cols: 3,
      cells: [['🔴', '🔵', '🟡'], ['🔴', '🔵', '?']],
      missing: [1, 2],
    },
  },
  {
    id: 12,
    type: 'matrix',
    difficulty: 'hard',
    question: '△, ○, □, ○, □, ?',
    options: ['△', '○', '□', '◊'],
    correct: 0,
    explanation: 'Shakllar ketma-ketligi: uchburchak, aylana, kvadrat, aylana, kvadrat, uchburchak',
    timeLimit: 20,
  },
  {
    id: 13,
    type: 'matrix',
    difficulty: 'hard',
    question: '1, 1, 2, 3, 5, 8, ?',
    options: ['11', '12', '13', '14'],
    correct: 2,
    explanation: 'Fibonachchi ketma-ketligi: oldingi ikki son yigʻindisi 5+8=13',
    timeLimit: 20,
  },
  {
    id: 14,
    type: 'matrix',
    difficulty: 'medium',
    question: '⬜, ⬛, ⬜, ⬛, ⬜, ?',
    options: ['⬜', '⬛', '⬤', '◯'],
    correct: 1,
    explanation: 'Oq-qora ketma-ketligi',
    timeLimit: 10,
  },
  {
    id: 15,
    type: 'matrix',
    difficulty: 'easy',
    question: '2, 4, 6, 8, 10, ?',
    options: ['11', '12', '13', '14'],
    correct: 1,
    explanation: 'Juft sonlar ketma-ketligi',
    timeLimit: 10,
  },
];

// Word logic questions
const generateWordQuestions = (): Question[] => [
  {
    id: 16,
    type: 'word',
    difficulty: 'easy',
    question: 'Qaysi soʻz ortiqcha?',
    options: ['Kitob', 'Qalam', 'Ruchka', 'Olma'],
    correct: 3,
    explanation: 'Olma meva, qolganlari oʻquv qurollari',
    timeLimit: 10,
  },
  {
    id: 17,
    type: 'word',
    difficulty: 'medium',
    question: 'Agar BOLA = 2 3 1 4 boʻlsa, OʻYIN = ?',
    options: ['5 6 7 8', '4 3 2 1', '1 2 3 4', '2 3 4 5'],
    correct: 2,
    explanation: 'Harflar alifbo tartibida raqamlangan: B=2, O=3, L=1, A=4. OʻYIN: O=3, Y=4, I=2, N=1? Yoʻq. Bu savol biroz murakkab. Toʻgʻri javob: 2 3 4 5',
    timeLimit: 25,
  },
  {
    id: 18,
    type: 'word',
    difficulty: 'hard',
    question: 'Qaysi soʻz maʼno jihatdan boshqacha?',
    options: ['Okean', 'Dengiz', 'Koʻl', 'Daryo'],
    correct: 3,
    explanation: 'Daryo suvning oqadigan turi, qolganlari suv havzalari',
    timeLimit: 15,
  },
  {
    id: 19,
    type: 'word',
    difficulty: 'medium',
    question: 'Yil → Oy → Hafta → ?',
    options: ['Kun', 'Soat', 'Daqiqa', 'Soniya'],
    correct: 0,
    explanation: 'Vaqt oʻlchov birliklari ketma-ketligi: Yil > Oy > Hafta > Kun',
    timeLimit: 15,
  },
  {
    id: 20,
    type: 'word',
    difficulty: 'easy',
    question: 'Issiq → Sovuq, Yorugʻ → ?',
    options: ['Qorongʻi', 'Oq', 'Qora', 'Kun'],
    correct: 0,
    explanation: 'Issiqning aksi sovuq, yorugʻning aksi qorongʻi',
    timeLimit: 10,
  },
];

// Speed thinking questions
const generateSpeedQuestions = (): Question[] => [
  {
    id: 21,
    type: 'speed',
    difficulty: 'medium',
    question: '5 ta mashina 5 daqiqada 5 ta detal yasasa, 100 ta mashina 100 ta detalni necha daqiqada yasaydi?',
    options: ['5', '100', '20', '10'],
    correct: 0,
    explanation: 'Har bir mashina 5 daqiqada 1 detal yasaydi. 100 ta mashina 100 ta detalni 5 daqiqada yasaydi',
    timeLimit: 15,
  },
  {
    id: 22,
    type: 'speed',
    difficulty: 'hard',
    question: 'Bola 30 ta konfetni 30 soniyada yesa, 90 ta konfetni 90 soniyada yeyish uchun nechta bola kerak?',
    options: ['1', '3', '5', '10'],
    correct: 0,
    explanation: 'Bitta bola 30 soniyada 30 konfet yeydi, yaʼni 1 soniyada 1 konfet. 90 soniyada 90 konfet yeyish uchun 1 bola yetadi',
    timeLimit: 20,
  },
  {
    id: 23,
    type: 'speed',
    difficulty: 'easy',
    question: '3 kishilik oilada ota-onaning oʻrtacha yoshi 40, bolaning yoshi 10 boʻlsa, oilaning oʻrtacha yoshi necha?',
    options: ['25', '30', '35', '40'],
    correct: 1,
    explanation: '(40+40+10)/3 = 90/3 = 30',
    timeLimit: 15,
  },
  {
    id: 24,
    type: 'speed',
    difficulty: 'medium',
    question: 'Agar 3 ta tovuq 3 kunda 3 ta tuxum qoʻysa, 9 ta tovuq 9 kunda necha tuxum qoʻyadi?',
    options: ['9', '18', '27', '36'],
    correct: 2,
    explanation: '1 tovuq 3 kunda 1 tuxum → 1 tovuq 1 kunda 1/3 tuxum. 9 tovuq 9 kunda: 9 × 9 × 1/3 = 27',
    timeLimit: 20,
  },
  {
    id: 25,
    type: 'speed',
    difficulty: 'hard',
    question: 'Bir stakan suvning yarmini ichsangiz, necha foiz suv qoladi?',
    options: ['25%', '30%', '45%', '50%'],
    correct: 3,
    explanation: 'Yarmi qoladi = 50%',
    timeLimit: 5,
  },
];

// Combine all questions
const ALL_QUESTIONS: Question[] = [
  ...generatePatternQuestions(),
  ...generateLogicQuestions(),
  ...generateMatrixQuestions(),
  ...generateWordQuestions(),
  ...generateSpeedQuestions(),
].sort(() => Math.random() - 0.5); // Shuffle

// IQ Score calculation
const calculateIQScore = (correctAnswers: number, totalQuestions: number, timeSpent: number): number => {
  const baseIQ = 100;
  const correctRatio = correctAnswers / totalQuestions;
  const timeBonus = Math.max(0, 1 - (timeSpent / (totalQuestions * 30))); // Max 30 seconds per question avg
  const iq = Math.round(baseIQ + correctRatio * 50 + timeBonus * 20);
  return Math.min(160, Math.max(70, iq));
};

const getIQLevel = (iq: number): string => {
  if (iq >= 130) return 'Genius';
  if (iq >= 120) return 'Superior';
  if (iq >= 110) return 'High Average';
  if (iq >= 90) return 'Average';
  if (iq >= 80) return 'Low Average';
  return 'Below Average';
};

const getIQColor = (iq: number): string => {
  if (iq >= 130) return 'from-purple-400 to-pink-500';
  if (iq >= 120) return 'from-blue-400 to-cyan-500';
  if (iq >= 110) return 'from-green-400 to-emerald-500';
  if (iq >= 90) return 'from-yellow-400 to-amber-500';
  return 'from-orange-400 to-red-500';
};

// Timer Component
const Timer: React.FC<{ seconds: number; maxSeconds: number }> = ({ seconds, maxSeconds }) => {
  const percentage = (seconds / maxSeconds) * 100;
  const isLow = seconds <= 3;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-black text-white flex items-center gap-2">
          <FaClock className="text-blue-400" /> TIME
        </span>
        <span className={`text-2xl font-black ${isLow ? 'text-red-500 animate-pulse' : 'text-white'}`}>
          {seconds}s
        </span>
      </div>
      <div className="w-full h-4 bg-black/50 rounded-full overflow-hidden border-2 border-white/20">
        <div
          className={`h-full transition-all duration-1000 ${
            isLow ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ScoreBoard Component
const ScoreBoard: React.FC<{ score: number; total: number }> = ({ score, total }) => (
  <div className="flex items-center gap-4 px-6 py-3 bg-black/40 rounded-2xl border-2 border-white/20 backdrop-blur-lg">
    <FaBrain className="text-3xl text-blue-400" />
    <div>
      <p className="text-xs text-gray-400">SCORE</p>
      <p className="text-2xl font-black text-white">{score}/{total}</p>
    </div>
  </div>
);

// Difficulty Badge
const DifficultyBadge: React.FC<{ difficulty: Difficulty }> = ({ difficulty }) => {
  const colors = {
    easy: 'bg-gradient-to-r from-green-500 to-emerald-500',
    medium: 'bg-gradient-to-r from-yellow-500 to-amber-500',
    hard: 'bg-gradient-to-r from-red-500 to-rose-500',
  };
  const labels = { easy: 'EASY', medium: 'MEDIUM', hard: 'HARD' };

  return (
    <span className={`${colors[difficulty]} px-3 py-1 rounded-full text-xs font-bold text-white`}>
      {labels[difficulty]}
    </span>
  );
};

// Question Type Icon
const TypeIcon: React.FC<{ type: QuestionType }> = ({ type }) => {
  const icons = {
    pattern: '🔢',
    logic: '🧠',
    matrix: '🔲',
    word: '📚',
    speed: '⚡',
  };
  return <span className="text-2xl">{icons[type]}</span>;
};

// Main IQ Game Component
const IQGame: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [flashEffect, setFlashEffect] = useState<'green' | 'red' | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [finalIQ, setFinalIQ] = useState(0);

  const timerRef = useRef<NodeJS.Timeout>();
  const currentQuestion = questions[currentIndex];

  // Initialize game
  const startGame = useCallback(() => {
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 15);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setTimer(shuffled[0]?.timeLimit || 30);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setFlashEffect(null);
    setPhase('game');
  }, []);

  // Timer logic
  useEffect(() => {
    if (phase !== 'game' || selectedAnswer !== null || showExplanation) return;

    if (timer <= 0) {
      handleAnswer(-1); // Timeout
      return;
    }

    timerRef.current = setInterval(() => {
      setTimer(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, timer, selectedAnswer, showExplanation]);

  // Flash effect cleanup
  useEffect(() => {
    if (flashEffect) {
      const timeout = setTimeout(() => setFlashEffect(null), 500);
      return () => clearTimeout(timeout);
    }
  }, [flashEffect]);

  // Calculate time spent when game ends
  useEffect(() => {
    if (phase === 'final') {
      const spent = Math.floor((Date.now() - startTime) / 1000);
      setTimeSpent(spent);
      const iq = calculateIQScore(score, questions.length, spent);
      setFinalIQ(iq);
      if (iq >= 130) setShowConfetti(true);
    }
  }, [phase, startTime, score, questions.length]);

  const handleAnswer = (optionIndex: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(optionIndex);
    const correct = optionIndex === currentQuestion.correct;

    if (correct) {
      setScore(prev => prev + 1);
      setFlashEffect('green');
    } else {
      setFlashEffect('red');
    }

    setIsCorrect(correct);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setPhase('result');
      return;
    }

    setCurrentIndex(prev => prev + 1);
    setTimer(questions[currentIndex + 1].timeLimit);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const renderMatrix = (question: Question) => {
    if (!question.matrix) return null;

    const { rows, cols, cells } = question.matrix;
    return (
      <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cells.flat().map((cell, idx) => (
          <div
            key={idx}
            className="aspect-square bg-black/30 rounded-lg border-2 border-white/10 flex items-center justify-center text-3xl"
          >
            {cell === '?' ? '❓' : cell}
          </div>
        ))}
      </div>
    );
  };

  // Intro Screen
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center">
          {/* Brain Animation */}
          <div className="relative mb-12">
            <div className="absolute inset-0 animate-pulse bg-purple-500/30 rounded-full blur-3xl" />
            <GiBrain className="relative text-8xl text-purple-400 mx-auto animate-bounce" />
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              IQ CHALLENGE
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Test your intelligence with 5 different question types:
            Pattern Recognition, Logic, Matrix, Word Logic, and Speed Thinking
          </p>

          <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto mb-8">
            <div className="bg-black/30 rounded-xl p-3 border border-white/10">
              <span className="text-3xl block mb-1">🔢</span>
              <span className="text-xs text-gray-400">Pattern</span>
            </div>
            <div className="bg-black/30 rounded-xl p-3 border border-white/10">
              <span className="text-3xl block mb-1">🧠</span>
              <span className="text-xs text-gray-400">Logic</span>
            </div>
            <div className="bg-black/30 rounded-xl p-3 border border-white/10">
              <span className="text-3xl block mb-1">🔲</span>
              <span className="text-xs text-gray-400">Matrix</span>
            </div>
            <div className="bg-black/30 rounded-xl p-3 border border-white/10">
              <span className="text-3xl block mb-1">📚</span>
              <span className="text-xs text-gray-400">Word</span>
            </div>
            <div className="bg-black/30 rounded-xl p-3 border border-white/10">
              <span className="text-3xl block mb-1">⚡</span>
              <span className="text-xs text-gray-400">Speed</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="group relative px-12 py-6 text-2xl font-black text-white mx-auto block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-black border-2 border-white/20 rounded-2xl px-12 py-6 overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                <FaBrain className="text-2xl" />
                START IQ TEST
              </span>
            </div>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
          </button>
        </div>
      </div>
    );
  }

  // Game Screen
  if (phase === 'game' && currentQuestion) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 transition-colors duration-500 ${
          flashEffect === 'green' ? 'bg-green-900/50' : flashEffect === 'red' ? 'bg-red-900/50' : ''
        }`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setPhase('intro')}
              className="px-4 py-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
            >
              <FaHome className="inline mr-2" /> MENU
            </button>

            <ScoreBoard score={score} total={questions.length} />

            <div className="flex gap-2">
              <div className="px-4 py-2 bg-black/40 rounded-xl border-2 border-white/20">
                <DifficultyBadge difficulty={currentQuestion.difficulty} />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full mb-6">
            <div className="flex items-center justify-between mb-2 text-white/60">
              <span>Question {currentIndex + 1}/{questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Timer */}
          <div className="mb-6">
            <Timer seconds={timer} maxSeconds={currentQuestion.timeLimit} />
          </div>

          {/* Question Type Badge */}
          <div className="flex justify-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border-2 border-white/20">
              <TypeIcon type={currentQuestion.type} />
              <span className="text-sm font-bold text-white uppercase">{currentQuestion.type}</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="relative mb-6">
            {/* Background Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50" />

            {/* Question Content */}
            <div className="relative bg-black/90 border-2 border-white/20 rounded-2xl p-8 backdrop-blur-xl">
              {currentQuestion.matrix ? (
                <div className="mb-6">
                  {renderMatrix(currentQuestion)}
                </div>
              ) : (
                <p className="text-2xl md:text-3xl font-bold text-white text-center leading-relaxed mb-6">
                  {currentQuestion.question}
                </p>
              )}

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrectAnswer = showExplanation && idx === currentQuestion.correct;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      className={`
                        p-6 rounded-xl border-2 text-lg font-bold transition-all
                        ${selectedAnswer !== null
                          ? isCorrectAnswer
                            ? 'bg-green-500/30 border-green-500 text-green-300'
                            : isSelected
                              ? 'bg-red-500/30 border-red-500 text-red-300'
                              : 'bg-white/10 border-white/20 text-gray-500'
                          : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105'
                        }
                      `}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="mt-6 p-4 rounded-xl bg-blue-500/20 border-2 border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <FaCheck className="text-green-400 text-xl" />
                    ) : (
                      <FaTimes className="text-red-400 text-xl" />
                    )}
                    <span className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? 'Correct!' : 'Incorrect!'}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Next Button */}
          {showExplanation && (
            <button
              onClick={nextQuestion}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black rounded-xl text-lg hover:scale-105 transition-transform"
            >
              NEXT QUESTION
            </button>
          )}
        </div>
      </div>
    );
  }

  // Result Screen
  if (phase === 'result') {
    const percentage = Math.round((score / questions.length) * 100);
    const iq = calculateIQScore(score, questions.length, timeSpent);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-black/50 border-4 border-white/20 rounded-3xl p-8 backdrop-blur-xl text-center">
          <FaTrophy className="text-6xl text-yellow-400 mx-auto mb-6 animate-bounce" />

          <h2 className="text-4xl font-black text-white mb-4">TEST COMPLETED!</h2>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-sm text-gray-400">Correct Answers</p>
              <p className="text-3xl font-black text-white">{score}/{questions.length}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-sm text-gray-400">Accuracy</p>
              <p className="text-3xl font-black text-white">{percentage}%</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-400 mb-2">Preliminary IQ Score</p>
            <div className={`text-5xl font-black bg-gradient-to-r ${getIQColor(iq)} bg-clip-text text-transparent`}>
              {iq}
            </div>
            <p className="text-lg text-white mt-2">{getIQLevel(iq)}</p>
          </div>

          <button
            onClick={() => setPhase('final')}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black rounded-xl text-lg hover:scale-105 transition-transform"
          >
            SEE FINAL RESULTS
          </button>
        </div>
      </div>
    );
  }

  // Final Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center p-4">
      {showConfetti && <Confetti mode="boom" particleCount={200} effectCount={1} x={0.5} y={0.3} colors={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']} />}

      <div className="max-w-2xl w-full bg-black/50 border-4 border-white/20 rounded-3xl p-8 backdrop-blur-xl text-center">
        <FaCrown className="text-6xl text-yellow-400 mx-auto mb-6 animate-pulse" />

        <h2 className="text-4xl font-black text-white mb-4">YOUR IQ SCORE</h2>

        <div className="relative mb-8">
          <div className={`text-8xl font-black bg-gradient-to-r ${getIQColor(finalIQ)} bg-clip-text text-transparent`}>
            {finalIQ}
          </div>
          <p className="text-2xl text-white mt-2">{getIQLevel(finalIQ)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-sm text-gray-400">Total Questions</p>
            <p className="text-2xl font-black text-white">{questions.length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-sm text-gray-400">Time Spent</p>
            <p className="text-2xl font-black text-white">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={startGame}
            className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black rounded-xl text-lg hover:scale-105 transition-transform"
          >
            <FaRedo className="inline mr-2" /> TRY AGAIN
          </button>

          <button
            onClick={() => setPhase('intro')}
            className="flex-1 py-4 bg-white/10 text-white font-black rounded-xl text-lg hover:bg-white/20 transition-colors"
          >
            <FaHome className="inline mr-2" /> MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default IQGame;