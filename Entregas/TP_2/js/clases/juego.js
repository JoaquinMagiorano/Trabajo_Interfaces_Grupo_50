import { Fondo } from './fondo.js';

export class Juego {
    constructor(canvas) {
        this.canvas = canvas;
        this.board = new Fondo(canvas);
        this.draggedPeg = null;
        this.mouseX = 0;
        this.mouseY = 0;
        
        // Variables para el temporizador
        this.tiempoLimite = 5 * 60; // 5 minutos en segundos
        this.tiempoRestante = this.tiempoLimite;
        this.timerInterval = null;
        this.juegoActivo = false;
        
        this.setupEventListeners();
        this.gameLoop();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    }

    // Método para iniciar el juego
    iniciar() {
        this.juegoActivo = true;
        this.tiempoRestante = this.tiempoLimite;
        this.iniciarTemporizador();
        this.updateStatus();
    }

    // Método para detener el juego
    detener() {
        this.juegoActivo = false;
        this.detenerTemporizador();
    }

    // Iniciar el temporizador
    iniciarTemporizador() {
        this.detenerTemporizador(); // Limpiar cualquier temporizador previo
        
        this.timerInterval = setInterval(() => {
            if (!this.juegoActivo) {
                this.detenerTemporizador();
                return;
            }

            this.tiempoRestante--;
            this.actualizarDisplayTiempo();

            // Verificar si se acabó el tiempo
            if (this.tiempoRestante <= 0) {
                this.detenerTemporizador();
                this.derrotaPorTiempo();
            }
        }, 1000);
    }

    // Detener el temporizador
    detenerTemporizador() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // Actualizar el display del tiempo
    actualizarDisplayTiempo() {
        const minutos = Math.floor(this.tiempoRestante / 60);
        const segundos = this.tiempoRestante % 60;
        const tiempoFormateado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        
        const tiempoElement = document.getElementById('tiempo');
        if (tiempoElement) {
            tiempoElement.textContent = tiempoFormateado;
            
            // Cambiar color si queda poco tiempo
            if (this.tiempoRestante <= 30) {
                tiempoElement.style.color = '#ff0000';
            } else if (this.tiempoRestante <= 60) {
                tiempoElement.style.color = '#ff6600';
            } else {
                tiempoElement.style.color = '#333';
            }
        }
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    onMouseDown(e) {
        if (!this.juegoActivo) return;
        
        const pos = this.getMousePos(e);
        const peg = this.board.getPegAt(pos.x, pos.y);
        
        if (peg) {
            this.draggedPeg = peg;
            this.draggedPeg.isDragging = true;
            this.board.highlightValidMoves(peg);
        }
    }

    onMouseMove(e) {
        if (this.draggedPeg && this.juegoActivo) {
            const pos = this.getMousePos(e);
            this.draggedPeg.x = pos.x - this.draggedPeg.size / 2;
            this.draggedPeg.y = pos.y - this.draggedPeg.size / 2;
        }
    }

    onMouseUp(e) {
        if (this.draggedPeg && this.juegoActivo) {
            const pos = this.getMousePos(e);
            const targetSpace = this.board.getSpaceAt(pos.x, pos.y);
            
            if (targetSpace && this.board.isValidMove(
                this.draggedPeg.row, 
                this.draggedPeg.col, 
                targetSpace.row, 
                targetSpace.col
            )) {
                // Movimiento válido
                this.board.movePeg(this.draggedPeg, targetSpace);
                this.updateStatus();
                
                // Verificar condiciones de fin de juego
                this.verificarEstadoJuego();
            } else {
                // Movimiento inválido, regresar a posición original
                this.draggedPeg.resetPosition();
            }
            
            this.draggedPeg.isDragging = false;
            this.board.clearHighlights();
            this.draggedPeg = null;
        }
    }

    verificarEstadoJuego() {
        const count = this.board.getPegCount();
        
        // Victoria: solo queda 1 ficha
        if (count === 1) {
            this.victoria();
            return;
        }
        
        // Derrota: no hay movimientos válidos
        if (!this.board.hasValidMoves()) {
            this.derrotaPorMovimientos();
            return;
        }
    }

    updateStatus() {
        const count = this.board.getPegCount();
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = `Fichas restantes: ${count}`;
        }
    }

    // Victoria
    victoria() {
        this.juegoActivo = false;
        this.detenerTemporizador();
        
        // Esperar un momento antes de mostrar la pantalla
        setTimeout(() => {
            if (typeof window.mostrarPantallaVictoria === 'function') {
                window.mostrarPantallaVictoria();
            }
        }, 500);
    }

    // Derrota por tiempo
    derrotaPorTiempo() {
        this.juegoActivo = false;
        
        setTimeout(() => {
            if (typeof window.mostrarPantallaDerrotaTiempo === 'function') {
                window.mostrarPantallaDerrotaTiempo();
            }
        }, 500);
    }

    // Derrota por movimientos
    derrotaPorMovimientos() {
        this.juegoActivo = false;
        this.detenerTemporizador();
        
        setTimeout(() => {
            if (typeof window.mostrarPantallaDerrotaMovimiento === 'function') {
                window.mostrarPantallaDerrotaMovimiento();
            }
        }, 500);
    }

    reset() {
    this.detenerTemporizador();
    this.board.initializeBoard();
    this.draggedPeg = null;
    this.tiempoRestante = this.tiempoLimite;
    this.juegoActivo = false;
    this.updateStatus();
    this.actualizarDisplayTiempo();
}

    gameLoop() {
        this.board.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}