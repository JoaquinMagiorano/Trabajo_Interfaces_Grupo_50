let currentSlide = 0;
const slides = document.querySelectorAll('.carrusel_item');
const indicators = document.querySelectorAll('.indicador');
const totalSlides = slides.length;

function updateCarrusel() {
    slides.forEach((slide, index) => {
        slide.classList.remove('activo', 'prev', 'next', 'hidden');
        if (index === currentSlide) {
            slide.classList.add('activo');
        } else if (index === (currentSlide - 1 + totalSlides) % totalSlides) {
            slide.classList.add('prev');
        } else if (index === (currentSlide + 1) % totalSlides) {
            slide.classList.add('next');
        } else {
            slide.classList.add('hidden');
        }
    });
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('activo', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarrusel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarrusel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarrusel();
}

// Auto-play
let autoPlayInterval = setInterval(nextSlide, 5000);

// Pausar auto-play al hover
const carousel = document.getElementById('carousel');
carousel.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});
carousel.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
});

// Touch/Swipe para móviles
let startX = 0;
let endX = 0;
carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});
carousel.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
});
function handleSwipe() {
    const swipeThreshold = 50;
    const diff = startX - endX;
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) nextSlide();
        else prevSlide();
    }
}

// Inicializar
updateCarrusel();