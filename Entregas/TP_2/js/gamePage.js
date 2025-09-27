
document.addEventListener('DOMContentLoaded', () => {
    const menu_btn = document.querySelectorAll('.menu_hamburguesa');
    const menu = document.querySelectorAll('.menu_desplegable');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.target;
            const targetForm = document.getElementById(targetId);
            const currentActiveForm = document.querySelector('.menu_desplegable.active');
            if (currentActiveForm === targetForm) return;

            // Cambiar clase active en tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Cambiar clase active en formularios
            forms.forEach(f => f.classList.remove('active'));
            targetForm.classList.add('active');
        });
    });
});








const hamburguesa_Btn = document.querySelector('.hamburgesa_btn');
const menu_desplegable = document.querySelector('.menu_desplegable');

let Menu_abierto = false;

function alternar_menu() {
    if (Menu_abierto) {
}
}
