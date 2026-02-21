import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBolt,
  FaCheckCircle,
  FaClock,
  FaCompass,
  FaCrown,
  FaEdit,
  FaLightbulb,
  FaPlus,
  FaRedo,
  FaTimesCircle,
  FaTrash,
} from "react-icons/fa";
import { GiChest } from "react-icons/gi";
import Confetti from "react-confetti-boom";
import { fetchGameQuestions, saveGameQuestions } from "../../../apiClient/gameQuestions";
import useContextPro from "../../../hooks/useContextPro";
import { hasAnyRole } from "../../../utils/roles";
import pirateOrchestra from "../../../assets/pirate_orchestra.m4a";
import { TREASURE_RIDDLES } from "./data/riddles";
import type { Riddle } from "./types";

type Phase = "intro" | "play" | "finish";
type RiddleDraft = {
  title: string;
  story: string;
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  hint: string;
  reward: string;
};

const TREASURE_HUNT_GAME_KEY = "treasure_hunt";
const SECONDS_TOTAL = 12 * 60;
const SECONDS_PER_QUESTION = 45;
const HINT_PENALTY = 40;
const WRONG_PENALTY = 25;
const STEP_SCORE_REQUIREMENT = 95;
const EMPTY_DRAFT: RiddleDraft = {
  title: "",
  story: "",
  question: "",
  options: ["", "", "", ""],
  answerIndex: 0,
  hint: "",
  reward: "120",
};

const randomizeRiddles = (riddles: Riddle[]) => [...riddles].sort(() => Math.random() - 0.5);
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export default function TreasureHunt() {
  const navigate = useNavigate();
  const {
    state: { user },
  } = useContextPro();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const skipInitialRemoteSaveRef = useRef(true);

  const [phase, setPhase] = useState<Phase>("intro");
  const [questionBank, setQuestionBank] = useState<Riddle[]>(TREASURE_RIDDLES);
  const [riddles, setRiddles] = useState<Riddle[]>(() => randomizeRiddles(TREASURE_RIDDLES));
  const [draft, setDraft] = useState<RiddleDraft>(EMPTY_DRAFT);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [questionError, setQuestionError] = useState("");
  const [remoteLoaded, setRemoteLoaded] = useState(false);

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

  const canManageQuestions = hasAnyRole(user, ["teacher", "admin"]);
  const current = riddles[questionIndex];
  const targetPath = Math.max(1, riddles.length - 1);
  const minScoreToWin = Math.max(900, riddles.length * STEP_SCORE_REQUIREMENT);
  const won = pathIndex >= targetPath && score >= minScoreToWin;
  const progressPct = riddles.length > 0 ? Math.round(((questionIndex + 1) / riddles.length) * 100) : 0;

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const remote = await fetchGameQuestions<Riddle>(TREASURE_HUNT_GAME_KEY);
      if (!alive) return;
      if (remote && remote.length > 0) {
        setQuestionBank(remote);
        setRiddles(randomizeRiddles(remote));
      }
      setRemoteLoaded(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!remoteLoaded) return;
    if (skipInitialRemoteSaveRef.current) {
      skipInitialRemoteSaveRef.current = false;
      return;
    }
    const t = window.setTimeout(() => void saveGameQuestions<Riddle>(TREASURE_HUNT_GAME_KEY, questionBank), 500);
    return () => window.clearTimeout(t);
  }, [questionBank, remoteLoaded]);

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
      void audioRef.current.play().catch(() => {});
      return;
    }
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, [phase]);

  useEffect(() => {
    if (phase !== "play") return;
    if (secondsLeft <= 0) return setPhase("finish");
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
  }, [phase, questionIndex]);

  const resetDraft = () => {
    setDraft(EMPTY_DRAFT);
    setEditingIdx(null);
    setQuestionError("");
  };

  const saveRiddle = () => {
    const title = draft.title.trim();
    const story = draft.story.trim();
    const question = draft.question.trim();
    const options = draft.options.map((o) => o.trim()) as [string, string, string, string];
    const hint = draft.hint.trim();
    const reward = Number(draft.reward);
    if (!title || !story || !question || !hint) return setQuestionError("Barcha maydonlarni to'ldiring.");
    if (options.some((o) => !o)) return setQuestionError("4 ta variant kiriting.");
    if (new Set(options.map((o) => o.toLowerCase())).size < 4) return setQuestionError("Variantlar turlicha bo'lsin.");
    if (!Number.isFinite(reward) || reward < 10) return setQuestionError("Mukofot kamida 10 bo'lsin.");

    const item: Riddle = {
      id: editingIdx !== null ? questionBank[editingIdx]?.id ?? `${Date.now()}` : `${Date.now()}`,
      title,
      story,
      question,
      options,
      answerIndex: draft.answerIndex,
      hint,
      reward: Math.round(reward),
    };
    if (editingIdx !== null) {
      setQuestionBank((prev) => prev.map((r, idx) => (idx === editingIdx ? item : r)));
      setToast("Savol yangilandi");
      return resetDraft();
    }
    setQuestionBank((prev) => [...prev, item]);
    setToast("Savol qo'shildi");
    resetDraft();
  };

  const start = () => {
    if (questionBank.length < 1) return setQuestionError("Kamida 1 ta savol qo'shing.");
    setRiddles(randomizeRiddles(questionBank));
    setQuestionError("");
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
  };

  const goNext = () => {
    if (questionIndex + 1 >= riddles.length) return setPhase("finish");
    setQuestionIndex((v) => v + 1);
  };

  const onAnswer = (idx: number) => {
    if (phase !== "play" || locked || !current) return;
    setLocked(true);
    setSelected(idx);
    const correct = idx === current.answerIndex;
    if (correct) {
      const speedBonus = Math.round(clamp(questionSeconds, 0, SECONDS_PER_QUESTION) * 1.5);
      const gain = (current.reward + speedBonus) * (doubleReward ? 2 : 1);
      const nextScore = score + gain;
      setScore(nextScore);
      setPathIndex((prev) => (nextScore >= (prev + 1) * STEP_SCORE_REQUIREMENT ? Math.min(targetPath, prev + 1) : prev));
    } else {
      setScore((s) => Math.max(0, s - WRONG_PENALTY));
      setPathIndex((p) => Math.max(0, p - 1));
    }
    window.setTimeout(goNext, 1200);
  };

  const grade = useMemo(() => {
    if (score >= 1300) return "Afsonaviy";
    if (score >= 950) return "Zo'r";
    if (score >= 700) return "Yaxshi";
    return "Boshlovchi";
  }, [score]);

  return (
    <div className="relative text-white">
      {phase === "finish" && won && <Confetti mode="boom" particleCount={80} effectCount={1} x={0.5} y={0.35} />}
      <div className="fixed left-1/2 top-24 z-50 -translate-x-1/2">{toast && <div className="rounded-full bg-yellow-600 px-6 py-2 font-bold text-white">{toast}</div>}</div>

      {phase === "intro" && (
        <div className="space-y-4">
          {canManageQuestions && (
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-900/20 p-4">
              <h3 className="mb-3 text-lg font-black">O'QITUVCHI PANELI</h3>
              <div className="grid gap-2 md:grid-cols-2">
                <input value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} className="rounded-xl bg-white/10 p-2" placeholder="Sarlavha" />
                <input value={draft.story} onChange={(e) => setDraft((p) => ({ ...p, story: e.target.value }))} className="rounded-xl bg-white/10 p-2" placeholder="Hikoya" />
                <input value={draft.question} onChange={(e) => setDraft((p) => ({ ...p, question: e.target.value }))} className="rounded-xl bg-white/10 p-2 md:col-span-2" placeholder="Savol" />
                {draft.options.map((o, i) => (
                  <input key={i} value={o} onChange={(e) => setDraft((p) => { const next = [...p.options] as [string, string, string, string]; next[i] = e.target.value; return { ...p, options: next }; })} className="rounded-xl bg-white/10 p-2" placeholder={`Variant ${i + 1}`} />
                ))}
                <select value={draft.answerIndex} onChange={(e) => setDraft((p) => ({ ...p, answerIndex: Number(e.target.value) }))} className="rounded-xl bg-white/10 p-2">
                  <option value={0}>Javob: 1</option><option value={1}>Javob: 2</option><option value={2}>Javob: 3</option><option value={3}>Javob: 4</option>
                </select>
                <input value={draft.reward} onChange={(e) => setDraft((p) => ({ ...p, reward: e.target.value }))} className="rounded-xl bg-white/10 p-2" placeholder="Ball" />
                <input value={draft.hint} onChange={(e) => setDraft((p) => ({ ...p, hint: e.target.value }))} className="rounded-xl bg-white/10 p-2 md:col-span-2" placeholder="Hint" />
              </div>
              {questionError && <p className="mt-2 text-sm text-rose-300">{questionError}</p>}
              <div className="mt-3 flex gap-2">
                <button onClick={saveRiddle} className="rounded-xl bg-cyan-600 px-4 py-2 font-bold">{editingIdx !== null ? <FaEdit className="inline" /> : <FaPlus className="inline" />} {editingIdx !== null ? "Saqlash" : "Qo'shish"}</button>
                {editingIdx !== null && <button onClick={resetDraft} className="rounded-xl border border-cyan-400/40 px-4 py-2">Bekor</button>}
              </div>
              <div className="mt-3 space-y-2">
                {questionBank.map((r, idx) => (
                  <div key={`${r.id}-${idx}`} className="flex items-start justify-between rounded-xl bg-white/5 p-2">
                    <div className="text-sm">{idx + 1}. {r.question}</div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingIdx(idx); setDraft({ title: r.title, story: r.story, question: r.question, options: [...r.options], answerIndex: r.answerIndex, hint: r.hint, reward: String(r.reward) }); }} className="rounded bg-cyan-600/30 p-2"><FaEdit /></button>
                      <button onClick={() => setQuestionBank((prev) => prev.filter((_, i) => i !== idx))} className="rounded bg-rose-600/30 p-2"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-amber-500/20 bg-amber-900/20 p-6">
            <h3 className="mb-3 text-lg font-black">Qoidalar</h3>
            <p className="text-sm text-amber-200/80">Xato javobda orqaga, to'g'ri javobda oldinga. Hint ball kamaytiradi.</p>
            <button onClick={start} className="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 p-3 font-black">SARGUZASHTNI BOSHLASH</button>
          </div>
        </div>
      )}

      {phase === "play" && current && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-xl bg-amber-900/30 p-3"><FaClock className="inline" /> {formatTime(secondsLeft)}</div>
            <div className="rounded-xl bg-amber-900/30 p-3">Progress: {progressPct}%</div>
            <div className="rounded-xl bg-amber-900/30 p-3">Ball: {score}</div>
            <div className="rounded-xl bg-amber-900/30 p-3">Savol vaqti: {questionSeconds}s</div>
          </div>
          <div className="rounded-2xl bg-amber-900/20 p-6">
            <div className="mb-2 text-sm text-amber-300">{current.title}</div>
            <p className="mb-4 text-amber-100">{current.story}</p>
            <h3 className="mb-4 text-2xl font-black">{current.question}</h3>
            <button onClick={() => { if (!locked && !showHint) { setShowHint(true); setScore((s) => Math.max(0, s - HINT_PENALTY)); } }} disabled={locked || showHint} className="mb-4 rounded-full bg-yellow-600 px-4 py-2 text-sm font-bold disabled:opacity-50"><FaLightbulb className="inline" /> Hint (-{HINT_PENALTY})</button>
            {showHint && <p className="mb-4 rounded-xl bg-amber-500/20 p-3 text-sm">Hint: {current.hint}</p>}
            {doubleReward && <p className="mb-3 text-sm font-bold text-yellow-300"><FaBolt className="inline" /> BONUS x2</p>}
            <div className="grid gap-2 sm:grid-cols-2">
              {current.options.map((opt, i) => {
                const reveal = locked && selected !== null;
                const isCorrect = i === current.answerIndex;
                const isWrongSelected = reveal && selected === i && !isCorrect;
                return (
                  <button key={`${opt}-${i}`} onClick={() => onAnswer(i)} disabled={locked} className={`rounded-xl border p-3 text-left ${isCorrect && reveal ? "border-emerald-400 bg-emerald-500/20" : isWrongSelected ? "border-rose-400 bg-rose-500/20" : "border-amber-500/30 bg-amber-950/30"}`}>
                    {opt} {isCorrect && reveal && <FaCheckCircle className="ml-1 inline" />} {isWrongSelected && <FaTimesCircle className="ml-1 inline" />}
                  </button>
                );
              })}
            </div>
          </div>
          <button onClick={() => setPhase("finish")} className="rounded-xl bg-amber-600 px-5 py-2 font-bold"><FaCrown className="inline" /> Yakunlash</button>
        </div>
      )}

      {phase === "finish" && (
        <div className="rounded-2xl bg-amber-900/20 p-8 text-center">
          <div className="mb-4 text-5xl"><GiChest className="inline" /></div>
          <h2 className="mb-2 text-3xl font-black">{won ? "Xazina topildi!" : "Mag'lub bo'ldingiz"}</h2>
          <p className="mb-1">Yakuniy ball: <b>{score}</b></p>
          <p className="mb-4">Reyting: <b>{grade}</b></p>
          {!won && <p className="mb-4 text-sm text-amber-200/70">Kerakli minimum ball: {minScoreToWin}</p>}
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <button onClick={start} className="rounded-xl bg-amber-600 px-5 py-2 font-bold"><FaRedo className="inline" /> Yana o'yna</button>
            <button onClick={() => navigate("/games")} className="rounded-xl border border-amber-500/40 px-5 py-2"><FaCompass className="inline" /> O'yinlar</button>
          </div>
        </div>
      )}
    </div>
  );
}
