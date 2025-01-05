let currentTurn = 0; // Índice del jugador actual
let players = ['Jugador Humano', 'Jugador IA 1', 'Jugador IA 2', 'Jugador IA 3', 'Jugador IA 4', 'Jugador IA 5', 'Jugador IA 6'];
let timer;
let turnTimeLeft = 30;
let gameData = {
  'Jugador Humano': { gold: 0, districts: [], hand: [] },
  'Jugador IA 1': { gold: 0, districts: [], hand: [] },
  'Jugador IA 2': { gold: 0, districts: [], hand: [] },
  'Jugador IA 3': { gold: 0, districts: [], hand: [] },
  'Jugador IA 4': { gold: 0, districts: [], hand: [] },
  'Jugador IA 5': { gold: 0, districts: [], hand: [] },
  'Jugador IA 6': { gold: 0, districts: [], hand: [] }
};

// Cartas de distrito (puedes agregar más distritos según el juego)
const districts = [
  { name: "Castillo", type: "Noble", value: 4 },
  { name: "Iglesia", type: "Religioso", value: 3 },
  { name: "Mercado", type: "Comercial", value: 2 },
  { name: "Fortaleza", type: "Militar", value: 6 },
  { name: "Torre", type: "Único", value: 5 }
];

// Mazo de cartas (boca abajo)
let deck = generateDeck();

// Función para iniciar el juego
function startGame() {
  dealCards(); // Distribuir cartas al inicio del juego
  updateDeck(); // Mostrar la carta del mazo en la interfaz
  nextTurn();  // Comenzar el primer turno
}

// Función para repartir 5 cartas a cada jugador
function dealCards() {
  players.forEach(player => {
    gameData[player].hand = [];
    for (let i = 0; i < 5; i++) {
      const card = deck.pop(); // Tomar carta del mazo
      gameData[player].hand.push(card); // Asignar carta al jugador
    }
    updatePlayerCards(player); // Actualizar la vista de las cartas del jugador
  });
}

// Función para generar el mazo de cartas (mezcladas)
function generateDeck() {
  let deck = [];
  for (let i = 0; i < 10; i++) {  // Crear 10 cartas de cada tipo de distrito
    districts.forEach(district => {
      deck.push({ ...district });
    });
  }
  return deck.sort(() => Math.random() - 0.5); // Mezclar las cartas aleatoriamente
}

// Función para actualizar el mazo en la interfaz (boca abajo)
function updateDeck() {
  const deckElement = document.getElementById('deck-card');
  deckElement.innerHTML = `<div class="card-back">Carta Boca Abajo</div>`;
}

// Función para actualizar las cartas de un jugador en la interfaz
function updatePlayerCards(player) {
  const cardListElement = document.getElementById(player === 'Jugador Humano' ? 'human-card-list' : `ia-card-list-${players.indexOf(player) + 1}`);
  cardListElement.innerHTML = ''; // Limpiar las cartas anteriores

  gameData[player].hand.forEach(card => {
    const listItem = document.createElement('li');
    listItem.textContent = `${card.name} (Valor: ${card.value} monedas)`;
    cardListElement.appendChild(listItem);
  });

  // Actualizar el oro del jugador
  const goldElement = document.getElementById(player === 'Jugador Humano' ? 'human-gold' : `ia-${players.indexOf(player) + 1}-gold`);
  goldElement.textContent = gameData[player].gold;
}

// Función para robar una carta del mazo
function drawCard() {
  if (deck.length > 0) {
    const card = deck.pop(); // Robar la carta del mazo
    gameData['Jugador Humano'].hand.push(card); // Agregar la carta a la mano del jugador humano
    gameData['Jugador Humano'].gold += card.value; // Sumar el valor de la carta al oro del jugador humano
    updatePlayerCards('Jugador Humano'); // Actualizar la interfaz con las cartas y el oro
    addToLog('Jugador Humano ha robado una carta.');
    nextTurn(); // Terminar el turno
  } else {
    addToLog('No quedan cartas en el mazo.');
  }
}

// Función para recolectar recursos
function collectResources() {
  gameData['Jugador Humano'].gold += 2; // Ganar 2 de oro al recolectar recursos
  updatePlayerCards('Jugador Humano'); // Actualizar oro y cartas
  addToLog('Jugador Humano ha recolectado recursos.');
  nextTurn();
}

// Función para construir un distrito
function buildDistrict() {
  if (gameData['Jugador Humano'].gold >= 3) { // Condición para construir un distrito
    gameData['Jugador Humano'].gold -= 3; // Restar el oro necesario para construir
    addToLog('Jugador Humano ha construido un distrito.');
    updatePlayerCards('Jugador Humano');
  } else {
    addToLog('Jugador Humano no tiene suficiente oro para construir un distrito.');
  }
  nextTurn();
}

// Función para agregar un evento al registro del juego
function addToLog(message) {
  const logElement = document.getElementById('log');
  const logEntry = document.createElement('li');
  logEntry.textContent = message;
  logElement.appendChild(logEntry);
}

// Función para actualizar el turno y el temporizador
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
      document.getElementById(`player-${currentTurn + 1}`).querySelector('.status').textContent
