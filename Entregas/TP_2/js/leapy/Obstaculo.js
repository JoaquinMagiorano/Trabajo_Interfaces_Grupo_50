export class Obstaculo {
    constructor(canvas, monedasManager) {
        this.canvas = canvas;
        this.monedasManager = monedasManager;
        this.obstacles = [];
        this.obstacleGap = 250;
        this.obstacleWidth = 120; // Ancho de colision (mas chiquito)
        this.offSetY = 10;
        
        this.obstacleDisplayWidth = 210; // Ancho visual (mas grande que colision)



        this.obstacleSpeed = 4;
        this.frameCount = 0;
        this.spawnRate = 90;
        
        // Cargar imagenes de los obstaculos
        this.imagenSuperior = new Image();
        this.imagenInferior = new Image();
        

        this.imagenSuperior.src = 'img/leapy_frog/tronco_superior.png'; // Tronco con corte amarillo
        this.imagenInferior.src = 'img/leapy_frog/tronco_inferior.png'; // Tronco largo completo
        
        this.imagenesCargadas = false;
        
        // Contador para verificar que ambas imagenes se cargaron
        let imagenesCargadasCount = 0;
        
        this.imagenSuperior.onload = () => {
            console.log('Imagen superior cargada');
            imagenesCargadasCount++;
            if (imagenesCargadasCount === 2) {
                this.imagenesCargadas = true;
                console.log('Todas las imagenes de obstaculos cargadas');
            }
        };
        
        this.imagenInferior.onload = () => {
            console.log('Imagen inferior cargada');
            imagenesCargadasCount++;
            if (imagenesCargadasCount === 2) {
                this.imagenesCargadas = true;
                console.log('Todas las imagenes de obstaculos cargadas');
            }
        };
    }

    update(renacuajo) {
        // Generar nuevos obstaculos
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

            // Generar moneda entre obstaculos
            if (this.obstacles.length > 1 && Math.random() < 0.4 && this.monedasManager) {
                const obstaculoAnterior = this.obstacles[this.obstacles.length - 2];
                const obstaculoNuevo = this.obstacles[this.obstacles.length - 1];
                
                const xEntreMedio = (obstaculoAnterior.x + this.obstacleWidth + obstaculoNuevo.x) / 2; 
                
                const alturaMinima = Math.max(obstaculoAnterior.topHeight, obstaculoNuevo.topHeight) + 30;
                const alturaMaxima = Math.min(obstaculoAnterior.bottomY, obstaculoNuevo.bottomY) - 30;
                const yAleatorio = Math.random() * (alturaMaxima - alturaMinima) + alturaMinima;
                
                this.monedasManager.generarMonedaEnPosicion(xEntreMedio, yAleatorio);
            }
        }

        // Actualizar la posicion de obstaculos existentes
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.obstacleSpeed;

            // Eliminar los obstaculos fuera de pantalla
            if (this.obstacles[i].x + this.obstacleWidth < 0) {
                this.obstacles.splice(i, 1);
                continue;
            }

            // Contar los puntos
            if (!this.obstacles[i].passed && this.obstacles[i].x + this.obstacleWidth < renacuajo.x) {
                this.obstacles[i].passed = true;
                return 1;
            }
        }
        return 0;
    }

    draw(ctx) {
        if (this.imagenesCargadas) {
            for (let obstacle of this.obstacles) {
                // Calcular el offset para centrar la imagen sobre el area de colision
                const offsetX = (this.obstacleDisplayWidth - this.obstacleWidth) / 2;
                
                // TUBO SUPERIOR - Tronco cortado
                // Se calcula la altura basada en el ancho visual
                const aspectRatioSuperior = this.imagenSuperior.width / this.imagenSuperior.height;
                const alturaSuperior = this.obstacleDisplayWidth / aspectRatioSuperior;
                
                // Repetir la imagen si el obstaculo es muy alto
                const repeticionesSuperior = Math.ceil(obstacle.topHeight / alturaSuperior);
                for (let i = repeticionesSuperior - 1; i >= 0; i--) {
                    ctx.drawImage(
                        this.imagenSuperior,
                        obstacle.x - offsetX, // Centrar sobre el area de colision
                        obstacle.topHeight - (repeticionesSuperior - i) * alturaSuperior + this.offSetY,
                        this.obstacleDisplayWidth, // Usar el ancho visual
                        alturaSuperior
                    );
                }
                
                // TUBO INFERIOR - Tronco completo
                // Calcular altura manteniendo proporcion basada en el ancho VISUAL
                const aspectRatioInferior = this.imagenInferior.width / this.imagenInferior.height;
                const alturaInferior = this.obstacleDisplayWidth / aspectRatioInferior;
                
                const alturaObstaculoInferior = this.canvas.height - obstacle.bottomY;
                
                // Repetir la imagen si el obstaculo es muy alto
                const repeticionesInferior = Math.ceil(alturaObstaculoInferior / alturaInferior);
                for (let i = 0; i < repeticionesInferior; i++) {
                    ctx.drawImage(
                        this.imagenInferior,
                        obstacle.x - offsetX, // Centrar sobre el area de colision
                        obstacle.bottomY + i * alturaInferior - this.offSetY,
                        this.obstacleDisplayWidth, // Usar ancho visual
                        alturaInferior
                    );
                }
                
                // Rectangulo de hitbox para debug
                // ctx.strokeStyle = 'red';
                // ctx.lineWidth = 2;
                // ctx.strokeRect(obstacle.x, 0, this.obstacleWidth, obstacle.topHeight);
                // ctx.strokeRect(obstacle.x, obstacle.bottomY, this.obstacleWidth, this.canvas.height - obstacle.bottomY);
            }
        } else {
            // Mientras cargan las imagenes, dibujar rectangulos simples
            ctx.fillStyle = '#77441A';
            for (let obstacle of this.obstacles) {
                // Tubo superior
                ctx.fillRect(obstacle.x, 0, this.obstacleWidth, obstacle.topHeight);
                // Tubo inferior
                ctx.fillRect(obstacle.x, obstacle.bottomY, this.obstacleWidth, this.canvas.height - obstacle.bottomY);
            }
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

            if (tadpoleRight > obstacleLeft && tadpoleLeft < obstacleRight) {
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