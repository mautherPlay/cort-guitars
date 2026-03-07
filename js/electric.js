document.addEventListener("DOMContentLoaded", () => {
  const guitarData = {
    storm: { title: "Storm X1", img: "images/x1D.jpg", desc: "Cort Storm X1 — це електрогітара для гітаристів, які шукають потужний звук і стильний дизайн за доступною ціною. Вона оснащена корпусом з липи, грифом з клена та накладкою з палісандру, що забезпечує комфортну гру та чіткий тон. Humbucker-пікапи дають насичене звучання для року та металу, а точне налаштування струн забезпечує стабільність під час інтенсивного виконання. Storm X1 ідеально підходить для початківців і тих, хто хоче отримати професійний звук без великих витрат." },
    phantom: { title: "Manson Classic", img: "images/MansonD.jpg", desc: "Cort Manson Classic — класична електрогітара, яка поєднує ретро-дизайн і сучасну функціональність. Її корпус виготовлений з високоякісного червоного дерева, що дає теплий і багатий тон, а гриф з клена забезпечує швидку і комфортну гру. Гітара оснащена сингл- і хамбакер-пікапами, що дозволяє досягати широкого спектру звучання — від чистого джазового тону до потужних рокових рифів. Manson Classic ідеальна для музикантів, які цінують універсальність і стиль у кожній деталі." },
    nova: { title: "G110-BKS", img: "images/G110D.jpg", desc: "Cort G110-BKS — електрогітара, створена для енергійного та яскравого звучання. Її ергономічний корпус і легкий гриф дозволяють зручно грати протягом довгих сесій. Гітара оснащена хамбакер-пікапами, що забезпечують потужний і насичений звук, а стильний чорний матовий корпус додає сучасного вигляду. G110-BKS чудово підходить для початківців і любителів року, які хочуть отримати надійний інструмент із виразним характером." }
  };

  const buttons = document.querySelectorAll(".guitar-btn");
  const guitarModal = document.getElementById("guitarModal");
  const guitarModalImg = document.getElementById("guitarModalImg");
  const guitarModalTitle = document.getElementById("guitarModalTitle");
  const guitarModalDesc = document.getElementById("guitarModalDesc");
  const closeGuitarModal = document.getElementById("closeGuitarModal");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.guitar;
      const data = guitarData[key];
      if (!data) return;
      guitarModalImg.src = data.img;
      guitarModalTitle.textContent = data.title;
      guitarModalDesc.textContent = data.desc;
      guitarModal.style.display = "flex";
      document.body.style.overflow = "hidden";
    });
  });

  closeGuitarModal.addEventListener("click", closeModal);
  guitarModal.addEventListener("click", (e) => { if (e.target === guitarModal) closeModal(); });

  function closeModal() {
    guitarModal.style.display = "none";
    document.body.style.overflow = "auto";
  }

  // Анімація появи при скролі
  const cards = document.querySelectorAll(".electric-card");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
  }, { threshold: 0.3 });
  cards.forEach(card => observer.observe(card));
});