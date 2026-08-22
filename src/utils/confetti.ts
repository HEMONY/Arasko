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

/**
 * Fires dynamic celebratory double-cannon confetti bursts when habit streak milestones (7 or 30 days) are reached!
 */
export function fireStreakMilestoneCelebration(milestoneDays = 7) {
  try {
    const is30Days = milestoneDays >= 30;
    const particleCount = is30Days ? 110 : 65;

    // Left cannon
    confetti({
      particleCount,
      angle: 60,
      spread: 65,
      origin: { x: 0.05, y: 0.75 },
      colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#F43F5E', '#FFD700'],
      ticks: 300,
      gravity: 1.1,
      scalar: 1.1,
      disableForReducedMotion: true,
    });

    // Right cannon
    confetti({
      particleCount,
      angle: 120,
      spread: 65,
      origin: { x: 0.95, y: 0.75 },
      colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#F43F5E', '#FFD700'],
      ticks: 300,
      gravity: 1.1,
      scalar: 1.1,
      disableForReducedMotion: true,
    });

    // Central starburst for big milestones (30 days)
    if (is30Days) {
      setTimeout(() => {
        try {
          confetti({
            particleCount: 90,
            spread: 120,
            origin: { x: 0.5, y: 0.45 },
            colors: ['#FFD700', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'],
            ticks: 350,
            gravity: 0.9,
            scalar: 1.25,
            disableForReducedMotion: true,
          });
        } catch {
          // ignore
        }
      }, 250);
    }
  } catch {
    // Ignore in unsupported environments
  }
}

