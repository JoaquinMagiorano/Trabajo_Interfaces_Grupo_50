const hamburguesa_Btn = document.querySelector('.hamburgesa_btn');
const menu_desplegable = document.querySelector('.menu_desplegable');
const btn_configuracion = document.querySelector('.btn_configuracion');
const menu_configuracion_desplegable = document.querySelector('.menu_configuracion_desplegable');
const pantallaFondo = document.querySelector('.menu_container');
const menu_compartir = document.querySelector('#menu_compartir');
const boton_compartir = document.querySelector('#btn_compartir');



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

boton_compartir.addEventListener('click', function(){
    menu_compartir.classList.toggle('hidden')
});