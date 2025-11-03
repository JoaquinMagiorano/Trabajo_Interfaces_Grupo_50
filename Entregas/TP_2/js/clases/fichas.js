export class Ficha {
    constructor(row, col, size, x, y) {
        this.row = row;
        this.col = col;
        this.size = size;
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.isDragging = false;

        this.pegImg = new Image();
        this.pegImg2 = new Image();
        
        this.pegImg.src = './img/peg/rana_prueba.png';
        this.pegImg2.src = './img/peg/sapo.png';
        
        const option= Math.floor(Math.random() * 2);
        const images=[this.pegImg,this.pegImg2];
        this.pegImgChosen = images[option];
           
    }

    draw(ctx) {
        
            if (this.pegImgChosen && this.pegImgChosen.complete && this.pegImgChosen.naturalHeight !== 0) {
                ctx.drawImage(this.pegImgChosen, this.x, this.y, this.size, this.size);
            } else {
            // Fallback si no hay imagen
            ctx.fillStyle = '#8B0000';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            ctx.beginPath();
            ctx.arc(this.x + this.size/2, this.y + this.size/2, this.size * 0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        if (this.isDragging) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x + this.size/2, this.y + this.size/2, this.size * 0.4, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    contains(x, y) {
        const dx = x - (this.x + this.size/2);
        const dy = y - (this.y + this.size/2);
        return Math.sqrt(dx*dx + dy*dy) < this.size * 0.35;
    }

    resetPosition() {
        this.x = this.originalX;
        this.y = this.originalY;
    }

    updatePosition(row, col, x, y) {
        this.row = row;
        this.col = col;
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
    }
}