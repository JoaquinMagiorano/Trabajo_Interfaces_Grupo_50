// Clase Obstaculos - Maneja todos los obstáculos del juego
export class Obstaculos {
    constructor(canvas) {
        this.canvas = canvas;
        this.pipes = [];
        this.pipeGap = 200;
        this.pipeWidth = 80;
        this.pipeSpeed = 3;
        this.frameCount = 0;
    }

    update() {
        // Generar nuevos obstáculos
        this.frameCount++;
        if (this.frameCount % 90 === 0) {
            this.generarObstaculo();
        }

        // Actualizar posición de obstáculos existentes
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].x -= this.pipeSpeed;

            // Eliminar obstáculos fuera de pantalla
            if (this.pipes[i].x + this.pipeWidth < 0) {
                this.pipes.splice(i, 1);
            }
        }
    }

    generarObstaculo() {
        const minHeight = 50;
        const maxHeight = this.canvas.height - this.pipeGap - 50;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        this.pipes.push({
            x: this.canvas.width,
            topHeight: topHeight,
            bottomY: topHeight + this.pipeGap,
            passed: false
        });
    }

    draw(ctx) {
        ctx.fillStyle = '#77441A';
        for (let pipe of this.pipes) {
            // Tubo superior
            ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            // Tubo inferior
            ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, this.canvas.height - pipe.bottomY);
        }
    }

    checkCollision(renacuajo) {
        for (let pipe of this.pipes) {
            const birdLeft = renacuajo.x;
            const birdRight = renacuajo.x + renacuajo.width;
            const birdTop = renacuajo.y;
            const birdBottom = renacuajo.y + renacuajo.height;

            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + this.pipeWidth;

            // Verificar si el pájaro está en el rango horizontal del tubo
            if (birdRight > pipeLeft && birdLeft < pipeRight) {
                // Verificar colisión con tubo superior o inferior
                if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
                    return true;
                }
            }
        }
        return false;
    }

    checkScore(renacuajo) {
        let puntosGanados = 0;
        for (let pipe of this.pipes) {
            if (!pipe.passed && pipe.x + this.pipeWidth < renacuajo.x) {
                pipe.passed = true;
                puntosGanados++;
            }
        }
        return puntosGanados;
    }

    reset() {
        this.pipes = [];
        this.frameCount = 0;
    }
}