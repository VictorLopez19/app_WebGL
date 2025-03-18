const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
// Pre-dibujar las plataformas en un canvas de buffer
const canvasAux = document.createElement('canvas');
const ctxAux = canvasAux.getContext('2d');

const encabezado = document.getElementById('encabezado');

const no_vidas = document.getElementById('no_vidas');
const total_puntaje = document.getElementById('total_puntaje');
const num_balas = document.getElementById('no_balas');
const text_nivel = document.getElementById('nivel');

const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");

const btnIzquierda = document.getElementById("btnIzquierda");
const btnDerecha = document.getElementById("btnDerecha");
const btnSaltar = document.getElementById("btnSaltar");

const botones = document.getElementById('controles');

// Obtiene las dimensiones actuales de la ventana del navegador.
const window_height = window.innerHeight * 0.7;
const window_width = window.innerWidth <= 500 ? window.innerWidth * 0.9 : window.innerWidth * 0.60;

// Ajusta el tamaño del canvas para que coincida con la pantalla
canvas.height = window_height;
canvas.width = window_width;

encabezado.style.width = window_width + 'px';
encabezado.style.height = '40px';

// Actualizar el tamaño del buffer canvas a lo necesario
canvasAux.width = window_width
canvasAux.height = window_height

canvas.style.background = "rgb(224, 224, 224)";
canvasAux.style.background = "rgb(224, 224, 224)";

const lado = 30; // Tamaño del cuadrado
let xPlayer = (canvas.width - lado) / 2; // Centrado en X
let yPlayer = canvas.height - lado; // Pegado abajo en Y
const velocidad = 10; // Cantidad de píxeles que se moverá en cada pulsación

let enSalto = false; // Variable para evitar múltiples saltos
let enSuelo = false; // Variable para verificar si el cuadrado está en el suelo
const alturaSalto = 50; // Altura del salto en píxeles
const tiempoSalto = 1000; // Duración del salto en milisegundos
let velocidadY = 0; // Velocidad vertical del cuadrado
const gravedad = 0.8; // Gravedad que afecta el salto
const salto = -15; // Fuerza del salto

let balas = []; // Array para almacenar las balas
const velocidadBala = 3; // Velocidad de la bala
const radioBala = 10; // Tamaño de la bala
let no_balas = 10;

// Generación de valores aleatorios para el círculo en canvasRandom
let radius = 20;
let circulos = [];
let noEnemigos = 1;

let plataformas = []; // Array para almacenar plataformas

let vidas = 3;
let puntaje = 0;
let nivel = 1;

let intervalID;
let intervalIDBalas;
let intervaloMovimiento;

let mario;
let frames = 0;
let liberada = true;

let isPlaying = false;
let isPaused = false;
let animationId;

let presionandoIzquierda = false;
let presionandoDerecha = false;
let presionandoSaltar = false;

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

let paused = new Image();
paused.src = './assets/img/paused.png';

const p1 = new Image();
const p2 = new Image();
const p3 = new Image();
p1.src = './assets/img/p1.png';
p2.src = './assets/img/p2.png';
p3.src = './assets/img/p3.png';

// Cargar puntajes desde localStorage
function cargarPuntajes() {
  const puntajes = JSON.parse(localStorage.getItem('highScores'));
  return puntajes || []; // Si no hay puntajes, devuelve un array vacío
}

// Guardar puntajes en localStorage
function guardarPuntajes(puntajes) {
  localStorage.setItem('highScores', JSON.stringify(puntajes));
}

// Agregar nuevo puntaje si es récord y evitar duplicados
function agregarPuntaje(nombre, puntaje) {
  let puntajes = cargarPuntajes(); // Cargar puntajes actuales desde localStorage

  // Verificar si el puntaje ya existe para el mismo nombre
  const existePuntaje = puntajes.find(p => p.nombre === nombre);

  if (existePuntaje) {
    // Si el puntaje existente es mayor que el nuevo, no hacemos nada
    if (existePuntaje.puntaje >= puntaje) {
      console.log(`${nombre} ya tiene un puntaje mayor o igual.`);
      return;
    }
    // Si el puntaje existente es menor, lo actualizamos
    existePuntaje.puntaje = puntaje;
  } else {
    // Si no existe, agregamos un nuevo puntaje
    puntajes.push({ nombre, puntaje });
  }

  // Ordenar los puntajes de mayor a menor
  puntajes.sort((a, b) => b.puntaje - a.puntaje);

  // Mantener solo los 5 más altos
  puntajes = puntajes.slice(0, 5);

  // Guardar en el localStorage
  guardarPuntajes(puntajes);

  console.log('Puntajes actualizados:', puntajes);
}

function esPuntajeAlto(puntaje) {
  const puntajes = cargarPuntajes(); // Cargar los puntajes actuales

  // Si hay menos de 5 puntajes, automáticamente entra
  if (puntajes.length < 5) {
    return true;
  }

  // Obtener el puntaje más bajo en la lista actual
  const puntajeMasBajo = puntajes[puntajes.length - 1].puntaje;

  // Si el nuevo puntaje es mayor que el más bajo, entra en el top 5
  return puntaje > puntajeMasBajo;
}

// Función para mostrar los puntajes en el modal
function mostrarPuntajes() {
  const puntajes = cargarPuntajes(); // Cargar puntajes actuales desde localStorage
  const modalBody = document.getElementById('modalPuntajesBody'); // Obtener el cuerpo del modal

  if (puntajes.length === 0) {
    modalBody.innerHTML = '<p class="text-center">No hay puntajes guardados.</p>'; // Mostrar mensaje si no hay puntajes
  } else {
    let html = '<div class="list-group">';
    puntajes.forEach(p => {
      html += `
        <div class="list-group-item d-flex justify-content-between align-items-center">
          <strong>${p.nombre}</strong>
          <span class="badge bg-primary rounded-pill">${p.puntaje}</span>
        </div>
      `; // Agregar cada puntaje a la lista con estilo
    });
    html += '</div>';
    modalBody.innerHTML = html; // Insertar los puntajes en el modal
  }
}

// Función para mostrar el modal cuando el puntaje entra en el Top 5
function mostrarModalRegistro() {
  const modal = document.getElementById('modalRegistroPuntaje');
  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();
}

// Función para guardar el puntaje ingresado
function guardarNuevoPuntaje() {
  const nombre = document.getElementById('nombreJugador').value.trim();

  if (nombre === '') {
    alert('Por favor, ingresa tu nombre.');
    return;
  }

  agregarPuntaje(nombre, puntaje); // Guardar el puntaje en localStorage

  // Cerrar el modal
  const modal = document.getElementById('modalRegistroPuntaje');
  const bootstrapModal = bootstrap.Modal.getInstance(modal);
  bootstrapModal.hide();
}

// Crear plataformas
function crearPlataformas() {
  plataformas.push({ x: canvas.width / 4, y: canvas.height - 120, ancho: multiplos(canvas.width / 4 * 2), alto: 18 });
  plataformas.push({ x: canvas.width / 12, y: canvas.height - 230, ancho: multiplos(canvas.width / 4), alto: 18 });
  plataformas.push({ x: canvas.width / 12 * 8, y: canvas.height - 230, ancho: multiplos(canvas.width / 4), alto: 18 });
  plataformas.push({ x: canvas.width / 4, y: canvas.height - 340, ancho: multiplos(canvas.width / 4 * 2), alto: 18 });
  plataformas.push({ x: -5, y: canvas.height - 10, ancho: canvas.width + 10, alto: 10 });
}

function dibujarPlataformas() {
  for (let i = 0; i < plataformas.length; i++) {
    const plataforma = plataformas[i];
    let anchoTotal = 0; // Reiniciar el anchoTotal para cada plataforma
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

function multiplos(num) {
  const abajo = Math.floor(num / 18) * 18;
  const arriba = Math.ceil(num / 18) * 18;

  return (num - abajo) <= (arriba - num) ? abajo : arriba;
}

// Crear una nueva bala desde la posición del cuadrado
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const bala = {
    x: xPlayer + lado / 2, // Centro del cuadrado
    y: yPlayer,

    destinoX: mouseX,
    destinoY: mouseY,
    angulo: Math.atan2(mouseY - yPlayer, mouseX - (xPlayer + lado / 2)), // Dirección del disparo
  };

  if (no_balas > 0) {
    if (!isPaused) {
      balas.push(bala);
      no_balas--;
    }
  }

  num_balas.innerHTML = " x" + no_balas;
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

function controlBalas() {
  intervalIDBalas = setInterval(function () {
    if (no_balas < 10) {
      if (!isPaused) {
        no_balas++;
      }
    }
    num_balas.innerHTML = " x" + no_balas;
  }, 1500);
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

        if (puntaje % 10 == 0 && puntaje > 0) {
          nivel++;

          if (puntaje % 30 == 0) {
            noEnemigos++;
          }
        }

        total_puntaje.innerHTML = " x" + puntaje;
        text_nivel.innerHTML = " Nivel " + nivel;
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
      xPlayer + lado > plataforma.x &&
      xPlayer < plataforma.x + plataforma.ancho &&
      yPlayer + lado + velocidadY >= plataforma.y &&
      yPlayer + lado <= plataforma.y + plataforma.alto
    ) {

      // Ajusta la posición del cuadrado sobre la plataforma
      yPlayer = plataforma.y - lado;  // Coloca el cuadrado sobre la plataforma
      velocidadY = 0;  // Detener el movimiento vertical
      enSuelo = true;  // El cuadrado está en el suelo o sobre una plataforma
      return true; // Se ha tocado una plataforma
    }
  }
  return false; // No tocó ninguna plataforma
}

class Sprite {
  constructor({ animations = [], data }) {
    this.animations = animations;
    this.animation = "walk";
    this.frame = {};
    this.frameIndex = -1;
    this.data = data;
  }

  advance() {
    if (frames % 12 === 0) {

      this.frameNames = this.animations[this.animation].frames;

      if (this.frameIndex + 1 >= this.frameNames.length) {
        this.frameIndex = 0;
      } else {
        this.frameIndex++;
      }
      this.frame = this.data.frames[this.frameNames[this.frameIndex]].frame;
    }
  }
}

class Character extends Sprite {
  constructor(imageURL, spriteObject, x, y, w, h) {
    super(spriteObject);
    this.x = x || 200;
    this.y = y || 200;
    this.w = w || 30;
    this.h = h || 30;
    this.image = new Image();
    this.image.src = imageURL;
  }

  draw() {
    this.advance();
    ctx.drawImage(
      this.image,
      this.frame.x,
      this.frame.y,
      this.frame.w,
      this.frame.h,
      xPlayer,
      yPlayer,
      this.w,
      this.h
    );
  }
}

// uploading async data
// NO USÉ FETCH PARA EL EJEMPLO EN CODEPEN ;)
mario = new Character("./assets/img/spritesheet.png", {
  data,
  animations: {
    walk: {
      name: "walk",
      frames: [
        "walk_001.png",
        "walk_002.png",
        "walk_003.png"
      ]
    },
    idle: {
      name: "idle",
      frames: ["idle_001.png", "idle_002.png", "idle_003.png"]
    },
    back: {
      name: "back",
      frames: [
        "walk_004.png",
        "walk_005.png",
        "walk_006.png"
      ]
    },
    jump: {
      name: "jump",
      frames: ["jump_001.png", "jump_001.png", "jump_001.png"]
    }
  }
});

class Player {
  // Ajuste en la función de dibujar y actualizar
  drawPlayer() {
    // Detectar colisiones con plataformas
    if (!colisionConPlataformas()) {
      // Si no está tocando ninguna plataforma, aplicar gravedad
      if (yPlayer + lado < canvas.height) {  // Evitar que se siga cayendo si ya está en el suelo
        velocidadY += gravedad;  // Aplicar gravedad
      }
    }

    // Actualiza la posición Y y asegura que no se mueva más allá del borde superior
    yPlayer += velocidadY;
    if (yPlayer < 40) { // Limita el salto para que no sobrepase el borde superior
      yPlayer = 40;
      velocidadY = 0; // Detener el salto al llegar al límite superior
    }
    comprobarColisiones();  // Verificar si las balas tocan los círculos
  }

}

let player = new Player();

document.addEventListener("keydown", function (event) {
  const tecla = event.key.toLowerCase();
  liberada = false;

  // Movimiento a la izquierda (a)
  if (tecla === "a") {
    xPlayer -= velocidad;  // Mueve el cuadrado a la izquierda
    if (xPlayer + lado <= 0) xPlayer = canvas.width;  // Si pasa el borde izquierdo, aparece en el derecho
    mario.animation = "walk";
  }
  // Movimiento a la derecha (d)
  else if (tecla === "d") {
    mario.animation = "back";
    xPlayer += velocidad;  // Mueve el cuadrado a la derecha
    if (xPlayer >= canvas.width) xPlayer = -lado;  // Si pasa el borde derecho, aparece en el izquierdo
  }
  // Salto (w)
  if (event.key === "w" && enSuelo) {  // Solo salta si está en el suelo o sobre una plataforma
    mario.animation = "jump";
    velocidadY = salto;  // Aplica la velocidad del salto
  }

  if (vidas > 0) {
    player.drawPlayer();
  }
});

document.addEventListener("keyup", function (event) {
  liberada = true;
});

function actualizarVisibilidadBotones() {
  if (window.innerWidth <= 500) {
      botones.classList.remove('d-none');  // Muestra los botones
  } else {
      botones.classList.add('d-none');  // Oculta los botones
  }
}

// Ejecutar cuando la ventana cambie de tamaño
window.addEventListener('resize', actualizarVisibilidadBotones);

// Función para comenzar el movimiento con un intervalo controlado
function iniciarMovimiento() {
  if (!intervaloMovimiento) {
      intervaloMovimiento = setInterval(() => {
          if (presionandoIzquierda) {
              xPlayer -= velocidad;
              if (xPlayer + lado <= 0) xPlayer = canvas.width;
              mario.animation = "walk";
          }

          if (presionandoDerecha) {
              xPlayer += velocidad;
              if (xPlayer >= canvas.width) xPlayer = -lado;
              mario.animation = "back";
          }

          if (presionandoSaltar && enSuelo) {
              mario.animation = "jump";
              velocidadY = salto;
          }

          if (vidas > 0) {
              player.drawPlayer();
          }
      }, 40); // Controla la velocidad del movimiento (100 ms por paso)
  }
}

// Función para detener el movimiento
function detenerMovimiento() {
  clearInterval(intervaloMovimiento);
  intervaloMovimiento = null;
}

// Eventos para botón Izquierda
btnIzquierda.addEventListener('mousedown', function () {
  presionandoIzquierda = true;
  liberada = false;
});
btnIzquierda.addEventListener('mouseup', function () {
  presionandoIzquierda = false;
  liberada = true;
});
btnIzquierda.addEventListener('touchstart', function () {
  presionandoIzquierda = true;
  liberada = false;
});
btnIzquierda.addEventListener('touchend', function () {
  presionandoIzquierda = false;
  liberada = true;
});

// Eventos para botón Derecha
btnDerecha.addEventListener('mousedown', function () {
  presionandoDerecha = true;
  liberada = false;
});
btnDerecha.addEventListener('mouseup', function () {
  presionandoDerecha = false;
  liberada = true;
});
btnDerecha.addEventListener('touchstart', function () {
  presionandoDerecha = true;
  liberada = false;
});
btnDerecha.addEventListener('touchend', function () {
  presionandoDerecha = false;
  liberada = true;
});

// Eventos para botón Saltar
btnSaltar.addEventListener('mousedown', function () {
  presionandoSaltar = true;
  liberada = false;
});
btnSaltar.addEventListener('mouseup', function () {
  presionandoSaltar = false;
  liberada = true;
});
btnSaltar.addEventListener('touchstart', function () {
  presionandoSaltar = true;
  liberada = false;
});
btnSaltar.addEventListener('touchend', function () {
  presionandoSaltar = false;
  liberada = true;
});

class Enemi {
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
    context.drawImage(enemi, this.posX - this.radius, this.posY - this.radius, this.radius * 2, this.radius * 2);
  }

  update(context, squareX, squareY, squareSize, index) {

    // Calcular las coordenadas del centro del cuadrado
    let squareCenterX = xPlayer + squareSize / 2;
    let squareCenterY = yPlayer + squareSize / 2;

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
      vidas--;
      no_vidas.innerHTML = " x" + vidas;
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


function drawEnemies() {
  drawEnemi();
  intervalID = setInterval(function () {
    for (i = 0; i < noEnemigos; i++) {
      if (!isPaused) {
        drawEnemi();
      }
    }
  }, 2000);
}

function drawEnemi() {
  // Elegir si el círculo aparecerá arriba o abajo
  let randomEdge = Math.random() < 0.5 ? 'top' : 'bottom';

  let randomX = Math.random() * (canvas.width - 2 * radius) + radius;
  let randomY;

  if (randomEdge === 'top') {
    randomY = radius + 10;  // Aparece en la parte superior
  } else {
    randomY = canvas.height - radius * 3;  // Aparece en la parte inferior
  }

  circulos.push(new Enemi(randomX, randomY));
}

// Función de actualización
function actualizar() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpia el canvas antes de redibujar
  ctx.drawImage(background, 0, 0, window_width, window_height);
  frames++;

  // Actualizar los círculos
  for (i = 0; i < circulos.length; i++) {
    circulos[i].update(ctx, xPlayer, yPlayer, lado, i);
  }

  if (vidas > 0) {
    player.drawPlayer();  // Dibujar el cuadrado y aplicar la gravedad y saltos
    ctx.drawImage(canvasAux, 0, 0);
    dibujarBalas();  // Dibujar las balas
    if (liberada) {
      mario.animation = "idle";
    }
    mario.draw();

    if (!isPaused) {
      animationId = requestAnimationFrame(actualizar);
    } else {
      ctx.drawImage(paused,
        (window_width / 2) - (window_width / 4) + 10, // Coordenada X centrada
        (window_height / 2) - (window_height / 4), // Coordenada Y centrada
        window_width / 2 - 20,
        window_height / 4 + 100
      );
    }
  }
  else {
    ctx.clearRect(0, 0, window_width, window_height); // Limpia el canvas antes de redibujar
    ctx.drawImage(background, 0, 0, window_width, window_height);
    clearInterval(intervalID);
    clearInterval(intervalIDBalas);
    cancelAnimationFrame(animationId);
    ctx.drawImage(game_over,
      (window_width / 2) - (window_width / 4) + 10, // Coordenada X centrada
      (window_height / 2) - (window_height / 4) - 50, // Coordenada Y centrada
      window_width / 2 - 20,
      window_height / 2 + 100
    );

    if (esPuntajeAlto(puntaje)) {
      mostrarModalRegistro();
    }

    detenerMovimiento();
    isPlaying = false;

    playPauseIcon.classList.remove("fa-pause");
    playPauseIcon.classList.add("fa-play");
  }
}

function reiniciarJuego() {
  // Restablecer posiciones del jugador y plataformas
  xPlayer = (canvas.width - lado) / 2;
  yPlayer = canvas.height - lado;
  velocidadY = 0;

  // Restablecer variables de salto y estado
  enSalto = false;
  enSuelo = false;
  isPaused = false;
  isPlaying = false;

  // Restablecer las balas
  balas = [];
  no_balas = 10;

  // Restablecer puntaje, nivel y vidas
  puntaje = 0;
  nivel = 1;
  vidas = 3;

  // Restablecer enemigos
  circulos = [];
  noEnemigos = 1;

  // Restablecer plataformas
  plataformas = [];
  crearPlataformas();
  iniciarMovimiento();

  // Restablecer estado de la imagen del personaje
  mario.animation = "idle";
  frames = 0;

  playPauseIcon.classList.remove("fa-pause");
  playPauseIcon.classList.add("fa-play");

  // Redibujar todo desde cero
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dibujarPlataformas();
  total_puntaje.innerHTML = " x" + puntaje;
  text_nivel.innerHTML = " Nivel " + nivel;
  num_balas.innerHTML = " x" + no_balas;
}

// Añadir un evento de clic al botón
playPauseBtn.addEventListener("click", function () {
  // Verificar si el ícono actual es de "play"
  if (playPauseIcon.classList.contains("fa-play")) {
    // Cambiar el ícono a "pausa"

    if (!isPlaying && !isPaused) {
      reiniciarJuego();
      no_vidas.innerHTML = " x" + vidas;
      num_balas.innerHTML = " x" + no_balas;
      crearPlataformas();
      // Cuando todas las imágenes carguen, dibuja las plataformas
      p1.onload = p2.onload = p3.onload = dibujarPlataformas;
      drawEnemies();
      controlBalas();
      actualizar();  // Iniciar el ciclo de actualización
      isPlaying = true;
    } else {
      isPaused = false;
      animationId = requestAnimationFrame(actualizar);
    }

    playPauseIcon.classList.remove("fa-play");
    playPauseIcon.classList.add("fa-pause");

  } else {
    // Cambiar el ícono a "play"
    isPaused = true;
    playPauseIcon.classList.remove("fa-pause");
    playPauseIcon.classList.add("fa-play");
  }
});

window.onload = function () {
  crearPlataformas();
  dibujarPlataformas();
  ctx.clearRect(0, 0, window_width, window_height); // Limpiar el lienzo
  ctx.drawImage(background, 0, 0, window_width, window_height); // Dibujar el fondo
  ctx.drawImage(canvasAux, 0, 0);

  // Llamar a la función que muestra los puntajes al cargar la página
  mostrarPuntajes();

  actualizarVisibilidadBotones();

  // Ejemplo: Agregar puntajes de ejemplo para probar
  // Ejemplo: Agregar puntajes de ejemplo para probar
  //localStorage.removeItem('highScores')
  //agregarPuntaje('Octavio', 100);
};
