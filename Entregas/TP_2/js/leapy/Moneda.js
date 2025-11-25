export class Moneda {
    constructor(canvas) {
        this.canvas = canvas;
        this.monedas = [];

        this.coinSpeed = 4; // Misma velocidad que los obstaculos
        this.frameCount = 0;

        // Configuracion del sprite sheet
        this.spriteSheet = new Image();
        this.spriteSheet.src = 'img/leapy_frog/moneda_animada_sprite_sheet.png'; // Ruta a tu imagen
        this.spriteLoaded = false;
        
        this.spriteSheet.onload = () => {
            this.spriteLoaded = true;
            console.log('Sprite sheet de monedas cargado correctamente');
        };

        // Configuracion de la animacion
        this.frameWidth = 350;     // Ancho de cada frame en el sprite
        this.frameHeight = 350;    // Alto de cada frame en el sprite
        this.totalFrames = 36;     // Total de frames
        this.currentFrame = 0;     // Frame actual
        this.frameCounter = 0;     // Contador para controlar velocidad de animacion
        this.frameSpeed = 2;       // Cada cuantos updates cambiar de frame
        
        // Tamaño de la moneda en pantalla
        this.drawWidth = 90;       // Ancho al dibujar 
        this.drawHeight = 90;      // Alto al dibujar 
        this.coinRadius = 30;      // Radio para colisiones
        
        // Brillo para la animacion
        this.brightness = 1;
        this.glowIntensity = 0;
    }


    generarMonedaEnPosicion(x, y) {
        this.monedas.push({
            x: x,
            y: y,
            recogida: false,
            // Propiedades para animacion CSS
            animandoRecoleccion: false,
            tiempoRecoleccion: 0,
            offsetY: 0,
            opacity: 1,
            scale: 1,
            brightness: 1,
            glowIntensity: 0
        });
    }

    update(renacuajo) {
        let monedasRecogidas = 0;

        this.frameCounter++;
        if (this.frameCounter >= this.frameSpeed) {
            this.frameCounter = 0;
            this.currentFrame++;
            
            if (this.currentFrame >= this.totalFrames) {
                this.currentFrame = 0;
            }
        }

        // Actualizar la posicion de monedas existentes
        for (let i = this.monedas.length - 1; i >= 0; i--) {
            const moneda = this.monedas[i];
            
            if (!moneda.recogida) {
                moneda.x -= this.coinSpeed;

                if (this.checkCollision(moneda, renacuajo)) {
                    moneda.recogida = true;
                    monedasRecogidas++;
                    this.crearAnimacionRecoleccionDOM(moneda);
                    this.monedas.splice(i, 1);
                    continue;
                }

                // Eliminar monedas fuera de pantalla
                if (moneda.x + this.coinRadius < 0) {
                    this.monedas.splice(i, 1);
                }
            }
        }

        return monedasRecogidas;
    }


    crearAnimacionRecoleccionDOM(moneda) {
        const canvasRect = this.canvas.getBoundingClientRect();
        
        // Crear elemento de imagen
        const monedaDOM = document.createElement('img');
        monedaDOM.src = 'img/leapy_frog/moneda.png';
        monedaDOM.className = 'moneda-recolectada';
        
        // Posicionar el elemento donde estaba la moneda en el canvas
        monedaDOM.style.left = `${canvasRect.left + moneda.x - this.drawWidth/2}px`;
        monedaDOM.style.top = `${canvasRect.top + moneda.y - this.drawHeight/2}px`;
        
        // Agregar al body
        document.body.appendChild(monedaDOM);
        
        // Eliminar el elemento cuando termine la animacion (0.6s)
        setTimeout(() => {
            if (monedaDOM.parentNode) {
                monedaDOM.parentNode.removeChild(monedaDOM);
            }
        }, 600);
    }

    checkCollision(moneda, renacuajo) {
        // Colision circulo a circulo usando distancia entre centros
        const dx = moneda.x - renacuajo.x;
        const dy = moneda.y - renacuajo.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        return distancia < (this.coinRadius + renacuajo.radius);
    }

    draw(ctx) {
    if (this.spriteLoaded) {
        for (let moneda of this.monedas) {
            if (!moneda.recogida) {
                // Calcular posicion del frame actual en el sprite sheet
                const sourceX = this.currentFrame * this.frameWidth;
                const sourceY = 0;
                
                // Calcular posicion para centrar el sprite
                const drawX = moneda.x - this.drawWidth / 2;
                const drawY = moneda.y - this.drawHeight / 2;
                
                ctx.drawImage(
                    this.spriteSheet,
                    sourceX,
                    sourceY,
                    this.frameWidth,
                    this.frameHeight,
                    drawX,
                    drawY,
                    this.drawWidth,
                    this.drawHeight
                );
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
        this.isAnimating = false;
    }
}