// js/footer.js
// Email береться з авторизованого акаунту Firebase (не з поля форми)
document.addEventListener("DOMContentLoaded", function() {
  var contactForm = document.getElementById("contactForm");
  var formStatus  = document.getElementById("formStatus");

  // Відстежуємо поточного юзера через compat SDK
  var currentUserEmail = null;
  firebase.auth().onAuthStateChanged(function(user) {
    currentUserEmail = user ? user.email : null;
  });

  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();

    if (!currentUserEmail) {
      formStatus.textContent = "Щоб відправити повідомлення, зайдіть на акаунт.";
      formStatus.style.color = "#ff5a5f";
      return;
    }

    var name    = contactForm.name.value.trim();
    var message = contactForm.message.value.trim();

    if (!name || !message) {
      formStatus.textContent = "Будь ласка, заповніть усі поля!";
      formStatus.style.color = "#ff5a5f";
      return;
    }

    var btnSubmit = contactForm.querySelector("button[type='submit']");
    btnSubmit.disabled = true;
    formStatus.textContent = "Відправляємо...";
    formStatus.style.color = "#888";

    firebase.firestore().collection("messages").add({
      name: name,
      email: currentUserEmail,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(function() {
      formStatus.textContent = "Дякуємо! Повідомлення надіслано ✅";
      formStatus.style.color = "#4caf50";
      contactForm.reset();
      btnSubmit.disabled = false;
    })
    .catch(function(error) {
      console.error("Помилка надсилання:", error);
      formStatus.textContent = "Сталася помилка. Спробуйте пізніше.";
      formStatus.style.color = "#ff5a5f";
      btnSubmit.disabled = false;
    });
  });
});