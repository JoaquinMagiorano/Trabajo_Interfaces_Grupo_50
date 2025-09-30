document.addEventListener('DOMContentLoaded', () => {
let currentSlide = 0;
const slides = Array.from(document.querySelectorAll('.carrucel_item'));
const indicators = Array.from(document.querySelectorAll('.indicador'));
const totalSlides = slides.length;
const carousel = document.getElementById('carousel');

if(totalSlides === 0) return;

function refreshClasses(){
slides.forEach((slide, index) => {
    slide.classList.remove('activo','prev','next','hidden');
    if(index === currentSlide) slide.classList.add('activo');
    else if(index === (currentSlide - 1 + totalSlides) % totalSlides) slide.classList.add('prev');
    else if(index === (currentSlide + 1) % totalSlides) slide.classList.add('next');
    else slide.classList.add('hidden');
});

indicators.forEach((ind, idx) => {
    ind.classList.toggle('activo', idx === currentSlide);
});
}

function nextSlide(){
    currentSlide = (currentSlide + 1) % totalSlides;
    refreshClasses();
    resetAutoPlay();
}

function prevSlide(){
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    refreshClasses();
    resetAutoPlay();
}

function goToSlide(index){
    if(typeof index !== 'number') return;
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    refreshClasses();
    resetAutoPlay();
}

// Exponer funciones globales si tu HTML las llama (prevSlide(), nextSlide(), goToSlide(n))
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;

// Auto-play
let autoPlayInterval = setInterval(nextSlide, 10000); /*esto maneja el tiempo de las imagenes*/ 

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 10000);
}

// teclado
document.addEventListener('keydown', (e) => {
if(e.key === 'ArrowLeft') prevSlide();
else if(e.key === 'ArrowRight') nextSlide();
});

// touch / swipe
let startX = 0;
if(carousel){
carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});
carousel.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const threshold = 50;
    if(Math.abs(diff) > threshold){
    if(diff > 0) nextSlide(); else prevSlide();
    }
});
}

// Indicators click
indicators.forEach((ind, idx) => ind.addEventListener('click', () => goToSlide(idx)));

// init
refreshClasses();
});