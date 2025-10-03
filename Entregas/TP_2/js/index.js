// ===== UTILIDADES COMPARTIDAS =====

/*
menuToShow: menu que se muestra
menuToHide: menu que se oculta
backdrop: fondo oscuro
*/
const toggleMenu = (menuToShow, menuToHide, backdrop) => {
  menuToShow.classList.toggle("visible") /*alterna la clase visible*/
  menuToHide.classList.remove("visible") /*remueve la clase visible*/

  /*verifica si algun menu tiene la clase visible*/
  const anyMenuVisible = menuToShow.classList.contains("visible") || menuToHide.classList.contains("visible")
  /*muestra/oculta el fondo si hay algun menu visible*/
  backdrop.classList.toggle("visible", anyMenuVisible)
}

// ===== MENÚS DESPLEGABLES =====
document.addEventListener("DOMContentLoaded", () => {
  const hamburguesa_Btn = document.querySelector(".hamburgesa_btn")
  const menu_desplegable = document.querySelector(".menu_desplegable")
  const btn_configuracion = document.querySelector(".btn_configuracion")
  const menu_configuracion_desplegable = document.querySelector(".menu_configuracion_desplegable")
  const pantallaFondo = document.querySelector(".menu_container")

  if (hamburguesa_Btn && menu_desplegable) {
    hamburguesa_Btn.addEventListener("click", () => {
      toggleMenu(menu_desplegable, menu_configuracion_desplegable, pantallaFondo)
    })
  }

  if (btn_configuracion && menu_configuracion_desplegable) {
    btn_configuracion.addEventListener("click", () => {
      toggleMenu(menu_configuracion_desplegable, menu_desplegable, pantallaFondo)
    })
  }
})

// ===== CARRUSEL PRINCIPAL =====
class MainCarousel {
  constructor(selector) {
    this.carousel = document.querySelector(selector)
    if (!this.carousel) return

    this.slides = Array.from(this.carousel.querySelectorAll(".carrusel_item"))
    this.indicators = Array.from(document.querySelectorAll(".indicador"))
    this.totalSlides = this.slides.length
    this.currentSlide = 0
    this.autoPlayInterval = null

    if (this.totalSlides === 0) return

    this.init()
  }

  init() {
    this.updateClasses()
    this.startAutoPlay()
    this.attachEventListeners()

    // Exponer métodos globalmente para onclick en HTML
    window.nextSlide = () => this.next()
    window.prevSlide = () => this.prev()
  }

  updateClasses() {
    this.slides.forEach((slide, index) => {
      slide.classList.remove("activo", "prev", "next", "hidden")

      if (index === this.currentSlide) {
        slide.classList.add("activo")
      } else if (index === (this.currentSlide - 1 + this.totalSlides) % this.totalSlides) {
        slide.classList.add("prev")
      } else if (index === (this.currentSlide + 1) % this.totalSlides) {
        slide.classList.add("next")
      } else {
        slide.classList.add("hidden")
      }
    })

    this.indicators.forEach((ind, idx) => {
      ind.classList.toggle("activo", idx === this.currentSlide)
    })
  }

  next() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides
    this.updateClasses()
    this.resetAutoPlay()
  }

  prev() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides
    this.updateClasses()
    this.resetAutoPlay()
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.next(), 10000)
  }

  resetAutoPlay() {
    clearInterval(this.autoPlayInterval)
    this.startAutoPlay()
  }

  attachEventListeners() {
    // Teclado
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prev()
      if (e.key === "ArrowRight") this.next()
    })

    // Touch
    let startX = 0
    this.carousel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
    })

    this.carousel.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX
      const diff = startX - endX
      const threshold = 50

      if (Math.abs(diff) > threshold) {
        diff > 0 ? this.next() : this.prev()
      }
    })
  }
}

// ===== MINI CARRUSEL =====
class MiniCarousel {
  constructor(selector) {
    this.container = document.querySelector(selector)
    if (!this.container) return

    this.carousel = this.container.querySelector(".mini_carrusel")
    this.prevBtn = this.container.querySelector(".prev-btn")
    this.nextBtn = this.container.querySelector(".next-btn")
    this.items = Array.from(this.carousel.querySelectorAll(".mini_carrusel-item"))
    this.totalItems = this.items.length
    this.currentIndex = 0
    this.animationStep = 0
    this.isAnimating = false
    this.maxIndex = Math.max(0, this.totalItems - 3)

    this.init()
  }

  init() {
    this.updateClasses()
    this.updateButtons()
    this.attachEventListeners()
  }

  getItemClass(index) {
    const effectiveIndex = this.currentIndex + this.animationStep
    const activeIndices = [effectiveIndex, effectiveIndex + 1, effectiveIndex + 2]

    if (index === activeIndices[0]) return "active-left"
    if (index === activeIndices[1]) return "active-center"
    if (index === activeIndices[2]) return "active-right"
    if (index === effectiveIndex - 1) return "prev"
    if (index === effectiveIndex + 3) return "next"
    if (index < effectiveIndex - 1) return "hidden-left"
    return "hidden-right"
  }

  updateClasses() {
    this.items.forEach((element, index) => {
      element.className = `mini_carrusel-item ${this.getItemClass(index)}`
    })
  }

  updateButtons() {
    const isAtStart = this.currentIndex === 0
    const isAtEnd = this.currentIndex >= this.maxIndex

    this.prevBtn.classList.toggle("disabled", isAtStart)
    this.prevBtn.disabled = isAtStart

    this.nextBtn.classList.toggle("disabled", isAtEnd)
    this.nextBtn.disabled = isAtEnd
  }

  animateTransition(direction) {
    if (this.isAnimating) return

    this.isAnimating = true
    const steps = 3
    const stepDuration = 200
    let step = 0

    const interval = setInterval(() => {
      step++
      this.animationStep = direction === "next" ? step : -step
      this.updateClasses()

      if (step >= steps) {
        clearInterval(interval)
        setTimeout(() => {
          this.currentIndex =
            direction === "next" ? Math.min(this.currentIndex + 3, this.maxIndex) : Math.max(this.currentIndex - 3, 0)

          this.animationStep = 0
          this.updateClasses()
          this.updateButtons()
          this.isAnimating = false
        }, 50)
      }
    }, stepDuration)
  }

  next() {
    if (this.currentIndex < this.maxIndex && !this.isAnimating) {
      this.animateTransition("next")
    }
  }

  prev() {
    if (this.currentIndex > 0 && !this.isAnimating) {
      this.animateTransition("prev")
    }
  }

  attachEventListeners() {
    this.prevBtn.addEventListener("click", () => this.prev())
    this.nextBtn.addEventListener("click", () => this.next())

    // Teclado
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && this.currentIndex > 0) this.prev()
      if (e.key === "ArrowRight" && this.currentIndex < this.maxIndex) this.next()
    })

    // Touch
    let startX = 0
    this.carousel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
    })

    this.carousel.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX
      const diff = startX - endX
      const threshold = 50

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && this.currentIndex < this.maxIndex) this.next()
        if (diff < 0 && this.currentIndex > 0) this.prev()
      }
    })
  }
}

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", () => {
  new MainCarousel("#carousel")
  new MiniCarousel(".mini_carrusel_contenedor")
})