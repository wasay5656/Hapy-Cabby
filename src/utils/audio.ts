/**
 * Web Audio API synthesized sound effects
 * Zero external audio dependencies — guaranteed to work in any browser without CORS or network latency.
 */

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  isMuted = muted;
}

export function getIsMuted(): boolean {
  return isMuted;
}

/**
 * Playful cartoon "whoosh / boing / pop" when the NO button slips away
 */
export function playDodgeSound() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startTime = ctx.currentTime;
    
    // Quick pitch slide upwards like a cartoon slip/boing
    osc.frequency.setValueAtTime(320, startTime);
    osc.frequency.exponentialRampToValueAtTime(750, startTime + 0.12);

    gain.gain.setValueAtTime(0.15, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.15);
  } catch {
    // Audio might be blocked until gesture
  }
}

/**
 * Harmonious celebratory fanfare / chime when the card is opened
 */
export function playOpenFanfare() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    chords.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.08);

      const noteStart = startTime + index * 0.08;
      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.18, noteStart + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + 1.0);
    });

    // Add a final sparkling bell
    setTimeout(() => {
      try {
        const bellOsc = ctx.createOscillator();
        const bellGain = ctx.createGain();
        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6
        bellGain.gain.setValueAtTime(0.12, ctx.currentTime);
        bellGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

        bellOsc.connect(bellGain);
        bellGain.connect(ctx.destination);
        bellOsc.start();
        bellOsc.stop(ctx.currentTime + 1.3);
      } catch {}
    }, 350);
  } catch {
    // Audio might be blocked
  }
}

/**
 * Subtle bubble pop for UI clicks
 */
export function playClickPop() {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {}
}
