import { Renacuajo } from './Renacuajo.js';
import { Obstaculo } from './Obstaculo.js';

// Clase principal
export class Juego {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Estado del juego
        this.juegoActivo = false;
        this.gameOver = false;
        
        // Componentes del juego
        this.renacuajo = new Renacuajo(canvas);
        this.obstaculos = new Obstaculo(canvas);
        
        // Puntuación
        this.score = 0;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Salto con clic o espacio
        this.canvas.addEventListener('click', () => this.jump());
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.juegoActivo) {
                e.preventDefault();
                this.jump();
            }
        });
    }

    jump() {
        if (this.juegoActivo && !this.gameOver) {
            this.renacuajo.jump();
        }
    }

    iniciar() {
        console.log('Iniciando juego...');
        this.juegoActivo = true;
        this.gameOver = false;
        this.gameLoop();
    }

    detener() {
        console.log('Deteniendo juego...');
        this.juegoActivo = false;
        this.gameOver = true;
    }

    reset() {
        console.log('Reseteando juego...');
        this.renacuajo.reset(this.canvas);
        this.obstaculos.reset();
        this.score = 0;
        this.gameOver = false;
        this.juegoActivo = false;
    }

    update() {
        if (!this.juegoActivo || this.gameOver) return;

        // Actualizar posición del renacuajo
        this.renacuajo.update();
        
        // Actualizar obstáculos y obtener puntos
        const puntosGanados = this.obstaculos.update(this.renacuajo);
        this.score += puntosGanados;
        
        // Detectar colisiones con obstáculos
        if (this.obstaculos.checkCollision(this.renacuajo)) {
            this.gameOver = true;
            this.derrotaPorColision();
        }
        
        // Verificar límites de la pantalla
        if (this.renacuajo.isOutOfBounds(this.canvas.height)) {
            this.gameOver = true;
            this.derrotaPorColision();
        }
    }

    draw() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar componentes
        this.renacuajo.draw(this.ctx);
        this.obstaculos.draw(this.ctx);
        
        // Dibujar puntuación
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.score, this.canvas.width / 2, 50);
    }

    victoria() {
        if (this.score >= 2) {
            this.juegoActivo = false;
            this.detener();
            
            setTimeout(() => {
                if (typeof window.mostrarPantallaVictoria === 'function') {
                    window.mostrarPantallaVictoria();
                }
            }, 500);
        }
    }

    derrotaPorColision() {
        this.juegoActivo = false;
        this.detener();
        
        setTimeout(() => {
            if (typeof window.mostrarPantallaDerrotaMovimiento === 'function') {
                window.mostrarPantallaDerrotaMovimiento();
            }
        }, 500);
    }

    gameLoop() {
        if (this.juegoActivo && !this.gameOver) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}