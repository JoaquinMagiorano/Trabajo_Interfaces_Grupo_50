/* ========================================
   MENÚS DESPLEGABLES
   ======================================== */
const hamburguesa_btn = document.querySelector(".hamburguesa_btn")
const menu_desplegable = document.querySelector(".menu_desplegable")
const btn_configuracion = document.querySelector(".btn_configuracion")
const menu_configuracion_desplegable = document.querySelector(".menu_configuracion_desplegable")
const pantallaFondo = document.querySelector(".menu_container")

hamburguesa_btn.addEventListener("click", () => {
  menu_desplegable.classList.toggle("visible")
  menu_configuracion_desplegable.classList.remove("visible")
  actualizarFondo()
})

btn_configuracion.addEventListener("click", () => {
  menu_configuracion_desplegable.classList.toggle("visible")
  menu_desplegable.classList.remove("visible")
  actualizarFondo()
})

function actualizarFondo() {
  if (menu_desplegable.classList.contains("visible") || menu_configuracion_desplegable.classList.contains("visible")) {
    pantallaFondo.classList.add("visible")
  } else {
    pantallaFondo.classList.remove("visible")
  }
}

/* ========================================
   CARRUSEL PRINCIPAL
   ======================================== */
const carousel_principal = document.querySelector("#carousel")

let slides_principales = []
if (carousel_principal) {
  const elementos_encontrados = carousel_principal.querySelectorAll(".carrusel_item")
  slides_principales = Array.from(elementos_encontrados)
}

const indicadores_principales = Array.from(document.querySelectorAll(".indicador"))
let indice_slide_actual = 0
let intervalo_autoplay = null

function actualizarSlidesPrincipales() {
  slides_principales.forEach((slide, index) => {
    slide.classList.remove("activo", "anterior", "siguiente", "hidden")

    if (index === indice_slide_actual) {
      slide.classList.add("activo")
    } else if (index === (indice_slide_actual - 1 + slides_principales.length) % slides_principales.length) {
      slide.classList.add("anterior")
    } else if (index === (indice_slide_actual + 1) % slides_principales.length) {
      slide.classList.add("siguiente")
    } else {
      slide.classList.add("hidden")
    }
  })

  indicadores_principales.forEach((ind, idx) => {
    if (idx === indice_slide_actual) {
      ind.classList.add("activo")
    } else {
      ind.classList.remove("activo")
    }
  })
}

function siguienteSlide() {
  indice_slide_actual = (indice_slide_actual + 1) % slides_principales.length
  actualizarSlidesPrincipales()
  reiniciarAutoplay()
}

function anteriorSlide() {
  indice_slide_actual = (indice_slide_actual - 1 + slides_principales.length) % slides_principales.length
  actualizarSlidesPrincipales()
  reiniciarAutoplay()
}

function iniciarAutoplay() {
  intervalo_autoplay = setInterval(siguienteSlide, 10000)
}

function reiniciarAutoplay() {
  clearInterval(intervalo_autoplay)
  iniciarAutoplay()
}

// Exponer funciones para botones HTML
window.siguienteSlide = siguienteSlide
window.anteriorSlide = anteriorSlide

// Control por teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    anteriorSlide()
  }
  if (e.key === "ArrowRight") {
    siguienteSlide()
  }
})

// Control táctil
let touch_inicio_x = 0
if (carousel_principal) {
  carousel_principal.addEventListener("touchstart", (e) => {
    touch_inicio_x = e.touches[0].clientX
  })

  carousel_principal.addEventListener("touchend", (e) => {
    const touch_fin_x = e.changedTouches[0].clientX
    const diferencia = touch_inicio_x - touch_fin_x

    if (Math.abs(diferencia) > 50) {
      if (diferencia > 0) {
        siguienteSlide()
      } else {
        anteriorSlide()
      }
    }
  })
}

// Inicializar carrusel principal
if (slides_principales.length > 0) {
  actualizarSlidesPrincipales()
  iniciarAutoplay()
}

/* ========================================
   MINI CARRUSEL
   ======================================== */
const todos_los_mini_carruseles = document.querySelectorAll(".mini_carrusel_contenedor")

todos_los_mini_carruseles.forEach((contenedor_mini) => {
  const mini_carousel = contenedor_mini.querySelector(".mini_carrusel")
  const btn_anterior_mini = contenedor_mini.querySelector(".btn_anterior")
  const btn_siguiente_mini = contenedor_mini.querySelector(".btn_siguiente")
  const items_mini = Array.from(mini_carousel.querySelectorAll(".mini_carrusel-item"))

  let indice_mini_actual = 0
  const indice_mini_maximo = Math.max(0, items_mini.length - 3)

  function obtenerClaseMini(index) {
    if (index === indice_mini_actual) return "izquierda_activo"
    if (index === indice_mini_actual + 1) return "centro_activo"
    if (index === indice_mini_actual + 2) return "derecha_activo"
    if (index === indice_mini_actual - 1) return "anterior"
    if (index === indice_mini_actual + 3) return "siguiente"
    if (index < indice_mini_actual - 1) return "hidden-left"
    return "hidden-right"
  }

  function actualizarItemsMini() {
    items_mini.forEach((elemento, index) => {
      elemento.className = `mini_carrusel-item ${obtenerClaseMini(index)}`
    })
  }

  function actualizarBotonesMini() {
    const en_inicio = indice_mini_actual === 0
    const en_final = indice_mini_actual >= indice_mini_maximo

    if (en_inicio) {
      btn_anterior_mini.classList.add("disabled")
    } else {
      btn_anterior_mini.classList.remove("disabled")
    }
    btn_anterior_mini.disabled = en_inicio

    if (en_final) {
      btn_siguiente_mini.classList.add("disabled")
    } else {
      btn_siguiente_mini.classList.remove("disabled")
    }
    btn_siguiente_mini.disabled = en_final
  }

  function siguienteMini() {
    if (indice_mini_actual < indice_mini_maximo) {
      indice_mini_actual = Math.min(indice_mini_actual + 3, indice_mini_maximo)
      actualizarItemsMini()
      actualizarBotonesMini()
    }
  }

  function anteriorMini() {
    if (indice_mini_actual > 0) {
      indice_mini_actual = Math.max(indice_mini_actual - 3, 0)
      actualizarItemsMini()
      actualizarBotonesMini()
    }
  }

  // Event listeners
  btn_anterior_mini.addEventListener("click", anteriorMini)
  btn_siguiente_mini.addEventListener("click", siguienteMini)

  // Control táctil
  let touch_mini_inicio_x = 0
  mini_carousel.addEventListener("touchstart", (e) => {
    touch_mini_inicio_x = e.touches[0].clientX
  })

  mini_carousel.addEventListener("touchend", (e) => {
    const touch_mini_fin_x = e.changedTouches[0].clientX
    const diferencia_mini = touch_mini_inicio_x - touch_mini_fin_x

    if (Math.abs(diferencia_mini) > 50) {
      if (diferencia_mini > 0 && indice_mini_actual < indice_mini_maximo) siguienteMini()
      if (diferencia_mini < 0 && indice_mini_actual > 0) anteriorMini()
    }
  })

  // Inicializar
  actualizarItemsMini()
  actualizarBotonesMini()
})
