const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
// Pre-dibujar las plataformas en un canvas de buffer
const canvasAux = document.createElement('canvas');
const ctxAux = canvasAux.getContext('2d');

const canvass = document.getElementById("canvass");
let ctxs = canvas.getContext("2d");

// Obtiene las dimensiones actuales de la ventana del navegador.
const window_height = window.innerHeight * 0.7;
const window_width = window.innerWidth <= 500 ? window.innerWidth * 0.9 : window.innerWidth * 0.60;

// Ajusta el tamaño del canvas para que coincida con la pantalla
canvas.height = window_height;
canvas.width = window_width;

// Actualizar el tamaño del buffer canvas a lo necesario
canvasAux.width = window_width
canvasAux.height = window_height

canvas.style.background = "rgb(224, 224, 224)";
canvasAux.style.background = "rgb(224, 224, 224)";

const lado = 30; // Tamaño del cuadrado
let x = (canvas.width - lado) / 2; // Centrado en X
let y = canvas.height - lado; // Pegado abajo en Y
const velocidad = 10; // Cantidad de píxeles que se moverá en cada pulsación

let enSalto = false; // Variable para evitar múltiples saltos
let enSuelo = false; // Variable para verificar si el cuadrado está en el suelo
const alturaSalto = 50; // Altura del salto en píxeles
const tiempoSalto = 1000; // Duración del salto en milisegundos
let velocidadY = 0; // Velocidad vertical del cuadrado
const gravedad = 0.8; // Gravedad que afecta el salto
const salto = -15; // Fuerza del salto
let volando = false;  // Variable para rastrear si el cuadrado está volando

let balas = []; // Array para almacenar las balas
const velocidadBala = 3; // Velocidad de la bala
const radioBala = 10; // Tamaño de la bala

// Generación de valores aleatorios para el círculo en canvasRandom
let radius = 20;
let circulos = [];
let noEnemigos = 1;

let plataformas = []; // Array para almacenar plataformas

let vidas = 2;
let puntaje = 0;

let intervalID;

// Cargar imágenes
let game_over = new Image();
game_over.src = './assets/img/game_over.png';

let background = new Image();
background.src = './assets/img/background.jpg';

let plataform = new Image();
plataform.src = './assets/img/plataform.png';

let enemi = new Image();
enemi.src = './assets/img/enemi.png';

let balaImg = new Image();
balaImg.src = './assets/img/bala.jpg';

const p1 = new Image();
const p2 = new Image();
const p3 = new Image();
p1.src = './assets/img/p1.png';
p2.src = './assets/img/p2.png';
p3.src = './assets/img/p3.png';

// Crear plataformas
function crearPlataformas() {
  plataformas.push({ x: 60, y: canvas.height - 100, ancho: 252, alto: 18 });
  plataformas.push({ x: 350, y: canvas.height - 150, ancho: 126, alto: 18 });
  plataformas.push({ x: 500, y: canvas.height - 250, ancho: 198, alto: 18 });
  plataformas.push({ x: 750, y: canvas.height - 300, ancho: 144, alto: 18 });
  plataformas.push({ x: -5, y: canvas.height - 10, ancho: canvas.width + 10, alto: 10 });
}

function dibujarPlataformas() {
  for (let i = 0; i < plataformas.length; i++) {
    const plataforma = plataformas[i];
    let anchoTotal = 0; // Reiniciar el anchoTotal para cada plataforma

    console.log("Entro")

    // Dibuja la imagen de la orilla izquierda (p1)
    ctxAux.drawImage(p1, plataforma.x + anchoTotal, plataforma.y, p1.width, p1.height);
    anchoTotal += p1.width;

    // Dibuja las imágenes del centro (p2) hasta completar el ancho de la plataforma
    while (anchoTotal + p3.width < plataforma.ancho) {
      ctxAux.drawImage(p2, plataforma.x + anchoTotal, plataforma.y, p2.width, p2.height);
      anchoTotal += p2.width;
    }

    // Dibuja la imagen de la orilla derecha (p3)
    ctxAux.drawImage(p3, plataforma.x + anchoTotal, plataforma.y, p3.width, p3.height);
  }
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



// Dibujar balas en el canvas
function dibujarBalas() {
  for (let i = 0; i < balas.length; i++) {
    let bala = balas[i];

    // Mover la bala en la dirección del disparo
    bala.x += Math.cos(bala.angulo) * velocidadBala;
    bala.y += Math.sin(bala.angulo) * velocidadBala;

    // Dibujar la bala
    ctx.beginPath();
    ctx.drawImage(balaImg, bala.x - radioBala, bala.y - radioBala, radioBala * 2, radioBala * 2);
    ctx.fill();
  }

  // Eliminar balas que salen del canvas
  balas = balas.filter(bala => bala.x > 0 && bala.x < canvas.width && bala.y > 0 && bala.y < canvas.height);
}

// Comprobar si una bala toca un círculo
function comprobarColisiones() {
  for (let i = 0; i < balas.length; i++) {
    let bala = balas[i];

    // Iterar sobre todos los círculos
    for (let j = 0; j < circulos.length; j++) {
      let circle = circulos[j];
      let dx = bala.x - circle.posX;
      let dy = bala.y - circle.posY;
      let distancia = Math.sqrt(dx * dx + dy * dy);

      // Si la bala toca el círculo
      if (distancia <= radioBala + circle.radius) {
        // Eliminar el círculo
        circulos.splice(j, 1);
        // Eliminar la bala que tocó el círculo
        balas.splice(i, 1);

        puntaje++;
        break;  // Salir del ciclo para evitar errores al modificar el array mientras se itera
      }
    }
  }
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

class cuadrado {
  constructor(color) {
    this.color = color;
  }

  // Ajuste en la función de dibujar y actualizar
  drawSquare() {
    ctx.fillStyle = this.color;

    // Detectar colisiones con plataformas
    if (!colisionConPlataformas()) {
      // Si no está tocando ninguna plataforma, aplicar gravedad
      if (y + lado < canvas.height) {  // Evitar que se siga cayendo si ya está en el suelo
        velocidadY += gravedad;  // Aplicar gravedad
      }
    }

    // Actualiza la posición Y y asegura que no se mueva más allá del borde superior
    y += velocidadY;
    if (y < 40) { // Limita el salto para que no sobrepase el borde superior
      y = 40;
      velocidadY = 0; // Detener el salto al llegar al límite superior
    }

    ctx.fillRect(x, y, lado, lado);  // Dibujar el cuadrado
    comprobarColisiones();  // Verificar si las balas tocan los círculos
  }

}

let player = new cuadrado("purple");



document.addEventListener("keydown", function (event) {
  const tecla = event.key.toLowerCase();

  // Movimiento a la izquierda (a)
  if (tecla === "a") {
    x -= velocidad;  // Mueve el cuadrado a la izquierda
    if (x + lado <= 0) x = canvas.width;  // Si pasa el borde izquierdo, aparece en el derecho
  }
  // Movimiento a la derecha (d)
  else if (tecla === "d") {
    x += velocidad;  // Mueve el cuadrado a la derecha
    if (x >= canvas.width) x = -lado;  // Si pasa el borde derecho, aparece en el izquierdo
  }
  // Salto (w)
  if (event.key === "w" && enSuelo) {  // Solo salta si está en el suelo o sobre una plataforma
    velocidadY = salto;  // Aplica la velocidad del salto
  }

  // Vuelo (s) - Mientras se mantenga presionada la tecla 's', el cuadrado sube
  if (event.key === "s") {
    volando = true;  // El cuadrado empieza a volar
  }

  if (vidas > 0) {
    player.drawSquare();
  }
});

document.addEventListener("keyup", function (event) {
  if (event.key === "s") {
    volando = false;  // El cuadrado deja de volar cuando se suelta la tecla
  }
});


class Circle {
  constructor(x, y) {
    this.cont = 0;
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = "black";
    this.speed = .7;
    this.dx = 0.1 * this.speed;
    this.dy = 0.1 * this.speed;
  }

  draw(context) {
    context.drawImage(enemi, this.posX - this.radius, this.posY - this.radius, this.radius*2, this.radius*2);
  }

  update(context, squareX, squareY, squareSize, index) {

    // Calcular las coordenadas del centro del cuadrado
    let squareCenterX = squareX + squareSize / 2;
    let squareCenterY = squareY + squareSize / 2;

    // Calcular la dirección hacia el centro del cuadrado
    let dxToSquare = squareCenterX - this.posX;
    let dyToSquare = squareCenterY - this.posY;

    // Normalizar el vector de dirección
    let distance = Math.sqrt(dxToSquare * dxToSquare + dyToSquare * dyToSquare);
    if (distance > 0) {
      // Movimiento hacia el centro del cuadrado, ajustando la velocidad
      this.dx = (dxToSquare / distance) * this.speed;
      this.dy = (dyToSquare / distance) * this.speed;
    }

    // Actualizar posición
    this.posX += this.dx;
    this.posY += this.dy;

    // Comprobar si el círculo ha llegado al cuadrado (colisión)
    if (
      this.posX + this.radius > squareX &&
      this.posX - this.radius < squareX + squareSize &&
      this.posY + this.radius > squareY &&
      this.posY - this.radius < squareY + squareSize
    ) {
      // El círculo ha alcanzado el cuadrado, puedes agregar acciones aquí
      console.log(vidas)
      vidas--;
      circulos.splice(index, 1);
    }

    // Comprobar colisión con los bordes
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
      this.cont++;
    }
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
      this.cont++;
    }

    // Si el círculo se mueve hacia la izquierda, invertir la imagen
    context.save(); 
    if (this.dx > 0) {
      context.scale(-1, 1);
      context.translate(-this.posX * 2, 0); // Ajustar la posición al invertir
    }

    // Dibujar el círculo o imagen aquí (por ejemplo, this.draw)
    this.draw(context);
    context.restore(); // Restaurar el contexto original

  }
}


function drawCircles() {
  drawCircle();
  intervalID = setInterval(function () {
    for (i = 0; i < noEnemigos; i++) {
      drawCircle();
    }
  }, 2000);
}

function drawCircle() {
  // Elegir si el círculo aparecerá arriba o abajo
  let randomEdge = Math.random() < 0.5 ? 'top' : 'bottom';

  let randomX = Math.random() * (canvas.width - 2 * radius) + radius;
  let randomY;

  if (randomEdge === 'top') {
    randomY = radius + 10;  // Aparece en la parte superior
  } else {
    randomY = canvas.height - radius * 3;  // Aparece en la parte inferior
  }

  circulos.push(new Circle(randomX, randomY));
}

// Función de actualización
function actualizar() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpia el canvas antes de redibujar
  ctx.drawImage(background, 0, 0, window_width, window_height);
  //ctx.drawImage(canvasAux, 0, 0); 

  // Si está volando, se mueve hacia arriba
  if (volando) {
    velocidadY = -5;  // Mantiene al cuadrado subiendo (simula vuelo)
  }

  // Actualizar los círculos
  for (i = 0; i < circulos.length; i++) {
    circulos[i].update(ctx, x, y, lado, i);
  }

  if (vidas > 0) {
    player.drawSquare();  // Dibujar el cuadrado y aplicar la gravedad y saltos
    ctx.drawImage(canvasAux, 0, 0);
    dibujarBalas();  // Dibujar las balas
    requestAnimationFrame(actualizar);  // Continuar actualizando
  } else {
    ctx.clearRect(0, 0, window_width, window_height); // Limpia el canvas antes de redibujar
    ctx.drawImage(background, 0, 0, window_width, window_height);
    clearInterval(intervalID);
    ctx.drawImage(game_over,
      (window_width / 2) - (window_width / 4) + 10, // Coordenada X centrada
      (window_height / 2) - (window_height / 4) - 50, // Coordenada Y centrada
      window_width / 2 - 20,
      window_height / 2 + 100
    );
  }
}

crearPlataformas();
// Cuando todas las imágenes carguen, dibuja las plataformas
p1.onload = p2.onload = p3.onload = dibujarPlataformas;


drawCircles();
actualizar();  // Iniciar el ciclo de actualización