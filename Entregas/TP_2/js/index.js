
const hamburguesa_Btn = document.querySelector('.hamburgesa_btn');
const menu_desplegable = document.querySelector('.menu_desplegable');
const btn_configuracion = document.querySelector('.btn_configuracion');
const menu_configuracion_desplegable = document.querySelector('.menu_configuracion_desplegable');
const pantallaFondo = document.querySelector('.menu_container');



hamburguesa_Btn.addEventListener('click', function() {
    menu_desplegable.classList.toggle('visible');
    menu_configuracion_desplegable.classList.remove('visible');
    actualizarFondo();
});

btn_configuracion.addEventListener('click', function() {
    menu_configuracion_desplegable.classList.toggle('visible');
    menu_desplegable.classList.remove('visible');
    actualizarFondo();
});

function actualizarFondo() {
    if (menu_desplegable.classList.contains('visible') ||
        menu_configuracion_desplegable.classList.contains('visible')) {
        pantallaFondo.classList.add('visible');
    } else {
        pantallaFondo.classList.remove('visible');
    }
}

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

    // Exponer funciones globales para el HTML
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;

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
    // Inicializar el carrusel
    refreshClasses();
});






// Carrusel pequeño - Navegación simple sin loop
document.addEventListener("DOMContentLoaded", () => {
  let currentIndex = 0 // Índice del primer elemento activo
  const items = Array.from(document.querySelectorAll(".carrusel_pequeno_item"))
  const totalItems = items.length
  const prevBtn = document.querySelector(".prev-btn-small")
  const nextBtn = document.querySelector(".next-btn-small")

  if (totalItems === 0) return

  function getVisibleIndices() {
    // Si estamos cerca del final y no hay suficientes elementos para llenar 3 posiciones
    const remainingItems = totalItems - currentIndex

    if (remainingItems < 3) {
      // Mostrar los últimos 3 elementos
      return [totalItems - 3, totalItems - 2, totalItems - 1]
    }

    // Mostrar los 3 elementos desde currentIndex
    return [currentIndex, currentIndex + 1, currentIndex + 2]
  }

  function refreshClasses() {
    const visibleIndices = getVisibleIndices()

    items.forEach((item, index) => {
      // Remover todas las clases de estado
      item.className = "carrusel_pequeno_item"

      // Determinar la posición del elemento
      if (visibleIndices.includes(index)) {
        // Elementos activos (los 3 visibles)
        const positionInGroup = visibleIndices.indexOf(index)
        if (positionInGroup === 0) {
          item.classList.add("activo-left")
        } else if (positionInGroup === 1) {
          item.classList.add("activo-center")
        } else {
          item.classList.add("activo-right")
        }
      } else if (index > visibleIndices[2]) {
        // Elementos a la derecha (next)
        const offset = index - visibleIndices[2]
        if (offset === 1) {
          item.classList.add("next-left")
        } else if (offset === 2) {
          item.classList.add("next-center")
        } else if (offset === 3) {
          item.classList.add("next-right")
        } else {
          item.classList.add("hidden-right")
        }
      } else if (index < visibleIndices[0]) {
        // Elementos a la izquierda (prev)
        const offset = visibleIndices[0] - index
        if (offset === 1) {
          item.classList.add("prev-right")
        } else if (offset === 2) {
          item.classList.add("prev-center")
        } else if (offset === 3) {
          item.classList.add("prev-left")
        } else {
          item.classList.add("hidden-left")
        }
      }
    })

    updateButtons()
  }

  // Función para actualizar el estado de los botones
  function updateButtons() {
    // Deshabilitar botón prev si estamos al inicio
    prevBtn.disabled = currentIndex === 0

    // Deshabilitar botón next si estamos mostrando los últimos 3 elementos
    const visibleIndices = getVisibleIndices()
    nextBtn.disabled = visibleIndices[2] === totalItems - 1
  }

  function nextSlideSmall() {
    const visibleIndices = getVisibleIndices()

    // Si ya estamos mostrando los últimos 3, no hacer nada
    if (visibleIndices[2] === totalItems - 1) return

    // Avanzar 3 posiciones
    currentIndex = Math.min(currentIndex + 3, totalItems - 3)
    refreshClasses()
  }

  function prevSlideSmall() {
    if (currentIndex === 0) return

    // Retroceder 3 posiciones
    currentIndex = Math.max(currentIndex - 3, 0)
    refreshClasses()
  }

  // Exponer funciones globales para el HTML
  window.nextSlideSmall = nextSlideSmall
  window.prevSlideSmall = prevSlideSmall

  // Inicializar el carrusel
  refreshClasses()
})
