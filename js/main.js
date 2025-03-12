const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones actuales de la ventana del navegador.
const window_height = window.innerHeight * 0.65;
const window_width = window.innerWidth <= 500 ? window.innerWidth * 0.9 : window.innerWidth * 0.65;

// Ajusta el tamaño del canvas para que coincida con la pantalla
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "rgb(224, 224, 224)";

const lado = 30; // Tamaño del cuadrado
let x = (canvas.width - lado) / 2; // Centrado en X
let y = canvas.height - lado; // Pegado abajo en Y
const velocidad = 10; // Cantidad de píxeles que se moverá en cada pulsación

let enSuelo = false; // Variable para verificar si el cuadrado está en el suelo
const alturaSalto = 50; // Altura del salto en píxeles
const tiempoSalto = 1000; // Duración del salto en milisegundos
let velocidadY = 0; // Velocidad vertical del cuadrado
const gravedad = 0.8; // Gravedad que afecta el salto
const salto = -15; // Fuerza del salto

let balas = []; // Array para almacenar las balas
const velocidadBala = 3; // Velocidad de la bala
const radioBala = 4; // Tamaño de la bala

let plataformas = []; // Array para almacenar plataformas

// Crear plataformas
function crearPlataformas() {
  plataformas.push({ x: 100, y: canvas.height - 50, ancho: 100, alto: 10 });
  plataformas.push({ x: 250, y: canvas.height - 100, ancho: 100, alto: 10 });
  plataformas.push({ x: 400, y: canvas.height - 150, ancho: 100, alto: 10 });
  plataformas.push({ x: 600, y: canvas.height - 200, ancho: 100, alto: 10 });
}

// Crear una nueva bala desde la posición del cuadrado
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const bala = {
    x: x + lado / 2, // Centro del cuadrado
    y: y,
    destinoX: mouseX,
    destinoY: mouseY,
    angulo: Math.atan2(mouseY - y, mouseX - (x + lado / 2)), // Dirección del disparo
  };

  balas.push(bala);
});

// Dibujar plataformas en el canvas
function dibujarPlataformas() {
  ctx.fillStyle = "green";
  for (let i = 0; i < plataformas.length; i++) {
    const plataforma = plataformas[i];
    ctx.fillRect(plataforma.x, plataforma.y, plataforma.ancho, plataforma.alto);
  }
}

// Dibujar balas en el canvas
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

// Función para detectar si el cuadrado toca una plataforma
function colisionConPlataformas() {
  enSuelo = false; // Resetear si está tocando el suelo en cada frame

  for (let i = 0; i < plataformas.length; i++) {
    const plataforma = plataformas[i];

    // Verifica si el cuadrado está tocando una plataforma
    if (
      x + lado > plataforma.x &&
      x < plataforma.x + plataforma.ancho &&
      y + lado + velocidadY >= plataforma.y &&
      y + lado <= plataforma.y + plataforma.alto
    ) {
      // Ajusta la posición del cuadrado sobre la plataforma
      y = plataforma.y - lado;  // Coloca el cuadrado sobre la plataforma
      velocidadY = 0;  // Detener el movimiento vertical
      enSuelo = true;  // El cuadrado está en el suelo o sobre una plataforma
      return true; // Se ha tocado una plataforma
    }
  }
  return false; // No tocó ninguna plataforma
}

// Ajuste en la función de dibujar y actualizar
function dibujarCuadrado() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpiar el canvas
  ctx.fillStyle = "blue";

  // Detectar colisiones con plataformas
  if (!colisionConPlataformas()) {
    // Si no está tocando ninguna plataforma, aplicar gravedad
    if (y + lado < canvas.height) {  // Evitar que se siga cayendo si ya está en el suelo
      velocidadY += gravedad;  // Aplicar gravedad
    }
  }
  
  y += velocidadY;

  ctx.fillRect(x, y, lado, lado);  // Dibujar el cuadrado

  // Console logs for debugging
  console.log("En Suelo:", enSuelo);
  console.log("Velocidad Y:", velocidadY);
  console.log("Posición Y:", y);

  dibujarPlataformas();  // Dibujar las plataformas
  plataformas.push({ x: 0, y: canvas.height - 10, ancho: canvas.width, alto: 10 });
  dibujarBalas();  // Dibujar las balas
}

// Mover el cuadrado con las teclas
document.addEventListener("keydown", function (event) {
  if (event.key === "a") {
    x -= 10;  // Mover a la izquierda
  }
  if (event.key === "d") {
    x += 10;  // Mover a la derecha
  }
  if (event.key === "w") {
    velocidadY = salto;  // Saltar si está en el suelo o sobre una plataforma
  }
});

// Actualizar la animación
function actualizar() {
  dibujarCuadrado();  // Dibujar el cuadrado y aplicar la gravedad y saltos
  requestAnimationFrame(actualizar);  // Continuar actualizando
}

// Crear plataformas al inicio
crearPlataformas();
actualizar();  // Iniciar el ciclo de actualización
