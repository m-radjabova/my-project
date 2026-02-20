import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBolt,
  FaCheckCircle,
  FaClock,
  FaCompass,
  FaCrown,
  FaFlagCheckered,
  FaGem,
  FaLightbulb,
  FaMapMarkerAlt,
  FaRedo,
  FaTimesCircle,
  FaStar
} from "react-icons/fa";
import { GiTreasureMap, GiCrystalShine, GiChest, GiShipWheel, GiCompass } from "react-icons/gi";
import { RiTreasureMapFill } from "react-icons/ri";
import Confetti from "react-confetti-boom";
import type { Riddle } from "./types";
import { TREASURE_RIDDLES } from "./data/riddles";
import pirateOrchestra from "../../../assets/pirate_orchestra.m4a";


type Phase = "intro" | "play" | "finish";

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

const SECONDS_TOTAL = 12 * 60;
const SECONDS_PER_QUESTION = 45;
const HINT_PENALTY = 40;
const WRONG_PENALTY = 25;
const STEP_SCORE_REQUIREMENT = 95;

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const randomizeRiddlesForRun = (riddles: Riddle[]) => {
  return [...riddles].sort(() => Math.random() - 0.5);
};

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 to-yellow-950/40 p-4 backdrop-blur-sm">
    <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-amber-200/70">
      {icon} {title}
    </div>
    <div className="mt-2 text-2xl font-black text-white">{value}</div>
  </div>
);

export default function TreasureHunt() {
  const navigate = useNavigate();
  const finishViewRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [phase, setPhase] = useState<Phase>("intro");
  const [riddles, setRiddles] = useState<Riddle[]>(() => randomizeRiddlesForRun(TREASURE_RIDDLES));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [pathIndex, setPathIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(SECONDS_TOTAL);
  const [questionSeconds, setQuestionSeconds] = useState(SECONDS_PER_QUESTION);
  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [doubleReward, setDoubleReward] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const current = riddles[questionIndex];
  const targetPath = Math.max(1, riddles.length - 1);
  const progressPct = Math.round(((questionIndex + 1) / riddles.length) * 100);
  const journeyPct = Math.round((pathIndex / targetPath) * 100);
  const timePct = Math.round((secondsLeft / SECONDS_TOTAL) * 100);
  const questionTimePct = Math.round((questionSeconds / SECONDS_PER_QUESTION) * 100);
  const minScoreToWin = Math.max(900, riddles.length * STEP_SCORE_REQUIREMENT);
  const won = pathIndex >= targetPath && score >= minScoreToWin;

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (phase !== "play") return;
    if (secondsLeft <= 0) {
      setPhase("finish");
      setLocked(true);
      return;
    }
    const t = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, secondsLeft]);

  useEffect(() => {
    if (phase !== "play" || locked || questionSeconds <= 0) return;
    const t = window.setTimeout(() => setQuestionSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, questionSeconds, locked]);

  useEffect(() => {
    if (phase !== "play") return;
    setLocked(false);
    setSelected(null);
    setShowHint(false);
    setQuestionSeconds(SECONDS_PER_QUESTION);
    setDoubleReward(Math.random() < 0.25);
  }, [questionIndex, phase]);

  useEffect(() => {
    if (phase !== "finish") return;
    finishViewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [phase]);

  useEffect(() => {
    const audio = new Audio(pirateOrchestra);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (phase === "play") {
      void audioRef.current.play().catch(() => {
        // Browser autoplay can be blocked; user can retry with another click.
      });
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, [phase]);

  const start = () => {
    setRiddles(randomizeRiddlesForRun(TREASURE_RIDDLES));
    setPhase("play");
    setQuestionIndex(0);
    setPathIndex(0);
    setScore(0);
    setSecondsLeft(SECONDS_TOTAL);
    setQuestionSeconds(SECONDS_PER_QUESTION);
    setLocked(false);
    setSelected(null);
    setShowHint(false);
    setDoubleReward(Math.random() < 0.25);
    setToast("🚀 Sarguzasht boshlandi!");
  };

  const goNextQuestion = () => {
    if (questionIndex + 1 >= riddles.length) {
      setPhase("finish");
      setLocked(true);
      return;
    }
    setQuestionIndex((v) => v + 1);
  };

  const giveHint = () => {
    if (phase !== "play" || locked || showHint) return;
    setShowHint(true);
    setScore((s) => Math.max(0, s - HINT_PENALTY));
    setToast(`💡 Hint -${HINT_PENALTY} ball`);
  };

  const onAnswer = (idx: number) => {
    if (phase !== "play" || locked || !current) return;
    setLocked(true);
    setSelected(idx);
    const correct = idx === current.answerIndex;

    if (correct) {
      const speedBonus = Math.round(clamp(questionSeconds, 0, SECONDS_PER_QUESTION) * 1.5);
      const mult = doubleReward ? 2 : 1;
      const gain = (current.reward + speedBonus) * mult;
      const nextScore = score + gain;
      setScore(nextScore);

      setPathIndex((prev) => {
        const required = (prev + 1) * STEP_SCORE_REQUIREMENT;
        if (nextScore < required) {
          setToast(`✅ +${gain} ball, lekin keyingi qadam uchun ${required} kerak`);
          return prev;
        }
        setToast(`🎉 +${gain} ball! ${doubleReward ? 'BONUS x2!' : ''}`);
        return Math.min(targetPath, prev + 1);
      });
    } else {
      setScore((s) => Math.max(0, s - WRONG_PENALTY));
      setPathIndex((prev) => Math.max(0, prev - 1));
      setToast(`❌ -${WRONG_PENALTY} ball, xaritada 1 qadam orqaga`);
    }

    window.setTimeout(goNextQuestion, 1200);
  };

  const grade = useMemo(() => {
    if (score >= 1300) return { label: "Afsonaviy", icon: <FaCrown className="text-yellow-300" /> };
    if (score >= 950) return { label: "Zo'r", icon: <GiCrystalShine className="text-amber-300" /> };
    if (score >= 700) return { label: "Yaxshi", icon: <FaGem className="text-amber-400" /> };
    return { label: "Boshlovchi", icon: <FaCompass className="text-amber-300" /> };
  }, [score]);

  return (
    <div className="relative text-white">
      <div ref={finishViewRef} />
      {phase === "finish" && won && (
        <>
          <Confetti
            mode="boom"
            particleCount={100}
            effectCount={1}
            x={0.5}
            y={0.35}
            colors={["#f59e0b", "#fbbf24", "#f97316", "#d97706", "#fde68a"]}
          />
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            {[...Array(32)].map((_, i) => (
              <span
                key={`coin-${i}`}
                className="absolute top-[-12%] text-xl sm:text-2xl"
                style={{
                  left: `${(i * 97) % 100}%`,
                  animation: `coinRain ${2.4 + (i % 7) * 0.25}s linear ${(i % 9) * 0.12}s infinite`,
                  filter: "drop-shadow(0 2px 5px rgba(0, 0, 0, 0.35))",
                }}
              >
                🪙
              </span>
            ))}
          </div>
          <style>{`
            @keyframes coinRain {
              0% { transform: translate3d(0, -14vh, 0) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              100% { transform: translate3d(-8px, 110vh, 0) rotate(560deg); opacity: 0.95; }
            }
          `}</style>
        </>
      )}

      <div className="mx-auto w-full">
        {/* Toast Notification */}
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50">
          {toast && (
            <div className="rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 px-6 py-3 text-white font-bold shadow-2xl animate-bounce backdrop-blur-sm">
              {toast}
            </div>
          )}
        </div>

        {/* Intro Phase */}
        {phase === "intro" && (
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Rules */}
            <div className="relative transform-gpu overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 p-6 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10" />
              
              <h3 className="relative mb-6 flex items-center gap-2 text-lg font-black text-white">
                <GiCompass className="text-amber-400" />
                O'YIN QOIDALARI
              </h3>

              <div className="relative space-y-4">
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-4">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-sm">1</span>
                      <span className="text-sm text-amber-200/80">Savollar doim oldinga ketadi, orqaga qaytmaydi</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-sm">2</span>
                      <span className="text-sm text-amber-200/80">Xato javobda <b className="text-white">xaritada 1 qadam orqaga</b> tushasiz</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-sm">3</span>
                      <span className="text-sm text-amber-200/80">Har yangi qadam uchun <b className="text-white">minimal ball talab qilinadi</b></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-sm">4</span>
                      <span className="text-sm text-amber-200/80">Oxirida sandiqgacha yetmasangiz <b className="text-white">mag'lub bo'lasiz</b></span>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center gap-2 text-xs text-amber-200/60">
                  <FaBolt className="text-yellow-400" />
                  <span>Ba'zi savollarda x2 bonus bo'ladi!</span>
                </div>

                {/* Start Button */}
                <button
                  onClick={start}
                  className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 p-4 font-black text-white text-lg shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  <span className="relative flex items-center justify-center gap-3">
                    <GiShipWheel />
                    SARGUZASHTNI BOSHLASH
                  </span>
                </button>
              </div>
            </div>

            {/* Map Preview */}
            <div className="relative transform-gpu overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 p-6 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10" />
              
              <h3 className="relative mb-6 flex items-center gap-2 text-lg font-black text-white">
                <RiTreasureMapFill className="text-yellow-400" />
                XARITA PREVIEW
              </h3>

              <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-950/30 p-4">
                {/* Decorative map texture */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, #f59e0b 2px, transparent 0)',
                  backgroundSize: '30px 30px'
                }} />

                <div className="relative mx-auto h-44 w-full max-w-lg">
                  <svg viewBox="0 0 320 140" className="h-full w-full">
                    <path
                      d="M34,108 C90,30 148,126 194,62 C224,18 264,28 288,84"
                      fill="none"
                      stroke="rgba(245, 158, 11, 0.6)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="6 10"
                    />
                    <path
                      d="M34,108 C90,30 148,126 194,62 C224,18 264,28 288,84"
                      fill="none"
                      stroke="rgba(251, 191, 36, 0.9)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="40 400"
                    />
                  </svg>

                  {/* Start Marker */}
                  <div className="absolute left-2 bottom-4 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg">
                    <FaMapMarkerAlt />
                  </div>

                  {/* End Marker */}
                  <div className="absolute right-1 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                    <FaFlagCheckered />
                  </div>

                  {/* Treasure */}
                  <div className="absolute right-[6%] top-[46%] -translate-y-1/2 text-4xl text-yellow-500 animate-pulse">
                    <GiChest />
                  </div>

                  {/* Path Marker */}
                  <div className="absolute left-[20%] bottom-[30%] flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/30 border-2 border-amber-400 text-white font-bold text-sm">
                    1
                  </div>
                  <div className="absolute left-[35%] top-[40%] flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/30 border-2 border-amber-400 text-white font-bold text-sm">
                    2
                  </div>
                  <div className="absolute left-[55%] bottom-[25%] flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/30 border-2 border-amber-400 text-white font-bold text-sm">
                    3
                  </div>
                  <div className="absolute left-[75%] top-[20%] flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/30 border-2 border-amber-400 text-white font-bold text-sm">
                    4
                  </div>
                </div>

                <div className="relative mt-4 flex items-center justify-between text-xs font-bold text-amber-200/80">
                  <span>⚓ Boshlanish</span>
                  <span>🏴‍☠️ Xazina</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Play Phase */}
        {phase === "play" && current && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative transform-gpu overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 p-4 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10" />
                <p className="relative text-xs font-bold text-amber-400">⏳ UMUMIY VAQT</p>
                <p className="relative text-2xl font-black text-white">{formatTime(secondsLeft)}</p>
                <div className="relative mt-2 h-1.5 rounded-full bg-amber-500/20">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-400" style={{ width: `${clamp(timePct, 0, 100)}%` }} />
                </div>
              </div>

              <div className="relative transform-gpu overflow-hidden rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 p-4 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10" />
                <p className="relative text-xs font-bold text-yellow-400">📊 PROGRESS</p>
                <p className="relative text-2xl font-black text-white">{progressPct}%</p>
                <div className="relative mt-2 h-1.5 rounded-full bg-amber-500/20">
                  <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              <div className="relative transform-gpu overflow-hidden rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-900/30 to-amber-900/30 p-4 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10" />
                <p className="relative text-xs font-bold text-orange-400">🏆 BALL</p>
                <p className="relative text-2xl font-black text-white">{score}</p>
                <div className="relative mt-2 flex items-center gap-1 text-xs text-amber-200/80">
                  {grade.icon}
                  <span>{grade.label}</span>
                </div>
              </div>

              <div className="relative transform-gpu overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 p-4 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10" />
                <p className="relative text-xs font-bold text-amber-400">⏱️ SAVOL VAQTI</p>
                <p className="relative text-2xl font-black text-white">{questionSeconds}s</p>
                <div className="relative mt-2 h-1.5 rounded-full bg-amber-500/20">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-400" style={{ width: `${questionTimePct}%` }} />
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="relative transform-gpu overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 p-6 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10" />

              <div className="relative flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black border border-amber-500/30">
                  <GiTreasureMap className="text-amber-400" />
                  XARITA
                </div>
                {doubleReward && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1 text-xs font-black text-white animate-pulse">
                    <FaBolt /> BONUS x2
                  </div>
                )}
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-950/30 p-4">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, #f59e0b 2px, transparent 0)',
                  backgroundSize: '30px 30px'
                }} />

                <div className="relative mx-auto h-56 w-full max-w-4xl sm:h-72">
                  <svg viewBox="0 0 700 260" className="h-full w-full">
                    {/* Background path */}
                    <path
                      d="M56,196 C170,54 296,236 398,110 C476,34 586,44 648,138"
                      fill="none"
                      stroke="rgba(245, 158, 11, 0.3)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray="8 16"
                    />
                    {/* Progress path */}
                    <path
                      d="M56,196 C170,54 296,236 398,110 C476,34 586,44 648,138"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${journeyPct * 8} 1600`}
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Start Marker */}
                  <div className="absolute left-2 bottom-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xl">
                    <FaMapMarkerAlt />
                  </div>

                  {/* End Marker */}
                  <div className="absolute right-1 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-xl">
                    <FaFlagCheckered />
                  </div>

                  {/* Treasure */}
                  <div className="absolute right-[6%] top-[54%] -translate-y-1/2 text-6xl text-yellow-500 animate-pulse">
                    <GiChest />
                  </div>

                  {/* Current Position */}
                  <div
                    className="absolute bottom-[18%] z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black shadow-lg transition-all duration-500 border-2 border-white"
                    style={{ left: `${8 + journeyPct * 0.84}%` }}
                  >
                    {pathIndex + 1}
                  </div>

                  {/* Node Markers */}
                  {[1, 2, 3, 4].map((node, i) => {
                    const positions = [
                      { left: '15%', top: '70%' },
                      { left: '30%', top: '40%' },
                      { left: '50%', top: '55%' },
                      { left: '70%', top: '25%' }
                    ];
                    const isPassed = i < pathIndex;
                    return (
                      <div
                        key={node}
                        className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 font-bold text-sm ${
                          isPassed 
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 border-white text-white'
                            : 'bg-amber-950/50 border-amber-500/50 text-amber-200/50'
                        }`}
                        style={{ left: positions[i].left, top: positions[i].top }}
                      >
                        {node}
                      </div>
                    );
                  })}
                </div>

                <div className="relative mt-4 flex items-center justify-between text-xs font-bold text-amber-200/80">
                  <span>⚓ START</span>
                  <span>Savol {questionIndex + 1}/{riddles.length}</span>
                  <span>🏴‍☠️ TREASURE</span>
                </div>
              </div>
            </div>

            {/* Question Section */}
            <div className="relative transform-gpu overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 p-6 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10" />

              <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.12em] text-amber-400">
                    {current.title}
                  </div>
                  <div className="mt-1 text-sm text-amber-200/80">
                    {current.story}
                  </div>
                </div>
                <button
                  onClick={giveHint}
                  disabled={locked || showHint}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-black transition-all ${
                    locked || showHint
                      ? 'bg-amber-500/20 text-amber-200/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:scale-105'
                  }`}
                >
                  <FaLightbulb /> Hint (-{HINT_PENALTY})
                </button>
              </div>

              {showHint && (
                <div className="relative mb-4 rounded-2xl bg-amber-500/20 border border-amber-500/30 p-4 text-sm text-amber-200">
                  <b className="text-amber-400">💡 Hint:</b> {current.hint}
                </div>
              )}

              <div className="relative mb-6 text-2xl font-black leading-tight text-white">
                {current.question}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {current.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrect = i === current.answerIndex;
                  const reveal = locked && selected !== null;

                  let stateClass = 'border-amber-500/30 bg-amber-950/30 hover:bg-amber-900/40';
                  if (reveal && isCorrect) {
                    stateClass = 'border-emerald-500/50 bg-emerald-500/20';
                  } else if (reveal && isSelected && !isCorrect) {
                    stateClass = 'border-rose-500/50 bg-rose-500/20';
                  } else if (isSelected) {
                    stateClass = 'border-amber-400 bg-amber-500/30';
                  }

                  return (
                    <button
                      key={`${opt}-${i}`}
                      onClick={() => onAnswer(i)}
                      disabled={locked}
                      className={`group relative overflow-hidden rounded-2xl border-2 p-4 text-left font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 ${stateClass}`}
                    >
                      <span className="relative flex items-center justify-between">
                        <span>{opt}</span>
                        {reveal && isCorrect && (
                          <FaCheckCircle className="text-emerald-400 text-xl" />
                        )}
                        {reveal && isSelected && !isCorrect && (
                          <FaTimesCircle className="text-rose-400 text-xl" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Finish Button */}
            <div className="flex justify-center">
              <button
                onClick={() => setPhase("finish")}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-8 py-3 font-black text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <span className="relative flex items-center gap-3">
                  <FaCrown />
                  YAKUNLASH
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Finish Phase */}
        {phase === "finish" && (
          <div className="relative transform-gpu overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-900/30 via-yellow-900/30 to-orange-900/30 p-8 backdrop-blur-xl text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10" />
            
            <div className="relative mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400/30" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-500">
                  {won ? <GiChest className="text-4xl text-white" /> : <FaCompass className="text-4xl text-white" />}
                </div>
              </div>
            </div>
            
            <h2 className="relative mb-4 text-4xl font-black bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {won ? "🏆 Xazina topildi!" : "😔 Mag'lub bo'ldingiz"}
            </h2>
            
            <p className="relative mb-2 text-lg text-amber-200/80">
              Yakuniy ball: <span className="font-black text-white">{score}</span>
            </p>
            
            <p className="relative mb-6 flex items-center justify-center gap-2 text-amber-200/80">
              {grade.icon}
              <span>Reyting: <span className="font-black text-white">{grade.label}</span></span>
            </p>

            {!won && (
              <p className="relative mb-6 text-sm text-amber-200/60">
                Kerakli minimum ball: {minScoreToWin}, sizda: {score}
              </p>
            )}

            <div className="relative mb-8 grid gap-3 sm:grid-cols-3">
              <StatCard 
                title="XARITA PROGRESS" 
                value={`${journeyPct}%`} 
                icon={<GiTreasureMap className="text-amber-400" />} 
              />
              <StatCard 
                title="QOLGAN VAQT" 
                value={formatTime(secondsLeft)} 
                icon={<FaClock className="text-amber-400" />} 
              />
              <StatCard 
                title="REYTING" 
                value={grade.label} 
                icon={<FaStar className="text-amber-400" />} 
              />
            </div>

            <div className="relative flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={start}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 font-black text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <span className="relative flex items-center gap-2">
                  <FaRedo />
                  YANA O'YNA
                </span>
              </button>
              
              <button
                onClick={() => navigate("/games")}
                className="group relative overflow-hidden rounded-xl bg-amber-500/20 px-6 py-3 font-bold text-white border border-amber-500/30 transition-all hover:bg-amber-500/30"
              >
                <span className="relative flex items-center gap-2">
                  <FaCompass />
                  O'YINLAR RO'YXATI
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
