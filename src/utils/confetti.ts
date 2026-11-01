import confetti from 'canvas-confetti';

export function fireCelebration(type: 'confetti' | 'hearts' | 'sparkles' | 'stars' = 'confetti') {
  if (typeof window === 'undefined') return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  if (type === 'hearts') {
    // Beautiful romantic heart burst
    confetti({
      ...defaults,
      particleCount: 80,
      spread: 100,
      startVelocity: 35,
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#f472b6', '#ec4899', '#ffffff'],
      shapes: ['circle'],
      scalar: 1.2,
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f43f5e', '#e11d48', '#fda4af'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f43f5e', '#e11d48', '#fda4af'],
      });
    }, 250);
  } else if (type === 'sparkles' || type === 'stars') {
    // Golden & pastel celestial sparkle shower
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#ffffff', '#fde047', '#e0e7ff'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#f59e0b', '#ec4899', '#a855f7'],
    });
  } else {
    // Classic vibrant party celebration
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#f43f5e', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#ec4899', '#3b82f6', '#f59e0b', '#10b981'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#f43f5e', '#fbbf24', '#a855f7', '#38bdf8'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#f43f5e', '#ffffff'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#fb7185', '#ec4899'],
    });
  }
}
