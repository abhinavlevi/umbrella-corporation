// Pure Web Audio API synthesizer for Umbrella Corporation laboratory terminal acoustics

class HiveSoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Subtle mechanical sci-fi chirp for mode/preset switches
  public playSelectChirp() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1180, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.045);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Biometric scanner sweep + "Access Granted" double chime on credential export
  public playAuthorizationScan() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Low-to-high laser scan hum
    const scanOsc = ctx.createOscillator();
    const scanGain = ctx.createGain();
    scanOsc.type = 'sawtooth';
    scanOsc.frequency.setValueAtTime(220, now);
    scanOsc.frequency.linearRampToValueAtTime(640, now + 0.35);
    scanOsc.frequency.linearRampToValueAtTime(310, now + 0.65);

    scanGain.gain.setValueAtTime(0.035, now);
    scanGain.gain.linearRampToValueAtTime(0.06, now + 0.3);
    scanGain.gain.exponentialRampToValueAtTime(0.001, now + 0.68);

    scanOsc.connect(scanGain);
    scanGain.connect(ctx.destination);
    scanOsc.start(now);
    scanOsc.stop(now + 0.7);

    // 2. High-tech dual confirmation chime ("Authorization Confirmed")
    const notes = [1318.5, 1760]; // E6 -> A6
    notes.forEach((freq, idx) => {
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      const startTime = now + 0.45 + idx * 0.11;

      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq, startTime);

      chimeGain.gain.setValueAtTime(0.08, startTime);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(startTime);
      chimeOsc.stop(startTime + 0.24);
    });
  }
}

export const hiveAudio = new HiveSoundEngine();
