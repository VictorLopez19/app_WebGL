
// Selecciona el elemento canvas del DOM y obtiene su contexto 2D para dibujar.
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones actuales de la ventana del navegador.
const window_height = /* 300; */window.innerHeight * 0.65;
const window_width = /* 300; */window.innerWidth <= 500? window.innerWidth * .9 : window.innerWidth * 0.65;

// Ajusta el tamaño del canvas para que coincida con la pantalla
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "rgb(224, 224, 224)";

const lado = 30; // Tamaño del cuadrado
let x = (canvas.width - lado) / 2; // Centrado en X
let y = canvas.height - lado; // Pegado abajo en Y
const velocidad = 10; // Cantidad de píxeles que se moverá en cada pulsación

let enSalto = false; // Variable para evitar múltiples saltos
const alturaSalto = 50; // Altura del salto en píxeles
const tiempoSalto = 100; // Duración del salto en milisegundos

let balas = []; // Array para almacenar las balas
const velocidadBala = 3; // Velocidad de la bala
const radioBala = 4; // Tamaño de la bala

function dibujarCuadrado() {
  // Limpiar el canvas antes de redibujar
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar el cuadrado
  ctx.fillStyle = "blue";
  ctx.fillRect(x, y, lado, lado);
}

document.addEventListener("keydown", function (event) {
  const tecla = event.key.toLowerCase();

  if (tecla === "a") {
    x -= velocidad;
    if (x + lado <= 0) x = canvas.width;
  } else if (tecla === "d") {
    x += velocidad;
    if (x >= canvas.width) x = -lado;
  } else if (tecla === "w" && !enSalto) {
    enSalto = true;
    let yOriginal = y;
    y -= alturaSalto; // Subir
    dibujarCuadrado();

    setTimeout(() => {
      y = yOriginal; // Bajar
      dibujarCuadrado();
      enSalto = false;
    }, tiempoSalto);
  }

  dibujarCuadrado();
});

canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Crear una nueva bala desde la posición del cuadrado
  const bala = {
    x: x + lado / 2, // Centro del cuadrado
    y: y,
    destinoX: mouseX,
    destinoY: mouseY,
    angulo: Math.atan2(mouseY - y, mouseX - (x + lado / 2)), // Dirección del disparo
  };

  balas.push(bala);
});


function dibujarBalas() {
  for (let i = 0; i < balas.length; i++) {
    let bala = balas[i];

    // Mover la bala en la dirección del disparo
    bala.x += Math.cos(bala.angulo) * velocidadBala;
    bala.y += Math.sin(bala.angulo) * velocidadBala;

    // Dibujar la bala
    ctx.beginPath();
    ctx.arc(bala.x, bala.y, radioBala, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
  }

  // Eliminar balas que salen del canvas
  balas = balas.filter(bala => bala.x > 0 && bala.x < canvas.width && bala.y > 0 && bala.y < canvas.height);
}

// Modificar la función de dibujo para incluir las balas
function dibujarCuadrado() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(x, y, lado, lado);
  dibujarBalas();
}

// Actualizar el canvas constantemente
function actualizar() {
  dibujarCuadrado();
  requestAnimationFrame(actualizar);
}

actualizar();