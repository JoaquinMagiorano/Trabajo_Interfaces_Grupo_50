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


function mostrarPantalla(pantalla) {
    blur_screen.classList.add('hidden');
    pantalla_comienzo.classList.add('hidden');
    pantalla_instrucciones.classList.add('hidden');
    pantalla_jugable.classList.add('hidden');
    pantalla_victoria.classList.add('hidden');
    
    pantalla.classList.remove('hidden');
}

// Ir a menú comienzo
function irAlMenu() {
    mostrarPantalla(pantalla_comienzo);
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
}

// Siguiente nivel
function siguientNivel() {
    mostrarPantalla(pantalla_jugable);
    resetGame();
}

btn_start.addEventListener('click', irAlMenu);
btn_instrucciones.addEventListener('click', irAInstrucciones);
btn_comenzar_jugar.addEventListener('click', irAJugar);
btn_volver_menu.addEventListener('click', irAlMenu);
btn_volver_menu_jugable.addEventListener('click', irAlMenu);
btn_siguiente.addEventListener('click', siguientNivel);
btn_menu_victoria.addEventListener('click', irAlMenu);


















const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas')); //El casting es para el intellisense, BORRAR DESPUES
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d")); //El casting es para el intellisense, BORRAR DESPUES
/* const btn_reset = document.getElementById('btn_reset'); */





const width = canvas.width;
const height = canvas.height;
const pieceWidth = width / 2;
const pieceHeight = height / 2;

// Arreglo con las images disponibles - CAMBIARLAS  
const imageArray = [
    "./img/frogames/sapo 1.png",
    "./img/frogames/sapo 2.png",
    "./img/frogames/sapo 3.png",
    "./img/frogames/sapo 4.png",
    "./img/frogames/sapo 5.png"
];

// Rotaciones actuales (representadas en grados)
let rotations = [0, 0, 0, 0];

const correctRotations = [0, 0, 0, 0];

let imageLoaded = false;
let originalImage = new Image();

function loadRandomImage() {
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    const selectedImage = imageArray[randomIndex];
    
    console.log("Cargando imagen:", selectedImage); //Se puede borrar despues
    
    originalImage.onload = () => {
        imageLoaded = true;
        randomizeRotations();
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
    
    checkResult();
}

function drawPiece(index, canvasX, canvasY, imgX, imgY) {
    ctx.save();
    
    ctx.translate(canvasX + pieceWidth / 2, canvasY + pieceHeight / 2);
    
    ctx.rotate((rotations[index] * Math.PI) / 180);
    
    ctx.drawImage(
        originalImage,
        imgX, imgY, pieceWidth, pieceHeight,  // Corte de la imagen original
        -pieceWidth / 2, -pieceHeight / 2, pieceWidth, pieceHeight  // Posición en el canvas
    );
    
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
    
    if (direction === 'left') {
        rotations[pieceIndex] = (rotations[pieceIndex] - 90 + 360) % 360;
    } else {
        rotations[pieceIndex] = (rotations[pieceIndex] + 90) % 360;
    }
    
    drawPuzzle();
}

function checkResult() {
    const solved = rotations.every((r, i) => r === correctRotations[i]);
    
    // TO DO
    // que pare el temporizador
    // que muestre los botones para pasar al siguiente nivel y eso
    // muestre un mensaje de completado?

    return solved;
}

function resetGame() {
    imageLoaded = false;
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

btn_reset.addEventListener('click', resetGame());

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
