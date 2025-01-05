let timerElement = document.getElementById('timer');
let playerTurnElement = document.getElementById('playerTurn');
let startButton = document.getElementById('startButton');
let currentPlayer = 0; // El jugador actual (comienza en 0)
let gameStarted = false;
let players = ['Jugador 1', 'Jugador 2', 'Jugador 3', 'Jugador 4', 'Jugador 5', 'Jugador 6', 'Jugador 7'];
let characters = ['Asesino', 'Ladrón', 'Hechicera', 'Rey', 'Obispo', 'Mercader', 'Arquitecto', 'Guerrero'];
let timerInterval;
let maxTime = 30;
let currentTime = maxTime;

// Función para comenzar el juego
function startGame() {
    gameStarted = true;
    startButton.disabled = true;
    nextTurn();
}

// Función para actualizar el temporizador
function updateTimer() {
    if (currentTime <= 0) {
        clearInterval(timerInterval);
        playerTurnElement.textContent = "El tiempo se agotó. Elige el personaje automáticamente.";
        currentPlayer = (currentPlayer + 1) % players.length;
        setTimeout(nextTurn, 2000); // Espera 2 segundos para cambiar de turno
    } else {
        timerElement.textContent = currentTime;
        currentTime--;
    }
}

// Función para iniciar el temporizador y mostrar el turno del jugador
function nextTurn() {
    currentTime = maxTime; // Resetear el temporizador
    timerElement.textContent = currentTime;
    playerTurnElement.textContent = `Es el turno de ${players[currentPlayer]} (${characters[currentPlayer]})`;
    timerInterval = setInterval(updateTimer, 1000);
}

// Evento para el botón de inicio
startButton.addEventListener('click', startGame);

// Iniciar el primer turno (después de 30 segundos, pasará al siguiente jugador)
