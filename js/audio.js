// Web Audio procedural ambient nature engine & Speech Synthesis pronunciation
class AmbientEngine {
  constructor() {
    this.ctx = null;
    this.currentMode = null;
    this.isPlaying = false;
    this.volume = 0.3;
    this.masterGain = null;
    this.activeNodes = [];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  stop() {
    if (!this.isPlaying) return;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.3);
    }
    setTimeout(() => {
      this.activeNodes.forEach(node => {
        try { node.stop ? node.stop() : node.disconnect(); } catch (e) {}
      });
      this.activeNodes = [];
      this.isPlaying = false;
      this.currentMode = null;
    }, 350);
  }

  play(mode) {
    this.init();
    if (this.isPlaying) {
      this.stop();
      if (this.currentMode === mode) return;
    }

    setTimeout(() => {
      this.currentMode = mode;
      this.isPlaying = true;
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.4);

      if (mode === 'rain') {
        this.createRainSound();
      } else if (mode === 'ocean') {
        this.createOceanWaves();
      } else if (mode === 'wind') {
        this.createDesertBreeze();
      } else if (mode === 'stream') {
        this.createMountainStream();
      }
    }, 100);
  }

  // Pink/White noise generator buffer
  createNoiseBuffer(seconds = 5) {
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  createRainSound() {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(5);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    const highPass = this.ctx.createBiquadFilter();
    highPass.type = 'highpass';
    highPass.frequency.setValueAtTime(300, this.ctx.currentTime);

    noise.connect(highPass);
    highPass.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise, highPass, filter);
  }

  createOceanWaves() {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(6);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);

    // LFO to modulate wave swell
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8 second wave cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(450, this.ctx.currentTime);

    lfo.connect(filter.frequency);
    noise.connect(filter);
    filter.connect(this.masterGain);

    lfo.start();
    noise.start();
    this.activeNodes.push(noise, filter, lfo, lfoGain);
  }

  createDesertBreeze() {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(6);
    noise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(400, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(3, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);

    lfo.connect(bandpass.frequency);
    noise.connect(bandpass);
    bandpass.connect(this.masterGain);

    lfo.start();
    noise.start();
    this.activeNodes.push(noise, bandpass, lfo, lfoGain);
  }

  createMountainStream() {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(5);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise, filter);
  }
}

export const AmbientSound = new AmbientEngine();

// Speech Synthesis & Pronunciation Player
export const PronounceAudio = {
  isSpeaking: false,

  speak(arabicText, onStart = () => {}, onEnd = () => {}) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(arabicText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.82; // dignified, calm, clear tempo
    utterance.pitch = 0.95;

    // Pick best Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang && v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      onEnd();
    };

    window.speechSynthesis.speak(utterance);
  },

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }
};
