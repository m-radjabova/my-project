import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaCrown,
  FaPlay,
  FaPlus,
  FaRedo,
  FaTrash,
  FaStar,
  FaBolt,
  FaFire,
} from "react-icons/fa";
import { GiRaceCar, GiCheckeredFlag } from "react-icons/gi";
import { MdTimer } from "react-icons/md";
import Confetti from "react-confetti-boom";

import trackImg from "../../../assets/track-road.jpg";
import carBlue from "../../../assets/blue-car-removebg-preview.png";
import carBlack from "../../../assets/black-car-removebg-preview.png";

type Phase = "teacher" | "play" | "finish";
type PlayerId = 0 | 1;

type Player = {
  id: PlayerId;
  name: string;
  position: number; // 0-100%
};

type MathQuestion = {
  id: string;
  question: string;
  answer: number;
  difficulty: "easy" | "medium" | "hard";
  points: number;
};

type QuestionDraft = {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
};

const RACE_TRACK_LENGTH = 100; // 100%
const BASE_MOVE_AMOUNT = 10;
const TIME_BONUS_MULTIPLIER = 0.3;
const ROUND_TIME = 15;

const DEFAULT_QUESTIONS: MathQuestion[] = [
  { id: "1", question: "5 + 3 = ?", answer: 8, difficulty: "easy", points: 10 },
  { id: "2", question: "12 - 7 = ?", answer: 5, difficulty: "easy", points: 10 },
  { id: "3", question: "4 × 3 = ?", answer: 12, difficulty: "easy", points: 10 },
  { id: "4", question: "15 ÷ 3 = ?", answer: 5, difficulty: "easy", points: 10 },
  { id: "5", question: "9 + 6 = ?", answer: 15, difficulty: "easy", points: 10 },

  { id: "6", question: "18 - 9 = ?", answer: 9, difficulty: "medium", points: 15 },
  { id: "7", question: "7 × 6 = ?", answer: 42, difficulty: "medium", points: 15 },
  { id: "8", question: "24 ÷ 4 = ?", answer: 6, difficulty: "medium", points: 15 },
  { id: "9", question: "13 + 18 = ?", answer: 31, difficulty: "medium", points: 15 },
  { id: "10", question: "45 - 17 = ?", answer: 28, difficulty: "medium", points: 15 },

  { id: "11", question: "16 × 3 = ?", answer: 48, difficulty: "hard", points: 20 },
  { id: "12", question: "56 ÷ 7 = ?", answer: 8, difficulty: "hard", points: 20 },
  { id: "13", question: "84 - 39 = ?", answer: 45, difficulty: "hard", points: 20 },
  { id: "14", question: "12 × 12 = ?", answer: 144, difficulty: "hard", points: 20 },
  { id: "15", question: "125 ÷ 5 = ?", answer: 25, difficulty: "hard", points: 20 },
];

const shuffleArray = <T,>(arr: T[]) => {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

export default function MathRace() {
  const [phase, setPhase] = useState<Phase>("teacher");
  const [players, setPlayers] = useState<Player[]>([
    { id: 0, name: "Qora", position: 0 },
    { id: 1, name: "Ko'k", position: 0 },
  ]);

  const [questions, setQuestions] = useState<MathQuestion[]>(DEFAULT_QUESTIONS);
  const [activeQuestions, setActiveQuestions] = useState<MathQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [isPlaying, setIsPlaying] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [winner, setWinner] = useState<PlayerId | null>(null);
  const [locked, setLocked] = useState(false);
  const [answerResult, setAnswerResult] = useState<{ correct: boolean; message: string } | null>(null);

  const [draftQuestion, setDraftQuestion] = useState<QuestionDraft>({
    question: "",
    answer: "",
    difficulty: "medium",
    points: 15,
  });
  const [draftError, setDraftError] = useState("");

  const countdownTimerRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const playersRef = useRef<Player[]>(players);
  const activeQuestionsCountRef = useRef(0);

  // ===== Track sizing =====
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    if (phase !== "play" || !trackRef.current) return;
    const el = trackRef.current;

    const ro = new ResizeObserver(() => setTrackWidth(el.clientWidth));
    ro.observe(el);
    setTrackWidth(el.clientWidth);

    return () => ro.disconnect();
  }, [phase]);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  useEffect(() => {
    activeQuestionsCountRef.current = activeQuestions.length;
  }, [activeQuestions.length]);

  // MUHIM: START va FINISH pozitsiyalari
  const CAR_WIDTH = 220; // Kichikroq qilindi
  const START_POSITION = 40; // Start chizig'i chapdan 40px
  const FINISH_POSITION = trackWidth - 120; // Finish chizig'i o'ngdan 120px oldin

  const getCarX = (posPercent: number) => {
    if (trackWidth === 0) return START_POSITION;
    
    // 0% da START_POSITION, 100% da FINISH_POSITION - CAR_WIDTH
    const availableTrack = FINISH_POSITION - START_POSITION - CAR_WIDTH;
    return START_POSITION + (availableTrack * posPercent) / 100;
  };

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const progress = activeQuestions.length > 0 ? ((currentQuestionIndex + 1) / activeQuestions.length) * 100 : 0;

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    const correct = currentQuestion.answer;
    const opts = [correct];

    while (opts.length < 4) {
      let wrong: number;
      if (currentQuestion.difficulty === "easy") {
        wrong = correct + (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
      } else if (currentQuestion.difficulty === "medium") {
        wrong = correct + (Math.floor(Math.random() * 8) + 2) * (Math.random() > 0.5 ? 1 : -1);
      } else {
        wrong = correct + (Math.floor(Math.random() * 15) + 3) * (Math.random() > 0.5 ? 1 : -1);
      }
      if (wrong > 0 && !opts.includes(wrong)) opts.push(wrong);
    }
    return shuffleArray(opts);
  }, [currentQuestion]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2000);
  };

  // ===== Timer =====
  useEffect(() => {
    if (phase !== "play" || !isPlaying || locked) return;

    if (timeLeft <= 0) {
      showToast("⏰ Vaqt tugadi!");
      setLocked(true);
      setAnswerResult({ correct: false, message: "Vaqt tugadi!" });

      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
      transitionTimerRef.current = window.setTimeout(() => {
        if (currentQuestionIndex + 1 >= activeQuestionsCountRef.current) {
          const snapshot = playersRef.current;
          const w =
            snapshot[0].position > snapshot[1].position ? 0 :
            snapshot[1].position > snapshot[0].position ? 1 : null;

          setWinner(w);
          setPhase("finish");
          setIsPlaying(false);
        } else {
          setCurrentQuestionIndex((p) => p + 1);
          setTimeLeft(ROUND_TIME);
          setLocked(false);
          setAnswerResult(null);
        }
      }, 1200);

      return;
    }

    if (countdownTimerRef.current) {
      window.clearTimeout(countdownTimerRef.current);
    }
    countdownTimerRef.current = window.setTimeout(() => setTimeLeft((p) => p - 1), 1000);

    return () => {
      if (countdownTimerRef.current) window.clearTimeout(countdownTimerRef.current);
    };
  }, [phase, isPlaying, timeLeft, locked, currentQuestionIndex, activeQuestions.length]);

  // finish check
  useEffect(() => {
    const winIdx = players.findIndex((p) => p.position >= RACE_TRACK_LENGTH);
    if (winIdx !== -1 && phase === "play") {
      setWinner(winIdx as PlayerId);
      setIsPlaying(false);
      setPhase("finish");
      showToast(`🏁 ${players[winIdx].name} marraga yetdi!`);
    }
  }, [players, phase]);

  const addQuestion = () => {
    const question = draftQuestion.question.trim();
    const answer = parseInt(draftQuestion.answer);

    if (!question) return setDraftError("Savolni kiriting!");
    if (isNaN(answer)) return setDraftError("Javobni son ko'rinishida kiriting!");

    const newQuestion: MathQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      question,
      answer,
      difficulty: draftQuestion.difficulty,
      points: draftQuestion.points,
    };

    setQuestions((p) => [...p, newQuestion]);
    setDraftQuestion({ question: "", answer: "", difficulty: "medium", points: 15 });
    setDraftError("");
    showToast("✅ Savol qo'shildi");
  };

  const removeQuestion = (id: string) => {
    setQuestions((p) => p.filter((q) => q.id !== id));
    showToast("🗑️ Savol o'chirildi");
  };

  const updatePlayerName = (id: PlayerId, name: string) => {
    setPlayers((p) => p.map((x) => (x.id === id ? { ...x, name } : x)));
  };

  const startGame = () => {
    if (questions.length < 2) {
      setDraftError("Kamida 2 ta savol bo'lishi kerak!");
      return;
    }

    if (countdownTimerRef.current) window.clearTimeout(countdownTimerRef.current);
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);

    setPlayers((p) => p.map((x) => ({ ...x, position: 0 })));

    const shuffled = shuffleArray([...questions]);
    setActiveQuestions(shuffled);

    setCurrentQuestionIndex(0);
    setTimeLeft(ROUND_TIME);
    setIsPlaying(true);
    setLocked(false);
    setAnswerResult(null);
    setWinner(null);
    setPhase("play");
    showToast("🏁 Poyga boshlandi!");
  };

  const handleAnswer = (playerId: PlayerId, answer: number) => {
    if (locked || !isPlaying || !currentQuestion) return;

    if (countdownTimerRef.current) {
      window.clearTimeout(countdownTimerRef.current);
    }
    setLocked(true);

    const isCorrect = answer === currentQuestion.answer;
    const player = players[playerId];

    if (isCorrect) {
      const difficultyBonus = 
        currentQuestion.difficulty === "hard" ? 5 :
        currentQuestion.difficulty === "medium" ? 3 : 1;
      
      const timeBonus = Math.floor(timeLeft * TIME_BONUS_MULTIPLIER);
      const moveAmount = BASE_MOVE_AMOUNT + difficultyBonus + timeBonus;

      setPlayers((prev) =>
        prev.map((p) =>
          p.id === playerId ? { ...p, position: Math.min(p.position + moveAmount, RACE_TRACK_LENGTH) } : p
        )
      );

      setAnswerResult({ correct: true, message: `✅ ${player.name} to'g'ri! +${moveAmount}%` });
      showToast(`🚀 ${player.name} oldinga!`);
    } else {
      setAnswerResult({ correct: false, message: `❌ ${player.name} xato! To'g'ri: ${currentQuestion.answer}` });
      showToast(`❌ Xato! To'g'ri javob: ${currentQuestion.answer}`);
    }

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = window.setTimeout(() => {
      if (currentQuestionIndex + 1 >= activeQuestionsCountRef.current) {
        const snapshot = playersRef.current;
        const w =
          snapshot[0].position > snapshot[1].position ? 0 :
          snapshot[1].position > snapshot[0].position ? 1 : null;

        setWinner(w);
        setPhase("finish");
        setIsPlaying(false);
      } else {
        setCurrentQuestionIndex((p) => p + 1);
        setTimeLeft(ROUND_TIME);
        setLocked(false);
        setAnswerResult(null);
      }
    }, 1400);
  };

  const resetGame = () => {
    if (countdownTimerRef.current) window.clearTimeout(countdownTimerRef.current);
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);

    setPhase("teacher");
    setIsPlaying(false);
    setPlayers((p) => p.map((x) => ({ ...x, position: 0 })));
    setCurrentQuestionIndex(0);
    setWinner(null);
  };

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) window.clearTimeout(countdownTimerRef.current);
      if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "hard":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-blue-400 bg-blue-500/20 border-blue-500/30";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <FaStar className="text-green-400" />;
      case "medium":
        return <FaBolt className="text-yellow-400" />;
      case "hard":
        return <FaFire className="text-red-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      {/* Background - faqat yo'l */}
      {phase === "play" && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${trackImg})`,
            backgroundSize: "cover",
          }}
        />
      )}

      {/* Toast */}
      <div className="fixed left-1/2 top-24 z-50 -translate-x-1/2">
        {toast && (
          <div className="rounded-full border border-yellow-400/40 bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-2 text-sm font-bold text-white shadow-xl backdrop-blur-md">
            {toast}
          </div>
        )}
      </div>

      {phase === "finish" && winner !== null && (
        <Confetti
          mode="boom"
          particleCount={150}
          effectCount={1}
          x={0.5}
          y={0.35}
          colors={["#fbbf24", "#f59e0b", "#ef4444", "#3b82f6", "#10b981"]}
        />
      )}

      {/* ===== Teacher Panel ===== */}
      {phase === "teacher" && (
        <div className="relative z-10 mx-auto max-w-6xl p-6">
          <div className="rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-7 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500">
                <GiRaceCar className="text-3xl text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">MATH RACE</h2>
                <p className="text-yellow-200/80">O'qituvchi paneli - Savollar va o'yinchilarni sozlang</p>
              </div>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-200">1-O'yinchi (Qora)</label>
                <input
                  value={players[0].name}
                  onChange={(e) => updatePlayerName(0, e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2 text-white"
                  placeholder="O'yinchi 1"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-200">2-O'yinchi (Ko'k)</label>
                <input
                  value={players[1].name}
                  onChange={(e) => updatePlayerName(1, e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-2 text-white"
                  placeholder="O'yinchi 2"
                />
              </div>
            </div>

            <div className="mb-6 rounded-xl border border-yellow-400/30 bg-slate-800/50 p-4">
              <h3 className="mb-3 text-lg font-bold text-white">Yangi savol qo'shish</h3>

              <div className="grid gap-3 md:grid-cols-2">
                <input
                  value={draftQuestion.question}
                  onChange={(e) => setDraftQuestion({ ...draftQuestion, question: e.target.value })}
                  className="rounded-xl border border-yellow-400/30 bg-slate-900/50 px-4 py-2 text-white"
                  placeholder="Savol (masalan: 5 + 3 = ?)"
                />
                <input
                  value={draftQuestion.answer}
                  onChange={(e) => setDraftQuestion({ ...draftQuestion, answer: e.target.value })}
                  className="rounded-xl border border-yellow-400/30 bg-slate-900/50 px-4 py-2 text-white"
                  placeholder="Javob (son)"
                  type="number"
                />
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <select
                  value={draftQuestion.difficulty}
                  onChange={(e) => setDraftQuestion({ ...draftQuestion, difficulty: e.target.value as any })}
                  className="rounded-xl border border-yellow-400/30 bg-slate-900/50 px-4 py-2 text-white"
                >
                  <option value="easy">🌟 Oson</option>
                  <option value="medium">⚡ O'rtacha</option>
                  <option value="hard">🔥 Qiyin</option>
                </select>

                <input
                  value={draftQuestion.points}
                  onChange={(e) => setDraftQuestion({ ...draftQuestion, points: parseInt(e.target.value) || 0 })}
                  className="rounded-xl border border-yellow-400/30 bg-slate-900/50 px-4 py-2 text-white"
                  placeholder="Ball"
                  type="number"
                />

                <button
                  onClick={addQuestion}
                  className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 font-bold text-white transition-all hover:scale-[1.02]"
                >
                  <FaPlus className="mr-2 inline" />
                  Qo'shish
                </button>
              </div>

              {draftError && <p className="mt-2 text-sm text-red-400">{draftError}</p>}
            </div>

            <div className="mb-6 max-h-60 overflow-y-auto">
              <h3 className="mb-2 text-lg font-bold text-white">Savollar ({questions.length})</h3>
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between rounded-xl border border-slate-600 bg-slate-800/50 p-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-400">#{idx + 1}</span>
                      <span className="text-white">{q.question}</span>
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${getDifficultyColor(q.difficulty)}`}>
                        {getDifficultyIcon(q.difficulty)}
                        {q.difficulty}
                      </span>
                      <span className="text-yellow-400 text-sm">+{q.points}</span>
                    </div>
                    <button onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-300">
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {questions.length >= 2 && (
              <div className="text-center">
                <button
                  onClick={startGame}
                  className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 px-10 py-4 text-xl font-black text-white shadow-2xl transition hover:scale-[1.03]"
                >
                  <FaPlay className="mr-3 inline" />
                  POYGANI BOSHLASH
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== PLAY PHASE ===== */}
      {phase === "play" && (
        <div className="relative z-10 min-h-screen">
          {/* Header */}
          <div className="absolute left-0 right-0 top-0 z-30 bg-gradient-to-b from-black/70 to-transparent p-4">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-black/60 px-4 py-2 border border-yellow-400/30 backdrop-blur-sm">
                    <p className="text-xs text-yellow-200">Savol</p>
                    <p className="text-lg font-bold text-white">
                      {currentQuestionIndex + 1}/{activeQuestions.length}
                    </p>
                  </div>
                  <div className="rounded-xl bg-black/60 px-4 py-2 border border-yellow-400/30 backdrop-blur-sm">
                    <p className="text-xs text-yellow-200">Vaqt</p>
                    <p className="text-lg font-bold text-white flex items-center gap-1">
                      <MdTimer className={`${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-yellow-300'}`} />
                      {timeLeft}s
                    </p>
                  </div>
                </div>

                <button
                  onClick={resetGame}
                  className="h-10 w-10 rounded-xl bg-black/60 border border-yellow-400/30 text-white hover:bg-black/80 transition-all backdrop-blur-sm"
                  title="Qayta"
                >
                  <FaRedo className="mx-auto" />
                </button>
              </div>

              {/* Progress */}
              <div className="mt-3 h-2 rounded-full bg-white/20 backdrop-blur-sm">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* MUHIM: Track Area - Mashinalar uchun yuqori qism */}
          <div ref={trackRef} className="absolute inset-x-0 top-28 bottom-64 z-20">
            {/* START chizig'i */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-green-500/70 z-10"
              style={{ left: `${START_POSITION}px` }}
            >
              <div className="absolute -left-7 top-2 text-xs font-bold text-white bg-green-600/80 px-2 py-1 rounded-full backdrop-blur-sm">
                START
              </div>
            </div>

            {/* FINISH chizig'i */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-yellow-400/90 z-10"
              style={{ left: `${FINISH_POSITION}px` }}
            >
              <div className="absolute -left-7 top-2 text-xs font-bold text-white bg-yellow-600/80 px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                <GiCheckeredFlag className="text-white" />
                FINISH
              </div>
            </div>

            {/* Track markers */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/50 to-transparent">
              <div className="flex justify-between px-4 text-xs text-white/50">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {/* MUHIM: Cars - Kichikroq va balandroqda */}
            {players.map((player, idx) => {
              const x = getCarX(player.position);
              const src = player.id === 0 ? carBlack : carBlue;

              return (
                <div
                  key={player.id}
                  className="absolute transition-all duration-700 ease-out"
                  style={{
                    top: `${15 + idx * 25}%`, // Yuqoriroqda
                    left: `${x}px`,
                    zIndex: 40, // Kartochkalardan yuqori
                  }}
                >
                  <div className="relative group">
                    {/* MUHIM: Kichikroq mashina */}
                    <img
                      src={src}
                      alt={player.name}
                      draggable={false}
                      className="h-[100px] w-auto select-none drop-shadow-[0_15px_15px_rgba(0,0,0,0.7)] transition-transform group-hover:scale-105"
                      style={{ 
                        filter: 'brightness(1.1) contrast(1.1)',
                        transform: 'scaleX(-1)'
                      }}
                    />
                    
                    {/* Player name - Mashina ustida emas, pastda */}
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-50">
                      <div className="bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-yellow-400/30 text-xs">
                        <span className="text-white font-bold mr-1">{player.name}</span>
                        <span className="text-yellow-300 font-bold bg-yellow-500/20 px-1.5 py-0.5 rounded-full">
                          {Math.round(player.position)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MUHIM: Question Cards - Pastki qismda, mashinalardan pastda */}
          <div className="absolute bottom-4 left-0 right-0 z-10 px-4">
            <div className="mx-auto max-w-6xl">
              {/* Question info - Markazda, teparoqda */}
              {currentQuestion && (
                <div className="mb-4 text-center">
                  <div className="inline-flex items-center gap-3 bg-black/70 backdrop-blur-md px-5 py-2 rounded-full border border-yellow-400/30 shadow-xl">
                    <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold ${getDifficultyColor(currentQuestion.difficulty)}`}>
                      {getDifficultyIcon(currentQuestion.difficulty)}
                      {currentQuestion.difficulty === "easy" ? "OSON" : 
                       currentQuestion.difficulty === "medium" ? "O'RTACHA" : "QIYIN"}
                    </span>
                    <span className="text-2xl font-black text-white">{currentQuestion.question}</span>
                    <span className="text-yellow-300 font-bold text-sm bg-yellow-500/20 px-3 py-1 rounded-full">
                      +{currentQuestion.points} ball
                    </span>
                  </div>
                </div>
              )}

              {/* Answer buttons - Ikki chetda, pastda */}
              <div className="grid grid-cols-2 gap-4">
                {/* Player 1 (Qora) - Chap tomonda */}
                <div className="transform transition-all hover:scale-105">
                  <div className="rounded-xl border-2 border-purple-500/30 bg-black/70 p-4 backdrop-blur-md shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-black border-2 border-gray-400"></div>
                      <p className="text-md font-bold text-white">{players[0].name}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {options.map((option, idx) => (
                        <button
                          key={`p0-${idx}`}
                          onClick={() => !locked && handleAnswer(0, option)}
                          disabled={locked}
                          className="rounded-lg border-2 border-purple-500/30 bg-gradient-to-br from-purple-600/40 to-purple-800/40 p-3 text-xl font-black text-white hover:from-purple-600/60 hover:to-purple-800/60 transition-all disabled:opacity-50 shadow-md"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Player 2 (Ko'k) - O'ng tomonda */}
                <div className="transform transition-all hover:scale-105">
                  <div className="rounded-xl border-2 border-blue-500/30 bg-black/70 p-4 backdrop-blur-md shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-blue-300"></div>
                      <p className="text-md font-bold text-white">{players[1].name}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {options.map((option, idx) => (
                        <button
                          key={`p1-${idx}`}
                          onClick={() => !locked && handleAnswer(1, option)}
                          disabled={locked}
                          className="rounded-lg border-2 border-blue-500/30 bg-gradient-to-br from-blue-600/40 to-blue-800/40 p-3 text-xl font-black text-white hover:from-blue-600/60 hover:to-blue-800/60 transition-all disabled:opacity-50 shadow-md"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Answer result */}
              {answerResult && (
                <div className="mt-3 text-center">
                  <div
                    className={`inline-block rounded-lg p-2 border-2 ${
                      answerResult.correct ? "bg-green-500/30 border-green-500/40" : "bg-red-500/30 border-red-500/40"
                    } backdrop-blur-md`}
                  >
                    <p className="text-white font-bold">{answerResult.message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Finish ===== */}
      {phase === "finish" && (
        <div className="relative z-10 mx-auto max-w-3xl p-6">
          <div className="rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mb-5 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400/30" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-400">
                  <FaCrown className="text-4xl text-white" />
                </div>
              </div>
            </div>

            <h2 className="mb-3 text-4xl font-black text-white">
              {winner !== null ? `${players[winner].name} G'OLIB!` : "DURANG!"}
            </h2>

            <p className="mb-6 text-xl text-yellow-200">
              {winner !== null ? "Mashina marraga birinchi yetib keldi!" : "Ikkala mashina ham teng!"}
            </p>

            <div className="mx-auto mb-6 grid max-w-md grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-white font-bold">{players[0].name}</p>
                <p className="text-2xl font-black text-white">{players[0].position}%</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="text-white font-bold">{players[1].name}</p>
                <p className="text-2xl font-black text-white">{players[1].position}%</p>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={resetGame}
                className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-7 py-3 text-lg font-black text-white hover:scale-105 transition-all"
              >
                <FaPlay className="mr-2 inline" />
                Qayta O'ynash
              </button>
              <button
                onClick={() => (window.location.href = "/games")}
                className="rounded-xl border border-yellow-400/30 bg-white/10 px-7 py-3 text-lg font-bold text-white hover:bg-white/20 transition-all"
              >
                <FaArrowLeft className="mr-2 inline" />
                O'yinlar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
