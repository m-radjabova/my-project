const getDicePips = (value: number): [number, number][] => {
  const map: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [
      [30, 30],
      [70, 70],
    ],
    3: [
      [30, 30],
      [50, 50],
      [70, 70],
    ],
    4: [
      [30, 30],
      [30, 70],
      [70, 30],
      [70, 70],
    ],
    5: [
      [30, 30],
      [30, 70],
      [50, 50],
      [70, 30],
      [70, 70],
    ],
    6: [
      [30, 25],
      [30, 50],
      [30, 75],
      [70, 25],
      [70, 50],
      [70, 75],
    ],
  };
  return map[value] ?? map[1];
};

type Props = {
  value: number;
};

function RealisticDice({ value }: Props) {
  const pips = getDicePips(value);

  return (
    <svg
      viewBox="0 0 120 120"
      className="w-24 h-24 drop-shadow-[0_16px_24px_rgba(0,0,0,0.7)] hover:scale-110 transition-all duration-300"
    >
      <defs>
        <linearGradient id="diceGradientTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="40%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#f3e8d8" />
        </linearGradient>

        <linearGradient id="diceGradientSide" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f9e8d4" />
          <stop offset="100%" stopColor="#e8d5c4" />
        </linearGradient>

        <filter id="diceShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
          <feOffset dx="2" dy="5" result="shadow" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.4" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <radialGradient id="diceShine" cx="30%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect
        x="12"
        y="12"
        width="96"
        height="96"
        rx="12"
        fill="url(#diceGradientTop)"
        stroke="#9b8874"
        strokeWidth="2.5"
        filter="url(#diceShadow)"
      />

      <polygon
        points="108,12 120,20 120,116 108,108"
        fill="url(#diceGradientSide)"
        stroke="#7a6859"
        strokeWidth="2"
      />
      <polygon
        points="12,108 20,120 116,120 108,108"
        fill="url(#diceGradientSide)"
        stroke="#7a6859"
        strokeWidth="2"
      />

      <rect x="12" y="12" width="96" height="96" rx="12" fill="url(#diceShine)" />

      {pips.map(([cx, cy], idx) => (
        <g key={`pip-${idx}`}>
          <circle cx={cx * 0.96 + 2.4} cy={cy * 0.96 + 2.4} r="4.5" fill="#000000" opacity="0.15" />
          <circle cx={cx * 0.96} cy={cy * 0.96} r="4.5" fill="#4a3728" stroke="#2d2416" strokeWidth="0.6" />
          <circle cx={cx * 0.96 - 1} cy={cy * 0.96 - 1} r="1.5" fill="#ffffff" opacity="0.4" />
        </g>
      ))}
    </svg>
  );
}

export default RealisticDice;
