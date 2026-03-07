// js/userStatus.js
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Получаем элементы navbar
const registerBtn = document.getElementById("registerBtn");
const userContainer = document.getElementById("userContainer");
const userNameSpan = document.getElementById("userName");

// Создаем кнопку "Вийти"
let logoutBtn = document.createElement("button");
logoutBtn.textContent = "Вийти";
logoutBtn.style.padding = "0.5rem 1rem";
logoutBtn.style.borderRadius = "6px";
logoutBtn.style.border = "none";
logoutBtn.style.background = "#464845";
logoutBtn.style.color = "#fff";
logoutBtn.style.cursor = "pointer";
logoutBtn.style.marginLeft = "0.5rem";

// Добавляем обработчик выхода
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    alert("Ви вийшли з акаунта.");
  }).catch((error) => {
    alert("Помилка виходу: " + error.message);
  });
});

// Следим за изменением состояния пользователя
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Скрываем кнопку регистрации
    if (registerBtn) registerBtn.style.display = 'none';

    // Показываем контейнер пользователя
    if (userContainer) {
      userContainer.style.display = 'flex';
      userNameSpan.textContent = user.email;

      // Добавляем кнопку "Вийти", если её ещё нет
      if (!userContainer.contains(logoutBtn)) {
        userContainer.appendChild(logoutBtn);
      }
    }
  } else {
    // Пользователь вышел — возвращаем кнопку регистрации
    if (registerBtn) registerBtn.style.display = 'inline-block';
    if (userContainer) {
      userContainer.style.display = 'none';
    }
  }
});