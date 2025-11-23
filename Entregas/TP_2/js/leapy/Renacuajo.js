// Clase Renacuajo - Maneja el personaje principal
export class Renacuajo {
    constructor(canvas) {
        this.x = canvas.width / 3;
        this.y = canvas.height / 2;
        this.radius = 25; // radio de la colision
        this.velocity = 0;
        this.gravity = 0.15;
        this.jumpStrength = -6;
        /*los pixeles mas arriba son los numeros mas bajos
         por lo tanto para caer tiene que aumentar el valor de y
          el cual aumenta constantemente con la gravedad*/
        // Configuración del sprite sheet
        this.spriteSheet = new Image();
        this.spriteSheet.src = 'img/leapy_frog/renacuajo_animad_sprite_sheet.png'; // Ruta a tu imagen
        this.spriteLoaded = false;
        
        this.spriteSheet.onload = () => {
            this.spriteLoaded = true;
            console.log('Sprite sheet cargado correctamente');
        };

        this.spriteSheetDead = new Image();
        this.spriteSheetDead.src = 'img/leapy_frog/renacuajo_muerto.png'; // Tu imagen con X en los ojos
        this.deadSpriteLoaded = false;
        this.isDead = false; // Nuevo estado

        this.spriteSheetDead.onload = () => {
            this.deadSpriteLoaded = true;
            console.log('Sprite de renacuajo muerto cargado');
        };


        // Configuración de la animación
        this.frameWidth = 350;  // Ancho de cada frame
        this.frameHeight = 350; // Alto de cada frame
        this.totalFrames = 14;  // Total de frames en tu sprite
        this.currentFrame = 0;  // Frame actual (reposo)
        this.frameCounter = 0;  // Contador para controlar velocidad de animación
        this.frameSpeed = 3;    // Cada cuántos updates cambiar de frame
        this.isAnimating = false; // Si la animación está activa
        
        // Tamaño del renacuajo en pantalla
        this.drawWidth = 100;   // Ancho al dibujar (ajustable)
        this.drawHeight = 100;  // Alto al dibujar (ajustable)
        this.offSetX = 15;
        this.offSetY = 5;
    }

    jump() {
        // Solo permitir salto si no está animando (evita reiniciar la animación)
        if (!this.isAnimating) {
            // Sube al renacuajo (reduce y)
            this.velocity = this.jumpStrength;
            
            // Iniciar la animación desde el principio
            this.isAnimating = true;
            this.currentFrame = 0;
            this.frameCounter = 0;
        }
    }

    update() {
        // Actualizar física
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        // Actualizar animación si está activa
        if (this.isAnimating) {
            this.frameCounter++;
            
            if (this.frameCounter >= this.frameSpeed) {
                this.frameCounter = 0;
                this.currentFrame++;
                
                // Si llegamos al último frame, detener y volver al frame de reposo
                if (this.currentFrame >= this.totalFrames) {
                    this.isAnimating = false;
                    this.currentFrame = 0; // Volver al frame de reposo
                }
            }
        }
    }

    reset(canvas) {
        this.y = canvas.height / 2;
        this.velocity = 0;
        this.isAnimating = false;
        this.currentFrame = 0;
        this.frameCounter = 0;
        this.isDead = false;
    }

    draw(ctx) {
        // Si está muerto y el sprite está cargado, usar el sprite muerto
        if (this.isDead && this.deadSpriteLoaded) {
            const drawX = this.x - this.drawWidth / 2;
            const drawY = this.y - this.drawHeight / 2;
            
            ctx.drawImage(
                this.spriteSheetDead,
                drawX,
                drawY,
                this.drawWidth,
                this.drawHeight
            );
            
            // Opcional: círculo de colisión para debug
             ctx.strokeStyle = 'red';
             ctx.beginPath();
             ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
             ctx.stroke();
        }
        // Si está vivo y el sprite normal está cargado
        else if (this.spriteLoaded) {
            const sourceX = this.currentFrame * this.frameWidth;
            const sourceY = 0;
            
            const drawX = this.x - this.drawWidth / 2;
            const drawY = this.y - this.drawHeight / 2;
            
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
            
            // Opcional: círculo de colisión para debug
            // ctx.strokeStyle = 'red';
            // ctx.beginPath();
            // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            // ctx.stroke();
        } else {
            // Mientras carga el sprite, dibujar círculo simple
            ctx.fillStyle = '#4caf50';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    isOutOfBounds(canvasHeight) {
        return this.y + this.radius > canvasHeight || this.y - this.radius < 0;
    }

    setDead() {
        this.isDead = true;
        this.isAnimating = false; // Detener animación normal
    }
}