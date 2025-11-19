// Clase Renacuajo - Maneja el personaje principal
export class Renacuajo {
    constructor(canvas) {
        this.x = canvas.width / 3;
        this.y = canvas.height / 2;
        this.radius = 20;
        this.velocity = 0;
        this.gravity = 0.25;
        this.jumpStrength = -7;
        /*los pixeles mas arriba son los numeros mas bajos
         por lo tanto para caer tiene que aumentar el valor de y
          el cual aumenta constantemente con la gravedad*/
        
    }

    jump() {// sube al renacuajo (reduce y)
        this.velocity = this.jumpStrength;
    }

    update() {//va a bajar constantemente segun la gravedad que se le asigne (aumentando en y)
        this.velocity += this.gravity;//
        this.y += this.velocity;
    }

    reset(canvas) {
        this.y = canvas.height / 2;
        this.velocity = 0;
    }

    draw(ctx) {
        ctx.fillStyle = '#4caf50';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    isOutOfBounds(canvasHeight) {
        return this.y + this.radius > canvasHeight || this.y - this.radius < 0;
    }
}