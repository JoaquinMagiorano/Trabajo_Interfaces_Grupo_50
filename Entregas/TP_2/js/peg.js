import { Juego } from './clases/juego.js';


const boton_compartir = document.querySelector('#btn_compartir');

boton_compartir.addEventListener('click', function(){
    menu_compartir.classList.toggle('hidden')
});


// Variable global para el juego
let game = null;

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    game = new Juego(canvas);

    console.log('Juego iniciado');
});


// ====================== Funcionamiento de la pagina del juego ====================== //
const btn_start = document.querySelector('#btn_start');
const blur_screen = document.querySelector('#blur_screen');
// Pantallas
const pantalla_comienzo = document.querySelector('.pantalla_comienzo');
const pantalla_instrucciones = document.querySelector('.pantalla_instrucciones');
const pantalla_jugable = document.querySelector('.pantalla_jugable');
const pantalla_final = document.querySelector('.pantalla_final');
const pantalla_derrota_tiempo = document.querySelector('.pantalla_derrota_tiempo');
const pantalla_derrota_movimiento = document.querySelector('.pantalla_derrota_movimiento');
// Botones de navegación
const btn_instrucciones = document.getElementById('btn_instrucciones');
const btn_comenzar_jugar = document.getElementById('btn_comenzar_jugar');
const btn_volver_menu = document.querySelector('.pantalla_instrucciones .btn');
const btn_reset = document.getElementById('btn_reset');
const btn_menu_jugable = document.getElementById('btn_menu');
const btn_menu_final = document.querySelector('.pantalla_final #btn_menu');
const btn_reset_derrota_tiempo = document.querySelector('.pantalla_derrota_tiempo #btn_reset');
const btn_menu_derrota_tiempo = document.querySelector('.pantalla_derrota_tiempo #btn_menu');
const btn_reset_derrota_movimiento = document.querySelector('.pantalla_derrota_movimiento #btn_reset');
const btn_menu_derrota_movimiento = document.querySelector('.pantalla_derrota_movimiento #btn_menu');

// ==================== FUNCIÓN PARA MOSTRAR PANTALLAS ==================== //
function mostrarPantalla(pantalla) {
    // Lista de todas las pantallas
    const pantallas = [
        blur_screen,
        pantalla_comienzo,
        pantalla_instrucciones,
        pantalla_jugable,
        pantalla_final,
        pantalla_derrota_tiempo,
        pantalla_derrota_movimiento
    ];

    // Pantallas que se muestran sobre el juego (overlays)
    const pantallasOverlay = [
        pantalla_final,
        pantalla_derrota_tiempo,
        pantalla_derrota_movimiento
    ];

    // Si es una pantalla overlay, solo ocultar las demás pero mantener pantalla_jugable
    if (pantallasOverlay.includes(pantalla)) {
        pantallas.forEach(p => {
            if (p && p !== pantalla_jugable && p !== pantalla) {
                p.classList.add('hidden');
            }
        });
        // Mostrar la pantalla solicitada
        if (pantalla) {
            pantalla.classList.remove('hidden');
        }
    } else {
        // Para pantallas normales, ocultar todas
        pantallas.forEach(p => {
            if (p) p.classList.add('hidden');
        });
        // Mostrar la pantalla solicitada
        if (pantalla) {
            pantalla.classList.remove('hidden');
        }
    }
}

// ==================== FUNCIONES DE NAVEGACIÓN ==================== //

function irAlMenu() {
    mostrarPantalla(pantalla_comienzo);
    if (game) {
        game.detener();
    }
}

function irAInstrucciones() {
    mostrarPantalla(pantalla_instrucciones);
}

function irAJugar() {
    mostrarPantalla(pantalla_jugable);
    if (game) {
        game.reset();
        game.iniciar();
    }
}

function irAPantallaFinal() {
    mostrarPantalla(pantalla_final);
}

function irADerrotaTiempo() {
    mostrarPantalla(pantalla_derrota_tiempo);
}

function irADerrotaMovimiento() {
    mostrarPantalla(pantalla_derrota_movimiento);
}

function resetearJuego() {
    mostrarPantalla(pantalla_jugable);
    if (game) {
        game.reset();
        game.iniciar();
    }
}

// ==================== EVENT LISTENERS ==================== //

// Botón de inicio (pantalla blur)
if (btn_start) {
    btn_start.addEventListener('click', irAlMenu);
}
// Botones del menú principal
if (btn_instrucciones) {
    btn_instrucciones.addEventListener('click', irAInstrucciones);
}
if (btn_comenzar_jugar) {
    btn_comenzar_jugar.addEventListener('click', irAJugar);
}
// Botón de volver desde instrucciones
if (btn_volver_menu) {
    btn_volver_menu.addEventListener('click', irAlMenu);
}
// Botones de la pantalla jugable
if (btn_reset) {
    btn_reset.addEventListener('click', resetearJuego);
}
if (btn_menu_jugable) {
    btn_menu_jugable.addEventListener('click', irAlMenu);
}
// Botón de la pantalla final
if (btn_menu_final) {
    btn_menu_final.addEventListener('click', irAlMenu);
}
// Botones de pantalla de derrota por tiempo
if (btn_reset_derrota_tiempo) {
    btn_reset_derrota_tiempo.addEventListener('click', resetearJuego);
}
if (btn_menu_derrota_tiempo) {
    btn_menu_derrota_tiempo.addEventListener('click', irAlMenu);
}
// Botones de pantalla de derrota por movimientos
if (btn_reset_derrota_movimiento) {
    btn_reset_derrota_movimiento.addEventListener('click', resetearJuego);
}
if (btn_menu_derrota_movimiento) {
    btn_menu_derrota_movimiento.addEventListener('click', irAlMenu);
}

// ==================== FUNCIONES PÚBLICAS PARA EL JUEGO ==================== //
// Estas funciones pueden ser llamadas desde la clase Juego
window.mostrarPantallaVictoria = function() {
    irAPantallaFinal();
};
window.mostrarPantallaDerrotaTiempo = function() {
    irADerrotaTiempo();
};
window.mostrarPantallaDerrotaMovimiento = function() {
    irADerrotaMovimiento();
};



