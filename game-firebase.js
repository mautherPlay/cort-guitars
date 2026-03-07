
//   gameScores/{userId}:
//     email: "..."
//     easy:   { bestScore, bestCombo, savedAt }
//     medium: { bestScore, bestCombo, savedAt }
//     hard:   { bestScore, bestCombo, savedAt }

import { auth, db } from './js/firebase.js';

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// ─────────────────────────────────────────────────────────────────────
// ВНУТРІШНІЙ СТАН
// ─────────────────────────────────────────────────────────────────────

let currentUser = null;

// Кеш усіх трьох рекордів одразу:
// { easy: {bestScore, bestCombo} | null,
//   medium: {bestScore, bestCombo} | null,
//   hard: {bestScore, bestCombo} | null }
let cachedScores = { easy: null, medium: null, hard: null };


// ─────────────────────────────────────────────────────────────────────
// ПУБЛІЧНІ ФУНКЦІЇ
// ─────────────────────────────────────────────────────────────────────

export function getCurrentUser() {
  return currentUser;
}

// Повертає кеш рекордів для всіх рівнів
export function getCachedScores() {
  return cachedScores;
}

/**
 * initGameFirebase({ onUserLoggedIn, onUserLoggedOut })
 * Запускає слухач авторизації. Спрацьовує одразу при завантаженні.
 * onUserLoggedIn(user, scores) — scores = { easy, medium, hard }
 */
export function initGameFirebase({ onUserLoggedIn, onUserLoggedOut }) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      console.log("Гра: користувач увійшов:", user.email);

      // Завантажуємо всі три рекорди одним запитом
      const scores = await loadAllScores(user.uid);
      cachedScores = scores;

      onUserLoggedIn(user, scores);
    } else {
      currentUser = null;
      cachedScores = { easy: null, medium: null, hard: null };
      console.log("Гра: користувач не залогінений");
      onUserLoggedOut();
    }
  });
}

/**
 * saveScore({ score, combo, level })
 * Зберігає результат для конкретного рівня.
 * Перезаписує тільки якщо новий результат кращий за попередній для цього рівня.
 *
 * Повертає: { saved, isNewBest, error? }
 */
export async function saveScore({ score, combo, level }) {
  if (!currentUser) {
    return { saved: false, isNewBest: false, error: 'not_logged_in' };
  }

  try {
    const userDocRef = doc(db, 'gameScores', currentUser.uid);
    const docSnap    = await getDoc(userDocRef);

    let isNewBest = false;

    if (docSnap.exists()) {
      // Документ є — перевіряємо рекорд ТІЛЬКИ для цього рівня
      const data     = docSnap.data();
      const levelData = data[level]; // data.easy / data.medium / data.hard
      const prevBest  = levelData ? (levelData.bestScore || 0) : 0;

      if (score > prevBest) {
        isNewBest = true;
      } else {
        // Результат не кращий для цього рівня — не зберігаємо
        return { saved: false, isNewBest: false };
      }
    } else {
      // Документ не існує — перший результат юзера
      isNewBest = true;
    }

    // Зберігаємо тільки поле конкретного рівня, не торкаємось інших.
    // merge: true гарантує що easy/medium/hard не перезапишуть один одного.
    await setDoc(userDocRef, {
      email: currentUser.email,
      // Зберігаємо під ключем рівня: 'easy', 'medium' або 'hard'
      [level]: {
        bestScore: score,
        bestCombo: combo,
        savedAt:   serverTimestamp(),
      }
    }, { merge: true });

    // Оновлюємо кеш для цього рівня
    cachedScores[level] = { bestScore: score, bestCombo: combo };

    return { saved: true, isNewBest: true };

  } catch (error) {
    console.error('Помилка збереження результату:', error);
    return { saved: false, isNewBest: false, error: error.message };
  }
}


// ─────────────────────────────────────────────────────────────────────
// ПРИВАТНА ФУНКЦІЯ
// ─────────────────────────────────────────────────────────────────────

/**
 * loadAllScores(uid)
 * Завантажує один документ і витягує рекорди для всіх трьох рівнів.
 * Повертає: { easy, medium, hard } де кожен або { bestScore, bestCombo } або null
 */
async function loadAllScores(uid) {
  try {
    const userDocRef = doc(db, 'gameScores', uid);
    const docSnap    = await getDoc(userDocRef);

    // Порожній результат за замовчуванням
    const result = { easy: null, medium: null, hard: null };

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Витягуємо дані для кожного рівня якщо вони є
      ['easy', 'medium', 'hard'].forEach(level => {
        if (data[level] && data[level].bestScore) {
          result[level] = {
            bestScore: data[level].bestScore || 0,
            bestCombo: data[level].bestCombo || 0,
          };
        }
      });
    }

    return result;

  } catch (error) {
    console.error('Помилка завантаження результатів:', error);
    return { easy: null, medium: null, hard: null };
  }
}