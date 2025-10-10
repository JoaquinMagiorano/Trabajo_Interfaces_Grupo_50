/* ========================================
   MENÚS DESPLEGABLES
   ======================================== */

const hamburguesa_btn = document.querySelector('.hamburguesa_btn');
const menu_desplegable = document.querySelector('.menu_desplegable');
const btn_configuracion = document.querySelector('.btn_configuracion');
const menu_configuracion_desplegable = document.querySelector('.menu_configuracion_desplegable');
const pantallaFondo = document.querySelector('.menu_container');



hamburguesa_btn.addEventListener('click', function() {
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