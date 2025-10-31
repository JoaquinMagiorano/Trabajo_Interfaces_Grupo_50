import { Espacio } from './espacios.js';
import { Ficha } from './fichas.js';

export class Fondo {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.spaceSize = 70;
        this.padding = 50;
        this.spaces = [];
        this.pegs = [];
        
        // Cargar imágenes
        this.boardImg = new Image();
        this.emptyImg = new Image();
        this.pegImg = new Image();
        
        // IMPORTANTE: Reemplaza estas rutas con tus propias imágenes
        this.boardImg.src = './img/peg/fondo.jpg';
        this.emptyImg.src = './img/peg/nenufar.png';
        this.pegImg.src = './img/peg/sapo.png';
        
        this.initializeBoard();
    }

    initializeBoard() {
        // Layout del Peg Solitaire tradicional (forma de cruz)
        // 1 = espacio válido, 0 = no válido
        const layout = [
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0]
        ];

        this.spaces = [];
        this.pegs = [];

        for (let row = 0; row < 7; row++) {
            this.spaces[row] = [];
            for (let col = 0; col < 7; col++) {
                const x = this.padding + col * this.spaceSize;
                const y = this.padding + row * this.spaceSize;
                
                const space = new Espacio(row, col, this.spaceSize, x, y);
                space.isValid = layout[row][col] === 1;
                
                // El espacio central empieza vacío
                if (row === 3 && col === 3) {
                    space.hasPeg = false;
                } else if (space.isValid) {
                    space.hasPeg = true;
                    const peg = new Ficha(row, col, this.spaceSize, x, y);
                    this.pegs.push(peg);
                }
                
                this.spaces[row][col] = space;
            }
        }
    }

    draw() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar fondo del tablero
        if (this.boardImg.complete && this.boardImg.src) {
            this.ctx.drawImage(this.boardImg, 0, 0, this.canvas.width, this.canvas.height);
        }

        // Dibujar espacios
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                this.spaces[row][col].draw(this.ctx, this.boardImg, this.emptyImg);
            }
        }

        // Dibujar fichas
        for (const peg of this.pegs) {
            peg.draw(this.ctx, this.pegImg);
        }
    }

    getPegAt(x, y) {
        for (let i = this.pegs.length - 1; i >= 0; i--) {
            if (this.pegs[i].contains(x, y)) {
                return this.pegs[i];
            }
        }
        return null;
    }

    getSpaceAt(x, y) {
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                const space = this.spaces[row][col];
                if (space.isValid && space.contains(x, y)) {
                    return space;
                }
            }
        }
        return null;
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        // Verificar que el destino sea válido y esté vacío
        if (!this.spaces[toRow][toCol].isValid || this.spaces[toRow][toCol].hasPeg) {
            return false;
        }

        // Calcular diferencia
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;

        // Debe moverse exactamente 2 espacios en una dirección (horizontal o vertical)
        if (Math.abs(rowDiff) === 2 && colDiff === 0) {
            // Movimiento vertical
            const middleRow = fromRow + rowDiff / 2;
            return this.spaces[middleRow][fromCol].hasPeg;
        } else if (Math.abs(colDiff) === 2 && rowDiff === 0) {
            // Movimiento horizontal
            const middleCol = fromCol + colDiff / 2;
            return this.spaces[fromRow][middleCol].hasPeg;
        }

        return false;
    }

    getValidMoves(peg) {
        const moves = [];
        const directions = [[-2, 0], [2, 0], [0, -2], [0, 2]]; // arriba, abajo, izq, der

        for (const [dr, dc] of directions) {
            const newRow = peg.row + dr;
            const newCol = peg.col + dc;

            if (newRow >= 0 && newRow < 7 && newCol >= 0 && newCol < 7) {
                if (this.isValidMove(peg.row, peg.col, newRow, newCol)) {
                    moves.push(this.spaces[newRow][newCol]);
                }
            }
        }

        return moves;
    }

    highlightValidMoves(peg) {
        // Limpiar resaltados previos
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                this.spaces[row][col].isHighlighted = false;
            }
        }

        // Resaltar movimientos válidos
        const validMoves = this.getValidMoves(peg);
        for (const space of validMoves) {
            space.isHighlighted = true;
        }
    }

    clearHighlights() {
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                this.spaces[row][col].isHighlighted = false;
            }
        }
    }

    movePeg(peg, toSpace) {
        // Actualizar espacios
        this.spaces[peg.row][peg.col].hasPeg = false;
        toSpace.hasPeg = true;

        // Eliminar la ficha del medio
        const middleRow = (peg.row + toSpace.row) / 2;
        const middleCol = (peg.col + toSpace.col) / 2;
        this.spaces[middleRow][middleCol].hasPeg = false;

        // Eliminar la ficha del medio del array
        const middlePegIndex = this.pegs.findIndex(p => p.row === middleRow && p.col === middleCol);
        if (middlePegIndex !== -1) {
            this.pegs.splice(middlePegIndex, 1);
        }

        // Actualizar posición de la ficha
        peg.updatePosition(toSpace.row, toSpace.col, toSpace.x, toSpace.y);
    }

    hasValidMoves() {
        for (const peg of this.pegs) {
            if (this.getValidMoves(peg).length > 0) {
                return true;
            }
        }
        return false;
    }

    getPegCount() {
        return this.pegs.length;
    }
}