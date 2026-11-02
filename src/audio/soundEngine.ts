/**
 * Procedural Web Audio API sound generator for ORKEN AI cinematic promotional video.
 * Zero external audio dependencies. Generates ambient cyber drones, rhythmic pulses,
 * UI clicks, robot vocal chirps, and cinematic impacts.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private destinationNode: MediaStreamAudioDestinationNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private isPlaying: boolean = false;

  // Active oscillators/intervals
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private droneGain: GainNode | null = null;
  private arpTimer: number | null = null;
  private lastTriggeredAct: number = -1;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.8;

    this.destinationNode = this.ctx.createMediaStreamDestination();

    // Route: masterGain -> analyser -> destination (speakers + recording)
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    this.analyser.connect(this.destinationNode);
  }

  public getMediaStream(): MediaStream | null {
    if (!this.destinationNode) return null;
    return this.destinationNode.stream;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getAnalyserData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(32);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public startSoundtrack() {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.startAmbientDrone();
    this.startCyberArp();
  }

  public stopSoundtrack() {
    this.isPlaying = false;
    this.stopAmbientDrone();
    this.stopCyberArp();
    this.lastTriggeredAct = -1;
  }

  private startAmbientDrone() {
    if (!this.ctx || !this.masterGain) return;
    this.stopAmbientDrone();

    const t = this.ctx.currentTime;
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.001, t);
    this.droneGain.gain.exponentialRampToValueAtTime(0.25, t + 1.5);

    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.setValueAtTime(220, t);
    this.droneFilter.Q.setValueAtTime(4, t);

    // Deep sub foundation (C2 - 65.4Hz)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sawtooth';
    this.droneOsc1.frequency.setValueAtTime(65.4, t);

    // Warm fifth (G2 - 98Hz) with slight detune
    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.setValueAtTime(98.0, t);
    this.droneOsc2.detune.setValueAtTime(6, t);

    this.droneOsc1.connect(this.droneFilter);
    this.droneOsc2.connect(this.droneFilter);
    this.droneFilter.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    this.droneOsc1.start(t);
    this.droneOsc2.start(t);
  }

  private stopAmbientDrone() {
    try {
      this.droneOsc1?.stop();
      this.droneOsc2?.stop();
      this.droneOsc1?.disconnect();
      this.droneOsc2?.disconnect();
      this.droneFilter?.disconnect();
      this.droneGain?.disconnect();
    } catch {
      // Ignored
    }
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneFilter = null;
    this.droneGain = null;
  }

  private startCyberArp() {
    if (!this.ctx || !this.masterGain) return;
    this.stopCyberArp();

    const scale = [130.81, 164.81, 196.0, 246.94, 261.63, 329.63, 392.0, 493.88]; // C pentatonic / minor 7
    let step = 0;

    const tick = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const freq = scale[step % scale.length];
      step++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = step % 4 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.5, now);
      filter.Q.setValueAtTime(6, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.2);

      this.arpTimer = window.setTimeout(tick, 180);
    };

    tick();
  }

  private stopCyberArp() {
    if (this.arpTimer) {
      clearTimeout(this.arpTimer);
      this.arpTimer = null;
    }
  }

  /**
   * Called on video time updates to trigger programmatic chapter transitions and sound events
   */
  public updateTimeline(currentTime: number) {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;
    const actIndex = Math.floor(currentTime / 5.0);

    if (actIndex !== this.lastTriggeredAct && actIndex >= 0 && actIndex <= 5) {
      this.lastTriggeredAct = actIndex;
      this.playChapterSwell(actIndex);
    }
  }

  public playChapterSwell(actIndex: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Cinematic riser sweep
    const sweep = this.ctx.createOscillator();
    const sweepGain = this.ctx.createGain();
    const sweepFilter = this.ctx.createBiquadFilter();

    sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(80, now);
    sweep.frequency.exponentialRampToValueAtTime(450, now + 0.6);

    sweepFilter.type = 'lowpass';
    sweepFilter.frequency.setValueAtTime(200, now);
    sweepFilter.frequency.exponentialRampToValueAtTime(3200, now + 0.6);

    sweepGain.gain.setValueAtTime(0.001, now);
    sweepGain.gain.linearRampToValueAtTime(0.12, now + 0.4);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    sweep.connect(sweepFilter);
    sweepFilter.connect(sweepGain);
    sweepGain.connect(this.masterGain);

    sweep.start(now);
    sweep.stop(now + 0.85);

    // Impact / sub-bass hit
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(140, now + 0.5);
    sub.frequency.exponentialRampToValueAtTime(35, now + 1.2);

    subGain.gain.setValueAtTime(0.22, now + 0.5);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    sub.connect(subGain);
    subGain.connect(this.masterGain);
    sub.start(now + 0.5);
    sub.stop(now + 1.45);

    // If Act 6 (Finale: Intelligence Beyond Limits) - Play grand triumphant chord & shimmer
    if (actIndex === 5) {
      this.playGrandFinaleChords();
    }
  }

  public playGrandFinaleChords() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const chord = [130.81, 196.0, 261.63, 329.63, 392.0, 523.25, 659.25]; // Rich Cmaj9 aura

    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.2);

      const vol = 0.08 / (idx + 1);
      gain.gain.setValueAtTime(0.001, now + 0.2);
      gain.gain.linearRampToValueAtTime(vol, now + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + 0.2);
      osc.stop(now + 4.8);
    });
  }

  public playRobotVoicePing() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const notes = [587.33, 880.0, 1174.66]; // D5, A5, D6
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.06, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.22);
    });
  }

  public playUiClick() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const soundEngine = new SoundEngine();
