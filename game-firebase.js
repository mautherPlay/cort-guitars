//   gameScores/{userId}:
//     email:    "..."
//     nickname: "..."   ← новий рядок
//     easy:     { bestScore, bestCombo, savedAt }
//     medium:   { bestScore, bestCombo, savedAt }
//     hard:     { bestScore, bestCombo, savedAt }
//     endless:  { bestScore, bestCombo, savedAt }

import { auth, db } from './js/firebase.js';

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  orderBy,
  query,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ─────────────────────────────────────────────────────────────────────
// ВНУТРІШНІЙ СТАН
// ─────────────────────────────────────────────────────────────────────

let currentUser   = null;
let cachedScores  = { easy: null, medium: null, hard: null, endless: null };
let cachedNickname = null;


// ─────────────────────────────────────────────────────────────────────
// ПУБЛІЧНІ ФУНКЦІЇ
// ─────────────────────────────────────────────────────────────────────

export function getCurrentUser()   { return currentUser; }
export function getCachedScores()  { return cachedScores; }
export function getCachedNickname(){ return cachedNickname; }

/**
 * initGameFirebase({ onUserLoggedIn, onUserLoggedOut })
 */
export function initGameFirebase({ onUserLoggedIn, onUserLoggedOut }) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;

      const docRef  = doc(db, 'gameScores', user.uid);
      const docSnap = await getDoc(docRef);

      const scores = { easy: null, medium: null, hard: null, endless: null };
      cachedNickname = null;

      if (docSnap.exists()) {
        const data = docSnap.data();
        cachedNickname = data.nickname || null;

        ['easy', 'medium', 'hard', 'endless'].forEach(level => {
          if (data[level] && data[level].bestScore) {
            scores[level] = {
              bestScore: data[level].bestScore || 0,
              bestCombo: data[level].bestCombo || 0,
            };
          }
        });
      }

      cachedScores = scores;
      onUserLoggedIn(user, scores, cachedNickname);

    } else {
      currentUser    = null;
      cachedNickname = null;
      cachedScores   = { easy: null, medium: null, hard: null, endless: null };
      onUserLoggedOut();
    }
  });
}

/**
 * saveScore({ score, combo, level })
 */
export async function saveScore({ score, combo, level }) {
  if (!currentUser) return { saved: false, isNewBest: false, error: 'not_logged_in' };

  try {
    const userDocRef = doc(db, 'gameScores', currentUser.uid);
    const docSnap    = await getDoc(userDocRef);

    let isNewBest = false;

    if (docSnap.exists()) {
      const data      = docSnap.data();
      const levelData = data[level];
      const prevBest  = levelData ? (levelData.bestScore || 0) : 0;
      if (score > prevBest) { isNewBest = true; }
      else { return { saved: false, isNewBest: false }; }
    } else {
      isNewBest = true;
    }

    await setDoc(userDocRef, {
      email: currentUser.email,
      [level]: {
        bestScore: score,
        bestCombo: combo,
        savedAt:   serverTimestamp(),
      }
    }, { merge: true });

    cachedScores[level] = { bestScore: score, bestCombo: combo };
    return { saved: true, isNewBest: true };

  } catch (error) {
    console.error('Помилка збереження результату:', error);
    return { saved: false, isNewBest: false, error: error.message };
  }
}

/**
 * saveNickname(nickname)
 * Зберігає нікнейм користувача. Можна викликати повторно — перезаписує.
 * Валідація: 3–20 символів, тільки літери/цифри/пробіл/підкреслення/дефіс.
 * Повертає { saved, error? }
 */
export async function saveNickname(nickname) {
  if (!currentUser) return { saved: false, error: 'not_logged_in' };

  const trimmed = nickname.trim();

  // Валідація довжини
  if (trimmed.length < 3) return { saved: false, error: 'too_short' };
  if (trimmed.length > 20) return { saved: false, error: 'too_long' };

  // Тільки букви (латиниця+кирилиця), цифри, пробіл, _ -
  if (!/^[\p{L}0-9 _\-]+$/u.test(trimmed)) {
    return { saved: false, error: 'invalid_chars' };
  }

  try {
    const userDocRef = doc(db, 'gameScores', currentUser.uid);
    await setDoc(userDocRef, {
      email:    currentUser.email,
      nickname: trimmed,
    }, { merge: true });

    cachedNickname = trimmed;
    return { saved: true };

  } catch (error) {
    console.error('Помилка збереження нікнейму:', error);
    return { saved: false, error: error.message };
  }
}

/**
 * loadLeaderboard()
 * Повертає топ-3 для:
 *   - totalScore: сума easy.bestScore + medium.bestScore + hard.bestScore
 *   - endless:    endless.bestScore
 *
 * Повертає { total: [...], endless: [...] }
 * Кожен елемент: { displayName, score }
 */
export async function loadLeaderboard() {
  try {
    const colRef  = collection(db, 'gameScores');
    const snap    = await getDocs(colRef);

    const totalArr   = [];
    const endlessArr = [];

    snap.forEach(docSnap => {
      const d = docSnap.data();
      const displayName = d.nickname || d.email || '???';

      // Сума балів easy + medium + hard
      const total =
        ((d.easy    && d.easy.bestScore)    ? d.easy.bestScore    : 0) +
        ((d.medium  && d.medium.bestScore)  ? d.medium.bestScore  : 0) +
        ((d.hard    && d.hard.bestScore)    ? d.hard.bestScore    : 0);

      if (total > 0) totalArr.push({ displayName, score: total });

      // Endless
      const endlessScore = (d.endless && d.endless.bestScore) ? d.endless.bestScore : 0;
      if (endlessScore > 0) endlessArr.push({ displayName, score: endlessScore });
    });

    // Сортуємо та беремо топ-3
    totalArr.sort((a, b) => b.score - a.score);
    endlessArr.sort((a, b) => b.score - a.score);

    return {
      total:   totalArr.slice(0, 3),
      endless: endlessArr.slice(0, 3),
    };

  } catch (error) {
    console.error('Помилка завантаження лідерборду:', error);
    return { total: [], endless: [] };
  }
}