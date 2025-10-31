export class Espacio {
    constructor(row, col, size, x, y) {
        this.row = row;
        this.col = col;
        this.size = size;
        this.x = x;
        this.y = y;
        this.hasPeg = true;
        this.isValid = true; // Si es una posición válida del tablero
        this.isHighlighted = false;
    }

    draw(ctx, boardImg, emptyImg) {
        if (!this.isValid) return;

        // Dibujar el espacio del tablero (vacío)
        if (emptyImg && emptyImg.complete) {
            ctx.drawImage(emptyImg, this.x, this.y, this.size, this.size);
        } else {
            // Fallback si no hay imagen
            ctx.fillStyle = '#D2691E';
            ctx.beginPath();
            ctx.arc(this.x + this.size/2, this.y + this.size/2, this.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Resaltar si es un movimiento válido
        if (this.isHighlighted) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(this.x + this.size/2, this.y + this.size/2, this.size * 0.45, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    contains(x, y) {
        const dx = x - (this.x + this.size/2);
        const dy = y - (this.y + this.size/2);
        return Math.sqrt(dx*dx + dy*dy) < this.size * 0.4;
    }
}