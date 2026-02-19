import { useEffect, useMemo, useState } from "react";
import {
  FaBolt,
  FaCheckCircle,
  FaClock,
  FaCrown,
  FaPlay,
  FaPlus,
  FaRedo,
  FaRocket,
  FaTimesCircle,
  FaTrash,
  FaUsers,
} from "react-icons/fa";

type TeamId = 0 | 1;

type Question = {
  question: string;
  options: string[];
  answerIndex: number;
  category: string;
};

type Phase = "question-setup" | "team-setup" | "play" | "finish";

type QuestionDraft = {
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  category: string;
};


const SECONDS_PER_QUESTION = 18;
const BASE_POINTS = 10;

const createEmptyDraft = (): QuestionDraft => ({
  question: "",
  options: ["", "", "", ""],
  answerIndex: 0,
  category: "Umumiy",
});

function QuizBattle() {
  const [phase, setPhase] = useState<Phase>("question-setup");
  const [teamNames, setTeamNames] = useState<[string, string]>(["Yulduzlar", "Chaqqonlar"]);
  const [nameError, setNameError] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [draft, setDraft] = useState<QuestionDraft>(createEmptyDraft());
  const [questionError, setQuestionError] = useState("");

  const [current, setCurrent] = useState(0);
  const [turn, setTurn] = useState<TeamId>(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [doublePoints, setDoublePoints] = useState(false);
  const [streak, setStreak] = useState<[number, number]>([0, 0]);

  const question = questions[current];
  const progressPct = questions.length > 0 ? Math.round(((current + 1) / questions.length) * 100) : 0;
  const timePct = Math.max(0, Math.round((timeLeft / SECONDS_PER_QUESTION) * 100));
  const maxScore = Math.max(1, questions.length * BASE_POINTS * 2);

  const winner = useMemo(() => {
    if (scores[0] === scores[1]) return null;
    return scores[0] > scores[1] ? 0 : 1;
  }, [scores]);

  useEffect(() => {
    if (phase !== "play" || locked) return;
    if (timeLeft <= 0) {
      goNext();
      return;
    }
    const t = window.setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, locked, timeLeft]);

  useEffect(() => {
    if (phase !== "play") return;
    setTimeLeft(SECONDS_PER_QUESTION);
    setLocked(false);
    setSelected(null);
    setDoublePoints(Math.random() < 0.25);
  }, [current, phase]);

  const addQuestion = () => {
    const questionText = draft.question.trim();
    const categoryText = draft.category.trim();
    const cleanedOptions = draft.options.map((item) => item.trim()) as [string, string, string, string];

    if (!questionText) {
      setQuestionError("Savol matnini kiriting.");
      return;
    }
    if (!categoryText) {
      setQuestionError("Kategoriyani kiriting.");
      return;
    }
    if (cleanedOptions.some((item) => !item)) {
      setQuestionError("4 ta variantning barchasini to'ldiring.");
      return;
    }

    setQuestions((prev) => [
      ...prev,
      {
        question: questionText,
        options: cleanedOptions,
        answerIndex: draft.answerIndex,
        category: categoryText,
      },
    ]);
    setQuestionError("");
    setDraft(createEmptyDraft());
  };

  const removeQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const goToTeamSetup = () => {
    if (questions.length < 2) {
      setQuestionError("Kamida 2 ta savol qo'shing.");
      return;
    }
    setQuestionError("");
    setPhase("team-setup");
  };

  const startGame = () => {
    if (questions.length < 2) {
      setPhase("question-setup");
      setQuestionError("Kamida 2 ta savol qo'shing.");
      return;
    }

    const a = teamNames[0].trim();
    const b = teamNames[1].trim();
    if (!a || !b) {
      setNameError("Ikkala guruh nomini ham kiriting.");
      return;
    }
    if (a.toLowerCase() === b.toLowerCase()) {
      setNameError("Guruh nomlari bir xil bo'lmasligi kerak.");
      return;
    }

    setTeamNames([a, b]);
    setNameError("");
    setCurrent(0);
    setTurn(0);
    setScores([0, 0]);
    setStreak([0, 0]);
    setTimeLeft(SECONDS_PER_QUESTION);
    setLocked(false);
    setSelected(null);
    setPhase("play");
  };

  const goNext = () => {
    if (current + 1 >= questions.length) {
      setPhase("finish");
      setLocked(true);
      return;
    }
    setTurn((v) => (v === 0 ? 1 : 0));
    setCurrent((v) => v + 1);
  };

  const onAnswer = (idx: number) => {
    if (phase !== "play" || locked || !question) return;
    setLocked(true);
    setSelected(idx);

    const correct = idx === question.answerIndex;
    if (correct) {
      const gain = BASE_POINTS * (doublePoints ? 2 : 1);
      setScores((prev) => {
        const n: [number, number] = [...prev] as [number, number];
        n[turn] += gain;
        return n;
      });
      setStreak((prev) => {
        const n: [number, number] = [...prev] as [number, number];
        n[turn] += 1;
        return n;
      });
    } else {
      setStreak((prev) => {
        const n: [number, number] = [...prev] as [number, number];
        n[turn] = 0;
        return n;
      });
    }

    window.setTimeout(goNext, 900);
  };

  const resetRound = () => {
    setCurrent(0);
    setTurn(0);
    setScores([0, 0]);
    setStreak([0, 0]);
    setTimeLeft(SECONDS_PER_QUESTION);
    setLocked(false);
    setSelected(null);
    setDoublePoints(false);
    setPhase("team-setup");
  };

  const resetEverything = () => {
    setQuestions([]);
    setDraft(createEmptyDraft());
    setQuestionError("");
    setNameError("");
    setCurrent(0);
    setTurn(0);
    setScores([0, 0]);
    setStreak([0, 0]);
    setTimeLeft(SECONDS_PER_QUESTION);
    setLocked(false);
    setSelected(null);
    setDoublePoints(false);
    setPhase("question-setup");
  };

  if (phase === "question-setup") {
    return (
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-[#ffd966]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[#ffb36b]/20 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-yellow-100">
            <FaUsers />
            O'QITUVCHI BOSQICHI
          </div>
          <h2 className="mt-4 font-bebas text-5xl text-white">SAVOLLARNI KIRITING</h2>
          <p className="mt-1 text-white/80">
            Savol, 4 ta variant va to'g'ri javobni tanlang. Keyin jamoalarni boshlaysiz.
          </p>

          <div className="mt-6 rounded-2xl border border-orange-200/40 bg-black/15 p-4">
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/70">Savol</label>
            <input
              value={draft.question}
              onChange={(e) => setDraft((prev) => ({ ...prev, question: e.target.value }))}
              className="w-full rounded-xl border border-white/25 bg-white/95 px-3 py-3 font-semibold text-[#1f2937] outline-none focus:border-[#ffb36b]"
              placeholder="Savol matni..."
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {draft.options.map((item, idx) => (
                <div key={idx}>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/70">
                    Variant {idx + 1}
                  </label>
                  <input
                    value={item}
                    onChange={(e) =>
                      setDraft((prev) => {
                        const next = [...prev.options] as [string, string, string, string];
                        next[idx] = e.target.value;
                        return { ...prev, options: next };
                      })
                    }
                    className="w-full rounded-xl border border-white/25 bg-white/95 px-3 py-3 font-semibold text-[#1f2937] outline-none focus:border-[#ffb36b]"
                    placeholder={`Variant ${idx + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/70">Kategoriya</label>
                <input
                  value={draft.category}
                  onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-xl border border-white/25 bg-white/95 px-3 py-3 font-semibold text-[#1f2937] outline-none focus:border-[#ffb36b]"
                  placeholder="Masalan: Matematika"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/70">To'g'ri javob</label>
                <select
                  value={draft.answerIndex}
                  onChange={(e) => setDraft((prev) => ({ ...prev, answerIndex: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-white/25 bg-white/95 px-3 py-3 font-semibold text-[#1f2937] outline-none focus:border-[#ffb36b]"
                >
                  <option value={0}>Variant 1</option>
                  <option value={1}>Variant 2</option>
                  <option value={2}>Variant 3</option>
                  <option value={3}>Variant 4</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black tracking-[0.08em] text-[#8a1f4d] shadow-lg transition hover:scale-[1.02]"
            >
              <FaPlus />
              SAVOL QO'SHISH
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/75">
            <span className="rounded-full bg-black/20 px-3 py-1">Savollar: {questions.length}</span>
            <span className="rounded-full bg-black/20 px-3 py-1">Har to'g'ri javob: +{BASE_POINTS}</span>
            <span className="rounded-full bg-black/20 px-3 py-1">Bonus raund: x2 ball</span>
          </div>

          {questionError ? <p className="mt-4 text-sm font-semibold text-rose-200">{questionError}</p> : null}

          <div className="mt-5 space-y-3">
            {questions.map((item, idx) => (
              <div key={`${item.question}-${idx}`} className="rounded-2xl border border-orange-200/35 bg-black/15 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/60">{item.category}</p>
                    <p className="mt-1 font-bold text-white">
                      {idx + 1}. {item.question}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(idx)}
                    className="inline-flex items-center gap-1 rounded-full bg-rose-400/20 px-3 py-1 text-xs font-bold text-rose-100"
                  >
                    <FaTrash />
                    O'chirish
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={goToTeamSetup}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-black tracking-[0.08em] text-[#8a1f4d] shadow-lg transition hover:scale-[1.02]"
            >
              <FaPlay />
              GURUHLARGA O'TISH
            </button>
            {questions.length > 0 ? (
              <button
                type="button"
                onClick={() => setQuestions([])}
                className="inline-flex items-center gap-2 rounded-full border border-orange-200/35 bg-black/20 px-6 py-3 text-sm font-bold text-white/90"
              >
                <FaTrash />
                SAVOLLARNI TOZALASH
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "team-setup") {
    return (
      <div className="relative overflow-hidden rounded-[28px] border border-orange-200/40 bg-gradient-to-br from-yellow-500/90 via-orange-500/90 to-red-500/90 p-6 shadow-2xl shadow-[#7f1d4f]/45 backdrop-blur-xl lg:p-8">
        <div className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-[#ffd966]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[#ffb36b]/20 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 text-xs font-extrabold tracking-[0.14em] text-yellow-100">
            <FaUsers />
            TEAM BATTLE
          </div>
          <h2 className="mt-4 font-bebas text-5xl text-white">GURUHLARNI KIRITING</h2>
          <p className="mt-1 text-white/80">
            O'qituvchi kiritgan savollar soni: <span className="font-black text-[#ffe57a]">{questions.length}</span>
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-orange-200/40 bg-black/15 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-white/70">1-Guruh</p>
              <input
                value={teamNames[0]}
                onChange={(e) => setTeamNames([e.target.value, teamNames[1]])}
                className="w-full rounded-xl border border-white/25 bg-white/95 px-3 py-3 font-semibold text-[#1f2937] outline-none focus:border-[#ffb36b]"
                placeholder="Masalan: Yulduzlar"
              />
            </div>
            <div className="rounded-2xl border border-orange-200/40 bg-black/15 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-white/70">2-Guruh</p>
              <input
                value={teamNames[1]}
                onChange={(e) => setTeamNames([teamNames[0], e.target.value])}
                className="w-full rounded-xl border border-white/25 bg-white/95 px-3 py-3 font-semibold text-[#1f2937] outline-none focus:border-[#ffb36b]"
                placeholder="Masalan: Chaqqonlar"
              />
            </div>
          </div>

          {nameError ? <p className="mt-4 text-sm font-semibold text-rose-200">{nameError}</p> : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startGame}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-black tracking-[0.08em] text-[#8a1f4d] shadow-lg transition hover:scale-[1.02]"
            >
              <FaPlay />
              O'YINNI BOSHLASH
            </button>

            <button
              type="button"
              onClick={() => setPhase("question-setup")}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200/35 bg-black/20 px-6 py-3 text-sm font-bold text-white/90"
            >
              <FaRedo />
              SAVOLLARGA QAYTISH
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "finish") {
    return (
      <div className="rounded-[28px] border border-orange-200/40 bg-gradient-to-br from-yellow-500/90 via-orange-500/90 to-red-500/90 p-6 shadow-2xl shadow-[#7f1d4f]/45 backdrop-blur-xl lg:p-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#8a1f4d]">
          <FaCrown className="text-2xl" />
        </div>
        <h2 className="mt-4 font-bebas text-5xl text-white">YAKUNIY NATIJA</h2>
        <p className="mt-1 text-white/80">
          {winner === null ? "Durrang! Juda zo'r o'ynadingiz." : `${teamNames[winner]} g'olib bo'ldi!`}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-2xl border border-orange-200/35 bg-black/15 p-4">
              <p className="text-sm font-bold text-white/70">{i + 1}-Guruh</p>
              <p className="mt-1 text-xl font-black text-white">{teamNames[i as TeamId]}</p>
              <p className="mt-2 text-3xl font-black text-[#ffd966]">{scores[i as TeamId]} ball</p>
              <div className="mt-3 h-2 w-full rounded-full bg-black/20">
                <div
                  className={`h-full rounded-full ${i === 0 ? "bg-yellow-200" : "bg-orange-300"}`}
                  style={{ width: `${Math.min(100, Math.round((scores[i as TeamId] / maxScore) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetRound}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-black tracking-[0.08em] text-[#8a1f4d] shadow-lg transition hover:scale-[1.02]"
          >
            <FaRedo />
            YANA O'YNASH
          </button>
          <button
            type="button"
            onClick={resetEverything}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200/35 bg-black/20 px-6 py-3 text-sm font-bold text-white/90"
          >
            <FaTrash />
            BARCHASINI YANGILASH
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="rounded-[28px] border border-orange-200/40 bg-gradient-to-br from-yellow-500/90 via-orange-500/90 to-red-500/90 p-6 shadow-2xl shadow-[#7f1d4f]/45 backdrop-blur-xl lg:p-8">
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        {[0, 1].map((i) => {
          const active = turn === i;
          return (
            <div
              key={i}
              className={`rounded-2xl border p-4 transition ${
                active ? "border-orange-100 bg-black/25" : "border-orange-200/35 bg-black/15"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">{i + 1}-Guruh</p>
              <p className="mt-1 text-lg font-black text-white">{teamNames[i as TeamId]}</p>
              <p className="mt-1 text-sm font-bold text-[#ffe57a]">{scores[i as TeamId]} ball</p>
              <p className="mt-1 text-xs text-white/70">Combo: {streak[i as TeamId]}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold tracking-[0.08em] text-white/85">
          Savol {current + 1}/{questions.length}
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1 text-sm font-bold text-yellow-100">
          <FaClock />
          {timeLeft}s
        </div>
      </div>

      <div className="mb-4 h-2 w-full rounded-full bg-black/20">
        <div className="h-full rounded-full bg-gradient-to-r from-yellow-200 to-orange-200" style={{ width: `${progressPct}%` }} />
      </div>
      <div className="mb-5 h-2 w-full rounded-full bg-black/20">
        <div className="h-full rounded-full bg-orange-300 transition-all" style={{ width: `${timePct}%` }} />
      </div>

      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-bold text-white/90">{question.category}</span>
        {doublePoints ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ffd966]/20 px-3 py-1 text-xs font-black text-[#ffe57a]">
            <FaRocket />
            BONUS x2
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 text-xs font-bold text-white/90">
            <FaBolt />
            ODDIY RAUND
          </span>
        )}
      </div>

      <h3 className="text-2xl font-black leading-tight text-white">{question.question}</h3>
      <p className="mt-1 text-sm text-white/75">
        Navbat: <span className="font-black text-[#ffe57a]">{teamNames[turn]}</span>
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {question.options.map((option, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === question.answerIndex;
          const reveal = locked && selected !== null;

          const stateClass =
            reveal && isCorrect
              ? "border-orange-200 bg-orange-400/30"
              : reveal && isSelected && !isCorrect
                ? "border-rose-300 bg-rose-500/25"
                : "border-orange-200/35 bg-black/20 hover:bg-black/30";

          return (
            <button
              key={`${option}-${idx}`}
              type="button"
              onClick={() => onAnswer(idx)}
              disabled={locked}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left font-bold text-white transition ${stateClass}`}
            >
              <span>{option}</span>
              {reveal && isCorrect ? (
                <FaCheckCircle className="text-orange-100" />
              ) : reveal && isSelected && !isCorrect ? (
                <FaTimesCircle className="text-rose-200" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuizBattle;



