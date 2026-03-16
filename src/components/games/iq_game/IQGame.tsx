import { useEffect, useMemo, useRef, useState } from 'react';
import { FaBrain, FaCheck, FaClock, FaCrown, FaHome, FaRedo, FaTimes, FaUser, FaUsers } from 'react-icons/fa';
import Confetti from 'react-confetti-boom';
import questionDataset from './bolalar_iq_50_dataset.json';

type Phase = 'intro' | 'game' | 'result';
type PlayerMode = 1 | 2;
type Difficulty = 'easy' | 'medium' | 'hard';
type QuestionType = 'pattern' | 'logic' | 'matrix' | 'word' | 'visual';
type VisualKind = 'sequence' | 'grid' | 'cards' | 'analogy';

interface QuestionVisual {
  kind: VisualKind;
  title?: string;
  items?: string[];
  rows?: string[][];
  left?: string[];
  right?: string[];
}

interface IQQuestion {
  id: number;
  type: QuestionType;
  difficulty: Difficulty;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  timeLimit: number;
  visual?: QuestionVisual;
}

const QUESTIONS = questionDataset as IQQuestion[];
const QUESTION_COUNT = 18;
const typeAccent = {
  pattern: 'from-sky-500 to-blue-500',
  logic: 'from-violet-500 to-fuchsia-500',
  matrix: 'from-cyan-500 to-indigo-500',
  word: 'from-emerald-500 to-teal-500',
  visual: 'from-amber-500 to-orange-500',
} satisfies Record<QuestionType, string>;
const diffAccent = {
  easy: 'from-emerald-500 to-green-500',
  medium: 'from-amber-500 to-yellow-500',
  hard: 'from-rose-500 to-red-500',
} satisfies Record<Difficulty, string>;

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const calcIq = (correct: number, total: number, seconds: number) => {
  if (!total) return 70;
  const accuracy = correct / total;
  const speed = Math.min((total * 18) / Math.max(seconds, total * 8), 1.35);
  return Math.max(70, Math.min(160, Math.round(72 + accuracy * 62 + speed * 16)));
};

const iqLevel = (iq: number) => {
  if (iq >= 135) return 'Genius level';
  if (iq >= 125) return 'Excellent';
  if (iq >= 115) return 'Very strong';
  if (iq >= 100) return 'Above average';
  if (iq >= 90) return 'Average';
  return 'Needs more practice';
};

const iqGradient = (iq: number) => {
  if (iq >= 135) return 'from-fuchsia-400 via-violet-400 to-pink-400';
  if (iq >= 125) return 'from-sky-400 via-blue-400 to-cyan-400';
  if (iq >= 115) return 'from-emerald-400 via-green-400 to-lime-400';
  if (iq >= 100) return 'from-amber-400 via-yellow-400 to-orange-400';
  return 'from-orange-400 via-rose-400 to-red-400';
};

const tone = (value: string) => {
  const v = value.toLowerCase();
  if (v.includes('qizil')) return 'from-rose-500/25 to-red-500/25 border-rose-300/30';
  if (v.includes("ko'k")) return 'from-sky-500/25 to-blue-500/25 border-sky-300/30';
  if (v.includes('yashil')) return 'from-emerald-500/25 to-green-500/25 border-emerald-300/30';
  if (v.includes('sariq')) return 'from-amber-500/25 to-yellow-500/25 border-amber-300/30';
  return 'from-white/10 to-white/5 border-white/10';
};

function Visual({ visual }: { visual?: QuestionVisual }) {
  if (!visual) return null;
  return (
    <div className="mb-6 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
      {visual.title ? <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.28em] text-sky-200/80">{visual.title}</p> : null}
      {visual.kind === 'sequence' && visual.items ? (
        <div className="flex flex-wrap justify-center gap-3">
          {visual.items.map((item, index) => (
            <div key={`${item}-${index}`} className={`min-w-20 rounded-2xl border bg-gradient-to-br px-4 py-4 text-center text-sm font-black text-white ${tone(item)}`}>{item}</div>
          ))}
        </div>
      ) : null}
      {visual.kind === 'cards' && visual.items ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {visual.items.map((item, index) => (
            <div key={`${item}-${index}`} className={`rounded-2xl border bg-gradient-to-br px-4 py-5 text-center text-sm font-bold text-white ${tone(item)}`}>{item}</div>
          ))}
        </div>
      ) : null}
      {visual.kind === 'grid' && visual.rows ? (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${visual.rows[0]?.length ?? 3}, minmax(0, 1fr))` }}>
          {visual.rows.flat().map((cell, index) => (
            <div key={`${cell}-${index}`} className={`flex min-h-20 items-center justify-center rounded-2xl border bg-gradient-to-br px-3 py-4 text-center text-sm font-black text-white ${tone(cell)}`}>{cell}</div>
          ))}
        </div>
      ) : null}
      {visual.kind === 'analogy' ? (
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">{(visual.left ?? []).map((item, index) => <div key={`${item}-${index}`} className="rounded-xl bg-sky-500/10 px-4 py-3 text-center font-bold text-sky-100">{item}</div>)}</div>
          <div className="flex items-center justify-center text-3xl font-black text-white/70">::</div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">{(visual.right ?? []).map((item, index) => <div key={`${item}-${index}`} className="rounded-xl bg-violet-500/10 px-4 py-3 text-center font-bold text-violet-100">{item}</div>)}</div>
        </div>
      ) : null}
    </div>
  );
}

function IQGame() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [playerMode, setPlayerMode] = useState<PlayerMode>(1);
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
  const [questions, setQuestions] = useState<IQQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [answers, setAnswers] = useState<Array<number | null>>([null, null]);
  const [timer, setTimer] = useState(20);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activePlayers = useMemo(() => playerNames.slice(0, playerMode), [playerMode, playerNames]);
  const currentQuestion = questions[currentIndex];
  const totalSeconds = startedAt && finishedAt ? Math.max(1, Math.round((finishedAt - startedAt) / 1000)) : 0;
  const iqScores = activePlayers.map((_, index) => calcIq(scores[index] ?? 0, questions.length, totalSeconds || questions.length * 18));
  const topScore = Math.max(...scores.slice(0, playerMode), 0);
  const winners = activePlayers.filter((_, index) => scores[index] === topScore);

  useEffect(() => {
    if (phase !== 'game' || !currentQuestion || showExplanation) return;
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setShowExplanation(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [phase, currentQuestion, showExplanation]);

  const startGame = (mode: PlayerMode) => {
    const selected = shuffle(QUESTIONS).slice(0, QUESTION_COUNT);
    setPlayerMode(mode);
    setQuestions(selected);
    setCurrentIndex(0);
    setScores([0, 0]);
    setAnswers([null, null]);
    setShowExplanation(false);
    setTimer(selected[0]?.timeLimit ?? 20);
    setStartedAt(Date.now());
    setFinishedAt(null);
    setPhase('game');
  };

  const setName = (index: number, value: string) => {
    setPlayerNames((prev) => {
      const next = [...prev];
      next[index] = value.trimStart().slice(0, 18) || `Player ${index + 1}`;
      return next;
    });
  };

  const answer = (playerIndex: number, optionIndex: number) => {
    if (!currentQuestion || showExplanation || answers[playerIndex] !== null) return;
    const nextAnswers = [...answers];
    nextAnswers[playerIndex] = optionIndex;
    setAnswers(nextAnswers);
    if (optionIndex === currentQuestion.correctIndex) {
      setScores((prev) => {
        const next = [...prev];
        next[playerIndex] += 1;
        return next;
      });
    }
    if (playerMode === 1 || nextAnswers.slice(0, playerMode).every((item) => item !== null)) {
      setShowExplanation(true);
    }
  };

  const nextQuestion = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      setFinishedAt(Date.now());
      setPhase('result');
      return;
    }
    setCurrentIndex(nextIndex);
    setAnswers([null, null]);
    setShowExplanation(false);
    setTimer(questions[nextIndex].timeLimit);
  };

  const progress = Math.round(((currentIndex + 1) / Math.max(questions.length, 1)) * 100);

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.28),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.22),_transparent_30%),linear-gradient(135deg,_#020617,_#111827_40%,_#172554_100%)] p-4 text-white">
        <div className="mx-auto max-w-6xl grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 md:p-8">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.28em] text-sky-100"><FaBrain />IQ Challenge</div>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">Rasmli IQ test, endi 1 yoki 2 o'yinchi uchun.</h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">Savollar alohida JSON faylga ko'chirildi. 2 o'yinchida bitta savolga ikkita alohida javob kartasi chiqadi va natija alohida hisoblanadi.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5"><p className="text-sm uppercase tracking-[0.24em] text-slate-400">Dataset</p><p className="mt-2 text-3xl font-black">{QUESTIONS.length}</p><p className="mt-1 text-sm text-slate-300">ta savol</p></div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5"><p className="text-sm uppercase tracking-[0.24em] text-slate-400">Session</p><p className="mt-2 text-3xl font-black">{QUESTION_COUNT}</p><p className="mt-1 text-sm text-slate-300">ta random savol</p></div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5"><p className="text-sm uppercase tracking-[0.24em] text-slate-400">Mode</p><p className="mt-2 text-3xl font-black">1 / 2</p><p className="mt-1 text-sm text-slate-300">o'yinchi</p></div>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <button type="button" onClick={() => setPlayerMode(1)} className={`rounded-[1.75rem] border p-6 text-left transition ${playerMode === 1 ? 'border-sky-300/40 bg-sky-500/15' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}><div className="mb-4 flex items-center gap-3 text-2xl font-black"><FaUser className="text-sky-300" />Single player</div><p className="text-sm text-slate-300">Bir kishi uchun bitta javob paneli.</p></button>
              <button type="button" onClick={() => setPlayerMode(2)} className={`rounded-[1.75rem] border p-6 text-left transition ${playerMode === 2 ? 'border-violet-300/40 bg-violet-500/15' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}><div className="mb-4 flex items-center gap-3 text-2xl font-black"><FaUsers className="text-violet-300" />Two players</div><p className="text-sm text-slate-300">Savol bitta, javob kartalari ikkita.</p></button>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <label className="rounded-3xl border border-white/10 bg-white/5 p-4"><span className="mb-2 block text-sm uppercase tracking-[0.24em] text-slate-400">Player 1</span><input value={playerNames[0]} onChange={(e) => setName(0, e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none" /></label>
              <label className={`rounded-3xl border p-4 ${playerMode === 2 ? 'border-white/10 bg-white/5' : 'border-white/5 bg-white/0 opacity-50'}`}><span className="mb-2 block text-sm uppercase tracking-[0.24em] text-slate-400">Player 2</span><input value={playerNames[1]} onChange={(e) => setName(1, e.target.value)} disabled={playerMode !== 2} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none disabled:opacity-60" /></label>
            </div>
            <button type="button" onClick={() => startGame(playerMode)} className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-7 py-4 text-lg font-black text-white"><FaBrain />Start IQ Test</button>
          </div>
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Savol turlari</p>
              <div className="mt-5 grid gap-3">
                {(['pattern', 'logic', 'matrix', 'word', 'visual'] as QuestionType[]).map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className={`mb-2 inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-white ${typeAccent[item]}`}>{item}</div>
                    <p className="text-sm text-slate-300">{item === 'pattern' ? 'Son va shakl ketma-ketliklari.' : item === 'logic' ? 'Mantiqiy savollar.' : item === 'matrix' ? "Jadval va bo'sh kataklar." : item === 'word' ? "Analogiya va so'z mantig'i." : 'Kartali rasmli topshiriqlar.'}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6"><p className="text-sm uppercase tracking-[0.24em] text-slate-400">2 o'yinchi oqimi</p><div className="mt-4 space-y-3 text-sm text-slate-300"><p>1. Savol ekranga bitta chiqadi.</p><p>2. Har o'yinchi o'z panelida javob beradi.</p><p>3. Ikkalasi tugatgach izoh ochiladi.</p><p>4. Ball va IQ alohida hisoblanadi.</p></div></div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'game' && currentQuestion) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.18),_transparent_32%),linear-gradient(160deg,_#020617,_#111827_45%,_#1e1b4b_100%)] p-4 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-950/70 p-5 lg:flex-row lg:items-center lg:justify-between">
            <button type="button" onClick={() => setPhase('intro')} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold"><FaHome />Menu</button>
            <div className="flex flex-wrap items-center gap-3">
              <div className={`rounded-full bg-gradient-to-r px-4 py-2 text-sm font-black uppercase tracking-[0.24em] text-white ${typeAccent[currentQuestion.type]}`}>{currentQuestion.type}</div>
              <div className={`rounded-full bg-gradient-to-r px-4 py-2 text-sm font-black uppercase tracking-[0.24em] text-white ${diffAccent[currentQuestion.difficulty]}`}>{currentQuestion.difficulty}</div>
            </div>
            <div className="flex flex-wrap gap-3">{activePlayers.map((player, index) => <div key={player} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><p className="text-xs uppercase tracking-[0.24em] text-slate-400">{player}</p><p className="text-2xl font-black">{scores[index]}</p></div>)}</div>
          </div>

          <div className="mb-6 rounded-[2rem] border border-white/10 bg-slate-950/70 p-5">
            <div className="mb-3 flex items-center justify-between text-sm font-semibold uppercase tracking-[0.24em] text-slate-300"><span>Question {currentIndex + 1} / {questions.length}</span><span>{progress}%</span></div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="mb-2 flex items-center justify-between text-white"><span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-sky-100/80"><FaClock />Timer</span><span className={`text-2xl font-black ${timer <= 5 ? 'text-rose-400' : 'text-white'}`}>{timer}s</span></div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full transition-all duration-1000 ${timer <= 5 ? 'bg-gradient-to-r from-orange-500 to-rose-500' : 'bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500'}`} style={{ width: `${Math.max(0, (timer / currentQuestion.timeLimit) * 100)}%` }} /></div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
            <Visual visual={currentQuestion.visual} />
            <div className="mb-6 text-center"><p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Savol</p><h2 className="mt-3 text-2xl font-black leading-tight md:text-4xl">{currentQuestion.prompt}</h2></div>
            <div className={`grid gap-5 ${playerMode === 2 ? 'xl:grid-cols-2' : ''}`}>
              {activePlayers.map((player, playerIndex) => (
                <div key={player} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div><p className="text-xs uppercase tracking-[0.24em] text-slate-400">Answer panel</p><p className="text-2xl font-black">{player}</p></div>
                    {showExplanation ? <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold ${answers[playerIndex] === currentQuestion.correctIndex ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>{answers[playerIndex] === currentQuestion.correctIndex ? <FaCheck /> : <FaTimes />}{answers[playerIndex] === null ? 'No answer' : answers[playerIndex] === currentQuestion.correctIndex ? 'Correct' : 'Wrong'}</div> : null}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {currentQuestion.options.map((option, optionIndex) => {
                      const selected = answers[playerIndex] === optionIndex;
                      const correct = optionIndex === currentQuestion.correctIndex;
                      const disabled = showExplanation || answers[playerIndex] !== null;
                      const state = showExplanation && correct ? 'border-emerald-300/40 bg-emerald-500/15 text-emerald-200' : showExplanation && selected ? 'border-rose-300/40 bg-rose-500/15 text-rose-200' : selected ? 'border-sky-300/40 bg-sky-500/15 text-sky-100' : 'border-white/10 bg-slate-950/70 text-white hover:border-sky-300/30 hover:bg-sky-500/10';
                      return <button key={`${player}-${option}`} type="button" disabled={disabled} onClick={() => answer(playerIndex, optionIndex)} className={`rounded-2xl border px-4 py-4 text-left text-sm font-bold transition ${state}`}><span className="mb-2 block text-xs uppercase tracking-[0.24em] text-slate-400">Variant {String.fromCharCode(65 + optionIndex)}</span><span className="text-base">{option}</span></button>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            {showExplanation ? <div className="mt-6 rounded-[1.75rem] border border-sky-300/20 bg-sky-500/10 p-5"><div className="mb-2 flex items-center gap-2 text-sky-200"><FaBrain /><p className="text-sm font-semibold uppercase tracking-[0.24em]">Izoh</p></div><p className="text-base text-slate-200">{currentQuestion.explanation}</p><button type="button" onClick={nextQuestion} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white">{currentIndex + 1 >= questions.length ? 'See results' : 'Next question'}</button></div> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.18),_transparent_30%),linear-gradient(155deg,_#020617,_#111827_45%,_#1e1b4b_100%)] p-4 text-white">
      {iqScores.some((value) => value >= 135) ? <Confetti mode="boom" effectCount={1} particleCount={160} x={0.5} y={0.25} /> : null}
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 md:p-8">
        <div className="text-center">
          <div className="mx-auto mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-500/20 text-4xl text-amber-300"><FaCrown /></div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Final result</p>
          <h2 className="mt-3 text-4xl font-black md:text-5xl">IQ Test Completed</h2>
          <p className="mt-3 text-base text-slate-300">{playerMode === 1 ? `${activePlayers[0]} testni tugatdi.` : winners.length === 1 ? `${winners[0]} bu raundda g'olib bo'ldi.` : "Ikki o'yinchi teng natija ko'rsatdi."}</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center"><p className="text-sm uppercase tracking-[0.24em] text-slate-400">Questions</p><p className="mt-2 text-4xl font-black">{questions.length}</p></div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center"><p className="text-sm uppercase tracking-[0.24em] text-slate-400">Time spent</p><p className="mt-2 text-4xl font-black">{totalSeconds}s</p></div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center"><p className="text-sm uppercase tracking-[0.24em] text-slate-400">Mode</p><p className="mt-2 text-4xl font-black">{playerMode}</p></div>
        </div>
        <div className={`mt-8 grid gap-5 ${playerMode === 2 ? 'lg:grid-cols-2' : ''}`}>
          {activePlayers.map((player, index) => {
            const accuracy = questions.length ? Math.round(((scores[index] ?? 0) / questions.length) * 100) : 0;
            const iq = iqScores[index];
            return (
              <div key={player} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.24em] text-slate-400">Player card</p><p className="text-3xl font-black">{player}</p></div>{playerMode === 2 && scores[index] === topScore ? <span className="rounded-full bg-amber-400/15 px-3 py-2 text-sm font-bold text-amber-200">Top score</span> : null}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"><p className="text-sm text-slate-400">Correct</p><p className="mt-2 text-3xl font-black">{scores[index]} / {questions.length}</p></div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"><p className="text-sm text-slate-400">Accuracy</p><p className="mt-2 text-3xl font-black">{accuracy}%</p></div>
                </div>
                <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5 text-center"><p className="text-sm uppercase tracking-[0.24em] text-slate-400">Estimated IQ</p><div className={`mt-3 bg-gradient-to-r ${iqGradient(iq)} bg-clip-text text-6xl font-black text-transparent`}>{iq}</div><p className="mt-2 text-lg font-semibold">{iqLevel(iq)}</p></div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button type="button" onClick={() => startGame(playerMode)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white"><FaRedo />Play again</button>
          <button type="button" onClick={() => setPhase('intro')} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white"><FaHome />Back to menu</button>
        </div>
      </div>
    </div>
  );
}

export default IQGame;
