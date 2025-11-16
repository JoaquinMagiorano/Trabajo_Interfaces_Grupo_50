// Clase Renacuajo - Maneja el personaje principal
export class Renacuajo {
    constructor(canvas) {
        this.x = 100;
        this.y = canvas.height / 2;
        this.width = 40;
        this.height = 40;
        this.velocity = 0;
        this.gravity = 0.1;
        this.jumpStrength = -5;
        /*los pixeles mas arriba son los numeros mas bajos
         por lo tanto para caer tiene que aumentar el valor de y
          el cual aumenta constantemente con la gravedad*/
        
    }

    jump() {// sube al renacuajo (reduce y)
        this.velocity = this.jumpStrength;
    }

    update() {//va bajar segun la gravedad contantemente(aumentando en y)
        this.velocity += this.gravity;//
        this.y += this.velocity;
    }

    reset(canvas) {
        this.y = canvas.height / 2;
        this.velocity = 0;
    }

    draw(ctx) {
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isOutOfBounds(canvasHeight) {
        return this.y + this.height > canvasHeight || this.y < 0;
    }
}