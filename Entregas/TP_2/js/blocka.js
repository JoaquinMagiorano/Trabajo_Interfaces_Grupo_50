const btn_start = document.querySelector('#btn_start');
const blur_screen = document.querySelector('#blur_screen');
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas')); //El casting es para el intellisense, BORRAR DESPUES
const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d")); //El casting es para el intellisense, BORRAR DESPUES
const btn_reset = document.getElementById('btn_reset');

const width = canvas.width;
const height = canvas.height;
const pieceWidth = width / 2;
const pieceHeight = height / 2;

// Arreglo con las images disponibles - CAMBIARLAS  
const imageArray = [
    "./img/random/cr7.jpg",
    "./img/random/te_garcho.jpeg",
    "./img/random/scorpio.jpeg",
    "./img/random/ms.jpg",
    "./img/random/mcbici.webp"
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

btn_start.addEventListener('click', function(){
    blur_screen.classList.toggle('hidden');
});

// Para que cargue la primer imagen
loadRandomImage();