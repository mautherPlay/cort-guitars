// Дані для електрогітар
const electricFeaturesData = {
  pickups: {
    title: "Пікапи",
    img: "images/pickups-detail.jpg",
    desc: "Пікапи визначають характер звуку гітари. Humbucker-пікапи забезпечують теплий, повний тон із мінімумом шуму, тоді як сингл-пікапи дають ясний, чіткий звук із високою деталізацією. Вони ідеально підходять для різних жанрів: від чистого джазу до важкого року."
  },
  body: {
    title: "Корпус",
    img: "images/body-detail.jpg",
    desc: "Матеріал і форма корпусу впливають на резонанс та баланс гітари. Липовий або червоне дерево забезпечує теплий, насичений звук, а ергономічна форма дозволяє зручно тримати інструмент навіть під час довгих сесій. Корпус також визначає естетику та загальний вигляд інструменту."
  },
  neck: {
    title: "Гриф",
    img: "images/neck-detail.jpg",
    desc: "Гриф визначає зручність гри та точність виконання. Кленовий або махагоновий гриф із накладкою з палісандру чи ятоба забезпечує гладку поверхню для пальців та чіткий відгук струн. Конструкція та профіль грифа впливають на швидкість та комфорт гри як для акордів, так і для соло."
  },
  bridge: {
    title: "Хедсток",
    img: "images/bridge-detail.jpg",
    desc: "Голова грифа — це верхня частина інструменту, де розташовані колки для натягу струн. Вона визначає естетику гітари та зручність налаштування. Високоякісні колки забезпечують стабільність строю навіть при активній грі, а оригінальний дизайн додає гітарі характеру та впізнаваності."
  }
};

// Елементи модалки
const electricButtons = document.querySelectorAll("#electric-features .feature-btn");
const electricModal = document.getElementById("electricFeaturesModal");
const electricModalImg = document.getElementById("electricModalImg");
const electricModalTitle = document.getElementById("electricModalTitle");
const electricModalDesc = document.getElementById("electricModalDesc");
const closeElectricModal = document.getElementById("closeElectricModal");

// Відкриття модалки по кнопці
electricButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.feature;
    const data = electricFeaturesData[key];
    if (!data) return;

    electricModalImg.src = data.img;
    electricModalTitle.textContent = data.title;
    electricModalDesc.textContent = data.desc;

    electricModal.style.display = "flex";
  });
});

// Закриття по хресту
closeElectricModal.addEventListener("click", () => {
  electricModal.style.display = "none";
});

// Закриття при кліку поза модалкою
window.addEventListener("click", (e) => {
  if (e.target === electricModal) {
    electricModal.style.display = "none";
  }
});