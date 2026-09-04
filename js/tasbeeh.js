// Digital Tasbeeh & Dhikr Counter
import { Storage } from './storage.js';

export class TasbeehCounter {
  constructor() {
    this.data = Storage.getTasbeeh();
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
