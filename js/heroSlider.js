// Список фонів
const heroImages = [
  'images/hero1.jpg',
  'images/hero2.jpg',
  'images/hero3.jpg'
];

const hero = document.getElementById('hero');

// Створюємо div для кожного фото
heroImages.forEach((img, index) => {
  const div = document.createElement('div');
  div.classList.add('hero-bg');
  if(index === 0) div.classList.add('active');
  div.style.backgroundImage = `url('${img}')`;
  hero.appendChild(div);
});

let current = 0;
const slides = document.querySelectorAll('.hero-bg');

setInterval(() => {
  slides[current].classList.remove('active');
  current = (current + 1) % slides.length;
  slides[current].classList.add('active');
}, 5000); // кожні 5 секунд