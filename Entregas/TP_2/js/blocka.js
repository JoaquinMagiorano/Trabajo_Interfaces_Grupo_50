/*pantalla principal*/ 
const btn_start = document.querySelector('#btn_start');
const blur_screen = document.querySelector('#blur_screen');
/*pantalla de inicio*/
const pantalla_comienzo = document.querySelector('.pantalla_comienzo');
const btn_instrucciones = document.getElementById('btn_instrucciones');
const btn_comenzar_jugar = document.getElementById('btn_comenzar_jugar');
/*pantalla instrucciones*/
const pantalla_instrucciones = document.querySelector('.pantalla_instrucciones');
const btn_volver_menu = document.querySelector('.pantalla_instrucciones .btn');
/*pantalla jugable*/
const pantalla_jugable = document.querySelector('.pantalla_jugable');
const btn_ayudita = document.getElementById('btn_ayudita');
const btn_reset = document.getElementById('btn_reset');
const btn_volver_menu_jugable = document.querySelectorAll('.pantalla_jugable .btn')[2];
/*pantalla de victoria*/
const pantalla_victoria = document.querySelector('.pantalla_victoria');
const btn_siguiente = document.querySelector('.pantalla_victoria #btn_siguiente');
const btn_menu_victoria = document.querySelectorAll('.pantalla_victoria .btn')[1];
/*pantalla final */
const pantalla_final=document.querySelector('.pantalla_final');
const btn_volver_menu_pantalla_final =document.querySelector('.pantalla_final .btn');
/*pantalla derrota*/
const pantalla_derrota = document.querySelector('.pantalla_derrota');
const btn_reintentar = document.querySelector('.pantalla_derrota #btn_reintentar');
const btn_menu_derrota = document.querySelectorAll('.pantalla_derrota .btn')[1];


/*variables para el funcionamiento del juego, tiempo, etc...*/
let juego_activo = false;
let juego_timer = null;
let tiempo_transcurrido = 0;
const timer_display = document.getElementById('tiempo');
let tiempo_limite = 0;
let tiene_limite = false;
/*//////////////////////////////////////*/ 


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d"); 
/* const btn_reset = document.getElementById('btn_reset'); */


const width = canvas.width;
const height = canvas.height;
const pieceWidth = width / 2;
const pieceHeight = height / 2;

const imageArray = [
    "./img/frogames/sapo 1.png",
    "./img/frogames/sapo 2.png",
    "./img/frogames/sapo 3.png",
    "./img/frogames/sapo 4.png",
    "./img/frogames/sapo 5.png",
    "./img/frogames/sapo 6.png",
    "./img/frogames/sapo 7.png",
    "./img/frogames/sapo 8.png"
];

// Rotaciones actuales (representadas en grados) y animaciones
let rotations = [0, 0, 0, 0];
const correctRotations = [0, 0, 0, 0];
let piezas_bloqueadas = [false, false, false, false];



let imageLoaded = false;
let originalImage = new Image();

/*/////////////////////////////////////////////////////////////////*/


/* sistema de niveles*/ 
let nivel_actual = 1;
const TOTAL_NIVELES = imageArray.length;
let filtro_actual = 'none';
    
let filtros_por_pieza = []; // Array para filtros individuales por pieza
let usar_filtros_mixtos = false; // para saber si usar filtros diferentes por pieza

function setDificultad(){
    switch(nivel_actual) {
        case 1:
            filtro_actual = 'none';
            usar_filtros_mixtos = false;
            tiene_limite = false;
            break;
        case 2:
            filtro_actual = 'grayscale(100%)';//escala de grises
            usar_filtros_mixtos = false;
            tiene_limite = false;
            break;
        case 3:
            filtro_actual = 'brightness(30%)';//brillo 30%
            usar_filtros_mixtos = false;
            tiene_limite = false;
            break;
        case 4:
            filtro_actual = 'invert(100%)';//negativo
            usar_filtros_mixtos = false;
            tiene_limite = false;
            break;
        case 5:// A partir del nivel 5, cada pieza tiene un filtro diferente   
            usar_filtros_mixtos = true;
            filtros_por_pieza = [
                'grayscale(100%)',
                'brightness(30%)',
                'invert(100%)',
                'sepia(100%)'
            ];
            tiene_limite = true;
            tiempo_limite = 30;
            break;
        case 6:
            usar_filtros_mixtos = true;
            filtros_por_pieza = [
                'contrast(200%)',
                'saturate(300%)',
                'grayscale(100%)',
                'brightness(30%)'
            ];
            tiene_limite = true;
            tiempo_limite = 20;
            break;
        case 7:
            usar_filtros_mixtos = true;
            filtros_por_pieza = [
                'hue-rotate(90deg)',
                'invert(100%)',
                'sepia(100%)',
                'invert(150%)'
            ];
            tiene_limite = true;
            tiempo_limite = 10;
            break;
        case 8:
            usar_filtros_mixtos = true;
            filtros_por_pieza = [
                'saturate(400%)',
                'none',
                'brightness(40%)',
                'invert(100%)'
            ];
            tiene_limite = true;
            tiempo_limite = 5;
            break;
        case 9:
            irAPantallaFinal();
            break;
        default:
            console.log("error nivel invalido");
            filtro_actual = 'none';
            usar_filtros_mixtos = false;
            tiene_limite = false;
    }
}

function pantallaVictoriaFinal(){
console.log("terminaste");
}

function iniciarTiempo() {
    if (juego_timer) return; 
    
    tiempo_transcurrido = 0;
    actualizarDisplayTiempo();
    
    juego_timer = setInterval(() => {
        tiempo_transcurrido++;
        actualizarDisplayTiempo();

        if (tiene_limite && tiempo_transcurrido >= tiempo_limite) {
            perderPorTiempo();
        }
    }, 1000); 
}

function detenerTiempo() {
    if (juego_timer) {
        clearInterval(juego_timer);
        juego_timer = null;
    }
}

function actualizarDisplayTiempo() {
    if (tiene_limite) {
        // Con límite: mostrar "restante / límite"
        const tiempo_restante = tiempo_limite - tiempo_transcurrido;
        
        const min_restante = Math.floor(Math.abs(tiempo_restante) / 60);
        const seg_restante = Math.abs(tiempo_restante) % 60;
        
        const min_limite = Math.floor(tiempo_limite / 60);
        const seg_limite = tiempo_limite % 60;
        
        const restante = `${String(min_restante).padStart(2, '0')}:${String(seg_restante).padStart(2, '0')}`;
        const limite = `${String(min_limite).padStart(2, '0')}:${String(seg_limite).padStart(2, '0')}`;
        
        if (timer_display) {
            timer_display.textContent = `${restante}`;
            
            if (tiempo_restante <= 10) {
                timer_display.style.color = 'red';
                timer_display.style.fontWeight = 'bold';
            } else if (tiempo_restante <= 30) {
                timer_display.style.color = 'orange';
                timer_display.style.fontWeight = 'bold';
            } else {
                timer_display.style.color = '#333';
                timer_display.style.fontWeight = 'normal';
            }
        }
    } else {
        // Sin límite: mostrar tiempo normal
        const minutos = Math.floor(tiempo_transcurrido / 60);
        const segundos = tiempo_transcurrido % 60;
        
        const formato = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        
        if (timer_display) {
            timer_display.textContent = formato;
            timer_display.style.color = '#333';
            timer_display.style.fontWeight = 'normal';
        }
    }
}

function mostrarTiempoVictoria() {
    const minutos = Math.floor(tiempo_transcurrido / 60);
    const segundos = tiempo_transcurrido % 60;
    const formato = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
    
    const tiempo_victoria = document.getElementById('tiempo_final');
    if (tiempo_victoria) {
        tiempo_victoria.textContent = formato;
    }
}

function perderPorTiempo() {
    juego_activo = false;
    detenerTiempo();
    setTimeout(irADerrota, 500);
}

function mostrarPantalla(pantalla) {
    blur_screen.classList.add('hidden');
    pantalla_comienzo.classList.add('hidden');
    pantalla_instrucciones.classList.add('hidden');
    pantalla_jugable.classList.add('hidden');
    pantalla_victoria.classList.add('hidden');
    pantalla_final.classList.add('hidden');//nuevo
    pantalla_derrota.classList.add('hidden');//nuevo

    pantalla.classList.remove('hidden');
}

// Ir a menú comienzo
function irAlMenu() {
    mostrarPantalla(pantalla_comienzo);
    detenerTiempo()
    nivel_actual = 1
}

// Ir a instrucciones
function irAInstrucciones() {
    mostrarPantalla(pantalla_instrucciones);
}

// Ir a jugar
function irAJugar() {
    mostrarPantalla(pantalla_jugable);
    resetGame();
}

// Ir a victoria
function irAVictoria() {
    mostrarPantalla(pantalla_victoria);
    juego_activo = false; 
}

function irADerrota() {
    mostrarPantalla(pantalla_derrota);
    juego_activo = false;
}

function reintentarNivel() {
    mostrarPantalla(pantalla_jugable);
    resetGame();
}

function irAPantallaFinal(){
    mostrarPantalla(pantalla_final);
}

// Siguiente nivel
function siguientNivel() {
    mostrarPantalla(pantalla_jugable);
    nivel_actual++;
    resetGame();

    
}

btn_start.addEventListener('click', irAlMenu);
btn_instrucciones.addEventListener('click', irAInstrucciones);
btn_comenzar_jugar.addEventListener('click', irAJugar);
btn_volver_menu.addEventListener('click', irAlMenu);
btn_volver_menu_jugable.addEventListener('click', irAlMenu);
btn_siguiente.addEventListener('click', siguientNivel);
btn_menu_victoria.addEventListener('click', irAlMenu);
btn_volver_menu_pantalla_final.addEventListener('click', irAlMenu);

if (btn_reintentar) {
    btn_reintentar.addEventListener('click', reintentarNivel);
}
if (btn_menu_derrota) {
    btn_menu_derrota.addEventListener('click', irAlMenu);
}
















function loadRandomImage() {
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    const selectedImage = imageArray[randomIndex];
    
    console.log("Cargando imagen:", selectedImage); //Se puede borrar despues
    
    originalImage.onload = () => {
        imageLoaded = true;
        randomizeRotations();
        setDificultad(); //setea la dificultad(filtros)
        drawPuzzle();
    }
    
    originalImage.onerror = () => {
        console.error("No se pudo cargar la imagen:", selectedImage); //Se puede borrar despues
    }
    
    originalImage.src = selectedImage;
}

function randomizeRotations() {
    for (let i = 0; i < 4; i++) {
        rotations[i] = [90, 180, 270][Math.floor(Math.random() * 3)];
    }
}

function drawPuzzle() {
    if (!imageLoaded) return;
    
    ctx.clearRect(0, 0, width, height);
    
    // Pieza superior izquierda
    drawPiece(0, 0, 0, 0, 0);
    
    // Pieza superior derecha
    drawPiece(1, pieceWidth, 0, pieceWidth, 0);
    
    // Pieza inferior izquierda
    drawPiece(2, 0, pieceHeight, 0, pieceHeight);
    
    // Pieza inferior derecha
    drawPiece(3, pieceWidth, pieceHeight, pieceWidth, pieceHeight);
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pieceWidth, 0);
    ctx.lineTo(pieceWidth, height);
    ctx.moveTo(0, pieceHeight);
    ctx.lineTo(width, pieceHeight);
    ctx.stroke();
    
    piezas_bloqueadas.forEach((bloqueada, index) => {
        if (bloqueada) {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = col * pieceWidth;
            const y = row * pieceHeight;
            
            ctx.strokeStyle = '#4caf50';
            ctx.lineWidth = 3;
            ctx.strokeRect(x + 2, y + 2, pieceWidth - 4, pieceHeight - 4);
        }   
    });

    checkResult();
}

function drawPiece(index, canvasX, canvasY, imgX, imgY, sin_filtros = false) {
    ctx.save();
    
    if (sin_filtros) {    
        ctx.filter = 'none';// Sin filtro (imagen original RGB)
    } else {// Aplica filtro según configuración del nivel     
        if (usar_filtros_mixtos) {          
            ctx.filter = filtros_por_pieza[index];// Cada pieza tiene su propio filtro
        } else {        
            ctx.filter = filtro_actual;// Todas las piezas con el mismo filtro
        }
    }
    ctx.translate(canvasX + pieceWidth / 2, canvasY + pieceHeight / 2);
    
    ctx.rotate((rotations[index] * Math.PI) / 180);
    
    ctx.drawImage(
        originalImage,
        imgX, imgY, pieceWidth, pieceHeight,  // Corte de la imagen original
        -pieceWidth / 2, -pieceHeight / 2, pieceWidth, pieceHeight  // Posición en el canvas
    );
    
    ctx.restore();
}

function drawOriginal(){
    if (!imageLoaded) return;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    
    ctx.translate(0, 0);
    
    ctx.drawImage(originalImage, 0, 0);
    
    ctx.restore();
}

// col y row siempre devuelven 0 y 1 dentro del rango valido, 0 es columna izquierda en col y fila superior en row, 1 es columna derecha en col y fila inferior en row
function getPieceIndex(x, y) { 
    const col = Math.floor(x / pieceWidth); 
    const row = Math.floor(y / pieceHeight); 
    
    if (col < 0 || col > 1 || row < 0 || row > 1) return -1;
    
    return row * 2 + col;
}

function rotatePiece(pieceIndex, direction) {
    if (pieceIndex < 0 || pieceIndex > 3) return;

    if (piezas_bloqueadas[pieceIndex]) return; 

    if (direction === 'left') {
        rotations[pieceIndex] = (rotations[pieceIndex] - 90 + 360) % 360;
    } else {
        rotations[pieceIndex] = (rotations[pieceIndex] + 90) % 360;
    }
    
    drawPuzzle();
}

function checkResult() {
    const solved = rotations.every((r, i) => r === correctRotations[i]);
    
    if (solved && juego_activo) {
        console.log("nivel superado");
        detenerTiempo();    
        mostrarTiempoVictoria();
        blockPieces();
        drawOriginal();
        setTimeout(irAVictoria, 2000); //2 segundos
    }

    return solved;
}

function resetGame() {
    imageLoaded = false;
    juego_activo = true;
    piezas_bloqueadas = [false, false, false, false];
    detenerTiempo();      
    iniciarTiempo();
    loadRandomImage();
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const pieceIndex = getPieceIndex(x, y);
    rotatePiece(pieceIndex, 'left');
});

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const pieceIndex = getPieceIndex(x, y);
    rotatePiece(pieceIndex, 'right');
});

btn_ayudita.addEventListener('click', () => {
    if (!juego_activo) return;

    let pieceIndex = rotations.findIndex((r, i) => r !== correctRotations[i]);

    if (pieceIndex !== -1) {
        rotations[pieceIndex] = correctRotations[pieceIndex];
        piezas_bloqueadas[pieceIndex] = true;
        tiempo_transcurrido += 5;
        actualizarDisplayTiempo();
        drawPuzzle();

        
    }
});

function blockPieces(){
    for (let i = 0; i < piezas_bloqueadas.length; i++) {
        piezas_bloqueadas[i] = true;
    }
}


btn_reset.addEventListener('click', resetGame);

// Para que cargue la primer imagen
loadRandomImage();



/*
                             .-----.
                            /7  .  (
                           /   .-.  \
                          /   /   \  \
                         / `  )   (   )
                        / `   )   ).  \
                      .'  _.   \_/  . |
     .--.           .' _.' )`.        |
    (    `---...._.'   `---.'_)    ..  \
     \            `----....___    `. \  |
      `.           _ ----- _   `._  )/  |
        `.       /"  \   /"  \`.  `._   |
          `.    ((O)` ) ((O)` ) `.   `._\
            `-- '`---'   `---' )  `.    `-.
               /                  ` \      `-.
             .'                      `.       `.
            /                     `  ` `.       `-.
     .--.   \ ===._____.======. `    `   `. .___.--`     .''''.
    ' .` `-. `.                )`. `   ` ` \          .' . '  8)
   (8  .  ` `-.`.               ( .  ` `  .`\      .'  '    ' /
    \  `. `    `-.               ) ` .   ` ` \  .'   ' .  '  /
     \ ` `.  ` . \`.    .--.     |  ` ) `   .``/   '  // .  /
      `.  ``. .   \ \   .-- `.  (  ` /_   ` . / ' .  '/   .'
        `. ` \  `  \ \  '-.   `-'  .'  `-.  `   .  .'/  .'
          \ `.`.  ` \ \    ) /`._.`       `.  ` .  .'  /
           |  `.`. . \ \  (.'               `.   .'  .'
        __/  .. \ \ ` ) \                     \.' .. \__
 .-._.-'     '"  ) .-'   `.                   (  '"     `-._.--.
(_________.-====' / .' /\_)`--..__________..-- `====-. _________)
                 (.'(.'
*/
