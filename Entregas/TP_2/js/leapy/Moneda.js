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

        // Actualizar animacion del sprite
        this.frameCounter++;
        if (this.frameCounter >= this.frameSpeed) {
            this.frameCounter = 0;
            this.currentFrame++;
            
            // Volver al primer frame cuando llega al final
            if (this.currentFrame >= this.totalFrames) {
                this.currentFrame = 0;
            }
        }

        // Actualizar posicion de monedas existentes
        for (let i = this.monedas.length - 1; i >= 0; i--) {
            const moneda = this.monedas[i];
            
            // Si esta animando la recoleccion
            if (moneda.animandoRecoleccion) {
                moneda.tiempoRecoleccion++;
                const progreso = moneda.tiempoRecoleccion / 36; // 36 frames = 0.6s a 60fps
                
                const easeOut = 1 - Math.pow(1 - progreso, 3);
                moneda.offsetY = -150 * easeOut;
                
                // Opacidad
                if (progreso < 0.5) {
                    moneda.opacity = 1 - (progreso * 0.2);
                } else {
                    moneda.opacity = 0.8 - ((progreso - 0.5) * 1.6);
                }
                
                // Escala
                if (progreso < 0.5) {
                    moneda.scale = 1 + (progreso * 0.6);
                } else {
                    moneda.scale = 1.3 - ((progreso - 0.5) * 1.6);
                }
                
                // Brillo
                if (progreso < 0.3) {
                    moneda.brightness = 1 + (progreso * 3.33);
                    moneda.glowIntensity = progreso * 66.67;
                } else if (progreso < 0.5) {
                    moneda.brightness = 2 + ((progreso - 0.3) * 2.5);
                    moneda.glowIntensity = 20 + ((progreso - 0.3) * 50);
                } else if (progreso < 0.7) {
                    moneda.brightness = 2.5 - ((progreso - 0.5) * 2.5);
                    moneda.glowIntensity = 30 - ((progreso - 0.5) * 25);
                } else {
                    moneda.brightness = 2 - ((progreso - 0.7) * 3.33);
                    moneda.glowIntensity = 25 - ((progreso - 0.7) * 83.33);
                }
                
                // Eliminar cuando termina la animacion
                if (moneda.tiempoRecoleccion >= 36) {
                    this.monedas.splice(i, 1);
                }
                continue;
            }
            
            if (!moneda.recogida) {
                moneda.x -= this.coinSpeed;

                // Verificar colision
                if (this.checkCollision(moneda, renacuajo)) {
                    moneda.recogida = true;
                    moneda.animandoRecoleccion = true; // Inicia la animacion
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
        // Colision circulo a circulo usando distancia entre centros
        const dx = moneda.x - renacuajo.x;
        const dy = moneda.y - renacuajo.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        
        return distancia < (this.coinRadius + renacuajo.radius);
    }

    draw(ctx) {
        if (this.spriteLoaded) {
            for (let moneda of this.monedas) {
                ctx.save();
    
                ctx.globalAlpha = moneda.opacity;
                
                if (moneda.animandoRecoleccion) {
                    ctx.filter = `brightness(${moneda.brightness}) drop-shadow(0 0 ${moneda.glowIntensity}px #FFD700)`;
                }
                
                // Calcular posicion del frame actual en el sprite sheet
                const sourceX = this.currentFrame * this.frameWidth;
                const sourceY = 0;
                
                // Calcular posicion para centrar el sprite
                const drawX = moneda.x - (this.drawWidth * moneda.scale) / 2;
                const drawY = moneda.y - (this.drawHeight * moneda.scale) / 2 + moneda.offsetY;
                
                ctx.drawImage(
                    this.spriteSheet,
                    sourceX,            // Posicion X en el sprite sheet
                    sourceY,            // Posicion Y en el sprite sheet
                    this.frameWidth,    // Ancho del frame en el sprite
                    this.frameHeight,   // Alto del frame en el sprite
                    drawX,              // Posicion X en el canvas
                    drawY,              // Posicion Y en el canvas
                    this.drawWidth * moneda.scale,     // Ancho al dibujar
                    this.drawHeight * moneda.scale     // Alto al dibujar
                );
                
                ctx.restore();
                
                // Dibujar circulo de colision para debug
                /* ctx.strokeStyle = 'red';
                ctx.beginPath();
                ctx.arc(moneda.x, moneda.y, this.coinRadius, 0, Math.PI * 2);
                ctx.stroke(); */
            }
        } else {
            // Mientras carga el sprite, dibujar circulos simples
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