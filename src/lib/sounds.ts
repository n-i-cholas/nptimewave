// Web Audio API Sound Effects System

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // Play a beep sound with customizable frequency and duration
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Envelope for smoother sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }

  // Correct answer - cheerful ascending chime
  playCorrect() {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);

          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.02);
          gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);

          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.15);
        }, index * 80);
      });
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }

  // Wrong answer - descending tone
  playWrong() {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(300, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.3);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }

  // Achievement unlocked - triumphant fanfare
  playAchievement() {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const notes = [
        { freq: 392, delay: 0 },      // G4
        { freq: 523.25, delay: 100 }, // C5
        { freq: 659.25, delay: 200 }, // E5
        { freq: 783.99, delay: 300 }, // G5
        { freq: 1046.5, delay: 450 }, // C6
      ];

      notes.forEach(({ freq, delay }) => {
        setTimeout(() => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);

          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
          gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);

          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.25);
        }, delay);
      });
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }

  // Quest complete - victory melody
  playQuestComplete() {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const notes = [
        { freq: 523.25, delay: 0, duration: 0.15 },     // C5
        { freq: 587.33, delay: 150, duration: 0.15 },   // D5
        { freq: 659.25, delay: 300, duration: 0.15 },   // E5
        { freq: 783.99, delay: 450, duration: 0.3 },    // G5
        { freq: 659.25, delay: 600, duration: 0.15 },   // E5
        { freq: 783.99, delay: 750, duration: 0.5 },    // G5
      ];

      notes.forEach(({ freq, delay, duration }) => {
        setTimeout(() => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);

          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.02);
          gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + duration);
        }, delay);
      });
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }

  // Click / UI feedback
  playClick() {
    this.playTone(800, 0.05, 'sine', 0.1);
  }

  // Purchase sound
  playPurchase() {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const notes = [
        { freq: 800, delay: 0 },
        { freq: 1000, delay: 50 },
        { freq: 1200, delay: 100 },
      ];

      notes.forEach(({ freq, delay }) => {
        setTimeout(() => {
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);

          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
          gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

          oscillator.start(ctx.currentTime);
          oscillator.stop(ctx.currentTime + 0.1);
        }, delay);
      });
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }
}

export const soundManager = new SoundManager();
