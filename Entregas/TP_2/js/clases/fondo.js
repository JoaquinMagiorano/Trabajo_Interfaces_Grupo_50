import { Espacio } from './espacios.js';
import { Ficha } from './fichas.js';

export class Fondo {
    
   

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.spaceSize = 85;
        this.spaces = [];
        this.pegs = [];
        
        //imágenes
        this.boardImg = new Image();
        this.emptyImg = new Image();
        this.pegImg = new Image();
        
        this.boardImg.src = './img/peg/fondo_peg.png';
        this.emptyImg.src = './img/peg/nenufar.png';
        this.pegImg.src = './img/peg/rana_prueba.png';
        
        this.initializeBoard();
    }

    initializeBoard() {
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

        const rowLayout=layout.length; //layout.length son las filas de layout
        const colLayout=layout[0].length;//layout[0].length son las columnas
        const valorValido=1;
       
        for (let row = 0; row < rowLayout; row++) {
            this.spaces[row] = [];
            
            for (let col = 0; col < colLayout; col++) {
                const x =  col * this.spaceSize;
                const y =  row * this.spaceSize;
                
                const space = new Espacio(row, col, this.spaceSize, x, y);//crea un espacio
                space.isValid = layout[row][col] === valorValido;//registra el valor en pos row col es valido(1) o no
                

                // Genera una ficha excepto en el medio
                if (row === Math.trunc(rowLayout/2) && col === Math.trunc(colLayout/2)) {//si es el medio no genera
                    space.hasPeg = false;
                } else if (space.isValid) {//si es valido asigna una ficha
                    space.hasPeg = true;
                    const peg = new Ficha(row, col, this.spaceSize, x, y);
                    this.pegs.push(peg);
                }
                
                this.spaces[row][col] = space;
            }
        }
    }

    draw() {
        // 1.Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 2.Dibujar fondo del tablero
        if (this.boardImg.complete && this.boardImg.src) {
            this.ctx.drawImage(this.boardImg, 0, 0, this.canvas.width, this.canvas.height);
        }

        // 3.Dibujar espacios
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                this.spaces[row][col].draw(this.ctx, this.boardImg, this.emptyImg);
            }
        }

        // 4.Dibujar fichas
        for (const peg of this.pegs) {
            peg.draw(this.ctx, this.pegImg);
        }
    }

    getPegAt(x, y) {//busca si hay una ficha en dicha pos
        for (let i = this.pegs.length - 1; i >= 0; i--) {
            if (this.pegs[i].contains(x, y)) {
                return this.pegs[i];
            }
        }
        return null;
    }

    getSpaceAt(x, y) {//busca si hay un espacio en dicha pos
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

        directions.forEach(direction => {
            const dr = direction[0];//direccion row
            const dc = direction[1];//direccion column
            const newRow = peg.row + dr;
            const newCol = peg.col + dc;
                if (newRow >= 0 && newRow < 7 && newCol >= 0 && newCol < 7) {//checkea si no esta en los bordes
                    if (this.isValidMove(peg.row, peg.col, newRow, newCol)) {//checkea si es un movimiento valido
                        moves.push(this.spaces[newRow][newCol]);
                    }
                }
            });

        return moves;
    };

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

    movePeg(peg, space) {
        //mueve la ficha
        this.updateSpaces(peg, space);
        
        //Elimina la ficha del medio
        this.removeMiddlePeg(peg, space);
        
        //actualiza la ficha movida
        peg.updatePosition(space.row, space.col, space.x, space.y);
    }

    updateSpaces(peg, space) {
        this.spaces[peg.row][peg.col].hasPeg = false;//la posision donde habia una ficha y ahora no la hay(no es borrar la comida es el movimiento)
        space.hasPeg = true;//la nueva posicion de la ficha
    }

    removeMiddlePeg(peg, space) {
        //marca donde estaba la ficha comida
        const middleRow = (peg.row + space.row) / 2;
        const middleCol = (peg.col + space.col) / 2;
        
        // establece que no hay ficha
        this.spaces[middleRow][middleCol].hasPeg = false;
        
        // ubica la ficha
        let middlePegIndex = -1;
        for (let i = 0; i < this.pegs.length; i++) {
            if (this.pegs[i].row === middleRow && this.pegs[i].col === middleCol) {
                middlePegIndex = i;
                break;
            }
        }
        //si la encontro la borra
        if (middlePegIndex !== -1) {
            this.pegs.splice(middlePegIndex, 1);
        }
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