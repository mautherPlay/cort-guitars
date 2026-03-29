// game.js — головний ігровий скрипт
'use strict';

import { initGameFirebase, saveScore, getCurrentUser, saveNickname, loadLeaderboard, getCachedNickname } from './game-firebase.js';
import { EASY_PATTERN,   EASY_SONG_DURATION   } from './easy-song.js';
import { MEDIUM_PATTERN, MEDIUM_SONG_DURATION } from './medium-song.js';
import { HARD_PATTERN,   HARD_SONG_DURATION   } from './hard-song.js';


// ═════════════════════════════════════════════════════════════════════
// 1. КОНФІГУРАЦІЯ
// ═════════════════════════════════════════════════════════════════════

const DIFFICULTY = {
  easy:    { speed: 180, label: 'Легкий'      },
  medium:  { speed: 300, label: 'Середній'    },
  hard:    { speed: 480, label: 'Важкий'      },
  endless: { speed: 200, label: 'Безкінечний' },
};

const HIT_ZONE_PCT     = 0.68;
const HIT_ZONE_HALF_PX = 90;

const STRING_NAMES  = ['E', 'A', 'D', 'G', 'B'];
const STRING_COLORS = ['#e84040', '#e8a020', '#40e860', '#4090e8', '#b040e8'];

const SONG_DURATIONS = {
  easy:   199 * 1000,
  medium:  88 * 1000,
  hard:   HARD_SONG_DURATION,
};
const ENDLESS_SPEED_START   = 160;
const ENDLESS_SPEED_MAX     = 960;
const ENDLESS_ACCEL_EVERY   = 10000;
const ENDLESS_ACCEL_STEP    = 32;
const SPEED_WARN_BEFORE_MS  = 4000;


// ═════════════════════════════════════════════════════════════════════
// 2. ПАТТЕРНИ НОТ
// ═════════════════════════════════════════════════════════════════════

function generatePattern(level) {
  const notes  = [];
  const counts = { medium: 50, hard: 80 };
  const gaps   = { medium: 1000, hard: 650 };
  const total  = counts[level];
  const gap    = gaps[level];
  const rhythmTemplates = [
    [0, 2, 4], [1, 3], [0, 1, 2, 3, 4], [2, 4, 0], [3, 1, 4],
  ];
  let t = 1500;
  for (let i = 0; i < total; i++) {
    const tpl = rhythmTemplates[i % rhythmTemplates.length];
    notes.push({ string: tpl[i % tpl.length], time: t });
    t += gap + Math.floor(Math.random() * gap * 0.3);
  }
  return notes;
}

const SONG_PATTERNS = {
  easy:   EASY_PATTERN,
  medium: MEDIUM_PATTERN,
  hard:   HARD_PATTERN,
};


// ═════════════════════════════════════════════════════════════════════
// 3. АУДІО
// ═════════════════════════════════════════════════════════════════════

let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playDeepKick() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);

    const bufferSize  = ctx.sampleRate * 0.05;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data        = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    noiseSource.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);

  } catch (e) {}
}

let songAudio = null;

// ── Preload: завантажуємо всі треки одразу при старті сторінки ──────
// Це усуває затримку між стартом гри і початком музики на хостингу
const AUDIO_SRCS = [
  'audio/deathnotelvl.mp3',
  'audio/bluepjano.mp3',
  'audio/pirates.mp3',
  'audio/crow.mp3',
];
const audioCache = {};
AUDIO_SRCS.forEach(src => {
  const a = new Audio();
  a.preload = 'auto';
  a.src = src;
  audioCache[src] = a;
});

function startSong(src, loop = false) {
  stopSong();
  // Беремо з кешу якщо є — файл вже завантажений браузером
  if (audioCache[src]) {
    songAudio = audioCache[src];
    songAudio.currentTime = 0;
  } else {
    songAudio = new Audio(src);
  }
  songAudio.volume = 0.75;
  songAudio.loop   = loop;
  songAudio.play().catch(() => {
    console.warn('Автовідтворення заблоковано браузером');
  });
}

function stopSong() {
  if (songAudio) {
    songAudio.pause();
    songAudio.currentTime = 0;
    songAudio = null;
  }
}


// ═════════════════════════════════════════════════════════════════════
// 4. СТАН ГРИ
// ═════════════════════════════════════════════════════════════════════

let state = {
  running:         false,
  level:           null,
  score:           0,
  combo:           0,
  maxCombo:        0,
  startTime:       0,
  notes:           [],
  patternIdx:      0,
  animFrame:       null,
  lastTimestamp:   0,
  countdownActive: false,

  endless: {
    currentSpeed:      200,
    nextSpeed:         200,
    nextSpeedChangeAt: 0,
    warnShown:         false,
    elapsedSec:        0,
    lastSecTick:       0,
    lastSpawnTime:     0,
  },
};


// ═════════════════════════════════════════════════════════════════════
// 5. DOM
// ═════════════════════════════════════════════════════════════════════

const screens = {
  difficulty: document.getElementById('screen-difficulty'),
  game:       document.getElementById('screen-game'),
  gameover:   document.getElementById('screen-gameover'),
  win:        document.getElementById('screen-win'),
};

const scoreDisplay = document.getElementById('score-display');
const comboDisplay = document.getElementById('combo-display');
const levelDisplay = document.getElementById('level-display');
const finalScore   = document.getElementById('final-score');
const finalCombo   = document.getElementById('final-combo');
const btnSave      = document.getElementById('btn-save');
const saveStatus   = document.getElementById('save-status');
const winScore      = document.getElementById('win-score');
const winCombo      = document.getElementById('win-combo');
const winLevelName  = document.getElementById('win-level-name');
const btnSaveWin    = document.getElementById('btn-save-win');
const saveStatusWin = document.getElementById('save-status-win');
const hitFeedback  = document.getElementById('hit-feedback');

const userPanel  = document.getElementById('user-panel');
const userAvatar      = document.getElementById('user-avatar');
const userDisplayName = document.getElementById('user-displayname');
const userEmailSub    = document.getElementById('user-email-sub');
const bestHint   = document.getElementById('best-score-hint');

const bestScoreEls = {
  easy:    { score: document.getElementById('best-score-easy'),    combo: document.getElementById('best-combo-easy')    },
  medium:  { score: document.getElementById('best-score-medium'),  combo: document.getElementById('best-combo-medium')  },
  hard:    { score: document.getElementById('best-score-hard'),    combo: document.getElementById('best-combo-hard')    },
  endless: { score: document.getElementById('best-score-endless'), combo: document.getElementById('best-combo-endless') },
};

const bestCards = {
  easy:    document.getElementById('best-card-easy'),
  medium:  document.getElementById('best-card-medium'),
  hard:    document.getElementById('best-card-hard'),
  endless: document.getElementById('best-card-endless'),
};

const noteContainers   = [0,1,2,3,4].map(i => document.getElementById(`notes-${i}`));
const trackEls         = [0,1,2,3,4].map(i => document.getElementById(`track-${i}`));
const hitButtons       = document.querySelectorAll('.hit-btn');
const countdownOverlay = document.getElementById('countdown-overlay');
const countdownNumber  = document.getElementById('countdown-number');
const endlessTimer        = document.getElementById('endless-timer');
const speedWarning        = document.getElementById('speed-warning');
const practiceCheckbox    = document.getElementById('practice-mode-checkbox');
const autoHitCheckbox     = document.getElementById('auto-hit-checkbox');
const autoHitRow          = document.getElementById('auto-hit-row');
const hardcoreCheckbox    = document.getElementById('hardcore-mode-checkbox');
const hardcoreToggleRow   = document.getElementById('hardcore-toggle-row');
const practiceHintText    = document.getElementById('practice-hint-text');
const practiceIndicator   = document.getElementById('practice-indicator');
const hardcoreIndicator   = document.getElementById('hardcore-indicator');

let isPracticeMode = false;
let isAutoHit      = false;
let isHardcoreMode = false;

// Практика — вмикає авто-хіт; блокує хардкор (несумісні режими)
practiceCheckbox.addEventListener('change', () => {
  isPracticeMode = practiceCheckbox.checked;
  if (isPracticeMode) {
    // Розблоковуємо авто-хіт
    autoHitRow.classList.remove('disabled');
    autoHitCheckbox.disabled = false;
    // Хардкор несумісний з практикою — вимикаємо і блокуємо
    isHardcoreMode            = false;
    hardcoreCheckbox.checked  = false;
    hardcoreCheckbox.disabled = true;
    hardcoreToggleRow.classList.add('disabled');
  } else {
    // Вимикаємо авто-хіт
    autoHitRow.classList.add('disabled');
    autoHitCheckbox.disabled = true;
    autoHitCheckbox.checked  = false;
    isAutoHit = false;
    // Розблоковуємо хардкор
    hardcoreCheckbox.disabled = false;
    hardcoreToggleRow.classList.remove('disabled');
  }
});

autoHitCheckbox.addEventListener('change', () => {
  isAutoHit = autoHitCheckbox.checked;
});

hardcoreCheckbox.addEventListener('change', () => {
  if (isPracticeMode) return; // захист — хардкор недоступний в практиці
  isHardcoreMode = hardcoreCheckbox.checked;
});


// ═════════════════════════════════════════════════════════════════════
// 6. FIREBASE
// ═════════════════════════════════════════════════════════════════════

initGameFirebase({
  onUserLoggedIn(user, scores, nickname) {
    userPanel.style.display = 'flex';
    userAvatar.textContent  = (nickname || user.email)[0].toUpperCase();
    userDisplayName.textContent = nickname || user.email;
    userEmailSub.textContent    = nickname ? user.email : '';
    bestHint.style.display  = 'none';
    updateBestScoreDisplay(scores);
    btnSave.classList.add('visible');
    renderLeaderboard();
  },
  onUserLoggedOut() {
    userPanel.style.display = 'none';
    bestHint.style.display  = 'block';
    updateBestScoreDisplay({ easy: null, medium: null, hard: null, endless: null });
    btnSave.classList.remove('visible');
  },
});

function updateBestScoreDisplay(scores) {
  ['easy', 'medium', 'hard', 'endless'].forEach(level => {
    const data = scores[level];
    const els  = bestScoreEls[level];
    if (!els) return;
    els.score.textContent = data ? data.bestScore : '0';
    els.combo.textContent = data ? data.bestCombo : '0';
  });
}

function highlightBestCard(level) {
  Object.values(bestCards).forEach(c => c && c.classList.remove('active-level'));
  if (bestCards[level]) bestCards[level].classList.add('active-level');
}


// ═════════════════════════════════════════════════════════════════════
// 7. КНОПКА ЗБЕРЕЖЕННЯ
// ═════════════════════════════════════════════════════════════════════

btnSave.addEventListener('click', async () => {
  btnSave.disabled       = true;
  btnSave.textContent    = '⏳ Зберігаємо...';
  saveStatus.textContent = '';
  saveStatus.className   = '';

  const result = await saveScore({
    score: state.score,
    combo: state.maxCombo,
    level: state.level,
  });

  if (result.error === 'not_logged_in') {
    saveStatus.textContent = '⚠️ Потрібно увійти в акаунт';
    saveStatus.className   = 'save-error';
    btnSave.disabled = false; btnSave.textContent = '💾 Зберегти результат';
    return;
  }
  if (result.error) {
    saveStatus.textContent = '❌ Помилка збереження. Спробуй ще раз.';
    saveStatus.className   = 'save-error';
    btnSave.disabled = false; btnSave.textContent = '💾 Зберегти результат';
    return;
  }
  if (!result.saved) {
    saveStatus.textContent = '📊 Твій рекорд на цьому рівні кращий!';
    saveStatus.className   = 'save-info';
    btnSave.disabled = false; btnSave.textContent = '💾 Зберегти результат';
    return;
  }

  btnSave.textContent    = '✓ Збережено!';
  saveStatus.textContent = `🎉 Новий рекорд на рівні "${DIFFICULTY[state.level].label}"!`;
  saveStatus.className   = 'save-success';

  if (bestScoreEls[state.level]) {
    bestScoreEls[state.level].score.textContent = state.score;
    bestScoreEls[state.level].combo.textContent = state.maxCombo;
  }
});


// ═════════════════════════════════════════════════════════════════════
// 8. НАВІГАЦІЯ
// ═════════════════════════════════════════════════════════════════════

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

document.querySelectorAll('.diff-card').forEach(btn => {
  btn.addEventListener('click', () => startGameWithCountdown(btn.dataset.level));
});

document.getElementById('btn-back').addEventListener('click', () => {
  cancelCountdown();
  stopGame();
  stopSong();
  showScreen('difficulty');
});

document.getElementById('btn-retry').addEventListener('click', () => startGameWithCountdown(state.level));
document.getElementById('btn-menu').addEventListener('click',  () => { stopSong(); showScreen('difficulty'); });
document.getElementById('btn-win-retry').addEventListener('click', () => startGameWithCountdown(state.level));
document.getElementById('btn-win-menu').addEventListener('click',  () => { stopSong(); showScreen('difficulty'); });

btnSaveWin.addEventListener('click', async () => {
  btnSaveWin.disabled       = true;
  btnSaveWin.textContent    = '⏳ Зберігаємо...';
  saveStatusWin.textContent = '';
  saveStatusWin.className   = '';

  const result = await saveScore({
    score: state.score,
    combo: state.maxCombo,
    level: state.level,
  });

  if (result.error === 'not_logged_in') {
    saveStatusWin.textContent = '⚠️ Потрібно увійти в акаунт';
    saveStatusWin.className   = 'save-error';
    btnSaveWin.disabled = false; btnSaveWin.textContent = '💾 Зберегти результат';
    return;
  }
  if (result.error) {
    saveStatusWin.textContent = '❌ Помилка збереження. Спробуй ще раз.';
    saveStatusWin.className   = 'save-error';
    btnSaveWin.disabled = false; btnSaveWin.textContent = '💾 Зберегти результат';
    return;
  }
  if (!result.saved) {
    saveStatusWin.textContent = '📊 Твій рекорд на цьому рівні кращий!';
    saveStatusWin.className   = 'save-info';
    btnSaveWin.disabled = false; btnSaveWin.textContent = '💾 Зберегти результат';
    return;
  }
  btnSaveWin.textContent    = '✓ Збережено!';
  saveStatusWin.textContent = `🎉 Новий рекорд на рівні "${DIFFICULTY[state.level].label}"!`;
  saveStatusWin.className   = 'save-success';
  if (bestScoreEls[state.level]) {
    bestScoreEls[state.level].score.textContent = state.score;
    bestScoreEls[state.level].combo.textContent = state.maxCombo;
  }
});


// ═════════════════════════════════════════════════════════════════════
// 9. КНОПКИ УПРАВЛІННЯ
// ═════════════════════════════════════════════════════════════════════

hitButtons.forEach(btn => {
  const strIdx     = parseInt(btn.dataset.string);
  const activate   = () => { btn.classList.add('pressed');    handleHit(strIdx); };
  const deactivate = () => { btn.classList.remove('pressed'); };

  btn.addEventListener('pointerdown',  e => { e.preventDefault(); activate(); });
  btn.addEventListener('pointerup',    deactivate);
  btn.addEventListener('pointerleave', deactivate);
});


// ═════════════════════════════════════════════════════════════════════
// 10. ВІДЛІК ПЕРЕД СТАРТОМ
// ═════════════════════════════════════════════════════════════════════

let countdownTimeout = null;

function startGameWithCountdown(level) {
  cancelCountdown();
  stopGame();
  stopSong();
  clearAllNotes();

  showScreen('game');
  highlightBestCard(level);
  levelDisplay.textContent    = DIFFICULTY[level].label;
  endlessTimer.style.display  = 'none';
  speedWarning.style.visibility = 'hidden'; speedWarning.style.opacity = '0';

  countdownOverlay.classList.add('active');
  let count = 3;
  countdownNumber.textContent = count;

  countdownTimeout = setInterval(() => {
    count--;
    if (count > 0) {
      countdownNumber.textContent = count;
      countdownNumber.classList.remove('countdown-pulse');
      void countdownNumber.offsetWidth;
      countdownNumber.classList.add('countdown-pulse');
    } else {
      clearInterval(countdownTimeout);
      countdownTimeout = null;
      countdownOverlay.classList.remove('active');
      startGame(level);
    }
  }, 1000);
}

function cancelCountdown() {
  if (countdownTimeout) { clearInterval(countdownTimeout); countdownTimeout = null; }
  countdownOverlay.classList.remove('active');
}


// ═════════════════════════════════════════════════════════════════════
// 11. СТАРТ / ЗУПИНКА
// ═════════════════════════════════════════════════════════════════════

function startGame(level) {
  stopGame();
  clearAllNotes();

  const now = performance.now();

  state = {
    running:         true,
    level,
    score:           0,
    combo:           0,
    maxCombo:        0,
    startTime:       now,
    notes:           [],
    patternIdx:      0,
    animFrame:       null,
    lastTimestamp:   now,
    countdownActive: false,

    endless: {
      currentSpeed:      ENDLESS_SPEED_START,
      nextSpeedChangeAt: now + ENDLESS_ACCEL_EVERY,
      warnShown:         false,
      elapsedSec:        0,
      lastSecTick:       now,
      lastSpawnTime:     now,
    },
  };

  if (level === 'endless') {
    endlessTimer.style.display  = 'block';
    endlessTimer.textContent    = '⏱ 0:00';
    speedWarning.style.visibility = 'hidden'; speedWarning.style.opacity = '0';
    startSong('audio/crow.mp3', true);
  } else {
    endlessTimer.style.display  = 'none';
    speedWarning.style.visibility = 'hidden'; speedWarning.style.opacity = '0';
  }

  isPracticeMode = practiceCheckbox.checked;
  isAutoHit      = autoHitCheckbox.checked && isPracticeMode;
  isHardcoreMode = hardcoreCheckbox.checked;

  practiceIndicator.classList.toggle('active', isPracticeMode);
  hardcoreIndicator.classList.toggle('active', isHardcoreMode);

  if (level === 'easy')   startSong('audio/deathnotelvl.mp3');
  if (level === 'medium') startSong('audio/bluepjano.mp3');
  if (level === 'hard')   startSong('audio/pirates.mp3');

  btnSave.disabled       = false;
  btnSave.textContent    = '💾 Зберегти результат';
  saveStatus.textContent = '';
  saveStatus.className   = '';

  updateHUD();
  state.animFrame = requestAnimationFrame(gameLoop);
}

function stopGame() {
  state.running = false;
  if (state.animFrame) {
    cancelAnimationFrame(state.animFrame);
    state.animFrame = null;
  }
}


// ═════════════════════════════════════════════════════════════════════
// 12. ІГРОВИЙ ЦИКЛ
// ═════════════════════════════════════════════════════════════════════

function gameLoop(timestamp) {
  if (!state.running) return;

  const elapsed     = timestamp - state.startTime;
  state.lastTimestamp = timestamp;
  const trackHeight = trackEls[0].getBoundingClientRect().height || 500;

  let currentSpeed;
  if (state.level === 'endless') {
    currentSpeed = state.endless.currentSpeed;
    tickEndless(timestamp);
  } else {
    currentSpeed = DIFFICULTY[state.level].speed;
  }

  // ── Спавн нот ──────────────────────────────────────────────────────
  if (state.level === 'endless') {
    spawnEndlessNotes(timestamp, currentSpeed);
  } else {
    const pattern = SONG_PATTERNS[state.level];
    const flightMs = (trackHeight * HIT_ZONE_PCT / currentSpeed) * 1000;

    while (
      state.patternIdx < pattern.length &&
      pattern[state.patternIdx].time - flightMs <= elapsed
    ) {
      spawnNote(pattern[state.patternIdx].string, timestamp);
      state.patternIdx++;
    }
  }

  // ── Рух нот і перевірка виходу за межу ────────────────────────────
  for (let i = state.notes.length - 1; i >= 0; i--) {
    const note  = state.notes[i];
    const age   = (timestamp - note.spawnTime) / 1000;
    const topPx = age * currentSpeed - 30;

    note.topPct       = (topPx / trackHeight) * 100;
    note.el.style.top = topPx + 'px';

    // ── АВТО-ХІТ ───────────────────────────────────────────────────
    if (isAutoHit) {
      const noteCenter   = topPx + 15;
      const centerLinePx = trackHeight * HIT_ZONE_PCT;
      if (Math.abs(noteCenter - centerLinePx) <= currentSpeed / 60 + 8) {
        note.el.classList.add('hit');
        setTimeout(() => removeDOMNote(note.el), 200);
        state.notes.splice(i, 1);
        state.combo++;
        if (state.combo > state.maxCombo) state.maxCombo = state.combo;
        state.score += 100 + (state.combo - 1) * 10;
        playDeepKick();
        updateHUD();
        showHitFeedback(note.string, state.combo);
        continue;
      }
    }

    if (topPx > trackHeight + 10) {
      removeDOMNote(note.el);
      state.notes.splice(i, 1);
      triggerMiss(note.string);

      if (!isPracticeMode) {
        gameOver();
        return;
      }
    }
  }

  // ── Перемога ───────────────────────────────────────────────────────
  if (state.level !== 'endless') {
    const pattern  = SONG_PATTERNS[state.level];
    const duration = SONG_DURATIONS[state.level];
    const allNotesSpawned = state.patternIdx >= pattern.length && state.notes.length === 0;
    const songEnded       = duration && elapsed >= duration;

    if (allNotesSpawned || songEnded) {
      stopSong();
      gameWin();
      return;
    }
  }

  state.animFrame = requestAnimationFrame(gameLoop);
}


// ═════════════════════════════════════════════════════════════════════
// 13. БЕЗКІНЕЧНИЙ РЕЖИМ
// ═════════════════════════════════════════════════════════════════════

function tickEndless(timestamp) {
  const e = state.endless;

  if (timestamp - e.lastSecTick >= 1000) {
    e.elapsedSec++;
    e.lastSecTick = timestamp;
    const min = Math.floor(e.elapsedSec / 60);
    const sec = String(e.elapsedSec % 60).padStart(2, '0');
    endlessTimer.textContent = `⏱ ${min}:${sec}`;
  }

  const atMax           = e.currentSpeed >= ENDLESS_SPEED_MAX;
  const timeUntilChange = e.nextSpeedChangeAt - timestamp;

  if (!atMax && timeUntilChange <= SPEED_WARN_BEFORE_MS && !e.warnShown) {
    e.warnShown = true;
    showSpeedWarning(Math.ceil(timeUntilChange / 1000));
  }
  if (!atMax && e.warnShown && timeUntilChange > 0) {
    updateSpeedWarningSeconds(Math.ceil(timeUntilChange / 1000));
  }

  if (!atMax && timestamp >= e.nextSpeedChangeAt) {
    e.currentSpeed      = Math.min(ENDLESS_SPEED_MAX, e.currentSpeed + ENDLESS_ACCEL_STEP);
    e.nextSpeedChangeAt = timestamp + ENDLESS_ACCEL_EVERY;
    e.warnShown         = false;
    hideSpeedWarning();
  }
}

function spawnEndlessNotes(timestamp, currentSpeed) {
  const e = state.endless;
  const t = (currentSpeed - ENDLESS_SPEED_START) / (ENDLESS_SPEED_MAX - ENDLESS_SPEED_START);
  const interval = Math.round(1100 - t * 600);
  if (timestamp - e.lastSpawnTime >= interval) {
    spawnNote(Math.floor(Math.random() * 5), timestamp);
    e.lastSpawnTime = timestamp;
  }
}

function showSpeedWarning(secLeft) {
  speedWarning.textContent = `⚡ Прискорення через ${secLeft} сек!`;
  speedWarning.style.visibility = 'visible';
  speedWarning.style.opacity    = '1';
}
function updateSpeedWarningSeconds(secLeft) {
  speedWarning.textContent = `⚡ Прискорення через ${secLeft} сек!`;
}
function hideSpeedWarning() {
  speedWarning.style.visibility = 'hidden';
  speedWarning.style.opacity    = '0';
}


// ═════════════════════════════════════════════════════════════════════
// 14. СПАВН НОТИ
// ═════════════════════════════════════════════════════════════════════

function spawnNote(strIdx, timestamp) {
  const el = document.createElement('div');
  el.className      = 'note';
  el.dataset.string = strIdx;
  el.textContent    = STRING_NAMES[strIdx];
  el.style.top      = '-40px';
  noteContainers[strIdx].appendChild(el);
  state.notes.push({ el, string: strIdx, spawnTime: timestamp, topPct: -6 });
}


// ═════════════════════════════════════════════════════════════════════
// 15. ВЛУЧЕННЯ
// ═════════════════════════════════════════════════════════════════════

function handleHit(strIdx) {
  if (!state.running) return;

  const trackH      = trackEls[0].getBoundingClientRect().height || 500;
  const hitCenterPx = trackH * HIT_ZONE_PCT;

  const inZone = state.notes.filter(n => {
    const notePx = parseFloat(n.el.style.top) || 0;
    return (
      n.string === strIdx &&
      notePx >= hitCenterPx - HIT_ZONE_HALF_PX &&
      notePx <= hitCenterPx + HIT_ZONE_HALF_PX
    );
  });

  if (inZone.length === 0) {
    if (isHardcoreMode) {
      triggerMiss(strIdx);
      gameOver();
    }
    return;
  }

  const best = inZone.reduce((a, b) =>
    Math.abs(parseFloat(a.el.style.top) - hitCenterPx) <
    Math.abs(parseFloat(b.el.style.top) - hitCenterPx) ? a : b
  );

  hitNote(best, strIdx);
}

function hitNote(note, strIdx) {
  note.el.classList.add('hit');
  setTimeout(() => removeDOMNote(note.el), 200);

  const idx = state.notes.indexOf(note);
  if (idx !== -1) state.notes.splice(idx, 1);

  state.combo++;
  if (state.combo > state.maxCombo) state.maxCombo = state.combo;
  state.score += 100 + (state.combo - 1) * 10;

  playDeepKick();

  updateHUD();
  showHitFeedback(strIdx, state.combo);
}


// ═════════════════════════════════════════════════════════════════════
// 16. ПРОМАХ
// ═════════════════════════════════════════════════════════════════════

function triggerMiss(strIdx) {
  trackEls[strIdx].classList.remove('miss-flash');
  void trackEls[strIdx].offsetWidth;
  trackEls[strIdx].classList.add('miss-flash');
  breakCombo();
}

function breakCombo() {
  state.combo = 0;
  updateHUD();
}


// ═════════════════════════════════════════════════════════════════════
// 17. HUD
// ═════════════════════════════════════════════════════════════════════

function updateHUD() {
  scoreDisplay.textContent = state.score;
  comboDisplay.textContent = `x${state.combo}`;
  if (state.combo > 1) {
    comboDisplay.classList.remove('combo-pulse');
    void comboDisplay.offsetWidth;
    comboDisplay.classList.add('combo-pulse');
  }
}


// ═════════════════════════════════════════════════════════════════════
// 18. FEEDBACK
// ═════════════════════════════════════════════════════════════════════

function showHitFeedback(strIdx, combo) {
  const text = combo >= 10 ? 'PERFECT!' :
               combo >= 5  ? 'AWESOME!' :
               combo >= 3  ? 'GREAT!'   : 'NICE!';
  hitFeedback.textContent = text;
  hitFeedback.style.color = STRING_COLORS[strIdx];
  hitFeedback.classList.remove('show');
  void hitFeedback.offsetWidth;
  hitFeedback.classList.add('show');
}


// ═════════════════════════════════════════════════════════════════════
// 19. ФІНАЛ
// ═════════════════════════════════════════════════════════════════════

function gameOver() {
  stopGame();
  stopSong();
  hideSpeedWarning();
  endlessTimer.style.display = 'none';

  finalScore.textContent = state.score;
  finalCombo.textContent = state.maxCombo;

  if (getCurrentUser()) {
    btnSave.classList.add('visible');
  } else {
    btnSave.classList.remove('visible');
  }

  setTimeout(() => showScreen('gameover'), 300);
}

function gameWin() {
  stopGame();
  stopSong();

  winScore.textContent     = state.score;
  winCombo.textContent     = state.maxCombo;
  winLevelName.textContent = DIFFICULTY[state.level].label;

  btnSaveWin.disabled       = false;
  btnSaveWin.textContent    = '💾 Зберегти результат';
  saveStatusWin.textContent = '';
  saveStatusWin.className   = '';

  if (isPracticeMode) {
    btnSaveWin.classList.remove('visible');
    saveStatusWin.textContent = '🎯 Результат у режимі практики не зберігається';
    saveStatusWin.className   = 'save-info';
  } else if (getCurrentUser()) {
    btnSaveWin.classList.add('visible');
  } else {
    btnSaveWin.classList.remove('visible');
  }

  setTimeout(() => showScreen('win'), 500);
}


// ═════════════════════════════════════════════════════════════════════
// 20. УТИЛІТИ
// ═════════════════════════════════════════════════════════════════════

function removeDOMNote(el) {
  if (el.parentNode) el.parentNode.removeChild(el);
}

function clearAllNotes() {
  noteContainers.forEach(c => { c.innerHTML = ''; });
  if (state) state.notes = [];
}


// ═════════════════════════════════════════════════════════════════════
// 21. СТАРТ
// ═════════════════════════════════════════════════════════════════════

showScreen('difficulty');

// ═══════════════════════════════════════════════════════════════════
// НІКНЕЙМ
// ═══════════════════════════════════════════════════════════════════

const nicknameForm    = document.getElementById('nickname-form');
const nicknameInput   = document.getElementById('nickname-input');
const nicknameStatus  = document.getElementById('nickname-status');
const btnSetNickname  = document.getElementById('btn-set-nickname');
const btnSaveNickname = document.getElementById('btn-save-nickname');
const btnCancelNick   = document.getElementById('btn-cancel-nickname');

btnSetNickname.addEventListener('click', () => {
  nicknameInput.value   = getCachedNickname() || '';
  nicknameStatus.textContent = '';
  nicknameForm.style.display = 'flex';
  nicknameInput.focus();
});

btnCancelNick.addEventListener('click', () => {
  nicknameForm.style.display = 'none';
});

btnSaveNickname.addEventListener('click', async () => {
  const val = nicknameInput.value.trim();
  nicknameStatus.style.color = '#86868b';
  nicknameStatus.textContent = 'Зберігаємо...';
  btnSaveNickname.disabled = true;

  const result = await saveNickname(val);

  btnSaveNickname.disabled = false;

  if (result.saved) {
    const user = getCurrentUser();
    userAvatar.textContent      = val[0].toUpperCase();
    userDisplayName.textContent = val;
    userEmailSub.textContent    = user ? user.email : '';
    nicknameStatus.style.color  = '#32d74b';
    nicknameStatus.textContent  = '✓ Нікнейм збережено!';
    setTimeout(() => { nicknameForm.style.display = 'none'; }, 1200);
    renderLeaderboard(); // Оновлюємо лідерборд
  } else {
    nicknameStatus.style.color = '#ff5a5f';
    if (result.error === 'too_short')      nicknameStatus.textContent = 'Мінімум 3 символи.';
    else if (result.error === 'too_long')  nicknameStatus.textContent = 'Максимум 20 символів.';
    else if (result.error === 'invalid_chars') nicknameStatus.textContent = 'Тільки букви, цифри, _ і -.';
    else if (result.error === 'not_logged_in') nicknameStatus.textContent = 'Спочатку увійдіть.';
    else nicknameStatus.textContent = 'Помилка. Спробуйте ще.';
  }
});

// Enter у полі нікнейму
nicknameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnSaveNickname.click();
  if (e.key === 'Escape') btnCancelNick.click();
});


// ═══════════════════════════════════════════════════════════════════
// ТАБЛИЦЯ ЛІДЕРІВ
// ═══════════════════════════════════════════════════════════════════

const MEDALS = ['🥇', '🥈', '🥉'];

function renderLeaderboard() {
  const lbTotal   = document.getElementById('lb-total');
  const lbEndless = document.getElementById('lb-endless');
  if (!lbTotal || !lbEndless) return;

  lbTotal.innerHTML   = '<div class="lb-loading">Завантаження...</div>';
  lbEndless.innerHTML = '<div class="lb-loading">Завантаження...</div>';

  loadLeaderboard().then(({ total, endless }) => {

    if (total.length === 0) {
      lbTotal.innerHTML = '<div class="lb-empty">Ще немає результатів</div>';
    } else {
      lbTotal.innerHTML = total.map((p, i) =>
        `<div class="lb-row">
          <span class="lb-medal">${MEDALS[i]}</span>
          <span class="lb-name">${escapeHtml(p.displayName)}</span>
          <span class="lb-score">${p.score.toLocaleString()}</span>
        </div>`
      ).join('');
    }

    if (endless.length === 0) {
      lbEndless.innerHTML = '<div class="lb-empty">Ще немає результатів</div>';
    } else {
      lbEndless.innerHTML = endless.map((p, i) =>
        `<div class="lb-row">
          <span class="lb-medal">${MEDALS[i]}</span>
          <span class="lb-name">${escapeHtml(p.displayName)}</span>
          <span class="lb-score">${p.score.toLocaleString()}</span>
        </div>`
      ).join('');
    }
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}