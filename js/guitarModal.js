// Дані для секції 1
const guitarsSection = [
  { img: "images/Cort1.jpg", title: "Gold-Passion", desc: "Верхня дека з ялини, витримана до вінтажного стану, надає Gold-Passion жвавого, гармонійно складного звучання, яке зазвичай асоціюється з акустичними інструментами, що витримують десятиліття. Від унікального скошеного вирізу до ручної обробки корпусу та ладів, кожен аспект Gold-Passion оптимізований для позачасової зручності гри та звучання." },
  { img: "images/Cort2.jpg", title: "Essence-OC4", desc: "Серія Essence пропонує чисте звучання акустичної гітари. Зосередившись на основних елементах, ми створили гітару, яка забезпечує винятковий звук та зручність гри за доступною ціною. Верхня дека з твердої торрефікованої ситкинської ялини створює насичений, теплий тон, ідеально збалансований нижньою декою та боковинами з червоного дерева. Витончена розетка \"ялинка\" та оребрення додають візуальної привабливості, а система передпідсилювача Fishman гарантує, що ваш звук залишиться чистим та яскравим, навіть на сцені. Серія Essence пропонує ідеальне поєднання ціни та якості, що відповідає вашому стилю." },
  { img: "images/Cort3.jpg", title: "AD810 Standart", desc: "Найстаріша акустична серія Cort, Standard Series, втілює чудову продуктивність та співвідношення ціни та якості. Гітари Standard Series доступні за ціною, але пропонують хорошу та надійну роботу як для початківців, так і для аматорів у різноманітних моделях з різними функціями для будь-якої ігрової ситуації. AD810 має верхню деку з ялини, нижню деку та боки з червоного дерева, а гриф — з мербау." }
];

// Знаходимо кнопки та елементи модалки
const buttonsSection = document.querySelectorAll("#section1 .details-btn");
const modalSection = document.getElementById("guitarSectionModal");
const modalImgSection = document.getElementById("modalSectionImg");
const modalTitleSection = document.getElementById("modalSectionTitle");
const modalDescSection = document.getElementById("modalSectionDesc");
const closeSectionBtn = document.getElementById("closeSectionModal");

// Відкриття модалки по кнопці
buttonsSection.forEach((btn) => {
  btn.addEventListener("click", () => {
    const idx = parseInt(btn.dataset.index);
    const data = guitarsSection[idx];

    modalImgSection.src = data.img;
    modalTitleSection.textContent = data.title;
    modalDescSection.textContent = data.desc;

    modalSection.style.display = "flex";
  });
});

// Закриття модалки по хресту
closeSectionBtn.addEventListener("click", () => {
  modalSection.style.display = "none";
});

// Закриття при кліку поза модалкою
window.addEventListener("click", (e) => {
  if (e.target === modalSection) {
    modalSection.style.display = "none";
  }
});