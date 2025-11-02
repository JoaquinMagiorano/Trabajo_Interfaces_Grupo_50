const boton_compartir = document.querySelector('#btn_compartir');

boton_compartir.addEventListener('click', function(){
    menu_compartir.classList.toggle('hidden')
});

//const canvas = document.getElementById('canvas');
//const ctx = canvas.getContext("2d");

/*
const width = canvas.width;
const height = canvas.height;

ctx.fillStyle = "brown";
ctx.fillRect(0,0,200,height);

ctx.fillStyle = "blue";
ctx.fillRect(200,0,width,height);

ctx.fillStyle = "brown";
ctx.fillRect(1400,0,width,height); */

// main.js - Punto de entrada principal
import { Juego } from './clases/juego.js';

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const game = new Juego(canvas);

    // Botón de reinicio
    document.getElementById('btn_reset').addEventListener('click', () => {
        game.reset();
    });

    console.log('Peg Solitaire Game iniciado!');
});

// ======================funcionamiento de la pagina del juego====================== //
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

// ==================== FUNCIÓN PARA MOSTRAR PANTALLAS ====================
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

    // Ocultar todas las pantallas
    pantallas.forEach(p => {
        if (p) p.classList.add('hidden');
    });

    // Mostrar la pantalla solicitada
    if (pantalla) {
        pantalla.classList.remove('hidden');
    }
}

// ==================== FUNCIONES DE NAVEGACIÓN ====================

// Ir al menú principal
function irAlMenu() {
    mostrarPantalla(pantalla_comienzo);
    // Detener el juego si está corriendo
    if (game) {
        game.detener();
    }
}

// Ir a instrucciones
function irAInstrucciones() {
    mostrarPantalla(pantalla_instrucciones);
}

// Ir a jugar
function irAJugar() {
    mostrarPantalla(pantalla_jugable);
    // Iniciar o reiniciar el juego
    if (game) {
        game.reset();
        game.iniciar();
    }
}

// Ir a pantalla final (victoria)
function irAPantallaFinal() {
    mostrarPantalla(pantalla_final);
}

// Ir a derrota por tiempo
function irADerrotaTiempo() {
    mostrarPantalla(pantalla_derrota_tiempo);
}

// Ir a derrota por movimientos
function irADerrotaMovimiento() {
    mostrarPantalla(pantalla_derrota_movimiento);
}

// Resetear juego
function resetearJuego() {
    mostrarPantalla(pantalla_jugable);
    if (game) {
        game.reset();
        game.iniciar();
    }
}

// ==================== EVENT LISTENERS ====================

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

// ==================== FUNCIONES PÚBLICAS PARA EL JUEGO ====================
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