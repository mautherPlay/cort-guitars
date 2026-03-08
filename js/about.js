document.addEventListener("DOMContentLoaded", () => {

  // Запускаємо всі відео вручну — fallback для Android
  // (autoplay може блокуватись до першого скролу)
  const videos = document.querySelectorAll("#about-premium video");

  videos.forEach(video => {
    video.muted = true;
    const tryPlay = () => {
      video.play().catch(() => {});
    };
    tryPlay();
    // Повторна спроба при скролі (Android unlock)
    window.addEventListener("scroll", tryPlay, { once: true });
    window.addEventListener("touchstart", tryPlay, { once: true });
  });

  // Кнопки звуку
  const soundButtons = document.querySelectorAll("#about-premium .sound-toggle");
  soundButtons.forEach(btn => {
    const video = btn.previousElementSibling;
    btn.addEventListener("click", () => {
      video.muted = !video.muted;
      btn.textContent = video.muted ? "🔇" : "🔊";
    });
  });

});