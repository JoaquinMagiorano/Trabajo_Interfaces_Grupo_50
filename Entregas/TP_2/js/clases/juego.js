import { Fondo } from './fondo.js';

export class Juego {
    constructor(canvas) {
        this.canvas = canvas;
        this.board = new Fondo(canvas);
        this.draggedPeg = null;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.setupEventListeners();
        this.gameLoop();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    onMouseDown(e) {
        const pos = this.getMousePos(e);
        const peg = this.board.getPegAt(pos.x, pos.y);
        
        if (peg) {
            this.draggedPeg = peg;
            this.draggedPeg.isDragging = true;
            this.board.highlightValidMoves(peg);
        }
    }

    onMouseMove(e) {
        if (this.draggedPeg) {
            const pos = this.getMousePos(e);
            this.draggedPeg.x = pos.x - this.draggedPeg.size / 2;
            this.draggedPeg.y = pos.y - this.draggedPeg.size / 2;
        }
    }

    onMouseUp(e) {
        if (this.draggedPeg) {
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
                
                // Verificar si el juego terminó
                if (!this.board.hasValidMoves()) {
                    this.endGame();
                }
            } else {
                // Movimiento inválido, regresar a posición original
                this.draggedPeg.resetPosition();
            }
            
            this.draggedPeg.isDragging = false;
            this.board.clearHighlights();
            this.draggedPeg = null;
        }
    }

    updateStatus() {
        const count = this.board.getPegCount();
        document.getElementById('status').textContent = `Fichas restantes: ${count}`;
    }

    endGame() {
        const count = this.board.getPegCount();
        let message = '';
        
        if (count === 1) {
            message = '¡PERFECTO! ¡Has ganado! Solo queda 1 ficha.';
        } else if (count <= 3) {
            message = `¡Muy bien! Terminaste con ${count} fichas.`;
        } else {
            message = `Juego terminado. Quedan ${count} fichas.`;
        }
        
        setTimeout(() => {
            alert(message + '\n\n Haz clic en "Reiniciar Juego" para jugar de nuevo.');
        }, 100);
    }

    reset() {
        this.board.initializeBoard();
        this.draggedPeg = null;
        this.updateStatus();
    }

    gameLoop() {
        this.board.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}