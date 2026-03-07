// js/login.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const emailInput = document.getElementById("loginEmail");
const passwordInput = document.getElementById("loginPassword");

loginBtn.addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Будь ласка, введіть Email та пароль!");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Вхід успішний!");
      window.location.href = "index.html"; // Перенаправление на главную
    })
    .catch((error) => {
      alert("Помилка: " + error.message);
    });
});

// Скрываем кнопку "Зареєструватися" на главной странице, если пользователь вошёл
onAuthStateChanged(auth, (user) => {
  if (user) {
    const registerBtn = document.querySelector('header.navbar nav a.btn');
    if (registerBtn) registerBtn.style.display = 'none';
  }
});