// Clase Obstaculo - Maneja todos los obstáculos del juego
export class Obstaculo {
    constructor(canvas, monedasManager) {
        this.canvas = canvas;
        this.monedasManager = monedasManager;
        this.obstacles = [];
        this.obstacleGap = 200;
        this.obstacleWidth = 80;
        this.obstacleSpeed = 4;
        this.frameCount = 0;
        this.spawnRate = 60;
    }

    update(renacuajo) {
        // Generar nuevos obstáculos
        this.frameCount++;
        if (this.frameCount % this.spawnRate === 0) {
            const minHeight = 50;
            const maxHeight = this.canvas.height - this.obstacleGap - 50;
            const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
            
            this.obstacles.push({
                x: this.canvas.width,
                topHeight: topHeight,
                bottomY: topHeight + this.obstacleGap,
                passed: false
            });

            if (this.obstacles.length > 1 && Math.random() < 0.4 && this.monedasManager) {
                const obstaculoAnterior = this.obstacles[this.obstacles.length - 2];
                const obstaculoNuevo = this.obstacles[this.obstacles.length - 1];
                
                // Posición X: que aparezca entre medio de los dos tubos
                const xEntreMedio = (obstaculoAnterior.x + this.obstacleWidth + obstaculoNuevo.x) / 2; 
                
                // Posición Y: altura aleatoria en la zona "segura" (con 30px de margen para arriba y para abajo)
                const alturaMinima = Math.max(obstaculoAnterior.topHeight, obstaculoNuevo.topHeight) + 30;
                const alturaMaxima = Math.min(obstaculoAnterior.bottomY, obstaculoNuevo.bottomY) - 30;
                const yAleatorio = Math.random() * (alturaMaxima - alturaMinima) + alturaMinima;
                
                this.monedasManager.generarMonedaEnPosicion(xEntreMedio, yAleatorio);
            }
        }

        // Actualizar posición de obstáculos existentes
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.obstacleSpeed;

            // Eliminar obstáculos fuera de pantalla
            if (this.obstacles[i].x + this.obstacleWidth < 0) {
                this.obstacles.splice(i, 1);
                continue;
            }

            // Contar puntos
            if (!this.obstacles[i].passed && this.obstacles[i].x + this.obstacleWidth < renacuajo.x) {
                this.obstacles[i].passed = true;
                return 1; // Retorna 1 punto ganado
            }
        }
        return 0; // No hay puntos ganados
    }

    draw(ctx) {
        ctx.fillStyle = '#77441A';
        for (let obstacle of this.obstacles) {
            // Tubo superior
            ctx.fillRect(obstacle.x, 0, this.obstacleWidth, obstacle.topHeight);
            // Tubo inferior
            ctx.fillRect(obstacle.x, obstacle.bottomY, this.obstacleWidth, this.canvas.height - obstacle.bottomY);
        }
    }

    checkCollision(renacuajo) {
        for (let obstacle of this.obstacles) {
            const tadpoleLeft = renacuajo.x - renacuajo.radius;
            const tadpoleRight = renacuajo.x + renacuajo.radius;
            const tadpoleTop = renacuajo.y - renacuajo.radius;
            const tadpoleBottom = renacuajo.y + renacuajo.radius;

            const obstacleLeft = obstacle.x;
            const obstacleRight = obstacle.x + this.obstacleWidth;

            // Verificar si el pájaro está en el rango horizontal del tubo
            if (tadpoleRight > obstacleLeft && tadpoleLeft < obstacleRight) {
                // Verificar colisión con tubo superior o inferior
                if (tadpoleTop < obstacle.topHeight || tadpoleBottom > obstacle.bottomY) {
                    return true;
                }
            }
        }
        return false;
    }

    reset() {
        this.obstacles = [];
        this.frameCount = 0;
    }
}