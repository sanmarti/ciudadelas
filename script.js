let currentTurn = 0; // Índice del jugador actual
let players = ['Jugador Humano', 'Jugador IA 1', 'Jugador IA 2', 'Jugador IA 3', 'Jugador IA 4', 'Jugador IA 5', 'Jugador IA 6'];
let timer;
let turnTimeLeft = 30;

// Función para actualizar el tiempo de la cuenta regresiva
function startTimer() {
  const timerElement = document.getElementById('timer');
  timer = setInterval(() => {
    turnTimeLeft--;
    timerElement.textContent = turnTimeLeft;

    if (turnTimeLeft === 0) {
      clearInterval(timer);
      nextTurn(); // Si se acaba el tiempo, pasa al siguiente turno
    }
  }, 1000);
}

// Función para iniciar el siguiente turno
function nextTurn() {
  // Si el turno del humano termina, el juego pasa a la IA
  const playerName = players[currentTurn];
  document.getElementById('current-turn').textContent = playerName;
  document.getElementById('turns-left').style.display = 'block'; // Mostrar el tiempo
  turnTimeLeft = 30; // Resetear el temporizador

  // Si es el turno del jugador humano, activa los botones
  if (playerName === 'Jugador Humano') {
    document.getElementById('human-actions').style.display = 'block';
  } else {
    document.getElementById('human-actions').style.display = 'none';
    // El jugador IA toma una acción automáticamente
    setTimeout(() => {
      // Simulamos que la IA toma una acción
      document.getElementById(`player-${currentTurn + 1}`).querySelector('.status').textContent = `${playerName} está actuando...`;
      setTimeout(() => {
        nextTurn(); // Después de que la IA actúe, pasa al siguiente jugador
      }, 2000); // La IA toma su turno después de 2 segundos
    }, 1000); // Esperar 1 segundo antes de que la IA actúe
  }

  // Cambiar al siguiente jugador
  currentTurn = (currentTurn + 1) % players.length;
  startTimer(); // Iniciar el temporizador para el siguiente turno
}

// Función para recolectar recursos
function collectResources() {
  // Lógica para recolectar recursos en el turno del humano
  addToLog('Jugador Humano ha recolectado recursos.');
  nextTurn();
}

// Función para construir un distrito
function buildDistrict() {
  // Lógica para construir un distrito en el turno del humano
  addToLog('Jugador Humano ha construido un distrito.');
  nextTurn();
}

// Función para agregar un evento al registro del juego
function addToLog(message) {
  const logElement = document.getElementById('log');
  const logEntry = document.createElement('li');
  logEntry.textContent = message;
  logElement.appendChild(logEntry);
}

// Iniciar el juego
nextTurn();
