/* ============================================
   MISTERIO - Procedural Audio System (ES6 Module)
   ============================================ */

export const AudioSystem = {
  ctx: null,
  masterGain: null,
  musicGain: null,
  sfxGain: null,
  ambientGain: null,
  musicPlaying: false,
  ambientNodes: [],

  init() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.5;
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.3;
    this.musicGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.5;
    this.sfxGain.connect(this.masterGain);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0.15;
    this.ambientGain.connect(this.masterGain);
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  // Dark ambient piano melody
  playMusic() {
    if (!this.ctx || this.musicPlaying) return;
    this.musicPlaying = true;

    const notes = [
      { freq: 220, dur: 2 },    // A3
      { freq: 196, dur: 1.5 },  // G3
      { freq: 174.6, dur: 2 },  // F3
      { freq: 164.8, dur: 1.5 },// E3
      { freq: 146.8, dur: 2 },  // D3
      { freq: 164.8, dur: 1 },  // E3
      { freq: 174.6, dur: 2.5 },// F3
      { freq: 196, dur: 2 },    // G3
    ];

    let time = this.ctx.currentTime;
    const playSequence = () => {
      if (!this.musicPlaying) return;
      notes.forEach(note => {
        this._playPianoNote(note.freq, time, note.dur);
        time += note.dur * 0.8;
      });
      if (this.musicPlaying) {
        setTimeout(playSequence, time * 1000 - this.ctx.currentTime * 1000 + 2000);
      }
    };
    playSequence();
  },

  stopMusic() {
    this.musicPlaying = false;
  },

  _playPianoNote(freq, startTime, duration) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 2;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  },

  // Ambient rain
  playRain() {
    if (!this.ctx) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2000;
    filter.Q.value = 0.5;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.08;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);
    noise.start();

    this.ambientNodes.push({ source: noise, gain });
  },

  // Clock ticking
  playClockTick() {
    if (!this.ctx) return;
    const tick = () => {
      if (!this.musicPlaying) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 800 + Math.random() * 200;
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ambientGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
      setTimeout(tick, 1000);
    };
    tick();
  },

  // SFX
  playClick() { this._playSFX(600, 0.08, 'sine'); },
  playFind() {
    if (!this.ctx) return;
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => this._playSFX(f, 0.15, 'triangle', 0.3), i * 80);
    });
  },
  playError() { this._playSFX(200, 0.12, 'square', 0.2); },
  playUnlock() {
    if (!this.ctx) return;
    [330, 415, 523, 659].forEach((f, i) => {
      setTimeout(() => this._playSFX(f, 0.1, 'sine', 0.4), i * 120);
    });
  },
  playPuzzleSolve() {
    if (!this.ctx) return;
    [523, 659, 784, 1047, 1319].forEach((f, i) => {
      setTimeout(() => this._playSFX(f, 0.12, 'triangle', 0.5), i * 100);
    });
  },
  playDoor() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.9);
  },

  _playSFX(freq, volume, type = 'sine', dur = 0.15) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + dur + 0.05);
  },

  // --- SONS DE TERROR ---
  playJumpScare() {
    if (!this.ctx) return;
    this._playSFX(150, 0.8, 'sawtooth', 0.5);
    setTimeout(() => this._playSFX(80, 0.9, 'square', 0.8), 100);
  },

  playWoodCreak() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(30, this.ctx.currentTime + 1.5);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.6);
  },

  playWhisper() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.5);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);
    noise.start();
  },

  playThunder() {
    if (!this.ctx) return;
    
    const bufferSize = this.ctx.sampleRate * 3.5; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.12; 
      b6 = white * 0.115926;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(130, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 3.0);
    filter.Q.value = 1.3;
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.38, this.ctx.currentTime + 0.15); 
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.3); 
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);
    
    noise.start();
  },

  stopAmbient() {
    this.ambientNodes.forEach(n => {
      try { n.source.stop(); } catch(e) {}
    });
    this.ambientNodes = [];
  }
};
