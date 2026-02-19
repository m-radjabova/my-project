import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapTexture from "../../../assets/map.jpg";
import pirateMusic from "../../../assets/pirate_orchestra.m4a";
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
  FaPlay,
  FaRedo,
  FaTimesCircle,
} from "react-icons/fa";
import { GiTreasureMap, GiCrystalShine, GiChest } from "react-icons/gi";
import type { Phase, Riddle } from "./types";
import { TREASURE_RIDDLES } from "./data/riddles";
import { clamp, formatTime, randomizeRiddlesForRun } from "./utils/gameUtils";
import ConfettiBurst from "./components/ConfettiBurst";
import StatCard from "./components/StatCard";

const SECONDS_TOTAL = 12 * 60;
const SECONDS_PER_QUESTION = 45;
const HINT_PENALTY = 40;
const WRONG_PENALTY = 25;
const STEP_SCORE_REQUIREMENT = 95;

export default function TreasureHunt() {
  const navigate = useNavigate();
  const bgmRef = useRef<HTMLAudioElement | null>(null);

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
  const [confetti, setConfetti] = useState(false);

  const current = riddles[questionIndex];
  const targetPath = Math.max(1, riddles.length - 1);
  const progressPct = Math.round(((questionIndex + 1) / riddles.length) * 100);
  const journeyPct = Math.round((pathIndex / targetPath) * 100);
  const timePct = Math.round((secondsLeft / SECONDS_TOTAL) * 100);
  const questionTimePct = Math.round((questionSeconds / SECONDS_PER_QUESTION) * 100);
  const minScoreToWin = Math.max(900, riddles.length * STEP_SCORE_REQUIREMENT);
  const won = pathIndex >= targetPath && score >= minScoreToWin;

  useEffect(() => {
    const audio = new Audio(pirateMusic);
    audio.loop = true;
    audio.volume = 0.35;
    bgmRef.current = audio;
    return () => {
      audio.pause();
      audio.currentTime = 0;
      bgmRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = bgmRef.current;
    if (!audio) return;
    if (phase === "play") {
      audio.play().catch(() => {
        setToast("Musiqa uchun ekranga bir marta bosing.");
        window.setTimeout(() => setToast(null), 1800);
      });
      return;
    }
    audio.pause();
    audio.currentTime = 0;
  }, [phase]);

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
    const dp = Math.random() < 0.25;
    setDoubleReward(dp);
  }, [questionIndex, phase]);

  useEffect(() => {
    if (phase === "finish" && won) setConfetti(true);
  }, [phase, won]);

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
    setToast(null);
    setConfetti(false);
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
    setToast(`Hint -${HINT_PENALTY} ball`);
    window.setTimeout(() => setToast(null), 1200);
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
          setToast(`+${gain} ball, lekin keyingi qadam uchun ${required} kerak`);
          window.setTimeout(() => setToast(null), 1500);
          return prev;
        }
        return Math.min(targetPath, prev + 1);
      });
    } else {
      setScore((s) => Math.max(0, s - WRONG_PENALTY));
      setPathIndex((prev) => Math.max(0, prev - 1));
      setToast(`-${WRONG_PENALTY} ball, xaritada 1 qadam orqaga`);
      window.setTimeout(() => setToast(null), 1200);
    }

    if (correct) {
      setToast((prev) => prev ?? "To'g'ri javob");
      window.setTimeout(() => setToast(null), 1200);
    }

    window.setTimeout(goNextQuestion, 900);
  };

  const grade = useMemo(() => {
    if (score >= 1300) return { label: "Afsonaviy", icon: <FaCrown /> };
    if (score >= 950) return { label: "Zo'r", icon: <GiCrystalShine /> };
    if (score >= 700) return { label: "Yaxshi", icon: <FaGem /> };
    return { label: "Boshlovchi", icon: <FaCompass /> };
  }, [score]);

  return (
    <div className="px-2 py-3 text-white sm:px-3 sm:py-4">
      <ConfettiBurst show={confetti} onDone={() => setConfetti(false)} />

      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-white">
              <GiTreasureMap className="text-base" />
              TREASURE HUNT
            </div>
            <h1 className="mt-3 text-3xl font-black">Xazina Ovchilari</h1>
            <p className="mt-1 text-white/85">Savollar oldinga ketadi, xaritadagi qadam esa javobga qarab yuradi.</p>
          </div>

          <div className="flex gap-2">
            {phase !== "play" ? (
              <button
                onClick={start}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-[#7a2d00] hover:bg-white/95 active:scale-[0.99]"
              >
                <FaPlay /> Boshlash
              </button>
            ) : (
              <button
                onClick={() => setPhase("finish")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-[#7a2d00] hover:bg-white/95 active:scale-[0.99]"
              >
                <FaCrown /> Yakunlash
              </button>
            )}

            <button
              onClick={() => navigate("/games")}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/15 active:scale-[0.99]"
            >
              <FaRedo /> Orqaga
            </button>
          </div>
        </div>

        <div className="relative mt-4 h-10">
          {toast ? (
            <div className="absolute left-0 right-0 mx-auto w-fit rounded-full bg-black/25 px-4 py-2 text-sm font-bold backdrop-blur">
              {toast}
            </div>
          ) : null}
        </div>

        <div className="mt-4 rounded-[28px] border border-white/25 bg-white/10 p-6 shadow-2xl backdrop-blur-xl lg:p-8">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Savol progress</div>
              <div className="mt-1 text-lg font-black">
                Savol {questionIndex + 1}/{riddles.length} • {progressPct}%
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-black/20">
                <div className="h-full rounded-full bg-white/80" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Score</div>
              <div className="mt-1 flex items-center gap-2 text-2xl font-black">
                <GiChest /> {score}
              </div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/85">
                {grade.icon} Reyting: {grade.label}
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Time</div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-black text-white">
                  <FaClock /> {formatTime(secondsLeft)}
                </div>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-black/20">
                <div className="h-full rounded-full bg-white/80" style={{ width: `${clamp(timePct, 0, 100)}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-white/80">
                <span>Savol timer</span>
                <span className="font-black">{questionSeconds}s</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-black/20">
                <div className="h-full rounded-full bg-white/60 transition-all" style={{ width: `${clamp(questionTimePct, 0, 100)}%` }} />
              </div>
            </div>
          </div>

          {phase === "intro" ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black">
                  <FaCompass /> Qoidalar
                </div>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/85">
                  <li>Savollar doim oldinga ketadi, orqaga qaytmaydi.</li>
                  <li>Xato javobda xaritada 1 qadam orqaga tushasiz.</li>
                  <li>Har yangi qadam uchun minimal ball talab qilinadi.</li>
                  <li>Oxirida sandiqgacha yetmasangiz mag'lub bo'lasiz.</li>
                </ul>
                <button
                             onClick={start}
                              className="group relative mt-8 overflow-hidden rounded-full border-2 border-[#ffe24d] bg-gradient-to-b from-[#ffd966] to-[#ffb347] px-12 py-4 text-lg font-black tracking-wider text-[#1a1a1a] shadow-[0_12px_0_0_rgba(230,126,34,0.95),0_15px_25px_rgba(0,0,0,0.2)] transition-all hover:translate-y-1 hover:shadow-[0_10px_0_0_rgba(230,126,34,0.95)] active:translate-y-3 active:shadow-[0_8px_0_0_rgba(230,126,34,0.95)] animate-fade-in-up"
                            >
                              <span className="relative z-10 flex items-center gap-3">
                                <FaPlay /> Sarguzashtni boshlash
                              </span>
                              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
                            </button>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black">
                  <FaBolt /> Map Preview
                </div>
                <div className="relative mt-4 overflow-hidden rounded-[22px] border border-[#f2d19c]/60 bg-[#c08a4a]/30 p-4">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-35"
                    style={{ backgroundImage: `url(${mapTexture})`, backgroundSize: "cover", backgroundPosition: "center" }}
                  />
                  <div className="relative mx-auto h-44 w-full max-w-lg">
                    <svg viewBox="0 0 320 140" className="h-full w-full">
                      <path
                        d="M34,108 C90,30 148,126 194,62 C224,18 264,28 288,84"
                        fill="none"
                        stroke="rgba(173, 26, 26, 0.85)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray="3 10"
                      />
                    </svg>
                    <div className="absolute left-2 bottom-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#8de1d9] text-[#7a2d00] shadow-lg">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="absolute right-1 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#8de1d9] text-[#7a2d00] shadow-lg">
                      <FaFlagCheckered />
                    </div>
                    <div className="absolute right-3 top-[46%] -translate-y-1/2 text-3xl font-black text-red-700">X</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-white/85">
                    <span>Boshlanish nuqtasi</span>
                    <span>Xazina nuqtasi</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {phase === "play" && current ? (
            <div className="mt-6">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black">
                    <GiTreasureMap /> Xarita
                  </div>
                  {doubleReward ? (
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-[#7a2d00]">
                      <FaBolt /> BONUS x2
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
                      Oddiy node
                    </div>
                  )}
                </div>

                <div className="relative mt-4 overflow-hidden rounded-[26px] border-2 border-[#f2d19c]/70 bg-[#c08a4a]/35 p-4 sm:p-6">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-55"
                    style={{ backgroundImage: `url(${mapTexture})`, backgroundSize: "cover", backgroundPosition: "center" }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f4d9ab]/10 to-[#6f3f1f]/35" />
                  <div className="relative mx-auto h-56 w-full max-w-4xl sm:h-72">
                    <svg viewBox="0 0 700 260" className="h-full w-full">
                      <path
                        d="M56,196 C170,54 296,236 398,110 C476,34 586,44 648,138"
                        fill="none"
                        stroke="rgba(124, 51, 28, 0.38)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray="4 16"
                      />
                      <path
                        d="M56,196 C170,54 296,236 398,110 C476,34 586,44 648,138"
                        fill="none"
                        stroke="rgba(155, 27, 27, 0.95)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${journeyPct * 7} 1600`}
                      />
                    </svg>
                    <div className="absolute left-2 bottom-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#8de1d9] text-[#7a2d00] shadow-xl sm:h-14 sm:w-14">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="absolute right-1 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#8de1d9] text-[#7a2d00] shadow-xl sm:h-14 sm:w-14">
                      <FaFlagCheckered />
                    </div>
                    <div className="absolute right-[6%] top-[54%] -translate-y-1/2 text-6xl font-black tracking-tight text-red-800/90 sm:text-7xl">X</div>
                    <div className="absolute right-[4%] top-[2%] rounded-2xl bg-black/20 p-2 text-4xl text-[#6f3f1f] sm:text-5xl">
                      <GiChest />
                    </div>
                    <div
                      className="absolute bottom-[18%] z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-[#fef3c7] bg-[#fff8e6] text-[#7a2d00] shadow-lg transition-all duration-500 sm:h-11 sm:w-11"
                      style={{ left: `${8 + journeyPct * 0.84}%` }}
                    >
                      {pathIndex + 1}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold text-white/85">
                    <span>Start</span>
                    <span>
                      Savol {questionIndex + 1}/{riddles.length}
                    </span>
                    <span>Treasure</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.12em] text-white/70">{current.title}</div>
                    <div className="mt-1 text-sm text-white/85">{current.story}</div>
                  </div>
                  <button
                    onClick={giveHint}
                    disabled={locked || showHint}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-black transition ${
                      locked || showHint ? "bg-white/10 text-white/60" : "bg-white text-[#7a2d00] hover:bg-white/95"
                    }`}
                  >
                    <FaLightbulb /> Hint (-{HINT_PENALTY})
                  </button>
                </div>

                {showHint ? (
                  <div className="mt-4 rounded-2xl bg-black/15 p-4 text-sm text-white/90">
                    <b>Hint:</b> {current.hint}
                  </div>
                ) : null}

                <div className="mt-5 text-2xl font-black leading-tight">{current.question}</div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {current.options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isCorrect = i === current.answerIndex;
                    const reveal = locked && selected !== null;
                    const state =
                      reveal && isCorrect
                        ? "border-emerald-200 bg-emerald-500/25"
                        : reveal && isSelected && !isCorrect
                          ? "border-rose-200 bg-rose-500/25"
                          : "border-white/20 bg-white/10 hover:bg-white/15";

                    return (
                      <button
                        key={`${opt}-${i}`}
                        onClick={() => onAnswer(i)}
                        disabled={locked}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left font-black text-white transition active:scale-[0.99] ${state}`}
                      >
                        <span>{opt}</span>
                        {reveal && isCorrect ? (
                          <FaCheckCircle className="text-emerald-200" />
                        ) : reveal && isSelected && !isCorrect ? (
                          <FaTimesCircle className="text-rose-200" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {phase === "finish" ? (
            <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#7a2d00]">
                <FaCrown className="text-2xl" />
              </div>
              <h2 className="mt-4 text-4xl font-black">{won ? "Xazina topildi!" : "Mag'lub bo'ldingiz"}</h2>
              <p className="mt-2 text-white/85">
                Yakuniy ball: <span className="font-black text-white">{score}</span> • Reyting:{" "}
                <span className="font-black text-white">{grade.label}</span>
              </p>
              {!won ? (
                <p className="mt-2 text-sm text-rose-200">
                  Xazinagacha yetmadingiz. Kerakli minimum ball: {minScoreToWin}, sizda: {score}.
                </p>
              ) : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <StatCard title="Xarita progress" value={`${journeyPct}%`} icon={<GiTreasureMap />} />
                <StatCard title="Time left" value={formatTime(secondsLeft)} icon={<FaClock />} />
                <StatCard title="Rank" value={grade.label} icon={<GiCrystalShine />} />
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <button
                  onClick={start}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-black text-[#7a2d00] hover:bg-white/95 active:scale-[0.99]"
                >
                  <FaRedo /> Yana o'ynash
                </button>
                <button
                  onClick={() => navigate("/games")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-6 py-3 text-sm font-black text-white hover:bg-white/15 active:scale-[0.99]"
                >
                  <FaCompass /> O'yinlar ro'yxatiga
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
