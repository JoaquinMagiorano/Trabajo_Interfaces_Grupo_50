// Clase Moneda - Maneja las monedas del juego
export class Moneda {
    constructor(canvas) {
        this.canvas = canvas;
        this.monedas = [];
        this.coinRadius = 15;
        this.coinSpeed = 4; // Misma velocidad que los obstáculos
        this.frameCount = 0;
    }

    generarMonedaEnPosicion(x, y) {
        this.monedas.push({
            x: x,
            y: y,
            recogida: false
        });
    }

    update(renacuajo) {
        let monedasRecogidas = 0;

        // Actualizar posición de monedas existentes
        for (let i = this.monedas.length - 1; i >= 0; i--) {
            const moneda = this.monedas[i];
            
            if (!moneda.recogida) {
                moneda.x -= this.coinSpeed;

                // Verificar colisión con el renacuajo
                if (this.checkCollision(moneda, renacuajo)) {
                    moneda.recogida = true;
                    monedasRecogidas++;
                }

                // Eliminar monedas fuera de pantalla
                if (moneda.x + this.coinRadius < 0) {
                    this.monedas.splice(i, 1);
                }
            }
        }

        return monedasRecogidas;
    }

    checkCollision(moneda, renacuajo) {
        // Colisión círculo a círculo usando distancia entre centros
        const dx = moneda.x - renacuajo.x;
        const dy = moneda.y - renacuajo.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        return distancia < (this.coinRadius + renacuajo.radius);
    }

    draw(ctx) {
        ctx.fillStyle = '#FFD700'; // intento de dorado
        
        for (let moneda of this.monedas) {
            if (!moneda.recogida) {
                ctx.beginPath();
                ctx.arc(moneda.x, moneda.y, this.coinRadius, 0, Math.PI * 2);
                ctx.fill();
                
                // borde opcional
                ctx.strokeStyle = '#FFA500';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    }

    reset() {
        this.monedas = [];
        this.frameCount = 0;
    }
}