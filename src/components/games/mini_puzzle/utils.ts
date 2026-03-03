export function getComboBonus(streak: number) {
  if (streak >= 4) return 20;
  if (streak === 3) return 10;
  if (streak === 2) return 5;
  return 0;
}

export function getRandomViewTransform() {
  const zoom = 1 + Math.random() * 0.35;
  const maxOffset = Math.max(0, 300 * zoom - 300);
  return {
    zoom: Number(zoom.toFixed(2)),
    offsetX: Math.floor(Math.random() * (maxOffset + 1)),
    offsetY: Math.floor(Math.random() * (maxOffset + 1)),
  };
}
