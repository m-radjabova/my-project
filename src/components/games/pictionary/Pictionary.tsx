import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaBrush,
  FaEraser,
  FaTrash,
  FaCheck,
  FaTimes,
  FaClock,
  FaGamepad,
  FaEye,
  FaEyeSlash,
  FaRedo,
  FaSave,
  FaUpload,
} from "react-icons/fa";
import { GiPaintBrush } from "react-icons/gi";
import { MdColorLens } from "react-icons/md";

type Team = "A" | "B";
type Phase = "setup" | "play";
type Difficulty = "easy" | "medium" | "hard";

type WordItem = {
  word: string;
  topic: string;
  difficulty: Difficulty;
};

const DEFAULT_BANK: WordItem[] = [
  // EASY
  { word: "APPLE", topic: "Fruits", difficulty: "easy" },
  { word: "BANANA", topic: "Fruits", difficulty: "easy" },
  { word: "ORANGE", topic: "Fruits", difficulty: "easy" },
  { word: "GRAPES", topic: "Fruits", difficulty: "easy" },
  { word: "PEAR", topic: "Fruits", difficulty: "easy" },

  { word: "BRUSH TEETH", topic: "Daily Routines", difficulty: "easy" },
  { word: "GO TO SCHOOL", topic: "Daily Routines", difficulty: "easy" },
  { word: "DO HOMEWORK", topic: "Daily Routines", difficulty: "easy" },
  { word: "SLEEP", topic: "Daily Routines", difficulty: "easy" },

  { word: "BICYCLE", topic: "Objects", difficulty: "easy" },
  { word: "UMBRELLA", topic: "Objects", difficulty: "easy" },
  { word: "PHONE", topic: "Objects", difficulty: "easy" },

  // MEDIUM
  { word: "WATERMELON", topic: "Fruits", difficulty: "medium" },
  { word: "PINEAPPLE", topic: "Fruits", difficulty: "medium" },

  { word: "TAKE A SHOWER", topic: "Daily Routines", difficulty: "medium" },
  { word: "COOK DINNER", topic: "Daily Routines", difficulty: "medium" },
  { word: "WASH DISHES", topic: "Daily Routines", difficulty: "medium" },

  { word: "AIRPLANE", topic: "Objects", difficulty: "medium" },
  { word: "HEADPHONES", topic: "Objects", difficulty: "medium" },

  // HARD
  { word: "TELESCOPE", topic: "Objects", difficulty: "hard" },
  { word: "MICROSCOPE", topic: "Objects", difficulty: "hard" },
  { word: "TRAFFIC JAM", topic: "Daily Routines", difficulty: "hard" },
  { word: "SUSTAINABILITY", topic: "Abstract", difficulty: "hard" },
];

const COLOR_PALETTE = [
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#ef4444", // Red
  "#f59e0b", // Orange
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#a855f7", // Purple
  "#06b6d4", // Cyan
  "#ffffff", // White
];


function normalizeWord(w: string) {
  return w.trim().toUpperCase().replace(/\s+/g, " ");
}

function safeParseBank(jsonText: string): { ok: true; bank: WordItem[] } | { ok: false; error: string } {
  try {
    const data = JSON.parse(jsonText);
    if (!Array.isArray(data)) return { ok: false, error: "JSON массив bo‘lishi kerak. Misol: [{word, topic, difficulty}]" };
    const cleaned: WordItem[] = data
      .map((x: any) => ({
        word: normalizeWord(String(x?.word ?? "")),
        topic: String(x?.topic ?? "Custom").trim() || "Custom",
        difficulty: (String(x?.difficulty ?? "easy").toLowerCase() as Difficulty) || "easy",
      }))
      .filter((x) => x.word.length >= 2)
      .map((x) => ({
        ...x,
        difficulty: (["easy", "medium", "hard"].includes(x.difficulty) ? x.difficulty : "easy") as Difficulty,
      }));
    if (!cleaned.length) return { ok: false, error: "Bank bo‘sh. Kamida 1 ta so‘z bo‘lsin." };
    return { ok: true, bank: cleaned };
  } catch (e: any) {
    return { ok: false, error: e?.message || "JSON parse error" };
  }
}

function difficultyForRound(roundNumber: number): Difficulty {
  if (roundNumber <= 4) return "easy";
  if (roundNumber <= 8) return "medium";
  return "hard";
}

function pickWord(bank: WordItem[], opts: { topic: string; diff: Difficulty; avoid?: string }) {
  const { topic, diff, avoid } = opts;

  const byTopic = topic === "All" ? bank : bank.filter((w) => w.topic === topic);
  const byDiff = byTopic.filter((w) => w.difficulty === diff);

  const poolPrimary = byDiff.filter((w) => w.word !== avoid);
  if (poolPrimary.length) return poolPrimary[Math.floor(Math.random() * poolPrimary.length)];

  const poolFallback = byTopic.filter((w) => w.word !== avoid);
  if (poolFallback.length) return poolFallback[Math.floor(Math.random() * poolFallback.length)];

  return bank[Math.floor(Math.random() * bank.length)];
}

type Point = { x: number; y: number };

function Pictionary() {
  // Game state
  const [phase, setPhase] = useState<Phase>("setup");
  const [drawerTeam, setDrawerTeam] = useState<Team>("A");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  const [topic, setTopic] = useState<string>("All");
  const [timerOn, setTimerOn] = useState(true);
  const [roundSeconds, setRoundSeconds] = useState(60);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [roundNumber, setRoundNumber] = useState(1);

  const [bank, setBank] = useState<WordItem[]>(DEFAULT_BANK);
  const [importOpen, setImportOpen] = useState(false);
  const [bankJson, setBankJson] = useState<string>(() => JSON.stringify(DEFAULT_BANK, null, 2));
  const [importMsg, setImportMsg] = useState<string>("");

  const [current, setCurrent] = useState<WordItem | null>(null);
  const [revealPressed, setRevealPressed] = useState(false);
  const [message, setMessage] = useState<string>("");

  // Drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const isDrawingRef = useRef(false);
  const pointsRef = useRef<Point[]>([]);
  const lastDrawTimeRef = useRef<number>(0);

  const [brushSize, setBrushSize] = useState(10);
  const [brushColor, setBrushColor] = useState("#ffffff");
  const [eraser, setEraser] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const topics = useMemo(() => {
    const t = Array.from(new Set(bank.map((w) => w.topic)));
    return ["All", ...t];
  }, [bank]);

  const currentDifficulty = useMemo(() => difficultyForRound(roundNumber), [roundNumber]);

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setup = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctxRef.current = ctx;

      const prev = canvas.toDataURL("image/png");

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.imageSmoothingEnabled = true;
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = brushColor;
      ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = prev;
    };

    setup();

    const ro = new ResizeObserver(() => setup());
    ro.observe(canvas);

    return () => ro.disconnect();
  }, [brushSize, brushColor, eraser]);

  // Apply brush settings
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";
  }, [brushSize, brushColor, eraser]);

  // Timer
  useEffect(() => {
    if (phase !== "play" || !timerOn) return;
    if (secondsLeft <= 0) return;

    const t = window.setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearInterval(t);
  }, [phase, timerOn, secondsLeft]);

  useEffect(() => {
    if (phase !== "play" || !timerOn) return;
    if (secondsLeft > 0) return;

    setMessage("⏳ Vaqt tugadi! Navbat almashdi.");
    endRound("skip");
  }, [secondsLeft]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(ev: KeyboardEvent) {
      if (ev.code === "Space") {
        ev.preventDefault();
        setRevealPressed(true);
      }
      if (ev.key.toLowerCase() === "c") clearCanvas();
      if (ev.key.toLowerCase() === "e") setEraser((v) => !v);
    }
    function onKeyUp(ev: KeyboardEvent) {
      if (ev.code === "Space") setRevealPressed(false);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
  }

  function startRound() {
    if (!bank.length) {
      setMessage("So‘zlar banki bo‘sh.");
      return;
    }
    const w = pickWord(bank, {
      topic,
      diff: currentDifficulty,
      avoid: current?.word,
    });

    setCurrent(w);
    setRevealPressed(false);
    setSecondsLeft(roundSeconds);
    setMessage(`🎨 ${drawerTeam} jamoa chizadi, boshqa jamoa topadi! (Level: ${currentDifficulty})`);
    setPhase("play");
    clearCanvas();
  }

  function endRound(result: "correct" | "skip") {
    if (result === "correct") {
      const guessingTeam: Team = drawerTeam === "A" ? "B" : "A";
      if (guessingTeam === "A") setScoreA((v) => v + 1);
      else setScoreB((v) => v + 1);
      setMessage(`✅ To‘g‘ri! +1 ball (${guessingTeam} jamoa)`);
    } else {
      setMessage("⏭️ Skip. Ball yo‘q.");
    }

    setDrawerTeam((t) => (t === "A" ? "B" : "A"));
    setPhase("setup");
    setRevealPressed(false);
    setSecondsLeft(roundSeconds);
    setRoundNumber((r) => r + 1);
  }

  // Drawing functions
  function drawSmoothPoint(p: Point) {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    // const rect = canvas.getBoundingClientRect();
    const now = performance.now();
    if (now - lastDrawTimeRef.current < 4) return;
    lastDrawTimeRef.current = now;

    const pts = pointsRef.current;
    pts.push(p);
    if (pts.length < 3) {
      const first = pts[0];
      ctx.beginPath();
      ctx.moveTo(first.x, first.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      return;
    }

    const p0 = pts[pts.length - 3];
    const p1 = pts[pts.length - 2];
    const p2 = pts[pts.length - 1];

    const mid1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
    const mid2 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

    ctx.beginPath();
    ctx.moveTo(mid1.x, mid1.y);
    ctx.quadraticCurveTo(p1.x, p1.y, mid2.x, mid2.y);
    ctx.stroke();

    pointsRef.current = [p1, p2];
  }

  function getPoint(e: React.PointerEvent<HTMLCanvasElement>): Point | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (phase !== "play") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    isDrawingRef.current = true;
    pointsRef.current = [];
    const p = getPoint(e);
    if (p) pointsRef.current.push(p);

    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (phase !== "play") return;
    if (!isDrawingRef.current) return;
    const p = getPoint(e);
    if (!p) return;
    drawSmoothPoint(p);
  }

  function onPointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    isDrawingRef.current = false;
    pointsRef.current = [];
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
  }

  function applyImport() {
    const res = safeParseBank(bankJson);
    if (!res.ok) {
      setImportMsg("❌ " + res.error);
      return;
    }
    setBank(res.bank);
    setImportMsg(`✅ Import OK: ${res.bank.length} ta so‘z`);
    setTopic("All");
  }

  const shownWord = current ? (revealPressed ? current.word : "•••••") : "—";

  const getDifficultyText = (difficulty: Difficulty) => {
    switch(difficulty) {
      case "easy": return "Oson";
      case "medium": return "O'rtacha";
      case "hard": return "Qiyin";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GiPaintBrush className="text-3xl text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Chiz va Top!
              </h1>
            </div>
            <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70">
              2 jamoa · Chizish va topish · Darajalar oshib boradi
            </p>
          </div>

          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-indigo-200 dark:border-indigo-800">
              <p className="text-xs text-indigo-500 dark:text-indigo-400">Hisob</p>
              <p className="text-xl font-bold">
                <span className="text-indigo-600 dark:text-indigo-400">A: {scoreA}</span>
                <span className="mx-1 text-indigo-300">|</span>
                <span className="text-purple-600 dark:text-purple-400">B: {scoreB}</span>
              </p>
            </div>

            <button
              onClick={() => setTimerOn(!timerOn)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all"
              title="Vaqtni yoqish/o'chirish"
            >
              <FaClock className={timerOn ? "text-indigo-600 dark:text-indigo-400" : "text-indigo-300 dark:text-indigo-600"} />
            </button>

            <button
              onClick={() => setImportOpen(!importOpen)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all"
              title="Import"
            >
              <FaUpload className="text-indigo-600 dark:text-indigo-400" />
            </button>

            <button
              onClick={() => {
                setScoreA(0); setScoreB(0); setDrawerTeam("A"); setRoundNumber(1);
                setCurrent(null); setRevealPressed(false); setPhase("setup");
                setSecondsLeft(roundSeconds); clearCanvas(); setMessage("");
              }}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-all"
              title="Qayta boshlash"
            >
              <FaRedo className="text-indigo-600 dark:text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Import panel */}
        {importOpen && (
          <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 p-5 shadow-xl">
            <h3 className="text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-2">So‘zlar bankini import qilish</h3>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-3">
              Format: [{"{word, topic, difficulty}"}] difficulty: easy|medium|hard
            </p>
            <textarea
              value={bankJson}
              onChange={(e) => setBankJson(e.target.value)}
              className="w-full h-40 p-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 font-mono text-sm focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={applyImport}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
              >
                <FaSave /> Import qilish
              </button>
              {importMsg && (
                <p className={`text-sm py-2 ${importMsg.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                  {importMsg}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Canvas */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 p-5 shadow-xl">
            {/* Canvas header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-indigo-500 dark:text-indigo-400">Chizuvchi jamoa</p>
                <p className="text-2xl font-bold">
                  <span className={drawerTeam === "A" ? "text-indigo-600 dark:text-indigo-400" : "text-purple-600 dark:text-purple-400"}>
                    {drawerTeam === "A" ? "⚔️ A TEAM" : "🛡️ B TEAM"}
                  </span>
                </p>
                <p className="text-xs text-indigo-400 dark:text-indigo-500 mt-1">
                  Raund #{roundNumber} · <span className={`font-bold ${currentDifficulty === 'easy' ? 'text-green-500' : currentDifficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {getDifficultyText(currentDifficulty)}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-indigo-500 dark:text-indigo-400">Qolgan vaqt</p>
                <p className={`text-2xl font-bold ${secondsLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-indigo-800 dark:text-indigo-200'}`}>
                  {timerOn ? `${secondsLeft}s` : '—'}
                </p>
              </div>
            </div>

            {/* Tools */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-4 mb-4 border border-indigo-200 dark:border-indigo-800">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <FaBrush className="text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Rang</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {COLOR_PALETTE.slice(0, 6).map((c) => (
                    <button
                      key={c}
                      onClick={() => { setBrushColor(c); setEraser(false); }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        brushColor === c && !eraser ? 'border-indigo-600 scale-110 shadow-lg' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white border-2 border-white"
                  >
                    <MdColorLens />
                  </button>
                </div>

                <div className="w-px h-6 bg-indigo-300 dark:bg-indigo-700 mx-2" />

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Size</span>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-24 accent-indigo-600"
                  />
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 w-8">{brushSize}</span>
                </div>

                <button
                  onClick={() => setEraser(!eraser)}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all text-sm ${
                    eraser 
                      ? 'bg-indigo-600 text-white shadow-lg' 
                      : 'bg-white dark:bg-slate-700 border border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300'
                  }`}
                >
                  <FaEraser /> O'chir
                </button>

                <button
                  onClick={clearCanvas}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-800 transition-all flex items-center gap-1 text-sm"
                >
                  <FaTrash /> Tozalash
                </button>
              </div>

              {showColorPicker && (
                <div className="mt-3 p-2 bg-white dark:bg-slate-700 rounded-lg border-2 border-indigo-300 dark:border-indigo-600">
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => { setBrushColor(e.target.value); setEraser(false); }}
                    className="w-full h-10"
                  />
                </div>
              )}

              <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-2">
                ⌨️ SPACE - so'zni ko'rsatish | E - o'chirg'ich | C - tozalash
              </p>
            </div>

            {/* Canvas */}
            <div className="aspect-[4/3] bg-white dark:bg-slate-900 rounded-xl border-2 border-indigo-300 dark:border-indigo-700 overflow-hidden shadow-inner">
              <canvas
                ref={canvasRef}
                className="w-full h-full touch-none"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              />
            </div>

            {message && (
              <div className="mt-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-700 text-indigo-800 dark:text-indigo-200 text-sm font-medium">
                {message}
              </div>
            )}
          </div>

          {/* Right: Word & Controls */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 p-5 shadow-xl">
            {/* Word card */}
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-xl p-6 text-center border-2 border-indigo-300 dark:border-indigo-700">
              <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">Joriy so'z</p>
              <div className="text-3xl md:text-5xl font-black tracking-wider text-indigo-900 dark:text-indigo-100 mb-3">
                {shownWord}
              </div>
              {current && (
                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                  {current.topic} · {getDifficultyText(current.difficulty)}
                </p>
              )}

              <button
                onMouseDown={() => setRevealPressed(true)}
                onMouseUp={() => setRevealPressed(false)}
                onMouseLeave={() => setRevealPressed(false)}
                onTouchStart={() => setRevealPressed(true)}
                onTouchEnd={() => setRevealPressed(false)}
                className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2 mx-auto"
              >
                {revealPressed ? <FaEyeSlash /> : <FaEye />} HOLD TO REVEAL
              </button>
            </div>

            {/* Difficulty indicators */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { level: "1-4", name: "Oson", color: "from-green-400 to-green-500" },
                { level: "5-8", name: "O'rtacha", color: "from-yellow-400 to-amber-500" },
                { level: "9+", name: "Qiyin", color: "from-red-400 to-rose-500" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`text-center p-2 rounded-lg bg-gradient-to-r ${item.color} bg-opacity-20 border-2 border-white/30`}
                >
                  <div className="text-xs text-white font-bold">{item.level}</div>
                  <div className="text-xs text-white font-semibold">{item.name}</div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-4 space-y-4">
              {/* Topic selection */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">Mavzu</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 focus:border-indigo-500 focus:outline-none"
                >
                  {topics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Time selection */}
              <div>
                <label className="block text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">Raund vaqti</label>
                <div className="flex gap-2">
                  {[30, 45, 60, 90].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setRoundSeconds(t);
                        setSecondsLeft(t);
                      }}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                        roundSeconds === t
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                          : 'bg-white dark:bg-slate-700 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-800'
                      }`}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              {phase === "setup" ? (
                <button
                  onClick={startRound}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <FaGamepad /> RAUNDNI BOSHLASH
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => endRound("correct")}
                    className="py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <FaCheck /> TO'G'RI
                  </button>
                  <button
                    onClick={() => endRound("skip")}
                    className="py-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-lg hover:from-red-600 hover:to-rose-600 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <FaTimes /> SKIP
                  </button>
                </div>
              )}

              {/* Stats */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-4 border border-indigo-300 dark:border-indigo-700">
                <p className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">📊 Statistikalar</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                  <div>Bank: <span className="font-bold text-indigo-800 dark:text-indigo-200">{bank.length}</span> ta so'z</div>
                  <div>Daraja: <span className="font-bold text-indigo-800 dark:text-indigo-200">{getDifficultyText(currentDifficulty)}</span></div>
                  <div>Raund: <span className="font-bold text-indigo-800 dark:text-indigo-200">#{roundNumber}</span></div>
                  <div>Navbat: <span className="font-bold text-indigo-800 dark:text-indigo-200">{drawerTeam} jamoa</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pictionary;
