document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab")
  const forms = document.querySelectorAll(".form")
  const loginForm = document.getElementById("login")
  const registerForm = document.getElementById("register")
  const loadingScreen = document.getElementById("loading-screen")
  const socialLinks = document.querySelectorAll(".social_login a")

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

  function showLoadingScreen() {
    // Mostrar pantalla de carga - CSS hace todo el trabajo
    loadingScreen.classList.add("active")

    // Redirigir después de 5 segundos (duración de la animación)
    setTimeout(() => {
      window.location.href = "index.html"
    }, 5000)
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    showLoadingScreen()
  })

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault()
    showLoadingScreen()
  })

  socialLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      showLoadingScreen()
    })
  })
})