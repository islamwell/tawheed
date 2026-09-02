// Digital Tasbeeh & Dhikr Counter
import { Storage } from './storage.js';

export class TasbeehCounter {
  constructor(audioCtx = null) {
    this.data = Storage.getTasbeeh();
    this.audioCtx = audioCtx;
  }

  playClickSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = this.audioCtx || new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch (e) {
      // Audio context might require initial user gesture
    }
  }

  increment() {
    this.data.count++;
    this.data.totalToday = (this.data.totalToday || 0) + 1;

    // Haptic feedback if supported on mobile devices
    if ('vibrate' in navigator) {
      try {
        if (this.data.count % this.data.target === 0) {
          navigator.vibrate([40, 60, 40]);
        } else {
          navigator.vibrate(15);
        }
      } catch (e) {}
    }

    this.playClickSound();
    Storage.saveTasbeeh(this.data);
    return { ...this.data, completedCycle: this.data.count % this.data.target === 0 };
  }

  reset() {
    this.data.count = 0;
    Storage.saveTasbeeh(this.data);
    return { ...this.data };
  }

  setTarget(targetNum) {
    this.data.target = Number(targetNum);
    Storage.saveTasbeeh(this.data);
    return { ...this.data };
  }

  setName(nameObj) {
    this.data.nameId = nameObj ? nameObj.id : null;
    this.data.nameArabic = nameObj ? nameObj.arabic : 'سُبْحَانَ اللَّهِ';
    this.data.nameTransliteration = nameObj ? nameObj.transliteration : 'SubhanAllah';
    Storage.saveTasbeeh(this.data);
    return { ...this.data };
  }

  getState() {
    return { ...this.data };
  }
}
