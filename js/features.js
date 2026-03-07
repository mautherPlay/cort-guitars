// Дані характеристик
const featureData = {
  "strings": {
    title: "Струни",
    img: "images/strings-detail.jpg",
    text: "Використовуємо високоякісні струни для чистого і насиченого звучання.",
    video: "videos/strings.mp4"
  },
  "wood": {
    title: "Матеріал (Дерево)",
    img: "images/wood-detail.jpg",
    text: "Вибрана деревина для корпусу та грифу, що забезпечує оптимальний резонанс.",
    video: "videos/wood.mp4"
  },
  "open-core": {
    title: "Технологія Open Core",
    img: "images/open-core-detail.jpg",
    text: "Технологія Open Core підвищує глибину та насиченість звучання гітари.",
    video: "videos/opencore.mp4"
  },
  "finish": {
    title: "Ексклюзивна обробка",
    img: "images/finish-detail.jpg",
    text: "Лакування та полірування захищають гітару та додають преміальний вигляд.",
    video: "videos/finish.mp4"
  }
};

// Повна ініціалізація після DOM
document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("featureModal");
  const modalImg = document.getElementById("featureModalImg");
  const modalTitle = document.getElementById("featureModalTitle");
  const modalText = document.getElementById("featureModalDesc");
  const modalVideo = document.getElementById("featureModalVideo");
  const modalVideoSource = modalVideo.querySelector("source");
  const closeModal = modal.querySelector(".close");

  document.querySelectorAll(".feature-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-feature");
      const data = featureData[key];
      if(!data) return;

      modalImg.src = data.img;
      modalTitle.textContent = data.title;
      modalText.textContent = data.text;
      modalVideoSource.src = data.video;
      modalVideo.load();

      modal.style.display = "flex";
    });
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    modalVideo.pause();
    modalVideo.currentTime = 0;
  });

  window.addEventListener("click", (e) => {
    if(e.target === modal){
      modal.style.display = "none";
      modalVideo.pause();
      modalVideo.currentTime = 0;
    }
  });

});