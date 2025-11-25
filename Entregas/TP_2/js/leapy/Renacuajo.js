export class Renacuajo {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = canvas.width / 3;
        this.y = canvas.height / 2;
        this.radius = 25; // radio de la colision
        this.velocity = 0;
        this.gravity = 0.15;
        this.jumpStrength = -6;
        this.offSetX = 15;
        this.offSetY = 5;
        this.showOnCanvas = true;



        /*los pixeles mas arriba son los numeros mas bajos
         por lo tanto para caer tiene que aumentar el valor de y
          el cual aumenta constantemente con la gravedad*/
        // Configuracion del sprite sheet
        this.spriteSheet = new Image();
        this.spriteSheet.src = 'img/leapy_frog/renacuajo_animad_sprite_sheet.png';
        this.spriteLoaded = false;
        
        this.spriteSheet.onload = () => {
            this.spriteLoaded = true;
            console.log('Sprite sheet cargado correctamente');
        };

        this.spriteSheetDead = new Image();
        this.spriteSheetDead.src = 'img/leapy_frog/renacuajo_muerto.png';
        this.deadSpriteLoaded = false;
        this.isDead = false;

        this.spriteSheetDead.onload = () => {
            this.deadSpriteLoaded = true;
            console.log('Sprite de renacuajo muerto cargado');
        };


        // Configuracion de la animacion
        this.frameWidth = 350;  // Ancho de cada frame
        this.frameHeight = 350; // Alto de cada frame
        this.totalFrames = 14;  // Total de frames
        this.currentFrame = 0;  // Frame actual
        this.frameCounter = 0;  // Contador para controlar velocidad de animacion
        this.frameSpeed = 3;    // Cada cuantos updates cambiar el frame
        this.isAnimating = false; // Si la animacion esta activa
        
        // Tamaño del renacuajo en pantalla
        this.drawWidth = 100;   // Ancho al dibujar 
        this.drawHeight = 100;  // Alto al dibujar 

        //Offsets para ajustar el sprite con la hitbox
        this.offSetX = 15; 
        this.offSetY = 5;
    }

    jump() {
        // Solo permitir salto si no esta en animacion
        if (!this.isAnimating) {
            this.velocity = this.jumpStrength;
            this.isAnimating = true;
            this.currentFrame = 0;
            this.frameCounter = 0;
        }
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.isAnimating) {
            this.frameCounter++;
            
            if (this.frameCounter >= this.frameSpeed) {
                this.frameCounter = 0;
                this.currentFrame++;
                
                if (this.currentFrame >= this.totalFrames) {
                    this.isAnimating = false;
                    this.currentFrame = 0;
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
        this.showOnCanvas = true;
    }

    draw(ctx) {
        if (!this.showOnCanvas) return;
        
        if (this.isDead && this.deadSpriteLoaded) {
            const drawX = this.x - this.drawWidth / 2;
            const drawY = this.y - this.drawHeight / 2;
            
            ctx.drawImage(
                this.spriteSheetDead,
                drawX - this.offSetX,
                drawY + this.offSetY,
                this.drawWidth,
                this.drawHeight
            );
            
            // Circulo de hitbox para debug
            // ctx.strokeStyle = 'red';
            // ctx.beginPath();
            // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            // ctx.stroke();
        }
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
                drawX - this.offSetX,
                drawY + this.offSetY,
                this.drawWidth,
                this.drawHeight
            );
            
            // Circulo de hitbox para debug
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
        this.isAnimating = false;
        this.showOnCanvas = false;

        if (this.canvas && typeof document !== 'undefined') {
            this.crearAnimacionDerrotaDOM();
        }

        this.velocity = Math.max(this.velocity, 2);
    }

    crearAnimacionDerrotaDOM() {
        const pantallaJuego = document.querySelector('.pantalla_juego');
        if (!pantallaJuego) {
            console.error('No se encontró .pantalla_juego');
            return;
        }

        const canvasRect = this.canvas.getBoundingClientRect();
        const pantallaRect = pantallaJuego.getBoundingClientRect();

        const renacuajoDOM = document.createElement('img');
        renacuajoDOM.src = 'img/leapy_frog/renacuajo_muerto.png';
        renacuajoDOM.className = 'renacuajo-caida';

        renacuajoDOM.style.left = `${canvasRect.left - pantallaRect.left + this.x - this.drawWidth / 2}px`;
        renacuajoDOM.style.top = `${canvasRect.top - pantallaRect.top + this.y - this.drawHeight / 2}px`;
        renacuajoDOM.style.width = `${this.drawWidth}px`;
        renacuajoDOM.style.height = `${this.drawHeight}px`;

        pantallaJuego.appendChild(renacuajoDOM);

        setTimeout(() => {
            if (renacuajoDOM.parentNode) {
                renacuajoDOM.parentNode.removeChild(renacuajoDOM);
            }
        }, 1200);
    }

}