import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FaBrush,
  FaCheck,
  FaClock,
  FaEraser,
  FaEye,
  FaEyeSlash,
  FaFlagCheckered,
  FaPalette,
  FaPlay,
  FaRedo,
  FaSave,
  FaTrash,
  FaUpload,
  FaUsers,
  FaTimes,
} from "react-icons/fa";
import { GiPaintBrush } from "react-icons/gi";
import { MdColorLens } from "react-icons/md";
import GamePlayView from "../shared/GamePlayView";

type Team = "A" | "B";
type Phase = "setup" | "preview" | "play";
type Difficulty = "easy" | "medium" | "hard";

type WordItem = {
  word: string;
  topic: string;
  difficulty: Difficulty;
};

type TeamState = {
  name: string;
  score: number;
};

type Point = { x: number; y: number };

const DEFAULT_BANK: WordItem[] = [
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
  { word: "WATERMELON", topic: "Fruits", difficulty: "medium" },
  { word: "PINEAPPLE", topic: "Fruits", difficulty: "medium" },
  { word: "TAKE A SHOWER", topic: "Daily Routines", difficulty: "medium" },
  { word: "COOK DINNER", topic: "Daily Routines", difficulty: "medium" },
  { word: "WASH DISHES", topic: "Daily Routines", difficulty: "medium" },
  { word: "AIRPLANE", topic: "Objects", difficulty: "medium" },
  { word: "HEADPHONES", topic: "Objects", difficulty: "medium" },
  { word: "TELESCOPE", topic: "Objects", difficulty: "hard" },
  { word: "MICROSCOPE", topic: "Objects", difficulty: "hard" },
  { word: "TRAFFIC JAM", topic: "Daily Routines", difficulty: "hard" },
  { word: "SUSTAINABILITY", topic: "Abstract", difficulty: "hard" },
];

const COLOR_PALETTE = ["#111827", "#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#ffffff"];

function normalizeWord(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, " ");
}

function safeParseBank(jsonText: string): { ok: true; bank: WordItem[] } | { ok: false; error: string } {
  try {
    const data = JSON.parse(jsonText);
    if (!Array.isArray(data)) {
      return { ok: false, error: "JSON massiv bo'lishi kerak. Misol: [{word, topic, difficulty}]" };
    }

    const cleaned: WordItem[] = data
      .map((item: any) => ({
        word: normalizeWord(String(item?.word ?? "")),
        topic: String(item?.topic ?? "Custom").trim() || "Custom",
        difficulty: String(item?.difficulty ?? "easy").toLowerCase() as Difficulty,
      }))
      .filter((item) => item.word.length >= 2)
      .map((item) => ({
        ...item,
        difficulty: (["easy", "medium", "hard"].includes(item.difficulty) ? item.difficulty : "easy") as Difficulty,
      }));

    if (!cleaned.length) {
      return { ok: false, error: "Bank bo'sh. Kamida 1 ta so'z kerak." };
    }

    return { ok: true, bank: cleaned };
  } catch (error: any) {
    return { ok: false, error: error?.message || "JSON parse error" };
  }
}

function difficultyForRound(roundNumber: number): Difficulty {
  if (roundNumber <= 4) return "easy";
  if (roundNumber <= 8) return "medium";
  return "hard";
}

function pickWord(bank: WordItem[], opts: { topic: string; diff: Difficulty; avoid?: string | null }) {
  const byTopic = opts.topic === "All" ? bank : bank.filter((word) => word.topic === opts.topic);
  const byDiff = byTopic.filter((word) => word.difficulty === opts.diff && word.word !== opts.avoid);
  if (byDiff.length) return byDiff[Math.floor(Math.random() * byDiff.length)];

  const byTopicFallback = byTopic.filter((word) => word.word !== opts.avoid);
  if (byTopicFallback.length) return byTopicFallback[Math.floor(Math.random() * byTopicFallback.length)];

  return bank[Math.floor(Math.random() * bank.length)];
}

function getDifficultyLabel(difficulty: Difficulty) {
  switch (difficulty) {
    case "easy":
      return "Oson";
    case "medium":
      return "O'rta";
    case "hard":
      return "Qiyin";
  }
}

function getTeamAccent(team: Team) {
  return team === "A"
    ? {
        badge: "from-sky-500 to-cyan-400",
        soft: "border-sky-400/35 bg-sky-500/10",
        text: "text-sky-100",
        muted: "text-sky-200/75",
      }
    : {
        badge: "from-rose-500 to-orange-400",
        soft: "border-rose-400/35 bg-rose-500/10",
        text: "text-rose-100",
        muted: "text-rose-200/75",
      };
}

function Pictionary() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [drawerTeam, setDrawerTeam] = useState<Team>("A");
  const [teams, setTeams] = useState<Record<Team, TeamState>>({
    A: { name: "1-jamoa", score: 0 },
    B: { name: "2-jamoa", score: 0 },
  });
  const [topic, setTopic] = useState("All");
  const [timerOn, setTimerOn] = useState(true);
  const [roundSeconds, setRoundSeconds] = useState(60);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [roundNumber, setRoundNumber] = useState(1);
  const [bank, setBank] = useState<WordItem[]>(DEFAULT_BANK);
  const [importOpen, setImportOpen] = useState(false);
  const [bankJson, setBankJson] = useState(() => JSON.stringify(DEFAULT_BANK, null, 2));
  const [importMsg, setImportMsg] = useState("");
  const [current, setCurrent] = useState<WordItem | null>(null);
  const [peekWord, setPeekWord] = useState(false);
  const [message, setMessage] = useState("2 jamoa tayyor bo'lsa, raundni boshlang.");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const pointsRef = useRef<Point[]>([]);
  const lastDrawTimeRef = useRef(0);

  const [brushSize, setBrushSize] = useState(10);
  const [brushColor, setBrushColor] = useState("#111827");
  const [eraser, setEraser] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const topics = useMemo(() => ["All", ...Array.from(new Set(bank.map((word) => word.topic)))], [bank]);
  const currentDifficulty = useMemo(() => difficultyForRound(roundNumber), [roundNumber]);
  const guesserTeam: Team = drawerTeam === "A" ? "B" : "A";
  const drawerInfo = teams[drawerTeam];
  const guesserInfo = teams[guesserTeam];
  const leaderTeam = teams.A.score === teams.B.score ? null : teams.A.score > teams.B.score ? "A" : "B";
  const shownWord = current ? (peekWord ? current.word : "•••••") : "—";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setupCanvas = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const previous = canvas.width > 0 && canvas.height > 0 ? canvas.toDataURL("image/png") : null;

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));

      ctxRef.current = ctx;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.imageSmoothingEnabled = true;
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = brushColor;
      ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";

      if (!previous) return;
      const image = new Image();
      image.onload = () => {
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.drawImage(image, 0, 0, rect.width, rect.height);
      };
      image.src = previous;
    };

    setupCanvas();
    const observer = new ResizeObserver(() => setupCanvas());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [brushSize, brushColor, eraser]);

  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = brushColor;
    ctx.globalCompositeOperation = eraser ? "destination-out" : "source-over";
  }, [brushSize, brushColor, eraser]);

  useEffect(() => {
    if (phase !== "play" || !timerOn || secondsLeft <= 0) return;
    const timerId = window.setInterval(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearInterval(timerId);
  }, [phase, timerOn, secondsLeft]);

  useEffect(() => {
    if (phase !== "play" || !timerOn || secondsLeft > 0) return;
    finishRound("skip");
  }, [phase, timerOn, secondsLeft]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code === "Space" && phase !== "setup") {
        event.preventDefault();
        setPeekWord(true);
      }
      if (event.key.toLowerCase() === "c") clearCanvas();
      if (event.key.toLowerCase() === "e") setEraser((value) => !value);
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.code === "Space") setPeekWord(false);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [phase]);

  function updateTeamName(team: Team, value: string) {
    setTeams((currentTeams) => ({
      ...currentTeams,
      [team]: {
        ...currentTeams[team],
        name: value.trimStart() || (team === "A" ? "1-jamoa" : "2-jamoa"),
      },
    }));
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
  }

  function prepareRound() {
    if (!bank.length) {
      setMessage("So'zlar banki bo'sh. Avval kamida 1 ta so'z yuklang.");
      return;
    }

    const word = pickWord(bank, {
      topic,
      diff: currentDifficulty,
      avoid: current?.word,
    });

    setCurrent(word);
    setPeekWord(true);
    setPhase("preview");
    setSecondsLeft(roundSeconds);
    clearCanvas();
    setMessage(`${drawerInfo.name} chizadi. ${guesserInfo.name} topishga tayyor tursin.`);
  }

  function startDrawingPhase() {
    setPhase("play");
    setPeekWord(false);
    setMessage(`${drawerInfo.name} chizmoqda. ${guesserInfo.name} topishi kerak.`);
  }

  function finishRound(result: "correct" | "skip") {
    if (result === "correct") {
      setTeams((currentTeams) => ({
        ...currentTeams,
        [guesserTeam]: {
          ...currentTeams[guesserTeam],
          score: currentTeams[guesserTeam].score + 1,
        },
      }));
      setMessage(`${guesserInfo.name} to'g'ri topdi va 1 ball oldi.`);
    } else {
      setMessage(`Vaqt tugadi yoki skip qilindi. Keyingi navbat ${guesserInfo.name} jamoasiga o'tadi.`);
    }

    setPhase("setup");
    setPeekWord(false);
    setSecondsLeft(roundSeconds);
    setCurrent(null);
    setDrawerTeam(guesserTeam);
    setRoundNumber((value) => value + 1);
    clearCanvas();
  }

  function resetGame() {
    setTeams({
      A: { name: "1-jamoa", score: 0 },
      B: { name: "2-jamoa", score: 0 },
    });
    setDrawerTeam("A");
    setRoundNumber(1);
    setRoundSeconds(60);
    setSecondsLeft(60);
    setPhase("setup");
    setCurrent(null);
    setPeekWord(false);
    setTopic("All");
    setTimerOn(true);
    setMessage("O'yin boshidan tiklandi. 1-jamoa birinchi bo'lib chizadi.");
    clearCanvas();
  }

  function applyImport() {
    const parsed = safeParseBank(bankJson);
    if (!parsed.ok) {
      setImportMsg(`Xato: ${parsed.error}`);
      return;
    }

    setBank(parsed.bank);
    setTopic("All");
    setImportMsg(`Tayyor: ${parsed.bank.length} ta so'z yuklandi.`);
  }

  function drawSmoothPoint(point: Point) {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const now = performance.now();
    if (now - lastDrawTimeRef.current < 4) return;
    lastDrawTimeRef.current = now;

    const points = pointsRef.current;
    points.push(point);

    if (points.length < 3) {
      const first = points[0];
      ctx.beginPath();
      ctx.moveTo(first.x, first.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      return;
    }

    const p0 = points[points.length - 3];
    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];
    const mid1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
    const mid2 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

    ctx.beginPath();
    ctx.moveTo(mid1.x, mid1.y);
    ctx.quadraticCurveTo(p1.x, p1.y, mid2.x, mid2.y);
    ctx.stroke();
    pointsRef.current = [p1, p2];
  }

  function getPoint(event: React.PointerEvent<HTMLCanvasElement>): Point | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function onPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (phase !== "play") return;
    isDrawingRef.current = true;
    pointsRef.current = [];
    const point = getPoint(event);
    if (point) pointsRef.current.push(point);
    (event.target as Element).setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (phase !== "play" || !isDrawingRef.current) return;
    const point = getPoint(event);
    if (!point) return;
    drawSmoothPoint(point);
  }

  function onPointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    isDrawingRef.current = false;
    pointsRef.current = [];
    try {
      (event.target as Element).releasePointerCapture(event.pointerId);
    } catch {}
  }

  const activeAccent = getTeamAccent(drawerTeam);

  return (
    <GamePlayView
      title="Pictionary"
      subtitle="2 jamoa uchun aniq round flow: chizuvchi tayyorlanadi, keyin qarshi jamoa topadi."
      gameKey="pictionary"
      backTo="/games/pictionary"
      icon={MdColorLens}
      colorClassName="from-sky-500 via-pink-500 to-orange-500"
    >
      <div className="space-y-6 text-white">
        <section className="grid gap-4 xl:grid-cols-[1.3fr,0.9fr]">
          <div className="rounded-3xl border border-white/12 bg-slate-950/50 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">Raund boshqaruvi</p>
                <h2 className="mt-2 text-2xl font-black">Raund #{roundNumber}</h2>
                <p className="mt-2 text-sm text-white/70">
                  Chizuvchi: <span className="font-bold text-white">{drawerInfo.name}</span>
                  {" · "}
                  Topuvchi: <span className="font-bold text-white">{guesserInfo.name}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTimerOn((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <FaClock />
                  {timerOn ? "Timer yoqilgan" : "Timer o'chirilgan"}
                </button>
                <button
                  type="button"
                  onClick={() => setImportOpen((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <FaUpload />
                  So'z importi
                </button>
                <button
                  type="button"
                  onClick={resetGame}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <FaRedo />
                  Qayta boshlash
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/70">Qiyinlik</p>
                <p className="mt-2 text-2xl font-black text-emerald-100">{getDifficultyLabel(currentDifficulty)}</p>
                <p className="mt-1 text-sm text-emerald-100/70">Raund oshgani sari so'zlar qiyinlashadi.</p>
              </div>
              <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-200/70">Vaqt</p>
                <p className="mt-2 text-2xl font-black text-amber-100">{timerOn ? `${secondsLeft}s` : "Cheklanmagan"}</p>
                <p className="mt-1 text-sm text-amber-100/70">{roundSeconds} soniyalik raund tanlangan.</p>
              </div>
              <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200/70">So'zlar banki</p>
                <p className="mt-2 text-2xl font-black text-fuchsia-100">{bank.length}</p>
                <p className="mt-1 text-sm text-fuchsia-100/70">{topic === "All" ? "Barcha mavzular" : topic}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            {(["A", "B"] as Team[]).map((team) => {
              const accent = getTeamAccent(team);
              const isDrawer = drawerTeam === team;
              const isGuesser = guesserTeam === team;

              return (
                <div key={team} className={`rounded-3xl border p-5 ${accent.soft}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-white ${accent.badge}`}>
                        Team {team}
                      </div>
                      <input
                        value={teams[team].name}
                        onChange={(event) => updateTeamName(team, event.target.value)}
                        className="mt-3 w-full rounded-2xl border border-white/12 bg-black/20 px-4 py-3 text-lg font-black text-white outline-none transition focus:border-white/30"
                      />
                    </div>
                    {leaderTeam === team && (
                      <div className="rounded-2xl border border-yellow-300/30 bg-yellow-400/10 px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-100">
                        Lider
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className={`text-xs uppercase tracking-[0.2em] ${accent.muted}`}>Hisob</p>
                      <p className={`mt-1 text-4xl font-black ${accent.text}`}>{teams[team].score}</p>
                    </div>
                    <div className="text-right text-sm">
                      {isDrawer && <p className="font-bold text-white">Hozir chizadi</p>}
                      {isGuesser && <p className="font-bold text-white/75">Hozir topadi</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {importOpen && (
          <section className="rounded-3xl border border-white/12 bg-slate-950/60 p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-black">So'zlar bankini yangilash</h3>
                <p className="mt-1 text-sm text-white/65">Format: [{`{ word, topic, difficulty }`}]. Difficulty: easy, medium, hard.</p>
              </div>
              <button
                type="button"
                onClick={applyImport}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-fuchsia-500 px-5 py-3 text-sm font-black text-white shadow-xl transition hover:scale-[1.01]"
              >
                <FaSave />
                Import qilish
              </button>
            </div>
            <textarea
              value={bankJson}
              onChange={(event) => setBankJson(event.target.value)}
              className="mt-4 h-56 w-full rounded-2xl border border-white/12 bg-black/30 p-4 font-mono text-sm text-white outline-none focus:border-white/25"
            />
            {importMsg && <p className="mt-3 text-sm text-white/75">{importMsg}</p>}
          </section>
        )}

        <section className="grid gap-6 2xl:grid-cols-[1.35fr,0.95fr]">
          <div className="rounded-3xl border border-white/12 bg-slate-950/55 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">Chizish doskasi</p>
                <h3 className="mt-2 text-xl font-black">Faqat play holatida chizish mumkin</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setBrushColor(color);
                      setEraser(false);
                    }}
                    className={`h-9 w-9 rounded-full border-2 transition ${brushColor === color && !eraser ? "scale-110 border-white" : "border-white/10"}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setShowColorPicker((value) => !value)}
                  className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/12 bg-white/10 px-3 text-white"
                >
                  <MdColorLens />
                </button>
                <button
                  type="button"
                  onClick={() => setEraser((value) => !value)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition ${
                    eraser ? "bg-white text-slate-950" : "border border-white/12 bg-white/10 text-white"
                  }`}
                >
                  <FaEraser />
                  O'chirg'ich
                </button>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <FaTrash />
                  Tozalash
                </button>
              </div>
            </div>

            {showColorPicker && (
              <div className="mt-4 rounded-2xl border border-white/12 bg-black/20 p-3">
                <input
                  type="color"
                  value={brushColor}
                  onChange={(event) => {
                    setBrushColor(event.target.value);
                    setEraser(false);
                  }}
                  className="h-12 w-full"
                />
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="inline-flex items-center gap-2 text-sm text-white/75">
                <FaBrush />
                Qalam o'lchami
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={brushSize}
                onChange={(event) => setBrushSize(Number(event.target.value))}
                className="w-40 accent-sky-400"
              />
              <span className="text-sm font-bold text-white">{brushSize}px</span>
              <span className="text-xs text-white/45">Shortcut: `Space` so'zni ko'rsatadi, `C` tozalaydi, `E` o'chirg'ichni yoqadi.</span>
            </div>

            <div className="mt-5 aspect-[4/3] overflow-hidden rounded-[28px] border border-white/12 bg-white shadow-inner">
              <canvas
                ref={canvasRef}
                className="h-full w-full touch-none"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              />
            </div>
          </div>

          <div className="space-y-6">
            <section className={`rounded-3xl border p-5 ${activeAccent.soft}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r text-white ${activeAccent.badge}`}>
                  <GiPaintBrush className="text-2xl" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">Joriy rol</p>
                  <h3 className="text-xl font-black">{drawerInfo.name} chizadi</h3>
                  <p className="text-sm text-white/70">{guesserInfo.name} so'zni topadi.</p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-white/12 bg-black/20 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/45">Joriy so'z</p>
                <div className="mt-3 text-3xl font-black tracking-[0.2em] md:text-4xl">{shownWord}</div>
                <p className="mt-3 text-sm text-white/65">
                  {current ? `${current.topic} · ${getDifficultyLabel(current.difficulty)}` : "Raund boshlanganda yangi so'z tanlanadi."}
                </p>
                {current && (
                  <button
                    type="button"
                    onMouseDown={() => setPeekWord(true)}
                    onMouseUp={() => setPeekWord(false)}
                    onMouseLeave={() => setPeekWord(false)}
                    onTouchStart={() => setPeekWord(true)}
                    onTouchEnd={() => setPeekWord(false)}
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
                  >
                    {peekWord ? <FaEyeSlash /> : <FaEye />}
                    Bosib turib ko'rish
                  </button>
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { step: "1", title: "Tayyorlanish", active: phase === "setup" },
                  { step: "2", title: "So'zni ko'rish", active: phase === "preview" },
                  { step: "3", title: "Chizish", active: phase === "play" },
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`rounded-2xl border px-4 py-3 text-center ${
                      item.active ? "border-white/40 bg-white/15 text-white" : "border-white/10 bg-black/20 text-white/55"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.2em]">Step {item.step}</p>
                    <p className="mt-1 text-sm font-bold">{item.title}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/12 bg-slate-950/55 p-5">
              <h3 className="text-lg font-black">O'yin boshqaruvi</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-white/70">Mavzu</label>
                  <select
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-white outline-none focus:border-white/25"
                  >
                    {topics.map((item) => (
                      <option key={item} value={item} className="bg-slate-900">
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-white/70">Raund vaqti</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[30, 45, 60, 90].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setRoundSeconds(value);
                          setSecondsLeft(value);
                        }}
                        className={`rounded-2xl px-3 py-3 text-sm font-black transition ${
                          roundSeconds === value ? "bg-white text-slate-950" : "border border-white/12 bg-white/10 text-white"
                        }`}
                      >
                        {value}s
                      </button>
                    ))}
                  </div>
                </div>

                {phase === "setup" && (
                  <button
                    type="button"
                    onClick={prepareRound}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 via-pink-500 to-orange-500 px-5 py-4 text-base font-black text-white shadow-xl transition hover:scale-[1.01]"
                  >
                    <FaPlay />
                    Keyingi raundni tayyorlash
                  </button>
                )}

                {phase === "preview" && (
                  <button
                    type="button"
                    onClick={startDrawingPhase}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-4 text-base font-black text-white shadow-xl transition hover:scale-[1.01]"
                  >
                    <FaFlagCheckered />
                    Chizishni boshlash
                  </button>
                )}

                {phase === "play" && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => finishRound("correct")}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-4 text-base font-black text-white shadow-xl transition hover:scale-[1.01]"
                    >
                      <FaCheck />
                      To'g'ri topildi
                    </button>
                    <button
                      type="button"
                      onClick={() => finishRound("skip")}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-4 text-base font-black text-white shadow-xl transition hover:scale-[1.01]"
                    >
                      <FaTimes />
                      Skip
                    </button>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-white/12 bg-slate-950/55 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <FaUsers />
                </div>
                <div>
                  <h3 className="text-lg font-black">Qoidalar qisqacha</h3>
                  <p className="text-sm text-white/65">O'yinni tushunarli boshqarish uchun 3 qadam.</p>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-sm text-white/75">
                <p>1. `Keyingi raundni tayyorlash` bosiladi va so'z faqat chizuvchiga ko'rsatiladi.</p>
                <p>2. Chizuvchi tayyor bo'lgach `Chizishni boshlash` bosiladi, timer ishga tushadi.</p>
                <p>3. Qarshi jamoa topsa `To'g'ri topildi`, topolmasa `Skip` bosiladi. Keyingi raundda navbat almashadi.</p>
              </div>
            </section>

            <section className="rounded-3xl border border-white/12 bg-white/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <FaPalette />
                </div>
                <div>
                  <h3 className="text-lg font-black">Holat xabari</h3>
                  <p className="text-sm text-white/65">{message}</p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </GamePlayView>
  );
}

export default Pictionary;