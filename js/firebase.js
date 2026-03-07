// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// ↑ ДОДАНО: імпорт Firestore — потрібен для збереження результатів гри

// Конфигурация твоего проекта Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDTrXDCi_O9UMQRbP5tqvstgZZxq5y9kmA",
  authDomain: "useraut-58945.firebaseapp.com",
  projectId: "useraut-58945",
  storageBucket: "useraut-58945.firebasestorage.app",
  messagingSenderId: "181937486925",
  appId: "1:181937486925:web:9257dd4a234abf4ec47004"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспортируем auth для использования в auth.js
export const auth = getAuth(app);

export const db = getFirestore(app);
// ↑ ДОДАНО: експорт db — використовується тільки в game-firebase.js
// auth.js, login.js, userStatus.js імпортують тільки auth — вони не змінюються