/* ═══════════════════════════════════════════════════════════
   ModiLander — Game Engine
   Pac-Man style maze game with BFS ghost AI
   ═══════════════════════════════════════════════════════════ */

// ── Maze Layout ──────────────────────────────────────────────
// 0 = dot, 1 = wall, 2 = empty, 3 = power pellet, 4 = ghost house center
const MAZE_TEMPLATE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,3,1,1,0,1,2,1,0,1,1,3,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,2,1,0,1,1,0,1],
  [1,0,0,0,0,2,2,2,0,0,0,0,1],
  [1,1,1,1,0,1,4,1,0,1,1,1,1],
  [1,0,0,0,0,2,2,2,0,0,0,0,1],
  [1,0,1,1,0,1,2,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,3,1,1,0,1,0,1,0,1,1,3,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let COLS = 13;
let ROWS = 13;
const TILE_SIZE = 60;

// ── Characters ───────────────────────────────────────────────
const CHARACTERS = {
  modi: {
    name: 'MODI JI',
    title: 'The Great Pellet Collector',
    tagline: 'Wah Modiji Wah!',
    emoji: '🪷',
    ghostEmojis: ['✋', '🌹', '🔵'],
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    accentRgb: '245,158,11',
    quote: 'Ek baar commit kar liya, toh phir khud ki bhi nahi sunta.',
    stats: [{l:'Promise Speed',v:99},{l:'Dot Collection',v:95},{l:'Ghost Evasion',v:78}],
    lifeIcon: '🪷',
    pelletIcon: '⚡',
    playerImg: 'assets/modi1.png',
    heroImg: 'assets/modi2.png',
    showcaseImages: ['assets/modi2.png', 'assets/modi1.png', 'assets/modi3.png'],
    ghostImages: ['assets/rahul1.png', 'assets/sp.png', 'assets/bsp.png'],
    lossMessage: 'Acche Din will come… next game.'
  },
  rahul: {
    name: 'RAHUL G',
    title: 'The Maze Philosopher',
    tagline: 'Maja Aaya!',
    emoji: '✋',
    ghostEmojis: ['🪷', '🌸', '🟠'],
    accent: '#0ea5e9',
    accentLight: '#38bdf8',
    accentRgb: '14,165,233',
    quote: 'Poverty is just a state of mind… unlike this maze, which is very real.',
    stats: [{l:'Yatra Distance',v:88},{l:'Mic Drops',v:72},{l:'Chaos Theory',v:91}],
    lifeIcon: '✋',
    pelletIcon: '🌟',
    playerImg: 'assets/rahul1.png',
    heroImg: 'assets/rahul2.png',
    showcaseImages: ['assets/rahul2.png', 'assets/rahul1.png', 'assets/rahul3.png'],
    ghostImages: ['assets/modi1.png', 'assets/sp.png', 'assets/bsp.png'],
    lossMessage: 'Better luck in the next election!'
  }
};

// ── Difficulty ───────────────────────────────────────────────
const DIFFICULTIES = {
  easy: {
    label: 'Easy',
    subtitle: 'Slow Ghosts',
    speed: 550,
    ghosts: 2,
    smartness: 0.12,
    powerDuration: 60,
    color: '#22c55e',
    playerSpawn: { x: 6, y: 10 },
    ghostSpawns: [
      {x:5, y:5, dir:'LEFT'},
      {x:6, y:5, dir:'UP'},
      {x:7, y:5, dir:'RIGHT'},
      {x:5, y:7, dir:'DOWN'},
    ],
    maze: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,1],
      [1,3,1,1,0,1,2,1,0,1,1,3,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,2,1,0,1,1,0,1],
      [1,0,0,0,0,2,2,2,0,0,0,0,1],
      [1,1,1,1,0,1,4,1,0,1,1,1,1],
      [1,0,0,0,0,2,2,2,0,0,0,0,1],
      [1,0,1,1,0,1,2,1,0,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,3,1,1,0,1,0,1,0,1,1,3,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
  },
  medium: {
    label: 'Medium',
    subtitle: 'Classic Pace',
    speed: 380,
    ghosts: 3,
    smartness: 0.55,
    powerDuration: 35,
    color: '#f97316',
    playerSpawn: { x: 7, y: 13 },
    ghostSpawns: [
      { x: 6, y: 7, dir: 'LEFT' },
      { x: 7, y: 7, dir: 'UP' },
      { x: 8, y: 7, dir: 'RIGHT' },
      { x: 7, y: 6, dir: 'DOWN' }
    ],
    maze: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
      [1,3,1,1,0,1,0,2,0,1,0,1,1,3,1],
      [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
      [1,0,1,1,0,1,1,1,1,1,0,1,1,0,1],
      [1,0,0,0,0,0,2,2,2,0,0,0,0,0,1],
      [1,1,1,1,0,1,2,4,2,1,0,1,1,1,1],
      [1,2,2,2,0,1,2,2,2,1,0,2,2,2,1],
      [1,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
      [1,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
      [1,3,0,1,1,1,0,1,0,1,1,1,0,3,1],
      [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
  },
  hard: {
    label: 'Hard',
    subtitle: 'Full Send',
    speed: 260,
    ghosts: 4,
    smartness: 0.92,
    powerDuration: 20,
    color: '#ef4444',
    playerSpawn: { x: 8, y: 15 },
    ghostSpawns: [
      { x: 7, y: 9, dir: 'LEFT' },
      { x: 8, y: 9, dir: 'UP' },
      { x: 9, y: 9, dir: 'RIGHT' },
      { x: 8, y: 8, dir: 'DOWN' }
    ],
    maze: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,3,1,1,0,1,1,0,1,0,1,1,0,1,1,3,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1],
      [1,0,1,0,0,0,0,0,2,0,0,0,0,0,1,0,1],
      [1,0,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,1,2,2,2,2,2,2,2,1,0,0,0,1],
      [1,1,1,0,1,2,1,2,4,2,1,2,1,0,1,1,1],
      [1,0,0,0,1,2,2,2,2,2,2,2,1,0,0,0,1],
      [1,0,1,0,1,1,1,1,0,1,1,1,1,0,1,0,1],
      [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
      [1,0,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,3,1,1,0,1,1,1,0,1,1,1,0,1,1,3,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
  }
};

// ── News Ticker ──────────────────────────────────────────────
const NEWS_ITEMS = [
  "BREAKING — Masterstroke! Leader successfully escapes all questions by pretending they are maze walls.",
  "LIVE — Visionary finds brilliant way to ignore poverty: focusing entirely on eating dots.",
  "EXCLUSIVE — 56-Inch chest perfectly designed to squeeze through narrow corridors while evading press.",
  "FLASH — Youth Icon re-launches himself for the 47th time after losing a life in level 2.",
  "NEW POLICY — Eating all dots declared critical national interest; public told to fast.",
  "UPDATE — Avoiding media questions added as a new high-speed evasion mechanic.",
  "SPORTS — Annual 'Chase Voters Through Maze' championship officially inaugurated.",
  "ALERT — Opposition blames ghosts for poor performance; ruling party taxes the dots."
];

// ═══════════════════════════════════════════════════════════
// AUDIO ENGINE (Web Audio API)
// ═══════════════════════════════════════════════════════════

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgPlaying = false;
    this.menuPlaying = false;

    // Load actual audio files
    this.menuMusic = new Audio('assets/music.mp3');
    this.menuMusic.loop = true;
    this.menuMusic.volume = 0.4;

    this.bgMusic = new Audio('assets/bg_music.mp3');
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.35;

    this.modiPower = new Audio('assets/wah-modiji-wah.mp3');
    this.modiPower.volume = 0.8;

    this.rahulPower = new Audio('assets/maja-aaya.mp3');
    this.rahulPower.volume = 0.8;

    this.modiDeath = new Audio('assets/khatam.mp3');
    this.modiDeath.volume = 0.8;

    this.rahulDeath = new Audio('assets/laure-na-bhujjam.mp3');
    this.rahulDeath.volume = 0.8;

    this.bossLaugh = new Audio('assets/boss_laugh.webm');
    this.bossLaugh.volume = 0.95;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a short tone (still useful for dots, UI clicks, etc.)
  playTone(freq = 440, type = 'sine', vol = 0.07, dur = 0.09) {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + dur);
    } catch(e) {}
  }

  playDotEat() {
    this.playTone(600, 'sine', 0.06, 0.06);
    setTimeout(() => this.playTone(800, 'sine', 0.04, 0.04), 30);
  }

  playPowerUp(character) {
    if (this.muted) return;
    this.init();
    try {
      if (character === 'modi') {
        this.modiPower.currentTime = 0;
        this.modiPower.play().catch(e => console.log(e));
      } else {
        this.rahulPower.currentTime = 0;
        this.rahulPower.play().catch(e => console.log(e));
      }
    } catch(e) {}
  }

  playDeath(character) {
    if (this.muted) return;
    this.init();
    try {
      if (character === 'modi') {
        this.modiDeath.currentTime = 0;
        this.modiDeath.play().catch(e => console.log(e));
      } else {
        this.rahulDeath.currentTime = 0;
        this.rahulDeath.play().catch(e => console.log(e));
      }
    } catch(e) {}
  }

  playGhostEat() {
    this.playTone(200, 'sawtooth', 0.08, 0.06);
    setTimeout(() => this.playTone(400, 'sawtooth', 0.06, 0.06), 50);
    setTimeout(() => this.playTone(800, 'sawtooth', 0.05, 0.1), 100);
  }

  playWin() {
    const melody = [523, 659, 784, 1047];
    melody.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.06, 0.2), i * 150);
    });
  }

  playClick() {
    this.playTone(700, 'sine', 0.05, 0.09);
  }

  playStart() {
    this.playTone(900, 'square', 0.07, 0.12);
  }

  startMenuMusic() {
    if (this.muted || this.menuPlaying) return;
    this.init();
    this.stopBgMusic();
    this.menuPlaying = true;
    try {
      this.menuMusic.currentTime = 0;
      this.menuMusic.play().catch(e => console.log(e));
    } catch(e) {}
  }

  stopMenuMusic() {
    this.menuPlaying = false;
    try {
      this.menuMusic.pause();
    } catch(e) {}
  }

  startBgMusic() {
    if (this.muted || this.bgPlaying) return;
    this.init();
    this.stopMenuMusic();
    this.bgPlaying = true;
    try {
      this.bgMusic.currentTime = 0;
      this.bgMusic.play().catch(e => console.log(e));
    } catch(e) {}
  }

  stopBgMusic() {
    this.bgPlaying = false;
    try {
      this.bgMusic.pause();
    } catch(e) {}
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      try {
        this.menuMusic.pause();
        this.bgMusic.pause();
        this.modiPower.pause();
        this.rahulPower.pause();
        this.modiDeath.pause();
        this.rahulDeath.pause();
        this.bossLaugh.pause();
      } catch(e) {}
      this.menuPlaying = false;
      this.bgPlaying = false;
    } else {
      this.init();
      if (state.screen === 'start') {
        this.startMenuMusic();
      } else if (state.screen === 'game' && state.isGameRunning) {
        this.startBgMusic();
      }
    }
    return this.muted;
  }
}

// ═══════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════

const audio = new AudioEngine();

let state = {
  screen: 'start', // 'start' | 'game' | 'result'
  character: 'modi',
  difficulty: 'easy',
  
  // Game state
  maze: null,
  playerPos: { x: 6, y: 10 },
  playerDir: null,
  playerNextDir: null,
  ghosts: [],
  score: 0,
  lives: 3,
  highScore: parseInt(localStorage.getItem('modilander_highScore') || '0'),
  isPowerMode: false,
  powerTimer: 0,
  isReady: true,
  isGameRunning: false,
  gameInterval: null,
  hasSwiped: false,
  isFullscreen: false,
  boardScale: 1,
  
  // Secret Boss encounter flags
  bossTriggered: false,
  bossActive: false,
  bossPausedAdjacent: false,
};

// ═══════════════════════════════════════════════════════════
// DOM REFERENCES
// ═══════════════════════════════════════════════════════════

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ═══════════════════════════════════════════════════════════
// SCREEN MANAGEMENT
// ═══════════════════════════════════════════════════════════

function showScreen(screen) {
  state.screen = screen;
  $$('.screen').forEach(s => s.classList.add('hidden'));
  $(`#screen-${screen}`).classList.remove('hidden');
  window.scrollTo(0, 0); // Always reset window scroll position when switching screens
  
  if (screen === 'start') {
    document.body.removeAttribute('data-character');
    updateStartPage();
  }
}

// ═══════════════════════════════════════════════════════════
// START PAGE
// ═══════════════════════════════════════════════════════════

let tickerIndex = 0;
let tickerInterval = null;

let logoCycleInterval = null;
let logoCycleIndex = 0;

const MUTE_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;

const UNMUTE_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;

function updateMuteIcons() {
  const startMute = $('#btn-mute-start');
  const gameMute = $('#btn-mute-game');
  
  const icon = audio.muted ? MUTE_SVG : UNMUTE_SVG;
  
  if (startMute) startMute.innerHTML = icon;
  if (gameMute) gameMute.innerHTML = icon;
}

function startLogoCycle() {
  if (logoCycleInterval) clearInterval(logoCycleInterval);
  
  logoCycleInterval = setInterval(() => {
    const char = CHARACTERS[state.character];
    const heroAvatar = $('#hero-avatar');
    if (!heroAvatar) return;
    
    const images = char.showcaseImages || [char.playerImg];
      
    logoCycleIndex = (logoCycleIndex + 1) % images.length;
    
    const imgEl = heroAvatar.querySelector('.hero-showcase-img');
    if (imgEl) {
      imgEl.style.opacity = '0';
      setTimeout(() => {
        imgEl.src = images[logoCycleIndex];
        imgEl.style.opacity = '1';
      }, 350);
    }
  }, 3500);
}

function initStartPage() {
  renderStartPage();
  startTicker();
  updateStartPage();
  startLogoCycle();
}

function renderStartPage() {
  const el = $('#screen-start');
  el.innerHTML = `
    <div class="bg-effects">
      <div class="blob-1"></div>
      <div class="blob-2"></div>
      <div class="dot-grid"></div>
      <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:1;">
        <line x1="0%" y1="10%" x2="60%" y2="100%" stroke="var(--accent)" stroke-width="1" stroke-opacity="0.18"></line>
        <line x1="15%" y1="0%" x2="85%" y2="100%" stroke="var(--accent)" stroke-width="0.5" stroke-opacity="0.1"></line>
        <line x1="100%" y1="0%" x2="40%" y2="100%" stroke="var(--accent)" stroke-width="0.8" stroke-opacity="0.14"></line>
        <line x1="0" y1="38%" x2="100%" y2="34%" stroke="url(#goldLine)" stroke-width="1" stroke-opacity="0.35"></line>
        <line x1="0" y1="72%" x2="100%" y2="68%" stroke="url(#silverLine)" stroke-width="0.6" stroke-opacity="0.2"></line>
        <defs>
          <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="transparent"></stop>
            <stop offset="25%" stop-color="#f59e0b" stop-opacity="1"></stop>
            <stop offset="75%" stop-color="#fbbf24" stop-opacity="1"></stop>
            <stop offset="100%" stop-color="transparent"></stop>
          </linearGradient>
          <linearGradient id="silverLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="transparent"></stop>
            <stop offset="30%" stop-color="#94a3b8" stop-opacity="1"></stop>
            <stop offset="70%" stop-color="#cbd5e1" stop-opacity="1"></stop>
            <stop offset="100%" stop-color="transparent"></stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
    
    <header class="header">
      <div class="header-logo">
        <div class="logo-icon" id="logo-icon"></div>
        <div class="logo-text">
          <span class="logo-title">MODI_LANDER</span>
          <span class="logo-sub">by Rahees</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="header-btn glass" id="btn-mute-start" aria-label="Toggle sound">${audio.muted ? MUTE_SVG : UNMUTE_SVG}</button>
        <button class="header-btn glass" id="btn-share" aria-label="Share">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
        </button>
      </div>
    </header>
    
    <main class="start-main">
      <!-- Left/Top Column: Immersive Showcase -->
      <div class="start-left-col">
        <div class="hero-showcase-container">
          <div class="absolute bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-3/4 rounded-full blur-[100px] transition-all duration-1000 opacity-60" id="hero-glow"></div>
          <div class="hero-avatar" id="hero-avatar"></div>
          <div class="hero-showcase-overlay">
            <div class="hero-showcase-info">
              <div class="hero-showcase-playing">
                <div class="dot"></div>
                <span>Playing as</span>
              </div>
              <h2 class="hero-showcase-name" id="hero-name">MODI JI</h2>
              <p class="hero-showcase-title" id="hero-title">The Great Pellet Collector</p>
            </div>
            <div class="hero-showcase-tagline" id="hero-tagline-wrap">
              <span id="hero-tagline">"WAH MODIJI WAH!"</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right/Bottom Column: Content & Actions -->
      <div class="start-right-col">
        <!-- News Ticker -->
        <div class="news-ticker">
          <div class="ticker-badge">
            <span class="ticker-dot"></span>
            <span class="ticker-label">Live</span>
          </div>
          <p class="ticker-text" id="ticker-text">${NEWS_ITEMS[0]}</p>
        </div>
        
        <!-- Title -->
        <div class="game-title">
          <div class="title-line title-line-1">MODI</div>
          <div class="title-line title-line-2" id="title-accent">LANDER</div>
          <p class="subtitle">INDIA'S MOST SATIRICAL MAZE GAME</p>
        </div>
        
        <!-- Character Selection -->
        <div style="width:100%">
          <div class="section-label">Choose Your Neta</div>
          <div class="char-grid" id="char-grid"></div>
        </div>
        
        <!-- Quote -->
        <div class="quote-card glass" id="quote-card">
          <span class="quote-mark">"</span>
          <p class="quote-text" id="quote-text"></p>
        </div>
        
        <!-- Difficulty -->
        <div style="width:100%">
          <div class="section-label" style="font-size:8px;letter-spacing:4px;color:rgba(255,255,255,0.2)">Difficulty Level</div>
          <div class="diff-grid" id="diff-grid"></div>
        </div>
        
        <!-- Start Button -->
        <button class="start-btn blob-btn" id="btn-start">
          <span class="btn-text">Start Election</span>
          <span class="btn-sub" id="start-btn-sub">Easy — Slow Ghosts</span>
          <span class="blob-btn__inner">
            <span class="blob-btn__blobs">
              <span class="blob-btn__blob"></span>
              <span class="blob-btn__blob"></span>
              <span class="blob-btn__blob"></span>
              <span class="blob-btn__blob"></span>
            </span>
          </span>
        </button>
        
        <p class="controls-hint">Arrow Keys · WASD · D-Pad on mobile</p>
        
        <!-- Stats Bar -->
        <div class="stats-bar glass" id="stats-bar">
          <div class="stat-cell">
            <span class="stat-cell-label">Best Score</span>
            <span class="stat-cell-value" id="home-highscore" style="color:var(--accent)">000000</span>
          </div>
          <div class="stat-cell">
            <span class="stat-cell-label">Promises Kept</span>
            <span class="stat-cell-value" style="color:#ef4444">😭</span>
          </div>
          <div class="stat-cell">
            <span class="stat-cell-label">Terms Left</span>
            <span class="stat-cell-value" style="color:rgba(255,255,255,0.4)">∞</span>
          </div>
        </div>

        <!-- Premium Creator Credits Footer -->
        <div style="display:flex; flex-direction:column; align-items:center; gap:8px; margin-top:16px;">
          <div style="height:1px; width:100%; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent); margin-bottom:12px;"></div>
          <div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:4px;">
            <div style="height:1px; width:16px; background:linear-gradient(90deg, transparent, var(--accent) 50%)"></div>
            <span style="font-size:7px; font-weight:900; color:rgba(255,255,255,0.15); text-transform:uppercase; letter-spacing:4px;">Crafted By</span>
            <div style="height:1px; width:16px; background:linear-gradient(270deg, transparent, var(--accent) 50%)"></div>
          </div>
          <div class="glass hover:bg-white/5 transition-all" style="display:flex; align-items:center; gap:16px; border-radius:16px; padding:12px 18px; border:1px solid rgba(255,255,255,0.05); box-shadow:0 8px 32px rgba(0,0,0,0.3)">
            <div style="width:3px; height:24px; border-radius:999px; background:linear-gradient(180deg, var(--accent), transparent); opacity:0.8;"></div>
            <div style="display:flex; flex-direction:column; gap:2px; text-align:left;">
              <span style="font-size:12px; font-weight:800; letter-spacing:1px; color:rgba(255,255,255,0.9)">RAHEES</span>
              <span style="font-size:8px; color:rgba(255,255,255,0.4)">@mohamdrahees__</span>
            </div>
            <a href="https://www.instagram.com/mohamdrahees__?igsh=N2k0dXM0dXQyNjd5" target="_blank" rel="noopener noreferrer" style="width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); transition:all 0.2s;" class="credit-link-btn" title="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:rgba(255,255,255,0.8)"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
          <p class="footer-satire" style="font-size:6px; color:rgba(255,255,255,0.1); margin-top:8px; line-height:1.5; text-align:center;">
            Pure satire & entertainment · Not affiliated with any political party
          </p>
        </div>
      </div>
    </main>
  `;
  
  // Render character cards
  const charGrid = $('#char-grid');
  charGrid.innerHTML = Object.entries(CHARACTERS).map(([id, char]) => `
    <button class="char-card glass ${state.character === id ? 'active glass-panel' : ''}" data-char="${id}">
      <div class="top-line" style="background:linear-gradient(90deg,transparent,${char.accent}80,transparent)"></div>
      <div class="char-avatar-wrap" style="${state.character === id ? `background:${char.accent}15;border:1px solid ${char.accent}30` : ''}">
        <img src="${char.playerImg}" class="char-avatar-img" alt="${char.name}">
      </div>
      <div class="char-name">${char.name}</div>
      <div class="char-title">${char.title}</div>
      ${state.character === id ? `
        <div class="char-stats">
          ${char.stats.map(s => `
            <div class="stat-row">
              <div class="stat-header">
                <span class="stat-label">${s.l}</span>
                <span class="stat-value" style="color:${char.accent}">${s.v}</span>
              </div>
              <div class="stat-bar">
                <div class="stat-bar-fill" style="width:${s.v}%;background:linear-gradient(90deg,${char.accent}70,${char.accent})"></div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </button>
  `).join('');
  
  // Render difficulty buttons
  const diffGrid = $('#diff-grid');
  diffGrid.innerHTML = Object.entries(DIFFICULTIES).map(([id, diff]) => `
    <button class="diff-btn glass ${state.difficulty === id ? 'active glass-panel' : ''}" data-diff="${id}"
            style="${state.difficulty === id ? `border:1px solid ${diff.color}40` : ''}">
      <span class="diff-label" style="${state.difficulty === id ? `color:${diff.color}` : ''}">${diff.label}</span>
      <span class="diff-subtitle" style="${state.difficulty === id ? `color:${diff.color}` : ''}">${diff.subtitle}</span>
    </button>
  `).join('');
  
  // Event listeners
  charGrid.addEventListener('click', (e) => {
    const card = e.target.closest('[data-char]');
    if (card) {
      audio.init();
      audio.startMenuMusic();
      audio.playPowerUp(card.dataset.char);
      state.character = card.dataset.char;
      renderStartPage();
      updateStartPage();
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Smoothly scroll to top so the newly selected neta showcase flows into view!
    }
  });
  
  diffGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-diff]');
    if (btn) {
      audio.init();
      audio.startMenuMusic();
      audio.playTone(600, 'sine', 0.04, 0.08);
      state.difficulty = btn.dataset.diff;
      renderStartPage();
      updateStartPage();
    }
  });
  
  $('#btn-start').addEventListener('click', () => {
    audio.init();
    audio.playStart();
    startGame();
  });
  
  $('#btn-mute-start').addEventListener('click', () => {
    audio.init();
    audio.toggleMute();
    updateMuteIcons();
  });
  
  $('#btn-share').addEventListener('click', async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MODI_LANDER',
          text: "India's most sarcastic maze game!",
          url: window.location.href
        });
      } catch(e) {}
    } else {
      // Fallback: copy URL
      navigator.clipboard?.writeText(window.location.href);
    }
  });
}

function updateStartPage() {
  const char = CHARACTERS[state.character];
  const diff = DIFFICULTIES[state.difficulty];
  
  // Update header logo
  const logoIcon = $('#logo-icon');
  if (logoIcon) {
    logoIcon.innerHTML = `<img src="${char.playerImg}" class="logo-avatar-img" alt="Logo">`;
  }

  // Update hero
  const heroAvatar = $('#hero-avatar');
  const heroGlow = $('#hero-glow');
  const heroName = $('#hero-name');
  const heroTitle = $('#hero-title');
  const speechBubble = $('#hero-tagline');
  const speechBubbleWrap = $('#hero-tagline-wrap');
  
  if (heroAvatar) {
    const images = char.showcaseImages || [char.playerImg];
    heroAvatar.innerHTML = `<img src="${images[0]}" class="hero-showcase-img" alt="${char.name}">`;
    logoCycleIndex = 0;
  }
  if (heroGlow) heroGlow.style.background = `radial-gradient(circle, ${char.accent}40 0%, transparent 60%)`;
  if (heroName) heroName.textContent = char.name;
  if (heroTitle) heroTitle.textContent = char.title;
  
  if (speechBubble) {
    speechBubble.textContent = `"${char.tagline}"`;
  }
  if (speechBubbleWrap) {
    speechBubbleWrap.style.borderColor = `rgba(${char.accentRgb}, 0.2)`;
    speechBubbleWrap.style.background = `rgba(${char.accentRgb}, 0.08)`;
    speechBubbleWrap.style.boxShadow = `0 4px 15px rgba(${char.accentRgb}, 0.15)`;
  }
  
  // Update accent colors
  const titleAccent = $('#title-accent');
  if (titleAccent) titleAccent.style.color = char.accent;
  
  // Update quote
  const quoteText = $('#quote-text');
  if (quoteText) quoteText.textContent = char.quote;
  
  // Update start button
  const startSub = $('#start-btn-sub');
  if (startSub) startSub.textContent = `${diff.label} — ${diff.subtitle}`;
  
  const startBtn = $('#btn-start');
  if (startBtn) {
    // Background is dynamically handled by the gooey blob elements using CSS variables
    startBtn.style.background = 'transparent';
  }
  
  // Update high score
  const hs = $('#home-highscore');
  if (hs) hs.textContent = state.highScore.toString().padStart(6, '0');
  
  // Update bg effects
  const blob1 = $('.blob-1');
  const blob2 = $('.blob-2');
  if (blob1) blob1.style.background = `radial-gradient(circle, ${char.accent}33 0%, transparent 70%)`;
  if (blob2) blob2.style.background = `radial-gradient(circle, ${char.accent}22 0%, transparent 70%)`;
  
  // Update CSS variable
  document.documentElement.style.setProperty('--accent', char.accent);
  document.documentElement.style.setProperty('--accent-light', char.accentLight);
  document.documentElement.style.setProperty('--accent-rgb', char.accentRgb);
}

function startTicker() {
  if (tickerInterval) clearInterval(tickerInterval);
  tickerInterval = setInterval(() => {
    const el = $('#ticker-text');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(() => {
      tickerIndex = (tickerIndex + 1) % NEWS_ITEMS.length;
      el.textContent = NEWS_ITEMS[tickerIndex];
      el.style.opacity = '1';
    }, 300);
  }, 3500);
}

// ═══════════════════════════════════════════════════════════
// GAME PAGE
// ═══════════════════════════════════════════════════════════

function cloneMaze() {
  const diff = DIFFICULTIES[state.difficulty];
  return diff.maze.map(r => [...r]);
}

function getInitialGhosts(count) {
  const diff = DIFFICULTIES[state.difficulty];
  return diff.ghostSpawns.slice(0, count).map(g => ({...g}));
}

function startGame() {
  if (logoCycleInterval) {
    clearInterval(logoCycleInterval);
    logoCycleInterval = null;
  }
  const char = CHARACTERS[state.character];
  const diff = DIFFICULTIES[state.difficulty];
  
  // Set character and difficulty data attributes for custom styling!
  document.body.setAttribute('data-character', state.character);
  document.body.setAttribute('data-difficulty', state.difficulty);
  
  // Reset game state
  state.maze = cloneMaze();
  COLS = state.maze[0].length;
  ROWS = state.maze.length;
  state.playerPos = { ...diff.playerSpawn };
  state.playerDir = null;
  state.playerNextDir = null;
  state.ghosts = getInitialGhosts(diff.ghosts);
  state.score = 0;
  state.lives = 3;
  state.isPowerMode = false;
  state.powerTimer = 0;
  state.isReady = true;
  state.hasSwiped = false;
  state.isGameRunning = true;
  state.bossTriggered = false;
  state.bossActive = false;
  state.bossPausedAdjacent = false;
  $('#secret-boss')?.remove();
  
  // Render game screen
  renderGameScreen();
  showScreen('game');
  
  // Calculate scale
  requestAnimationFrame(() => {
    calculateBoardScale();
    renderMaze();
    renderEntities();
  });
  
  // Start background music
  audio.init();
  audio.startBgMusic();
  
  // Ready phase
  showReady();
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Start game loop after ready
  setTimeout(() => {
    state.isReady = false;
    hideReady();
    state.gameInterval = setInterval(gameTick, diff.speed);
  }, 2000);
}

function renderGameScreen() {
  const char = CHARACTERS[state.character];
  const el = $('#screen-game');
  
  el.innerHTML = `
    <div class="bg-effects">
      <div class="blob-1" style="background:radial-gradient(circle,rgba(${char.accentRgb},0.05) 0%,transparent 70%);width:60%;height:30%;top:0;left:50%;transform:translateX(-50%)"></div>
      <div class="blob-2" style="background:radial-gradient(circle,rgba(${char.accentRgb},0.04) 0%,transparent 70%);width:40%;height:30%;bottom:0;right:0"></div>
      <div class="dot-grid"></div>
      <div class="bg-lines">
        <div class="bg-line line-left-1"></div>
        <div class="bg-line line-left-2"></div>
        <div class="bg-line line-right-1"></div>
        <div class="bg-line line-right-2"></div>
      </div>
    </div>
    
    <div id="power-overlay" class="power-overlay hidden"></div>
    
    <!-- Top Bar -->
    <div class="game-topbar">
      <div class="game-topbar-inner glass-pill">
        <button class="topbar-menu" id="btn-back-menu">
          ← <span>MENU</span>
        </button>
        <div class="topbar-center">
          <div class="accent-dot" style="background:${char.accent}"></div>
          <span class="game-name">MODI_LANDER</span>
        </div>
        <div class="topbar-actions">
          <button class="topbar-btn" id="btn-fullscreen" aria-label="Fullscreen">⛶</button>
          <button class="topbar-btn" id="btn-mute-game" aria-label="Toggle sound">${audio.muted ? MUTE_SVG : UNMUTE_SVG}</button>
        </div>
      </div>
    </div>
    
    <!-- HUD -->
    <div class="game-hud">
      <div class="hud-inner glass-pill">
        <div class="hud-section">
          <span class="hud-label">Promises</span>
          <span class="hud-value" id="hud-score" style="color:${char.accent}">${state.score.toString().padStart(6,'0')}</span>
        </div>
        <div class="hud-section center">
          <span class="hud-label">Terms Left</span>
          <div class="hud-lives" id="hud-lives">
            ${[0,1,2].map(i => `<span class="hud-life ${i >= state.lives ? 'lost' : ''}">${char.lifeIcon}</span>`).join('')}
          </div>
        </div>
        <div class="hud-section right">
          <span class="hud-label">Best</span>
          <span class="hud-value" id="hud-highscore" style="color:rgba(255,255,255,0.9)">${state.highScore.toString().padStart(6,'0')}</span>
        </div>
      </div>
    </div>
    
    <!-- Power Banner -->
    <div id="power-banner" class="power-banner hidden">
      <div class="power-banner-inner glass">
        <div class="power-banner-bg"></div>
        <div class="power-banner-content">
          <div class="power-dot"></div>
          <span class="power-text">${char.name.split(' ')[0]} POWER MODE ON!</span>
          <div class="power-dot"></div>
        </div>
      </div>
    </div>
    
    <!-- Maze -->
    <div class="maze-wrap" id="maze-wrap">
      <div class="maze-container" id="maze-container" style="border-color:var(--accent)">
        <div class="maze-grid-overlay" style="background-image:linear-gradient(rgba(var(--accent-rgb),0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--accent-rgb),0.06) 1px,transparent 1px);background-size:60px 60px"></div>
        <div class="maze-grid" id="maze-grid"></div>
        
        <!-- Player -->
        <div class="player" id="player">
          <div class="player-glow" style="background:rgba(var(--accent-rgb),0.6)"></div>
          <div class="player-icon" style="border:2px solid var(--accent);box-shadow:0 0 20px rgba(var(--accent-rgb),0.6),0 0 40px rgba(var(--accent-rgb),0.4);filter:brightness(1.15)">
            <img src="${char.playerImg}" class="character-img" alt="${char.name}">
          </div>
        </div>
        
        <!-- Ghosts container -->
        <div id="ghosts-container"></div>
        
        <!-- Ready overlay -->
        <div class="ready-overlay" id="ready-overlay">
          <div class="ready-avatar" style="background:rgba(var(--accent-rgb),0.15);border:2px solid var(--accent)">
            <img src="${char.playerImg}" class="ready-avatar-img" alt="${char.name}">
          </div>
          <span class="ready-text" style="text-shadow:0 0 40px rgba(var(--accent-rgb),0.6),0 4px 12px rgba(0,0,0,0.5)">GET READY!</span>
          <span class="ready-sub">${char.tagline}</span>
        </div>
        
        <!-- Swipe hint (mobile) -->
        <div class="swipe-hint" id="swipe-hint">
          <div class="swipe-content">
            <span class="swipe-finger">👆</span>
            <span class="swipe-text" style="text-shadow:0 0 20px ${char.accent}">Swipe anywhere<br>to move</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- D-Pad -->
    <div class="dpad-wrap" id="dpad-wrap">
      <div class="dpad">
        <button class="dpad-btn dpad-up" data-dir="UP">▲</button>
        <button class="dpad-btn dpad-left" data-dir="LEFT">◀</button>
        <div class="dpad-center"></div>
        <button class="dpad-btn dpad-right" data-dir="RIGHT">▶</button>
        <button class="dpad-btn dpad-down" data-dir="DOWN">▼</button>
      </div>
    </div>
  `;
  
  // Render ghost elements
  renderGhostElements();
  
  // Event listeners
  $('#btn-back-menu').addEventListener('click', exitToMenu);
  
  $('#btn-fullscreen').addEventListener('click', toggleFullscreen);
  
  $('#btn-mute-game').addEventListener('click', () => {
    audio.init();
    audio.toggleMute();
    updateMuteIcons();
  });
  
  // D-Pad
  $$('[data-dir]').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      setDirection(btn.dataset.dir);
    });
  });
  
  // Keyboard
  window.onkeydown = (e) => {
    const map = {
      ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
      w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
    };
    if (map[e.key]) {
      e.preventDefault();
      state.hasSwiped = true;
      hideSwipeHint();
      setDirection(map[e.key]);
    }
  };
  
  // Touch/Swipe
  let touchStart = null;
  const mazeWrap = $('#maze-wrap');
  
  document.addEventListener('touchstart', (e) => {
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    if (!touchStart) return;
    const dx = e.touches[0].clientX - touchStart.x;
    const dy = e.touches[0].clientY - touchStart.y;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    if (Math.max(ax, ay) > 35) {
      if (!state.hasSwiped) {
        state.hasSwiped = true;
        hideSwipeHint();
      }
      if (ax > ay) {
        setDirection(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        setDirection(dy > 0 ? 'DOWN' : 'UP');
      }
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });
  
  document.addEventListener('touchend', () => {
    touchStart = null;
  }, { passive: true });
  
  // Resize handler
  window.onresize = () => {
    if (state.screen === 'game') {
      calculateBoardScale();
    }
  };
}

function renderGhostElements() {
  const char = CHARACTERS[state.character];
  const container = $('#ghosts-container');
  if (!container) return;
  
  container.innerHTML = state.ghosts.map((g, i) => {
    const ghostImg = char.ghostImages[i % char.ghostImages.length];
    return `
      <div class="ghost" id="ghost-${i}">
        <div class="ghost-scare-glow"></div>
        <div class="ghost-icon">
          <img src="${ghostImg}" class="character-img" alt="Ghost">
        </div>
      </div>
    `;
  }).join('');
}

function calculateBoardScale() {
  const wrap = $('#maze-wrap');
  const topbar = $('.game-topbar');
  const hud = $('.game-hud');
  const dpad = $('#dpad-wrap');
  
  if (!wrap) return;
  
  const topH = topbar ? topbar.offsetHeight : 0;
  const hudH = hud ? hud.offsetHeight : 0;
  const dpadH = dpad ? (window.innerWidth <= 768 ? dpad.offsetHeight : 0) : 0;
  
  const availW = window.innerWidth - 16;
  const availH = window.innerHeight - topH - hudH - dpadH - 16;
  
  const boardSize = COLS * TILE_SIZE;
  const scale = Math.min(1, availW / boardSize, availH / boardSize);
  state.boardScale = Math.max(0.1, scale);
  
  const container = $('#maze-container');
  const grid = $('#maze-grid');
  
  if (container) {
    container.style.width = (boardSize * state.boardScale) + 'px';
    container.style.height = (boardSize * state.boardScale) + 'px';
  }
  
  if (grid) {
    grid.style.transform = `scale(${state.boardScale})`;
    grid.style.width = boardSize + 'px';
    grid.style.height = boardSize + 'px';
  }
}

function renderMaze() {
  const grid = $('#maze-grid');
  if (!grid) return;
  
  grid.innerHTML = state.maze.map((row, y) => 
    row.map((cell, x) => {
      let content = '';
      if (cell === 1) {
        content = `<div class="tile-wall" style="background:rgba(var(--accent-rgb),0.2);border-color:var(--accent);box-shadow:inset 0 0 12px rgba(0,0,0,0.4),0 0 10px rgba(var(--accent-rgb),0.3)"></div>`;
      } else if (cell === 0) {
        content = `<div class="tile-dot" style="background:var(--accent-light);box-shadow:0 0 6px rgba(var(--accent-rgb),0.5)"></div>`;
      } else if (cell === 3) {
        content = `<div class="tile-pellet"><div class="pellet-glow" style="background:rgba(var(--accent-rgb),0.4)"></div><img src="assets/pellet.png" class="pellet-img" alt="Pellet"></div>`;
      }
      return `<div class="tile" data-x="${x}" data-y="${y}">${content}</div>`;
    }).join('')
  ).join('');
}

function renderEntities() {
  const char = CHARACTERS[state.character];
  const scale = state.boardScale;
  
  // Update player position
  const player = $('#player');
  if (player) {
    player.style.left = (state.playerPos.x * TILE_SIZE * scale) + 'px';
    player.style.top = (state.playerPos.y * TILE_SIZE * scale) + 'px';
    player.style.width = (TILE_SIZE * scale) + 'px';
    player.style.height = (TILE_SIZE * scale) + 'px';
    
    // Power mode glow
    const glow = player.querySelector('.player-glow');
    if (glow) {
      if (state.isPowerMode) {
        glow.classList.add('power');
      } else {
        glow.classList.remove('power');
        glow.style.background = `rgba(var(--accent-rgb),0.6)`;
      }
    }
    
    const icon = player.querySelector('.player-icon');
    if (icon) {
      icon.style.borderColor = state.isPowerMode ? '#ff00ff' : 'var(--accent)';
      icon.style.boxShadow = state.isPowerMode 
        ? '0 0 30px #ff00ff, 0 0 60px rgba(255,0,255,0.4)' 
        : `0 0 20px rgba(var(--accent-rgb),0.6), 0 0 40px rgba(var(--accent-rgb),0.4)`;
      icon.style.fontSize = (36 * scale) + 'px';
    }
  }
  
  // Update ghost positions
  state.ghosts.forEach((g, i) => {
    const ghost = $(`#ghost-${i}`);
    if (ghost) {
      ghost.style.left = (g.x * TILE_SIZE * scale) + 'px';
      ghost.style.top = (g.y * TILE_SIZE * scale) + 'px';
      ghost.style.width = (TILE_SIZE * scale) + 'px';
      ghost.style.height = (TILE_SIZE * scale) + 'px';
      
      if (state.isPowerMode) {
        ghost.classList.add('scared');
      } else {
        ghost.classList.remove('scared');
      }
      
      const icon = ghost.querySelector('.ghost-icon');
      if (icon) {
        icon.style.fontSize = (32 * scale) + 'px';
      }
    }
  });
}

function updateHUD() {
  const char = CHARACTERS[state.character];
  const scoreEl = $('#hud-score');
  const hsEl = $('#hud-highscore');
  const livesEl = $('#hud-lives');
  
  if (scoreEl) scoreEl.textContent = state.score.toString().padStart(6, '0');
  if (hsEl) hsEl.textContent = state.highScore.toString().padStart(6, '0');
  if (livesEl) {
    livesEl.innerHTML = [0,1,2].map(i => 
      `<span class="hud-life ${i >= state.lives ? 'lost' : ''}">${char.lifeIcon}</span>`
    ).join('');
  }
}

function showReady() {
  const overlay = $('#ready-overlay');
  if (overlay) overlay.classList.remove('hidden');
}

function hideReady() {
  const overlay = $('#ready-overlay');
  if (overlay) overlay.classList.add('hidden');
}

function hideSwipeHint() {
  const hint = $('#swipe-hint');
  if (hint) hint.classList.add('hidden-hint');
}

function setDirection(dir) {
  if (state.isReady) return;
  
  // Instantly execute exactly one step in the clicked/tapped direction
  const next = tryMove(state.playerPos.x, state.playerPos.y, dir);
  if (next.x !== state.playerPos.x || next.y !== state.playerPos.y) {
    state.playerPos = next;
    
    // Eat dot/pellet instantly!
    const cell = state.maze[state.playerPos.y][state.playerPos.x];
    if (cell === 0 || cell === 3) {
      if (cell === 3) {
        if (!state.bossTriggered) {
          triggerBossSequence();
          state.maze[state.playerPos.y][state.playerPos.x] = 2;
          updateTile(state.playerPos.x, state.playerPos.y);
          return;
        }
        audio.playPowerUp(state.character);
        state.isPowerMode = true;
        state.powerTimer = DIFFICULTIES[state.difficulty].powerDuration;
        state.score += 50;
        
        $('#power-banner')?.classList.remove('hidden');
        $('#power-overlay')?.classList.remove('hidden');
      } else {
        audio.playDotEat();
        state.score += 10;
      }
      state.maze[state.playerPos.y][state.playerPos.x] = 2;
      updateTile(state.playerPos.x, state.playerPos.y);
    }
    
    // Check win condition instantly!
    const hasDotsLeft = state.maze.some(row => row.includes(0) || row.includes(3));
    if (!hasDotsLeft) {
      endGame('win');
      return;
    }
    
    // Update high score instantly!
    if (state.score > state.highScore) {
      state.highScore = state.score;
      localStorage.setItem('modilander_highScore', state.highScore.toString());
    }
    
    // Check ghost collision instantly!
    const hitGhost = state.ghosts.find(g => g.x === state.playerPos.x && g.y === state.playerPos.y);
    if (hitGhost) {
      if (state.isPowerMode) {
        audio.playGhostEat();
        state.score += 200;
        hitGhost.x = 6;
        hitGhost.y = 5;
      } else {
        audio.playDeath(state.character);
        state.lives--;
        updateHUD();
        
        if (state.lives > 0) {
          state.playerPos = { x: 6, y: 10 };
          state.playerDir = null;
          state.playerNextDir = null;
          state.ghosts = getInitialGhosts(DIFFICULTIES[state.difficulty].ghosts);
          renderGhostElements();
          
          state.isReady = true;
          showReady();
          
          setTimeout(() => {
            state.isReady = false;
            hideReady();
          }, 2000);
        } else {
          endGame('loss');
          return;
        }
      }
    }
    
    // Render the instant move
    updateHUD();
    renderEntities();
  }
  
  // Auto fullscreen on mobile first touch
  if (window.innerWidth < 768 && !state.isFullscreen) {
    tryFullscreen();
  }
}

function tryFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  state.isFullscreen = true;
}

function toggleFullscreen() {
  const doc = document;
  if (doc.fullscreenElement || doc.webkitFullscreenElement) {
    if (doc.exitFullscreen) doc.exitFullscreen();
    else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    state.isFullscreen = false;
  } else {
    tryFullscreen();
  }
}

// ═══════════════════════════════════════════════════════════
// GAME TICK (Main Game Loop)
// ═══════════════════════════════════════════════════════════

function tryMove(x, y, dir) {
  let nx = x, ny = y;
  if (dir === 'UP') ny--;
  if (dir === 'DOWN') ny++;
  if (dir === 'LEFT') nx--;
  if (dir === 'RIGHT') nx++;
  
  // Wrap horizontally
  if (nx < 0) nx = COLS - 1;
  if (nx >= COLS) nx = 0;
  
  // Check valid
  if (state.maze[ny] && state.maze[ny][nx] !== 1 && state.maze[ny][nx] !== 4) {
    return { x: nx, y: ny };
  }
  return { x, y };
}

function bfsPath(fromX, fromY, toX, toY) {
  const queue = [{ x: fromX, y: fromY, path: [] }];
  const visited = new Set();
  visited.add(`${fromX},${fromY}`);
  
  const dirs = { UP: {dx:0,dy:-1}, DOWN: {dx:0,dy:1}, LEFT: {dx:-1,dy:0}, RIGHT: {dx:1,dy:0} };
  
  while (queue.length > 0) {
    const curr = queue.shift();
    if (curr.x === toX && curr.y === toY) {
      return curr.path[0] || null;
    }
    for (const [dir, delta] of Object.entries(dirs)) {
      let nx = curr.x + delta.dx;
      let ny = curr.y + delta.dy;
      
      // Wrap horizontally
      if (nx < 0) nx = COLS - 1;
      if (nx >= COLS) nx = 0;
      
      const key = `${nx},${ny}`;
      if (ny >= 0 && ny < ROWS && state.maze[ny][nx] !== 1 && state.maze[ny][nx] !== 4 && !visited.has(key)) {
        visited.add(key);
        queue.push({ x: nx, y: ny, path: [...curr.path, dir] });
      }
    }
  }
  return null;
}

function gameTick() {
  if (state.isReady) return;
  
  const char = CHARACTERS[state.character];
  const diff = DIFFICULTIES[state.difficulty];
  
  // ── Power mode timer ──
  if (state.powerTimer > 0) {
    state.powerTimer--;
    if (state.powerTimer <= 0) {
      state.isPowerMode = false;
      $('#power-banner')?.classList.add('hidden');
      $('#power-overlay')?.classList.add('hidden');
    }
  }
  

  
  // ── Move ghosts ──
  const opposite = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
  const allDirs = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  
  state.ghosts.forEach(ghost => {
    let targetX = state.playerPos.x;
    let targetY = state.playerPos.y;
    
    if (state.isPowerMode) {
      // Flee: target is opposite direction from player
      targetX = (ghost.x + (ghost.x - state.playerPos.x) * 3 + COLS) % COLS;
      targetY = (ghost.y + (ghost.y - state.playerPos.y) * 3 + ROWS) % ROWS;
      targetY = Math.max(1, Math.min(ROWS - 2, targetY));
    }
    
    const useSmart = state.isPowerMode || Math.random() < diff.smartness;
    let chosenDir = null;
    
    if (useSmart) {
      chosenDir = bfsPath(ghost.x, ghost.y, targetX, targetY);
    }
    
    if (!chosenDir) {
      if (useSmart) {
        // Fallback: greedy
        let bestDist = Infinity;
        allDirs.forEach(dir => {
          if (dir === opposite[ghost.dir]) return;
          const next = tryMove(ghost.x, ghost.y, dir);
          if (next.x !== ghost.x || next.y !== ghost.y) {
            const dist = Math.abs(next.x - targetX) + Math.abs(next.y - targetY);
            if (dist < bestDist) {
              bestDist = dist;
              chosenDir = dir;
            }
          }
        });
      } else {
        // Random movement
        const shuffled = [...allDirs].sort(() => Math.random() - 0.5);
        for (const dir of shuffled) {
          if (dir === opposite[ghost.dir]) continue;
          const next = tryMove(ghost.x, ghost.y, dir);
          if (next.x !== ghost.x || next.y !== ghost.y) {
            chosenDir = dir;
            break;
          }
        }
      }
      
      // Last resort: reverse
      if (!chosenDir) {
        const rev = tryMove(ghost.x, ghost.y, opposite[ghost.dir]);
        if (rev.x !== ghost.x || rev.y !== ghost.y) {
          chosenDir = opposite[ghost.dir];
        }
      }
    }
    
    if (chosenDir) {
      const next = tryMove(ghost.x, ghost.y, chosenDir);
      ghost.x = next.x;
      ghost.y = next.y;
      ghost.dir = chosenDir;
    }
  });
  
  // ── Check ghost collision ──
  const hitGhost = state.ghosts.find(g => g.x === state.playerPos.x && g.y === state.playerPos.y);
  
  if (hitGhost) {
    if (state.isPowerMode) {
      // Eat the ghost!
      audio.playGhostEat();
      state.score += 200;
      hitGhost.x = 6;
      hitGhost.y = 5;
    } else {
      // Player dies
      audio.playDeath(state.character);
      state.lives--;
      updateHUD();
      
      if (state.lives > 0) {
        // Reset positions
        state.playerPos = { x: 6, y: 10 };
        state.playerDir = null;
        state.playerNextDir = null;
        state.ghosts = getInitialGhosts(diff.ghosts);
        renderGhostElements();
        
        state.isReady = true;
        showReady();
        
        setTimeout(() => {
          state.isReady = false;
          hideReady();
        }, 2000);
      } else {
        // Game over
        endGame('loss');
        return;
      }
    }
  }
  
  // ── Check win condition ──
  const hasDotsLeft = state.maze.some(row => row.includes(0) || row.includes(3));
  if (!hasDotsLeft) {
    endGame('win');
    return;
  }
  
  // ── Update high score ──
  if (state.score > state.highScore) {
    state.highScore = state.score;
    localStorage.setItem('modilander_highScore', state.highScore.toString());
  }
  
  // ── Render ──
  updateHUD();
  renderEntities();
}

function updateTile(x, y) {
  const tile = $(`.tile[data-x="${x}"][data-y="${y}"]`);
  if (tile) {
    tile.innerHTML = ''; // Clear the dot/pellet
  }
}

function endGame(status) {
  state.isGameRunning = false;
  if (state.gameInterval) {
    clearInterval(state.gameInterval);
    state.gameInterval = null;
  }
  
  audio.stopBgMusic();
  
  if (status === 'win') {
    audio.playWin();
  }
  
  window.onkeydown = null;
  document.body.style.overflow = '';
  
  // Show result screen after a brief delay
  setTimeout(() => {
    showResultScreen(status);
  }, 500);
}

function exitToMenu() {
  state.isGameRunning = false;
  if (state.gameInterval) {
    clearInterval(state.gameInterval);
    state.gameInterval = null;
  }
  audio.stopBgMusic();
  audio.startMenuMusic();
  window.onkeydown = null;
  document.body.style.overflow = '';
  $('#secret-boss')?.remove();
  document.body.classList.remove('screen-shake');
  
  showScreen('start');
  startLogoCycle();
}

// ═══════════════════════════════════════════════════════════
// RESULT PAGE
// ═══════════════════════════════════════════════════════════

function showResultScreen(status) {
  const char = CHARACTERS[state.character];
  const el = $('#screen-result');
  
  const isWin = status === 'win';
  const isLol = status === 'lol_loss';
  
  let emoji = isWin ? '🏆' : '💀';
  if (isLol) emoji = '👾💀';
  
  let title = isWin ? 'YOU WIN!' : 'GAME OVER';
  if (isLol) title = 'LOL! HACKED!';
  
  let titleColor = isWin ? char.accent : '#ef4444';
  if (isLol) titleColor = '#ff3333';
  
  let subtitle = '';
  if (isWin) {
    subtitle = `All dots collected! ${char.tagline}`;
  } else if (isLol) {
    subtitle = `${char.name} got eaten by the Secret Boss! Zero seats won! LOL!`;
  } else {
    subtitle = char.lossMessage || 'Better luck in the next election!';
  }
  
  el.innerHTML = `
    <div class="result-glow" style="background:radial-gradient(circle,${isLol ? '#ff3333' : char.accent}40 0%,transparent 60%)"></div>
    <div class="result-content">
      <div class="result-emoji">${emoji}</div>
      <div class="result-title" style="color:${titleColor};text-shadow:0 0 40px ${titleColor}60">
        ${title}
      </div>
      <div class="result-subtitle">
        ${subtitle}
      </div>
      <div class="result-score-card glass-panel">
        <div class="result-score-item">
          <span class="result-score-label">Score</span>
          <span class="result-score-value" style="color:${isLol ? '#ff3333' : char.accent}">${state.score.toString().padStart(6,'0')}</span>
        </div>
        <div class="result-score-item">
          <span class="result-score-label">Best</span>
          <span class="result-score-value" style="color:rgba(255,255,255,0.9)">${state.highScore.toString().padStart(6,'0')}</span>
        </div>
      </div>
      <div class="result-actions">
        <button class="result-btn primary" id="btn-play-again" style="background:linear-gradient(135deg,${isLol ? '#ff3333' : char.accent}E6,${isLol ? '#ff6666' : char.accentLight}B3)">
          Play Again
        </button>
        <button class="result-btn secondary glass" id="btn-result-menu">
          Menu
        </button>
      </div>
    </div>
  `;
  
  showScreen('result');
  
  $('#btn-play-again').addEventListener('click', () => {
    audio.init();
    audio.playStart();
    startGame();
  });
  
  $('#btn-result-menu').addEventListener('click', () => {
    audio.init();
    audio.playClick();
    audio.startMenuMusic();
    showScreen('start');
    startLogoCycle();
  });
}

// ═══════════════════════════════════════════════════════════
// SECRET BOSS SEQUENCES (TRIGGER, TELEPORT ENEMY, FULLSCREEN VIDEO)
// ═══════════════════════════════════════════════════════════

function playDevilLaugh() {
  audio.init();
  if (audio.ctx && audio.ctx.state === 'suspended') {
    audio.ctx.resume();
  }
  if (audio.muted || !audio.ctx) return;
  
  const now = audio.ctx.currentTime;
  
  // 3 laughter pulses: "HA... HA... HA..."
  const pulses = [
    { delay: 0.0, freq: 110 },
    { delay: 0.32, freq: 95 },
    { delay: 0.64, freq: 80 }
  ];
  
  pulses.forEach(p => {
    try {
      // Osc 1: Sawtooth (for fat mechanical buzz)
      const osc1 = audio.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(p.freq, now + p.delay);
      osc1.frequency.linearRampToValueAtTime(p.freq - 35, now + p.delay + 0.25);
      
      // Osc 2: Square (detuned by -5Hz for a heavy, growling chorus grunt!)
      const osc2 = audio.ctx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(p.freq - 5, now + p.delay);
      osc2.frequency.linearRampToValueAtTime(p.freq - 40, now + p.delay + 0.25);
      
      const gain = audio.ctx.createGain();
      gain.gain.setValueAtTime(0.0, now + p.delay);
      gain.gain.linearRampToValueAtTime(0.4, now + p.delay + 0.04); // high power blast
      gain.gain.linearRampToValueAtTime(0.0, now + p.delay + 0.26); // clean linear decay
      
      // Low-pass filter to sound like a giant mechanical beast!
      const filter = audio.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now + p.delay);
      
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(audio.ctx.destination);
      
      osc1.start(now + p.delay);
      osc2.start(now + p.delay);
      
      osc1.stop(now + p.delay + 0.28);
      osc2.stop(now + p.delay + 0.28);
    } catch(e) {
      console.error("Devil laugh synth error:", e);
    }
  });
}

function getAdjacentOpenTile(pos) {
  const dirs = [
    {dx: 0, dy: -1}, // UP
    {dx: 0, dy: 1},  // DOWN
    {dx: -1, dy: 0}, // LEFT
    {dx: 1, dy: 0}   // RIGHT
  ];
  for (const d of dirs) {
    const nx = pos.x + d.dx;
    const ny = pos.y + d.dy;
    if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && state.maze[ny][nx] !== 1) {
      return { x: nx, y: ny };
    }
  }
  return { x: pos.x, y: pos.y }; // fallback
}

function triggerBossSequence() {
  state.bossTriggered = true;
  state.bossActive = true;
  state.isReady = true; // Block keyboard/swipe controls
  
  // Stop background music immediately
  audio.stopBgMusic();
  audio.stopMenuMusic();
  
  // Also stop any specific character audios that might be playing
  try {
    audio.modiPower.pause();
    audio.rahulPower.pause();
  } catch(e) {}
  
  // Clear the game loop interval to freeze everything
  if (state.gameInterval) {
    clearInterval(state.gameInterval);
    state.gameInterval = null;
  }
  
  // Shake the screen
  document.body.classList.add('screen-shake');
  
  // Show the danger warning screen
  const dangerScreen = $('#danger-screen');
  if (dangerScreen) {
    dangerScreen.classList.remove('hidden');
  }
  
  // Play a scary repeating siren/synth error sound using Web Audio API!
  let alarmInterval = null;
  if (audio.ctx) {
    let count = 0;
    alarmInterval = setInterval(() => {
      if (audio.muted) return;
      // High pitch warning siren
      audio.playTone(880, 'sawtooth', 0.1, 0.15);
      setTimeout(() => {
        audio.playTone(740, 'sawtooth', 0.1, 0.15);
      }, 150);
      count++;
      if (count > 6) {
        clearInterval(alarmInterval);
      }
    }, 350);
  }
  
  // Wait 2.5 seconds, then run the next phase
  setTimeout(() => {
    // Stop the alarm siren interval just in case
    if (alarmInterval) clearInterval(alarmInterval);
    
    // Hide danger screen and stop screen vibration
    if (dangerScreen) {
      dangerScreen.classList.add('hidden');
    }
    document.body.classList.remove('screen-shake');
    
    // Now start the Teleport Boss Invasion!
    startBossInvasion();
  }, 2500);
}

function startBossInvasion() {
  // Find the maze container to add the boss element
  const container = $('#maze-container');
  if (!container) return;
  
  // Create boss DOM element
  const boss = document.createElement('div');
  boss.className = 'boss-enemy';
  boss.id = 'secret-boss';
  
  // Start scale
  const scale = state.boardScale;
  boss.style.width = (TILE_SIZE * scale) + 'px';
  boss.style.height = (TILE_SIZE * scale) + 'px';
  
  // Center starting position: row 6, col 6
  let bossX = 6;
  let bossY = 5;
  boss.style.left = (bossX * TILE_SIZE * scale) + 'px';
  boss.style.top = (bossY * TILE_SIZE * scale) + 'px';
  
  // Set the boss image
  boss.innerHTML = `<img src="assets/secret_enemy.png" class="boss-img" alt="Secret Boss">`;
  container.appendChild(boss);
  
  // Play the custom devil laugh webm file!
  if (!audio.muted) {
    audio.bossLaugh.currentTime = 0;
    audio.bossLaugh.play().catch(e => console.log("Audio play error", e));
  }
  
  // Play spawn glitch sound
  audio.playTone(180, 'square', 0.15, 0.4);
  setTimeout(() => audio.playTone(90, 'square', 0.2, 0.5), 100);
  
  // Now let's calculate teleport targets!
  
  // 1. Ghost targets (slow phase)
  const ghostsTargets = [];
  state.ghosts.forEach((ghost, index) => {
    ghostsTargets.push({
      x: ghost.x,
      y: ghost.y,
      type: 'ghost',
      ref: ghost,
      id: index
    });
  });
  
  // 2. ALL remaining dots / pellets targets (insane speed lightning sweep phase)
  const dotsTargets = [];
  state.maze.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === 0 || cell === 3) {
        dotsTargets.push({ x, y, type: 'dot' });
      }
    });
  });
  // Shuffle dots for aggressive lightning patterns
  dotsTargets.sort(() => Math.random() - 0.5);
  
  // 3. Final player target
  const playerTarget = {
    x: state.playerPos.x,
    y: state.playerPos.y,
    type: 'player'
  };
  
  let ghostIndex = 0;
  let dotIndex = 0;
  
  function executeNextTeleport() {
    // PHASE 1: Eat opposition ghosts slowly and dramatically
    if (ghostIndex < ghostsTargets.length) {
      const target = ghostsTargets[ghostIndex];
      bossX = target.x;
      bossY = target.y;
      
      boss.style.left = (bossX * TILE_SIZE * scale) + 'px';
      boss.style.top = (bossY * TILE_SIZE * scale) + 'px';
      
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 120);
      
      audio.playGhostEat();
      
      const ghostDOM = $(`#ghost-${target.id}`);
      if (ghostDOM) {
        ghostDOM.style.transition = 'all 0.15s';
        ghostDOM.style.transform = 'scale(0) rotate(180deg)';
        setTimeout(() => ghostDOM.remove(), 150);
      }
      
      state.ghosts = state.ghosts.filter(g => g !== target.ref);
      state.score += 200;
      updateHUD();
      
      ghostIndex++;
      setTimeout(executeNextTeleport, 680); // 680ms slow interval
      return;
    }
    
    // PHASE 2: Eat ALL remaining dots and pellets in the game at lightning speed
    if (dotIndex < dotsTargets.length) {
      const target = dotsTargets[dotIndex];
      bossX = target.x;
      bossY = target.y;
      
      boss.style.left = (bossX * TILE_SIZE * scale) + 'px';
      boss.style.top = (bossY * TILE_SIZE * scale) + 'px';
      
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 40);
      
      audio.playTone(600, 'triangle', 0.06, 0.05);
      state.maze[target.y][target.x] = 2;
      updateTile(target.x, target.y);
      state.score += 10;
      updateHUD();
      
      dotIndex++;
      setTimeout(executeNextTeleport, 95); // 95ms lightning fast speed!
      return;
    }
    
    // PHASE 2.5: Teleport adjacent to player and pause dramatically!
    if (!state.bossPausedAdjacent) {
      state.bossPausedAdjacent = true;
      
      const adjTile = getAdjacentOpenTile(state.playerPos);
      bossX = adjTile.x;
      bossY = adjTile.y;
      
      boss.style.left = (bossX * TILE_SIZE * scale) + 'px';
      boss.style.top = (bossY * TILE_SIZE * scale) + 'px';
      
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 150);
      
      audio.playTone(150, 'sawtooth', 0.15, 0.4);
      
      // Pulse animation during the stare-down pause
      boss.style.animation = 'boss-pulse 0.18s ease-in-out infinite alternate';
      
      // Pause for a solid 2.5 seconds of intense stare-down suspense!
      setTimeout(executeNextTeleport, 2500);
      return;
    }
    
    // PHASE 3: Consume player
    bossX = playerTarget.x;
    bossY = playerTarget.y;
    
    boss.style.left = (bossX * TILE_SIZE * scale) + 'px';
    boss.style.top = (bossY * TILE_SIZE * scale) + 'px';
    
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 250);
    
    // Play the boss laugh AGAIN as soon as it eats the player!
    if (!audio.muted) {
      audio.bossLaugh.currentTime = 0;
      audio.bossLaugh.play().catch(e => console.log(e));
    }
    
    // Heavy explosion grunts
    audio.playTone(80, 'sawtooth', 0.4, 0.8);
    audio.playTone(120, 'sawtooth', 0.25, 0.6);
    
    const playerDOM = $('#player');
    if (playerDOM) {
      playerDOM.style.transform = 'scale(0) rotate(-180deg)';
      playerDOM.style.transition = 'all 0.15s';
    }
    
    // Wait 2.2 seconds for the laugh to play out, then play video!
    setTimeout(() => {
      boss.remove();
      playBossVideo();
    }, 2200);
  }
  
  // Start the teleportation sequence 1.2 seconds after the monstrous spawn laugh
  setTimeout(executeNextTeleport, 1200);
}

function playBossVideo() {
  const videoOverlay = $('#video-overlay');
  const videoEl = $('#boss-video');
  if (!videoOverlay || !videoEl) {
    // Fallback if elements not found: go straight to result
    endGame('lol_loss');
    return;
  }
  
  // Double check all game background music is muted/stopped
  audio.stopBgMusic();
  audio.stopMenuMusic();
  
  // Show fullscreen video overlay
  videoOverlay.classList.remove('hidden');
  
  // Request fullscreen if supported to make it a true immersive full screen experience!
  tryFullscreen();
  
  // Setup video volume
  videoEl.volume = 0.9;
  
  // Play the video!
  videoEl.play().catch(e => {
    console.log("Video auto-play blocked, playing muted or on click", e);
    // If blocked, try playing muted
    videoEl.muted = true;
    videoEl.play().catch(err => {
      // Fallback if it completely fails: skip to results
      videoOverlay.classList.add('hidden');
      endGame('lol_loss');
    });
  });
  
  // Listen for video completion or user skip
  videoEl.onended = () => {
    finishBossVideo();
  };
  
  videoEl.onerror = () => {
    finishBossVideo();
  };
  
  // Allow skipping the video if they click/touch it (just in case they are stuck)
  videoOverlay.onclick = () => {
    videoEl.pause();
    finishBossVideo();
  };
}

function finishBossVideo() {
  const videoOverlay = $('#video-overlay');
  const videoEl = $('#boss-video');
  
  if (videoOverlay) videoOverlay.classList.add('hidden');
  if (videoEl) {
    videoEl.pause();
    videoEl.onended = null;
    videoEl.onerror = null;
  }
  
  // Exit fullscreen
  const doc = document;
  if (doc.fullscreenElement || doc.webkitFullscreenElement) {
    if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
    else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    state.isFullscreen = false;
  }
  
  // Trigger game over with 'lol_loss' status
  endGame('lol_loss');
}

// ═══════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initStartPage();
  showScreen('start');
  
  // Init audio on first interaction
  document.addEventListener('click', () => {
    audio.init();
    audio.startMenuMusic();
  }, { once: true });
  document.addEventListener('touchstart', () => {
    audio.init();
    audio.startMenuMusic();
  }, { once: true });
});
