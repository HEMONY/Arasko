import confetti from 'canvas-confetti';

export function fireTaskDoneConfetti(eventOrigin?: { x: number; y: number }) {
  try {
    const origin = eventOrigin
      ? {
          x: eventOrigin.x / window.innerWidth,
          y: eventOrigin.y / window.innerHeight,
        }
      : { x: 0.5, y: 0.6 };

    confetti({
      particleCount: 45,
      spread: 60,
      origin: origin,
      colors: ['#4F46E5', '#7C3AED', '#10B981', '#F59E0B', '#3B82F6'],
      ticks: 200,
      gravity: 1.2,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
  } catch {
    // Ignore in unsupported environments
  }
}
