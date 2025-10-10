const btn_comienzo = document.querySelector('#btn_comienzo');
const pantalla_difu = document.querySelector('#pantalla_difuminada');
const canvas = document.getElementById('canvas');

var ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;






btn_comienzo.addEventListener('click', function(){
    pantalla_difu.classList.toggle('hidden');
});