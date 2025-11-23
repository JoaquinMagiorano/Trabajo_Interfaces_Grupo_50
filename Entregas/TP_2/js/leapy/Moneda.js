// Clase Moneda - Maneja las monedas del juego
export class Moneda {
    constructor(canvas) {
        this.canvas = canvas;
        this.monedas = [];

        this.coinSpeed = 4; // Misma velocidad que los obstáculos
        this.frameCount = 0;

        // Configuración del sprite sheet
        this.spriteSheet = new Image();
        this.spriteSheet.src = 'img/leapy_frog/moneda_animada_sprite_sheet.png'; // Ruta a tu imagen
        this.spriteLoaded = false;
        
        this.spriteSheet.onload = () => {
            this.spriteLoaded = true;
            console.log('Sprite sheet de monedas cargado correctamente');
        };

       

         // Configuración de la animación
        this.frameWidth = 350;     // Ancho de cada frame en el sprite
        this.frameHeight = 350;    // Alto de cada frame en el sprite
        this.totalFrames = 36;     // Total de frames en tu sprite
        this.currentFrame = 0;     // Frame actual
        this.frameCounter = 0;     // Contador para controlar velocidad de animación
        this.frameSpeed = 2;       // Cada cuántos updates cambiar de frame (ajustable)
        
        // Tamaño de la moneda en pantalla
        this.drawWidth = 90;       // Ancho al dibujar (ajustable)
        this.drawHeight = 90;      // Alto al dibujar (ajustable)
        this.coinRadius = 30;      // Radio para colisiones (ajustar según drawWidth/drawHeight)
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

        // Actualizar animación del sprite
        this.frameCounter++;
        if (this.frameCounter >= this.frameSpeed) {
            this.frameCounter = 0;
            this.currentFrame++;
            
            // Volver al primer frame cuando llega al final
            if (this.currentFrame >= this.totalFrames) {
                this.currentFrame = 0;
            }
        }

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
        if (this.spriteLoaded) {
            for (let moneda of this.monedas) {
                if (!moneda.recogida) {
                    // Calcular posición del frame actual en el sprite sheet
                    const sourceX = this.currentFrame * this.frameWidth;
                    const sourceY = 0; // Si tienes múltiples filas, ajusta esto
                    
                    // Calcular posición para centrar el sprite
                    const drawX = moneda.x - this.drawWidth / 2;
                    const drawY = moneda.y - this.drawHeight / 2;
                    
                    ctx.drawImage(
                        this.spriteSheet,
                        sourceX,            // Posición X en el sprite sheet
                        sourceY,            // Posición Y en el sprite sheet
                        this.frameWidth,    // Ancho del frame en el sprite
                        this.frameHeight,   // Alto del frame en el sprite
                        drawX,              // Posición X en el canvas
                        drawY,              // Posición Y en el canvas
                        this.drawWidth,     // Ancho al dibujar
                        this.drawHeight     // Alto al dibujar
                    );
                    
                    // Opcional: Dibujar círculo de colisión para debug
                     ctx.strokeStyle = 'red';
                     ctx.beginPath();
                     ctx.arc(moneda.x, moneda.y, this.coinRadius, 0, Math.PI * 2);
                     ctx.stroke();
                }
            }
        } else {
            // Mientras carga el sprite, dibujar círculos simples
            ctx.fillStyle = '#FFD700';
            for (let moneda of this.monedas) {
                if (!moneda.recogida) {
                    ctx.beginPath();
                    ctx.arc(moneda.x, moneda.y, this.coinRadius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.strokeStyle = '#FFA500';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
        }
    }

    reset() {
        this.monedas = [];
        this.frameCount = 0;
        this.currentFrame = 0;
        this.frameCounter = 0;
    }

    setDead() {
    this.isDead = true;
    this.isAnimating = false; // Detener animación normal
    }

}