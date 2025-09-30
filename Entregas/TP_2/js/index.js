document.addEventListener('DOMContentLoaded', () => {
    let currentSlide = 0;
    const slides = Array.from(document.querySelectorAll('.carrusel_item'));
    const indicators = Array.from(document.querySelectorAll('.indicador'));
    const totalSlides = slides.length;
    const carousel = document.getElementById('carousel');

    // Validación: si no hay slides, no hacer nada
    if(totalSlides === 0) return;

    // Función para actualizar las clases de los slides e indicadores
    function refreshClasses() {
        slides.forEach((slide, index) => {
            slide.classList.remove('activo', 'prev', 'next', 'hidden');
            if(index === currentSlide) {
                slide.classList.add('activo');
            } else if(index === (currentSlide - 1 + totalSlides) % totalSlides) {
                slide.classList.add('prev');
            } else if(index === (currentSlide + 1) % totalSlides) {
                slide.classList.add('next');
            } else {
                slide.classList.add('hidden');
            }
        });

        indicators.forEach((ind, idx) => {
            ind.classList.toggle('activo', idx === currentSlide);
        });
    }

    // Navegar al siguiente slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        refreshClasses();
        resetAutoPlay();
    }

    // Navegar al slide anterior
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        refreshClasses();
        resetAutoPlay();
    }

    // Ir a un slide específico
    function goToSlide(index) {
        if(typeof index !== 'number') return;
        currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
        refreshClasses();
        resetAutoPlay();
    }

    // Exponer funciones globales para el HTML
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    window.goToSlide = goToSlide;

    // Auto-play: cambia de slide cada 10 segundos
    let autoPlayInterval = setInterval(nextSlide, 10000);

    // Reiniciar el timer de auto-play cuando el usuario interactúa
    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 10000);
    }

    // Navegación con teclado (flechas izquierda/derecha)
    document.addEventListener('keydown', (e) => {
        if(e.key === 'ArrowLeft') {
            prevSlide();
        } else if(e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Navegación táctil (swipe)
    let startX = 0;
    if(carousel) {
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const threshold = 50;
            
            if(Math.abs(diff) > threshold) {
                if(diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });
    }

    // Click en indicadores
    indicators.forEach((ind, idx) => {
        ind.addEventListener('click', () => goToSlide(idx));
    });

    // Inicializar el carrusel
    refreshClasses();
});