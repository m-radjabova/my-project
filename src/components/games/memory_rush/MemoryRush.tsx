import { useEffect, useMemo, useState } from "react";
import { 
  FaBrain, FaClock, FaCrown, FaMedal, FaPlay, FaRedo, FaBolt,
  FaStar, FaTrophy, FaLayerGroup 
} from "react-icons/fa";
import { GiBrain, GiAchievement } from "react-icons/gi";
import { MdTimer, MdMemory } from "react-icons/md";
import { RiBrainFill } from "react-icons/ri";

type Difficulty = "easy" | "normal" | "hard";
type Phase = "setup" | "preview" | "play" | "finish";
type PlayerId = 0 | 1;

type CardItem = {
  id: string;
  pairId: string;
  label: string; 
};

const PREVIEW_SECONDS = 3;
const TURN_TIME_LIMIT_SECONDS = 0;
const GAME_TIME_LIMIT_SECONDS = 8 * 60;

const DIFFICULTY_SIZES: Record<Difficulty, number> = {
  easy: 12,
  normal: 16,
  hard: 20,
};

const DIFFICULTY_GAME_TIME_SECONDS: Record<Difficulty, number> = {
  easy: 160,
  normal: 200,
  hard: 240,
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function ConfettiBurst({ show, onDone }: { show: boolean; onDone: () => void }) {
  const pieces = useMemo(() => {
    return Array.from({ length: 90 }).map((_, i) => {
      const left = rand(0, 100);
      const size = rand(6, 12);
      const delay = rand(0, 0.25);
      const duration = rand(1.0, 1.7);
      const drift = rand(-22, 22);
      const rot = rand(180, 760);
      const opacity = rand(0.85, 1);
      return { i, left, size, delay, duration, drift, rot, opacity };
    });
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(onDone, 1900);
    return () => window.clearTimeout(t);
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <style>{`
        @keyframes confetti-fall-green {
          0%   { transform: translate3d(var(--x), -12vh, 0) rotate(0deg); opacity: 0; }
          12%  { opacity: var(--o); }
          100% { transform: translate3d(calc(var(--x) + var(--d)), 112vh, 0) rotate(var(--r)); opacity: 0; }
        }
      `}</style>

      {pieces.map((p) => (
        <span
          key={p.i}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.55}px`,
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
            opacity: p.opacity,
            ["--x" as any]: `${rand(-8, 8)}vw`,
            ["--d" as any]: `${p.drift}vw`,
            ["--r" as any]: `${p.rot}deg`,
            ["--o" as any]: `${p.opacity}`,
            animation: `confetti-fall-green ${p.duration}s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(total: number) {
  const s = Math.max(0, total);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

const PAIRS_POOL: Array<{ pairId: string; a: string; b: string }> = [
  { pairId: "p1", a: "🍎", b: "🍎" },
  { pairId: "p2", a: "🐱", b: "🐱" },
  { pairId: "p3", a: "🚗", b: "🚗" },
  { pairId: "p4", a: "🏀", b: "🏀" },
  { pairId: "p5", a: "📘", b: "📘" },
  { pairId: "p6", a: "🎵", b: "🎵" },
  { pairId: "p7", a: "🌞", b: "🌞" },
  { pairId: "p8", a: "🧩", b: "🧩" },
  { pairId: "p9", a: "🧪", b: "🧪" },
  { pairId: "p10", a: "🗺️", b: "🗺️" },
  { pairId: "p11", a: "🌳", b: "🌳" },
  { pairId: "p12", a: "🏫", b: "🏫" },
  { pairId: "p13", a: "⏳", b: "⏳" },
  { pairId: "p14", a: "💡", b: "💡" },
  { pairId: "p15", a: "🏹", b: "🏹" },
  { pairId: "p16", a: "🦋", b: "🦋" }
];

function buildDeck(totalCards: number) {
  const pairsNeeded = Math.floor(totalCards / 2);
  const selectedPairs = shuffle(PAIRS_POOL).slice(0, pairsNeeded);

  const cards: CardItem[] = [];
  selectedPairs.forEach((p) => {
    cards.push({ id: `${p.pairId}-a-${Math.random().toString(16).slice(2)}`, pairId: p.pairId, label: p.a });
    cards.push({ id: `${p.pairId}-b-${Math.random().toString(16).slice(2)}`, pairId: p.pairId, label: p.b });
  });

  return shuffle(cards);
}

type CardState = {
  isFaceUp: boolean;
  isMatched: boolean;
  shake: boolean;
};

export default function MemoryRush() {
  const [phase, setPhase] = useState<Phase>("setup");

  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [playerNames, setPlayerNames] = useState<[string, string]>(["O'yinchi 1", "O'yinchi 2"]);

  const [deck, setDeck] = useState<CardItem[]>([]);
  const [cardState, setCardState] = useState<CardState[]>([]);

  const [active, setActive] = useState<PlayerId>(0);
  const [pairs, setPairs] = useState<[number, number]>([0, 0]);
  const [streak, setStreak] = useState<[number, number]>([0, 0]);

  const [firstPick, setFirstPick] = useState<number | null>(null);
  const [secondPick, setSecondPick] = useState<number | null>(null);
  const [lockInput, setLockInput] = useState(false);

  const [previewLeft, setPreviewLeft] = useState(PREVIEW_SECONDS);
  const [gameTimeLeft, setGameTimeLeft] = useState(GAME_TIME_LIMIT_SECONDS);

  const [turnTimeLeft, setTurnTimeLeft] = useState(TURN_TIME_LIMIT_SECONDS);
  const [confetti, setConfetti] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const totalCards = DIFFICULTY_SIZES[difficulty];
  const gameTimeLimit = DIFFICULTY_GAME_TIME_SECONDS[difficulty];
  const totalPairs = Math.floor(totalCards / 2);

  const gridClass = useMemo(() => {
    if (difficulty === "easy") return "grid-cols-3 sm:grid-cols-4";
    if (difficulty === "normal") return "grid-cols-4";
    return "grid-cols-4 sm:grid-cols-5";
  }, [difficulty]);

  const progressPct = useMemo(() => {
    const done = pairs[0] + pairs[1];
    return Math.round((done / Math.max(1, totalPairs)) * 100);
  }, [pairs, totalPairs]);

  const score = useMemo(() => {
    const base = (pairs[0] + pairs[1]) * 120;
    const combo = streak[0] * 25 + streak[1] * 25;
    return base + combo;
  }, [pairs, streak]);

  const currentPlayer = playerNames[active];

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1300);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (phase !== "play") return;
    if (gameTimeLeft <= 0) {
      finishGame();
      return;
    }
    const t = window.setTimeout(() => setGameTimeLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, gameTimeLeft]);

  useEffect(() => {
    if (phase !== "play") return;
    if (TURN_TIME_LIMIT_SECONDS <= 0) return;
    if (lockInput) return;

    if (turnTimeLeft <= 0) {
      setToast("⏳ Navbat almashdi!");
      switchTurn(true);
      return;
    }
    const t = window.setTimeout(() => setTurnTimeLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, turnTimeLeft, lockInput]);

  useEffect(() => {
    if (phase !== "preview") return;
    if (previewLeft <= 0) {
      setCardState((prev) => prev.map((c) => ({ ...c, isFaceUp: false, shake: false })));
      setPhase("play");
      return;
    }
    const t = window.setTimeout(() => setPreviewLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, previewLeft]);

  const initGame = () => {
    const a = playerNames[0].trim() || "O'yinchi 1";
    const b = playerNames[1].trim() || "O'yinchi 2";
    setPlayerNames([a, b]);

    const newDeck = buildDeck(totalCards);
    setDeck(newDeck);
    setCardState(newDeck.map(() => ({ isFaceUp: true, isMatched: false, shake: false })));

    setActive(0);
    setPairs([0, 0]);
    setStreak([0, 0]);
    setFirstPick(null);
    setSecondPick(null);
    setLockInput(true);

    setPreviewLeft(PREVIEW_SECONDS);
    setGameTimeLeft(gameTimeLimit);
    setTurnTimeLeft(TURN_TIME_LIMIT_SECONDS);

    setToast("👀 3 soniya yodlab oling!");
    setPhase("preview");

    window.setTimeout(() => setLockInput(false), PREVIEW_SECONDS * 1000 + 200);
  };

  const finishGame = () => {
    setPhase("finish");
    setLockInput(true);
    setConfetti(true);
  };

  const restart = () => {
    setPhase("setup");
    setConfetti(false);
    setToast(null);
  };

  const resetBoard = () => {
    initGame();
  };

  const switchTurn = (forced = false) => {
    setFirstPick(null);
    setSecondPick(null);

    setCardState((prev) =>
      prev.map((c) => (c.isMatched ? c : { ...c, isFaceUp: false, shake: false }))
    );

    setActive((p) => (p === 0 ? 1 : 0));
    if (forced) {
      setStreak((prev) => {
        const n: [number, number] = [...prev] as [number, number];
        n[active] = 0;
        return n;
      });
    }
    if (TURN_TIME_LIMIT_SECONDS > 0) setTurnTimeLeft(TURN_TIME_LIMIT_SECONDS);
  };

  const onPick = (idx: number) => {
    if (phase !== "play") return;
    if (lockInput) return;

    const st = cardState[idx];
    if (!st) return;
    if (st.isMatched) return;
    if (st.isFaceUp) return;

    setCardState((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], isFaceUp: true, shake: false };
      return next;
    });

    if (firstPick === null) {
      setFirstPick(idx);
      return;
    }

    if (secondPick === null) {
      setSecondPick(idx);
      setLockInput(true);

      const a = firstPick;
      const b = idx;

      const match = deck[a].pairId === deck[b].pairId;

      window.setTimeout(() => {
        if (match) {
          setCardState((prev) => {
            const next = [...prev];
            next[a] = { ...next[a], isMatched: true, shake: false };
            next[b] = { ...next[b], isMatched: true, shake: false };
            return next;
          });

          setPairs((prev) => {
            const n: [number, number] = [...prev] as [number, number];
            n[active] += 1;
            return n;
          });
          setStreak((prev) => {
            const n: [number, number] = [...prev] as [number, number];
            n[active] += 1;
            return n;
          });

          setToast(`✅ Juft topildi! (${currentPlayer})`);
          setConfetti(true);

          setFirstPick(null);
          setSecondPick(null);
          setLockInput(false);

          const willBeDone = pairs[0] + pairs[1] + 1 >= totalPairs;
          if (willBeDone) {
            window.setTimeout(() => finishGame(), 500);
          }
          return;
        }

        setCardState((prev) => {
          const next = [...prev];
          next[a] = { ...next[a], shake: true };
          next[b] = { ...next[b], shake: true };
          return next;
        });

        setToast("❌ Juft emas — navbat almashdi!");
        setStreak((prev) => {
          const n: [number, number] = [...prev] as [number, number];
          n[active] = 0;
          return n;
        });

        window.setTimeout(() => {
          setCardState((prev) => {
            const next = [...prev];
            next[a] = { ...next[a], isFaceUp: false, shake: false };
            next[b] = { ...next[b], isFaceUp: false, shake: false };
            return next;
          });

          setFirstPick(null);
          setSecondPick(null);
          setLockInput(false);

          setActive((p) => (p === 0 ? 1 : 0));
          if (TURN_TIME_LIMIT_SECONDS > 0) setTurnTimeLeft(TURN_TIME_LIMIT_SECONDS);
        }, 250);
      }, 650);
    }
  };

  const winner = useMemo(() => {
    if (pairs[0] === pairs[1]) return null;
    return pairs[0] > pairs[1] ? 0 : 1;
  }, [pairs]);

  const winnerText = useMemo(() => {
    if (winner === null) return "Durrang 🤝";
    return `${playerNames[winner]} g'olib 🏆`;
  }, [winner, playerNames]);

  const finalScore = useMemo(() => {
    const timeBonus = Math.round(gameTimeLeft * 2);
    return score + timeBonus;
  }, [score, gameTimeLeft]);

  const rank = useMemo(() => {
    if (finalScore >= 1200) return { label: "Afsonaviy", icon: <FaCrown className="text-yellow-300" /> };
    if (finalScore >= 900) return { label: "Zo'r", icon: <FaMedal className="text-yellow-300" /> };
    if (finalScore >= 700) return { label: "Yaxshi", icon: <GiBrain className="text-emerald-100" /> };
    return { label: "Boshlovchi", icon: <FaBolt className="text-blue-300" /> };
  }, [finalScore]);

  return (
    <div className={`min-h-screen text-white`}>
      <ConfettiBurst show={confetti} onDone={() => setConfetti(false)} />

      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-3xl border border-emerald-200/50 bg-gradient-to-br from-[#1dbb95] via-[#18af95] to-[#0ea5a4] p-4 shadow-xl shadow-teal-900/30 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-300 to-cyan-300 text-teal-900 shadow-lg">
              <MdMemory className="text-2xl" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-100">Memory Rush</div>
              <h1 className="text-xl font-black text-white sm:text-2xl">Xotira o'yini</h1>
            </div>
          </div>

          <div className="flex gap-2">
            {phase === "setup" ? (
              <button
                onClick={initGame}
                className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-[#b3135f] shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <FaPlay className="transition-transform group-hover:translate-x-1" />
                <span>Boshlash</span>
              </button>
            ) : (
              <button
                onClick={resetBoard}
                className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-[#b3135f] shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <FaRedo className="transition-transform group-hover:rotate-180" />
                <span>Qayta</span>
              </button>
            )}

            <button
              onClick={restart}
              className="flex items-center gap-2 rounded-full bg-black/20 px-5 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-black/30"
            >
              <FaRedo />
              <span>Orqaga</span>
            </button>
          </div>
        </div>

        {/* Toast */}
        <div className="relative mb-4 h-10">
          {toast && (
            <div className="absolute left-0 right-0 mx-auto w-fit rounded-full bg-black/25 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
              {toast}
            </div>
          )}
        </div>

        <div className="relative">
          {phase === "setup" && (
            <div className="grid gap-5 md:grid-cols-2">
              {/* Settings */}
              <div className="rounded-2xl border border-emerald-100/40 bg-black/15 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <FaLayerGroup className="text-emerald-100" />
                  <div className="text-sm font-black uppercase tracking-wider text-white/70">Sozlamalar</div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-black/15 p-4">
                    <div className="mb-2 text-xs font-bold text-emerald-100">1-o'yinchi</div>
                    <input
                      value={playerNames[0]}
                      onChange={(e) => setPlayerNames([e.target.value, playerNames[1]])}
                      className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-cyan-300"
                      placeholder="1-o'yinchi nomi"
                    />
                  </div>

                  <div className="rounded-xl bg-black/15 p-4">
                    <div className="mb-2 text-xs font-bold text-emerald-100">2-o'yinchi</div>
                    <input
                      value={playerNames[1]}
                      onChange={(e) => setPlayerNames([playerNames[0], e.target.value])}
                      className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-cyan-300"
                      placeholder="2-o'yinchi nomi"
                    />
                  </div>

                  <div className="rounded-xl bg-black/15 p-4">
                    <div className="mb-2 text-xs font-bold text-emerald-100">Qiyinlik</div>
                    <div className="flex flex-wrap gap-2">
                      <DiffButton active={difficulty === "easy"} onClick={() => setDifficulty("easy")} label="Simple (12)" />
                      <DiffButton active={difficulty === "normal"} onClick={() => setDifficulty("normal")} label="Typical (16)" />
                      <DiffButton active={difficulty === "hard"} onClick={() => setDifficulty("hard")} label="Challenging (20)" />
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                      <MdTimer className="text-emerald-100" />
                      <span>Preview: <b className="text-white">3s</b> • Game: <b className="text-white">{formatTime(gameTimeLimit)}</b></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={initGame}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-[#b3135f] shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                >
                  <FaPlay /> O'yinni boshlash
                </button>
              </div>

              {/* Rules */}
              <div className="rounded-2xl border border-emerald-100/40 bg-black/15 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <GiAchievement className="text-emerald-100" />
                  <div className="text-sm font-black uppercase tracking-wider text-white/70">Qoidalar</div>
                </div>

                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-100">•</span>
                    <span>Har navbatda <b className="text-white">2 ta karta</b> ochiladi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-100">•</span>
                    <span>✅ <b className="text-white">Juft topilsa:</b> ochiq qoladi va yana yuradi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-100">•</span>
                    <span>❌ <b className="text-white">Juft topilmasa:</b> navbat almashadi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-100">•</span>
                    <span><b className="text-white">Combo:</b> ketma-ket topilgan juftlar uchun bonus</span>
                  </li>
                </ul>

                <div className="mt-4 rounded-xl bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FaStar className="text-yellow-300" />
                    <span><b className="text-white">Ball:</b> Juft = 120, Combo = +25, Time bonus</span>
                  </div>
                  <div className="mt-2 text-xs text-white/60">
                    Yaxshi o'ynalsa <b className="text-white">800+ ball</b> olish mumkin
                  </div>
                </div>
              </div>
            </div>
          )}

          {(phase === "preview" || phase === "play") && (
            <>
              {/* HUD */}
              <div className="mb-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-emerald-100/35 bg-black/15 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white/70">
                      <FaClock className="text-emerald-100" /> Time
                    </div>
                    <div className="rounded-full bg-black/20 px-3 py-1 text-sm font-black">
                      {formatTime(gameTimeLeft)}
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-200 to-cyan-200 transition-all"
                      style={{ width: `${Math.round((gameTimeLeft / gameTimeLimit) * 100)}%` }}
                    />
                  </div>
                  {phase === "preview" && (
                    <div className="mt-2 rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-200">
                      👀 Preview: {previewLeft}s
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-emerald-100/35 bg-black/15 p-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white/70">
                    <FaTrophy className="text-emerald-100" /> Progress
                  </div>
                  <div className="mt-1 text-lg font-black">
                    {pairs[0] + pairs[1]}/{totalPairs} • {progressPct}%
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-200 to-cyan-200"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-100/35 bg-black/15 p-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white/70">
                    <RiBrainFill className="text-emerald-100" /> Navbat
                  </div>
                  <div className="mt-1 text-lg font-black">
                    <span className="rounded-full bg-white px-3 py-1 font-bold text-[#b3135f]">
                      {currentPlayer}
                    </span>
                  </div>
                </div>
              </div>

              {/* Players */}
              <div className="mb-5 grid gap-3 md:grid-cols-2">
                {[0, 1].map((p) => {
                  const isActive = active === p;
                  return (
                    <div
                      key={p}
                      className={`rounded-xl border p-4 transition-all ${
                        isActive 
                          ? "border-emerald-100 bg-black/25" 
                          : "border-emerald-100/35 bg-black/15"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-white/60">O'yinchi {p + 1}</div>
                          <div className="text-lg font-black">{playerNames[p as PlayerId]}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-emerald-100">Juft</div>
                          <div className="text-3xl font-black text-white">{pairs[p as PlayerId]}</div>
                        </div>
                      </div>
                      {streak[p as PlayerId] > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-xs">
                          <FaBolt className="text-yellow-300" />
                          <span>Combo: {streak[p as PlayerId]}x</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Board */}
              <div className={`grid gap-2 sm:gap-3 ${gridClass}`}>
                {deck.map((card, idx) => {
                  const st = cardState[idx];
                  const faceUp = st?.isFaceUp || phase === "preview";
                  const matched = st?.isMatched;
                  const shake = st?.shake;

                  return (
                    <button
                      key={card.id}
                      onClick={() => onPick(idx)}
                      disabled={phase !== "play" || lockInput || matched}
                      className="relative aspect-square rounded-xl sm:rounded-2xl"
                      style={{ perspective: "1000px" }}
                    >
                      <div
                        className={`absolute inset-0 rounded-xl sm:rounded-2xl transition-all duration-500 ${
                          shake ? "animate-shake" : ""
                        }`}
                        style={{
                          transformStyle: "preserve-3d",
                          transform: faceUp ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                      >
                        {/* Back */}
                        <div
                          className={`absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-emerald-100/40 bg-gradient-to-br from-[#0f8b82]/70 to-[#0b6f85]/70 backdrop-blur-sm flex items-center justify-center ${
                            matched ? "opacity-50" : ""
                          }`}
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <div className="text-center">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-black/20">
                              <GiBrain className="text-xl text-emerald-100" />
                            </div>
                            <div className="mt-1 text-[8px] font-black uppercase tracking-wider text-white/40">
                              Memory
                            </div>
                          </div>
                        </div>

                        {/* Front */}
                        <div
                          className={`absolute inset-0 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center ${
                            matched 
                              ? "border-emerald-100 bg-gradient-to-br from-emerald-100/30 to-cyan-100/30" 
                              : "border-emerald-100/45 bg-gradient-to-br from-white/25 to-white/10"
                          }`}
                          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                        >
                          <span className="text-2xl sm:text-3xl md:text-4xl">{card.label}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <FaBrain className="text-emerald-100" />
                  <span>Difficulty: <b className="text-white">{difficulty.toUpperCase()}</b></span>
                  <span>•</span>
                  <span>Cards: <b className="text-white">{totalCards}</b></span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={resetBoard}
                    className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-[#b3135f] transition-all hover:scale-105 sm:text-sm"
                  >
                    <FaRedo /> Restart
                  </button>
                  <button
                    onClick={finishGame}
                    className="flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-black/30 sm:text-sm"
                  >
                    <FaCrown /> Finish
                  </button>
                </div>
              </div>
            </>
          )}

          {phase === "finish" && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-2xl">
                <FaCrown className="text-3xl" />
              </div>
              
              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">O'yin tugadi! 🏆</h2>
              <p className="mt-2 text-lg text-white/80">{winnerText}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-emerald-100/35 bg-black/15 p-4">
                  <div className="text-xs text-emerald-100">Player 1</div>
                  <div className="mt-1 text-lg font-black">{playerNames[0]}</div>
                  <div className="text-sm text-white/60">{pairs[0]} juft</div>
                </div>
                <div className="rounded-xl border border-emerald-100/35 bg-black/15 p-4">
                  <div className="text-xs text-emerald-100">Player 2</div>
                  <div className="mt-1 text-lg font-black">{playerNames[1]}</div>
                  <div className="text-sm text-white/60">{pairs[1]} juft</div>
                </div>
                <div className="rounded-xl border border-emerald-100/35 bg-black/15 p-4">
                  <div className="text-xs text-emerald-100">Ball</div>
                  <div className="mt-1 text-2xl font-black text-yellow-300">{finalScore}</div>
                </div>
                <div className="rounded-xl border border-emerald-100/35 bg-black/15 p-4">
                  <div className="text-xs text-emerald-100">Daraja</div>
                  <div className="mt-1 flex items-center justify-center gap-2 text-lg font-black">
                    {rank.icon}
                    <span>{rank.label}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-black/20 p-3 text-sm text-white/80">
                <b>Ball:</b> Juftlar × 120 + Combo bonus + Vaqt bonusi ({formatTime(gameTimeLeft)} qoldi)
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                <button
                  onClick={resetBoard}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-black text-[#b3135f] shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <FaRedo /> Yana o'ynash
                </button>
                <button
                  onClick={restart}
                  className="flex items-center justify-center gap-2 rounded-xl bg-black/20 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-black/30"
                >
                  <FaRedo /> Bosh sahifa
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DiffButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
        active 
          ? "bg-white text-[#b3135f] shadow-lg" 
          : "bg-black/20 text-white/90 hover:bg-black/30"
      }`}
    >
      {label}
    </button>
  );
}
