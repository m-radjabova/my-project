import { useEffect, useMemo } from "react";
import { rand } from "../utils/gameUtils";

type Props = {
  show: boolean;
  onDone: () => void;
};

export default function ConfettiBurst({ show, onDone }: Props) {
  const pieces = useMemo(() => {
    return Array.from({ length: 90 }).map((_, i) => {
      const left = rand(0, 100);
      const size = rand(6, 12);
      const delay = rand(0, 0.25);
      const duration = rand(1.0, 1.6);
      const drift = rand(-22, 22);
      const rot = rand(180, 760);
      const opacity = rand(0.85, 1);
      return { i, left, size, delay, duration, drift, rot, opacity };
    });
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(onDone, 1800);
    return () => window.clearTimeout(t);
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <style>{`
        @keyframes confetti-fall-amber {
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
            ["--x" as string]: `${rand(-8, 8)}vw`,
            ["--d" as string]: `${p.drift}vw`,
            ["--r" as string]: `${p.rot}deg`,
            ["--o" as string]: `${p.opacity}`,
            animation: `confetti-fall-amber ${p.duration}s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
