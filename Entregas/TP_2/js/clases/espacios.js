export class Espacio {
    constructor(row, col, size, x, y) {
        this.row = row;
        this.col = col;
        this.size = size;
        this.x = x;
        this.y = y;
        this.hasPeg = true;
        this.isValid = true;
        this.isHighlighted = false;
    }

    draw(ctx, boardImg, emptyImg) {
        if (!this.isValid) return;


        //Dibujar el nenúfar encima del efecto
        if (emptyImg && emptyImg.complete) {
            const shrinkFactor = 0.85; //Tamaño del nenufar
            const newSize = this.size * shrinkFactor;
            const offset = (this.size - newSize) / 2;
            
            ctx.drawImage(emptyImg, this.x + offset, this.y + offset, newSize, newSize);
        } else {
            //Fallback por si no hay imagen
            ctx.fillStyle = '#D2691E';
            ctx.beginPath();
            ctx.arc(this.x + this.size/2, this.y + this.size/2, this.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }

        //Resaltar si es un movimiento válido (DIBUJA EL EFECTO PRIMERO)
        if (this.isHighlighted) {
            const time = Date.now() / 1000;
            const pulse = 0.85 + Math.sin(time * 3) * 0.15;
            
            const centerX = this.x + this.size/2;
            const centerY = this.y + this.size/2;
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
            
            ctx.fillStyle = `rgba(255, 215, 0, ${0.3 * pulse})`;
            ctx.beginPath();
            ctx.arc(centerX, centerY, this.size * 0.45 * pulse, 0, Math.PI * 2); //grosor del resplandor
            ctx.fill();
            
            // Anillo exterior
            //ctx.strokeStyle = '#FFD700';
            //ctx.lineWidth = 3;
            //ctx.beginPath();
            //ctx.arc(centerX, centerY, this.size * 0.42, 0, Math.PI * 2);
            //ctx.stroke();
            
            ctx.shadowBlur = 0;
        }
    }

    contains(x, y) {
        const dx = x - (this.x + this.size/2);
        const dy = y - (this.y + this.size/2);
        return Math.sqrt(dx*dx + dy*dy) < this.size * 0.4;
    }
}