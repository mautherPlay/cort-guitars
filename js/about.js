document.addEventListener("DOMContentLoaded", () => {

  // Паралакс відео при скролі
  const videos = document.querySelectorAll("#about-premium video");
  window.addEventListener("scroll", () => {
    videos.forEach(video => {
      const rect = video.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const offset = (windowHeight - rect.top) * 0.05;
        video.style.transform = `scale(1.2) translateY(${offset}px)`;
      }
    });
  });

  // Кнопки звуку
  const soundButtons = document.querySelectorAll("#about-premium .sound-toggle");

  soundButtons.forEach(btn => {
    const video = btn.previousElementSibling; // відео перед кнопкою

    btn.addEventListener("click", () => {
      video.muted = !video.muted;
      btn.textContent = video.muted ? "🔇" : "🔊";
    });
  });

});