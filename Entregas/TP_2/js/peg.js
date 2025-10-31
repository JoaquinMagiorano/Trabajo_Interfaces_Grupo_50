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
    document.getElementById('resetBtn').addEventListener('click', () => {
        game.reset();
    });

    console.log('Peg Solitaire Game iniciado!');
});