// ==================== ESPERAR A QUE EL DOM ESTÉ LISTO ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, iniciando juego...');
    
    // ==================== VARIABLES GLOBALES ====================
    const blur_screen = document.getElementById('blur_screen');
    const pantalla_comienzo = document.querySelector('.pantalla_comienzo');
    const pantalla_instrucciones = document.querySelector('.pantalla_instrucciones');
    const pantalla_jugable = document.querySelector('.pantalla_jugable');
    const pantalla_final = document.querySelector('.pantalla_final');
    const pantalla_derrota = document.querySelector('.pantalla_derrota');

    const btn_start = document.getElementById('btn_start');
    const btn_comenzar_jugar = document.getElementById('btn_comenzar_jugar');
    const btn_instrucciones = document.getElementById('btn_instrucciones');
    const btn_volver_menu = document.getElementById('btn_volver_menu');
    const btn_reset = document.getElementById('btn_reset');
    const btn_reintentar = document.getElementById('btn_reintentar');
    const btn_volver_juego = document.getElementById('btn_volver_juego');

    let tiempoInicio = null;
    let timerInterval = null;
    let gameInstance = null;

    // ==================== FUNCIONES DE NAVEGACIÓN ====================
    function mostrarPantalla(pantalla) {
        console.log('Mostrando pantalla:', pantalla.className);
        
        // Ocultar todas las pantallas
        blur_screen.classList.add('hidden');
        pantalla_comienzo.classList.add('hidden');
        pantalla_instrucciones.classList.add('hidden');
        pantalla_jugable.classList.add('hidden');
        pantalla_final.classList.add('hidden');
        pantalla_derrota.classList.add('hidden');

        // Mostrar la pantalla solicitada
        pantalla.classList.remove('hidden');
    }

    function iniciarTemporizador() {
        tiempoInicio = Date.now();
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        timerInterval = setInterval(actualizarTiempo, 1000);
        console.log('Temporizador iniciado');
    }

    function detenerTemporizador() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            console.log('Temporizador detenido');
        }
    }

    function actualizarTiempo() {
        if (!tiempoInicio) return;
        
        const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
        const minutos = Math.floor(tiempoTranscurrido / 60);
        const segundos = tiempoTranscurrido % 60;
        const tiempoElement = document.getElementById('tiempo');
        if (tiempoElement) {
            tiempoElement.textContent = 
                `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        }
    }

    // ==================== EVENT LISTENERS ====================
    btn_start.addEventListener('click', () => {
        console.log('Botón start clickeado');
        mostrarPantalla(pantalla_comienzo);
    });

    btn_comenzar_jugar.addEventListener('click', () => {
        console.log('Comenzando juego...');
        mostrarPantalla(pantalla_jugable);
        iniciarTemporizador();
        
        // Inicializar el juego
        if (!gameInstance) {
            gameInstance = new FrogSolitaire('canvas');
        }
    });

    btn_instrucciones.addEventListener('click', () => {
        console.log('Mostrando instrucciones');
        mostrarPantalla(pantalla_instrucciones);
    });

    btn_volver_menu.addEventListener('click', () => {
        console.log('Volviendo al menú');
        mostrarPantalla(pantalla_comienzo);
        detenerTemporizador();
    });

    btn_reset.addEventListener('click', () => {
        console.log('Reset del juego');
        if (gameInstance) {
            gameInstance.reset();
            tiempoInicio = Date.now();
        }
    });

    btn_reintentar.addEventListener('click', () => {
        console.log('Reintentando juego');
        mostrarPantalla(pantalla_jugable);
        if (gameInstance) {
            gameInstance.reset();
            tiempoInicio = Date.now();
            iniciarTemporizador();
        }
    });

    if (btn_volver_juego) {
        btn_volver_juego.addEventListener('click', () => {
            console.log('Volviendo al menú desde juego');
            mostrarPantalla(pantalla_comienzo);
            detenerTemporizador();
        });
    }

    // ==================== CLASE PRINCIPAL DEL JUEGO ====================
    class FrogSolitaire {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) {
                console.error('Canvas no encontrado!');
                return;
            }
            
            this.ctx = this.canvas.getContext('2d');
            this.isRunning = false;
            this.images = {};
            this.imagesLoaded = false;
            this.draggedFrog = null;
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            this.animationTime = 0;
            
            console.log('Iniciando juego FrogSolitaire...');
            this.loadImages();
        }
        
        async loadImages() {
            console.log('Cargando imágenes...');
            
            // Rutas de las imágenes - verifica que estas rutas sean correctas
            const imagePaths = {
                lake: './img/frogames/lago1.png',
                lilypad: './img/frogames/nenufar.png', 
                frogGreen: './img/frogames/rana1.png',
                frogOrange: './img/frogames/rana2.png'
            };
            
            console.log('Rutas de imágenes:', imagePaths);

            try {
                // Cargar imágenes en paralelo
                const loadPromises = Object.entries(imagePaths).map(async ([key, path]) => {
                    try {
                        const img = await this.loadImage(path);
                        this.images[key] = img;
                        console.log(`✅ Imagen cargada: ${key}`, img);
                        return { key, success: true };
                    } catch (error) {
                        console.warn(`❌ Error cargando ${key}:`, path, error);
                        // Crear imagen de respaldo inmediatamente
                        this.images[key] = this.createFallbackImage(key);
                        return { key, success: false };
                    }
                });

                const results = await Promise.allSettled(loadPromises);
                console.log('Resultados de carga:', results);
                
            } catch (error) {
                console.error('Error general cargando imágenes:', error);
            } finally {
                this.imagesLoaded = true;
                console.log('Estado final de imágenes:', this.images);
                this.init();
            }
        }
        
        loadImage(src) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    console.log(`Imagen cargada exitosamente: ${src}`);
                    resolve(img);
                };
                img.onerror = () => {
                    console.error(`Error cargando imagen: ${src}`);
                    reject(new Error(`Failed to load ${src}`));
                };
                img.src = src;
                
                // Timeout para evitar que se quede colgado
                setTimeout(() => {
                    if (!img.complete) {
                        console.warn(`Timeout cargando imagen: ${src}`);
                        reject(new Error(`Timeout loading ${src}`));
                    }
                }, 3000);
            });
        }
        
        createFallbackImage(type) {
            console.log(`Creando imagen de respaldo para: ${type}`);
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            
            switch(type) {
                case 'lake':
                    // Fondo azul-verde para el lago
                    ctx.fillStyle = '#1a4d2e';
                    ctx.fillRect(0, 0, 100, 100);
                    // Agregar algo de textura
                    ctx.fillStyle = '#0d2818';
                    for (let i = 0; i < 20; i++) {
                        ctx.beginPath();
                        ctx.arc(Math.random() * 100, Math.random() * 100, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    break;
                    
                case 'lilypad':
                    // Nenúfar verde circular
                    ctx.fillStyle = '#2d5016';
                    ctx.beginPath();
                    ctx.arc(50, 50, 40, 0, Math.PI * 2);
                    ctx.fill();
                    // Textura de nenúfar
                    ctx.strokeStyle = '#1a3010';
                    ctx.lineWidth = 2;
                    for (let i = 0; i < 8; i++) {
                        ctx.beginPath();
                        ctx.moveTo(50, 50);
                        ctx.lineTo(50 + 35 * Math.cos(i * Math.PI/4), 50 + 35 * Math.sin(i * Math.PI/4));
                        ctx.stroke();
                    }
                    break;
                    
                case 'frogGreen':
                    // Rana verde
                    ctx.fillStyle = '#47CA7D';
                    ctx.beginPath();
                    ctx.arc(50, 50, 35, 0, Math.PI * 2);
                    ctx.fill();
                    // Ojos
                    ctx.fillStyle = '#000';
                    ctx.beginPath();
                    ctx.arc(35, 35, 5, 0, Math.PI * 2);
                    ctx.arc(65, 35, 5, 0, Math.PI * 2);
                    ctx.fill();
                    // Boca
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(50, 60, 15, 0.2 * Math.PI, 0.8 * Math.PI);
                    ctx.stroke();
                    break;
                    
                case 'frogOrange':
                    // Rana naranja
                    ctx.fillStyle = '#ff8800';
                    ctx.beginPath();
                    ctx.arc(50, 50, 35, 0, Math.PI * 2);
                    ctx.fill();
                    // Ojos
                    ctx.fillStyle = '#000';
                    ctx.beginPath();
                    ctx.arc(35, 35, 5, 0, Math.PI * 2);
                    ctx.arc(65, 35, 5, 0, Math.PI * 2);
                    ctx.fill();
                    // Boca
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(50, 60, 15, 0.2 * Math.PI, 0.8 * Math.PI);
                    ctx.stroke();
                    break;
            }
            
            const img = new Image();
            img.src = canvas.toDataURL();
            console.log(`Imagen de respaldo creada para: ${type}`);
            return img;
        }
        
        init() {
            console.log('Inicializando juego...');
            
            // Configuración del tablero
            this.cellSize = 70;
            this.boardSize = 7;
            this.marginX = (this.canvas.width - (this.boardSize * this.cellSize)) / 2;
            this.marginY = (this.canvas.height - (this.boardSize * this.cellSize)) / 2;
            
            console.log('Dimensiones canvas:', this.canvas.width, this.canvas.height);
            console.log('Margenes:', this.marginX, this.marginY);
            
            // Patrón del tablero (1 = ficha, 0 = vacío, null = no existe)
            this.board = [
                [null, null, 1, 1, 1, null, null],
                [null, null, 1, 1, 1, null, null],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 0, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [null, null, 1, 1, 1, null, null],
                [null, null, 1, 1, 1, null, null]
            ];
            
            // Tipos de ranas (colores diferentes)
            this.frogTypes = [];
            this.initializeFrogTypes();
            
            this.setupEventListeners();
            this.isRunning = true;
            this.gameLoop();
            
            console.log('Juego inicializado. Estado del tablero:', this.board);
        }
        
        initializeFrogTypes() {
            // Asignar tipos de ranas aleatoriamente
            for (let row = 0; row < this.boardSize; row++) {
                this.frogTypes[row] = [];
                for (let col = 0; col < this.boardSize; col++) {
                    if (this.board[row][col] === 1) {
                        // 70% verdes, 30% naranjas
                        this.frogTypes[row][col] = Math.random() < 0.7 ? 'green' : 'orange';
                    } else {
                        this.frogTypes[row][col] = null;
                    }
                }
            }
            console.log('Tipos de ranas inicializados:', this.frogTypes);
        }
        
        setupEventListeners() {
            this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            this.canvas.addEventListener('mouseleave', () => this.handleMouseLeave());
        }
        
        handleMouseDown(event) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            const cell = this.getCellAtPosition(x, y);
            if (!cell || this.board[cell.row][cell.col] !== 1) {
                console.log('Clic en posición inválida:', x, y, cell);
                return;
            }
            
            const { row, col } = cell;
            console.log('Rana seleccionada en:', row, col);

            // Iniciar arrastre
            this.isDragging = true;
            this.draggedFrog = {
                row,
                col,
                type: this.frogTypes[row][col],
                x: this.marginX + col * this.cellSize + this.cellSize/2,
                y: this.marginY + row * this.cellSize + this.cellSize/2,
                dragX: x,
                dragY: y
            };
            
            this.dragOffset.x = x - this.draggedFrog.x;
            this.dragOffset.y = y - this.draggedFrog.y;
            
            this.canvas.style.cursor = 'grabbing';
            console.log('Arrastre iniciado:', this.draggedFrog);
        }
        
        handleMouseMove(event) {
            if (!this.isDragging || !this.draggedFrog) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            this.draggedFrog.dragX = x - this.dragOffset.x;
            this.draggedFrog.dragY = y - this.dragOffset.y;
        }
        
        handleMouseUp(event) {
            if (!this.isDragging || !this.draggedFrog) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            const targetCell = this.getCellAtPosition(x, y);
            console.log('Soltando en:', targetCell);

            if (targetCell && this.isValidMove(this.draggedFrog.row, this.draggedFrog.col, targetCell.row, targetCell.col)) {
                console.log('Movimiento válido, ejecutando...');
                this.makeMove(this.draggedFrog.row, this.draggedFrog.col, targetCell.row, targetCell.col);
            } else {
                console.log('Movimiento inválido');
            }

            // Resetear estado de arrastre
            this.isDragging = false;
            this.draggedFrog = null;
            this.canvas.style.cursor = 'default';
        }
        
        handleMouseLeave() {
            if (this.isDragging) {
                this.isDragging = false;
                this.draggedFrog = null;
                this.canvas.style.cursor = 'default';
            }
        }
        
        getCellAtPosition(x, y) {
            const col = Math.floor((x - this.marginX) / this.cellSize);
            const row = Math.floor((y - this.marginY) / this.cellSize);
            
            if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize && 
                this.board[row][col] !== null) {
                return { row, col };
            }
            return null;
        }
        
        isValidMove(fromRow, fromCol, toRow, toCol) {
            // Verificar que el movimiento sea válido
            const rowDiff = Math.abs(fromRow - toRow);
            const colDiff = Math.abs(fromCol - toCol);
            
            // Debe ser salto de 2 casillas en línea recta
            if ((rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2)) {
                const middleRow = (fromRow + toRow) / 2;
                const middleCol = (fromCol + toCol) / 2;
                
                // La casilla intermedia debe tener ficha y la destino estar vacía
                return this.board[middleRow][middleCol] === 1 && 
                       this.board[toRow][toCol] === 0;
            }
            
            return false;
        }
        
        makeMove(fromRow, fromCol, toRow, toCol) {
            console.log(`Moviendo de (${fromRow},${fromCol}) a (${toRow},${toCol})`);
            
            // Realizar el movimiento
            this.board[fromRow][fromCol] = 0; // Quitar ficha origen
            this.board[toRow][toCol] = 1;     // Poner ficha destino
            
            // Mantener el tipo de rana
            this.frogTypes[toRow][toCol] = this.frogTypes[fromRow][fromCol];
            this.frogTypes[fromRow][fromCol] = null;
            
            // Quitar ficha del medio
            const middleRow = (fromRow + toRow) / 2;
            const middleCol = (fromCol + toCol) / 2;
            this.board[middleRow][middleCol] = 0;
            this.frogTypes[middleRow][middleCol] = null;
            
            console.log('Tablero después del movimiento:', this.board);
            
            // Verificar fin del juego
            this.checkGameEnd();
        }
        
        getPossibleMoves() {
            const moves = [];
            for (let row = 0; row < this.boardSize; row++) {
                for (let col = 0; col < this.boardSize; col++) {
                    if (this.board[row][col] === 1) {
                        const directions = [
                            {dr: -2, dc: 0}, {dr: 2, dc: 0},
                            {dr: 0, dc: -2}, {dr: 0, dc: 2}
                        ];
                        
                        for (const dir of directions) {
                            const newRow = row + dir.dr;
                            const newCol = col + dir.dc;
                            
                            if (this.isValidMove(row, col, newRow, newCol)) {
                                moves.push({
                                    from: { row, col },
                                    to: { row: newRow, col: newCol },
                                    direction: dir
                                });
                            }
                        }
                    }
                }
            }
            return moves;
        }
        
        checkGameEnd() {
            const remainingPegs = this.countRemainingPegs();
            const hasValidMoves = this.getPossibleMoves().length > 0;
            
            console.log(`Fichas restantes: ${remainingPegs}, Movimientos válidos: ${hasValidMoves}`);
            
            if (remainingPegs === 1) {
                // Victoria - solo queda una ficha
                console.log('¡VICTORIA! Solo queda 1 rana');
                setTimeout(() => this.onGameEnd(true), 500);
            } else if (!hasValidMoves) {
                // Derrota - no hay movimientos posibles
                console.log('DERROTA - No hay movimientos posibles');
                setTimeout(() => this.onGameEnd(false), 500);
            }
        }
        
        countRemainingPegs() {
            let count = 0;
            for (let row = 0; row < this.boardSize; row++) {
                for (let col = 0; col < this.boardSize; col++) {
                    if (this.board[row][col] === 1) count++;
                }
            }
            return count;
        }
        
        onGameEnd(won) {
            this.isRunning = false;
            detenerTemporizador();
            
            if (won) {
                console.log('¡Victoria! Mostrando pantalla final');
                mostrarPantalla(pantalla_final);
            } else {
                console.log('Derrota - sin movimientos');
                mostrarPantalla(pantalla_derrota);
            }
        }
        
        reset() {
            console.log('Reseteando juego...');
            this.board = [
                [null, null, 1, 1, 1, null, null],
                [null, null, 1, 1, 1, null, null],
                [1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 0, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1],
                [null, null, 1, 1, 1, null, null],
                [null, null, 1, 1, 1, null, null]
            ];
            this.initializeFrogTypes();
            this.isRunning = true;
        }
        
        gameLoop() {
            if (!this.isRunning) return;
            
            this.animationTime += 0.016; // Aprox 60 FPS
            
            this.render();
            requestAnimationFrame(() => this.gameLoop());
        }
        
        render() {
            // Limpiar canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Dibujar fondo (lago)
            if (this.images.lake && this.images.lake.complete) {
                this.ctx.drawImage(this.images.lake, 0, 0, this.canvas.width, this.canvas.height);
                console.log('✅ Lago dibujado');
            } else {
                this.ctx.fillStyle = '#1a4d2e';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                console.log('✅ Lago de respaldo dibujado');
            }
            
            // Dibujar tablero
            this.drawBoard();
            
            // Dibujar hints animados si no hay arrastre
            if (!this.isDragging) {
                this.drawHints();
            }
            
            // Dibujar rana arrastrada encima de todo
            if (this.isDragging && this.draggedFrog) {
                this.drawDraggedFrog();
            }
        }
        
        drawHints() {
            const moves = this.getPossibleMoves();
            const pulse = Math.sin(this.animationTime * 3) * 0.3 + 0.7;
            
            moves.forEach(move => {
                const fromX = this.marginX + move.from.col * this.cellSize + this.cellSize/2;
                const fromY = this.marginY + move.from.row * this.cellSize + this.cellSize/2;
                const toX = this.marginX + move.to.col * this.cellSize + this.cellSize/2;
                const toY = this.marginY + move.to.row * this.cellSize + this.cellSize/2;
                
                // Círculo verde pulsante en destino
                this.ctx.strokeStyle = `rgba(76, 175, 80, ${pulse})`;
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.arc(toX, toY, this.cellSize/2 - 5, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // Flecha animada desde origen a destino
                this.drawAnimatedArrow(fromX, fromY, toX, toY, pulse);
            });
        }
        
        drawAnimatedArrow(fromX, fromY, toX, toY, opacity) {
            // Calcular dirección y posición de la flecha
            const angle = Math.atan2(toY - fromY, toX - fromX);
            const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
            const progress = (Math.sin(this.animationTime * 4) + 1) / 2; // 0 to 1
            const arrowX = fromX + (distance * 0.3) * Math.cos(angle);
            const arrowY = fromY + (distance * 0.3) * Math.sin(angle);
            const bounce = Math.sin(this.animationTime * 8) * 3;
            
            // Dibujar flecha
            this.ctx.save();
            this.ctx.translate(arrowX, arrowY + bounce);
            this.ctx.rotate(angle);
            
            this.ctx.fillStyle = `rgba(255, 235, 59, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(-15, -8);
            this.ctx.lineTo(-15, 8);
            this.ctx.closePath();
            this.ctx.fill();
            
            this.ctx.restore();
        }
        
        drawBoard() {
            console.log('Dibujando tablero...');
            
            for (let row = 0; row < this.boardSize; row++) {
                for (let col = 0; col < this.boardSize; col++) {
                    if (this.board[row][col] === null) continue;
                    
                    const x = this.marginX + col * this.cellSize;
                    const y = this.marginY + row * this.cellSize;
                    const centerX = x + this.cellSize/2;
                    const centerY = y + this.cellSize/2;
                    
                    // Dibujar nenúfar
                    if (this.images.lilypad && this.images.lilypad.complete) {
                        this.ctx.drawImage(
                            this.images.lilypad,
                            x + 5,
                            y + 5,
                            this.cellSize - 10,
                            this.cellSize - 10
                        );
                        console.log(`✅ Nenúfar dibujado en (${row},${col})`);
                    } else {
                        this.ctx.fillStyle = '#2d5016';
                        this.ctx.beginPath();
                        this.ctx.arc(centerX, centerY, this.cellSize/2 - 5, 0, Math.PI * 2);
                        this.ctx.fill();
                        console.log(`✅ Nenúfar de respaldo dibujado en (${row},${col})`);
                    }
                    
                    // Dibujar rana si existe
                    if (this.board[row][col] === 1) {
                        const frogType = this.frogTypes[row][col];
                        const frogImage = frogType === 'orange' ? this.images.frogOrange : this.images.frogGreen;
                        
                        if (frogImage && frogImage.complete) {
                            this.ctx.drawImage(
                                frogImage,
                                x + 10,
                                y + 10,
                                this.cellSize - 20,
                                this.cellSize - 20
                            );
                            console.log(`✅ Rana ${frogType} dibujada en (${row},${col})`);
                        } else {
                            // Fallback si no hay imagen
                            this.ctx.fillStyle = frogType === 'orange' ? '#ff8800' : '#47CA7D';
                            this.ctx.beginPath();
                            this.ctx.arc(centerX, centerY, this.cellSize/3, 0, Math.PI * 2);
                            this.ctx.fill();
                            console.log(`✅ Rana de respaldo ${frogType} dibujada en (${row},${col})`);
                        }
                    }
                }
            }
        }
        
        drawDraggedFrog() {
            if (!this.draggedFrog) return;
            
            const frogImage = this.draggedFrog.type === 'orange' ? 
                this.images.frogOrange : this.images.frogGreen;
            
            // Sombra para efecto de arrastre
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            this.ctx.shadowBlur = 15;
            this.ctx.shadowOffsetX = 5;
            this.ctx.shadowOffsetY = 5;
            
            if (frogImage && frogImage.complete) {
                this.ctx.drawImage(
                    frogImage,
                    this.draggedFrog.dragX - this.cellSize/2 + 10,
                    this.draggedFrog.dragY - this.cellSize/2 + 10,
                    this.cellSize - 20,
                    this.cellSize - 20
                );
            } else {
                // Fallback
                this.ctx.fillStyle = this.draggedFrog.type === 'orange' ? '#ff8800' : '#47CA7D';
                this.ctx.beginPath();
                this.ctx.arc(this.draggedFrog.dragX, this.draggedFrog.dragY, this.cellSize/3, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            // Resetear sombra
            this.ctx.shadowColor = 'transparent';
            this.ctx.shadowBlur = 0;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
        }
    }

    console.log('Juego Frog Solitaire inicializado correctamente');
});