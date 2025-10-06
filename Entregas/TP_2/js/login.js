document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab")
  const forms = document.querySelectorAll(".form")
  const loginForm = document.getElementById("login")
  const loadingScreen = document.getElementById("loading-screen")
  const progressFill = document.getElementById("progress-fill")
  const loadingPercentage = document.getElementById("loading-percentage")

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.target
      const targetForm = document.getElementById(targetId)
      const currentActiveForm = document.querySelector(".form.active")
      if (currentActiveForm === targetForm) return

      tabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      forms.forEach((f) => f.classList.remove("active"))
      targetForm.classList.add("active")
    })
  })

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Mostrar pantalla de carga
    loadingScreen.classList.add("active")

    const lilyPads = document.querySelectorAll(".lily-pad")

    // Simular carga de 5 segundos con porcentaje
    let progress = 0
    const duration = 5000 // 5 segundos
    const interval = 50 // Actualizar cada 50ms
    const increment = (100 / duration) * interval

    const loadingInterval = setInterval(() => {
      progress += increment

      if (progress >= 100) {
        progress = 100
        clearInterval(loadingInterval)

        // Redirigir a index.html después de completar
        setTimeout(() => {
          window.location.href = "index.html"
        }, 200)
      }

      // Actualizar porcentaje
      loadingPercentage.textContent = Math.floor(progress) + "%"

      // Iluminar nenúfares según el progreso
      const activeLilyIndex = Math.floor((progress / 100) * lilyPads.length)
      lilyPads.forEach((lily, index) => {
        if (index < activeLilyIndex) {
          lily.classList.add("active")
        }
      })
    }, interval)
  })
})
