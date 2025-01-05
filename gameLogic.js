// Lógica de la Partida
class Game {
    constructor(players) {
        this.players = players; // Jugadores del juego
        this.currentPlayerIndex = 0; // El índice del jugador actual
        this.playersData = {}; // Información de los jugadores (oro, cartas, etc.)
        this.turnsLeft = 30; // Tiempo por turno
        this.characters = ['Asesino', 'Ladrón', 'Hechicera', 'Rey', 'Obispo', 'Mercader', 'Arquitecto', 'Guerrero'];
        this.cardsDeck = this.generateDeck(); // El mazo de cartas de distritos
        this.activePlayer = null; // Jugador que está jugando en el turno actual
        this.gameStarted = false; // Si el juego ha comenzado
    }

    // Iniciar el juego
    startGame() {
        this.gameStarted = true;
        this.initializePlayers();
        this.startNextTurn();
    }

    // Inicializar los jugadores con sus datos
    initializePlayers() {
        this.players.forEach(player => {
            this.playersData[player] = {
                gold: 0,
                districts: [],
                characterChoice: null,
                hand: [],
                turn: false
            };
        });
    }

    // Iniciar el siguiente turno
    startNextTurn() {
        this.turnsLeft = 30; // Reseteamos el temporizador
        this.activePlayer = this.players[this.currentPlayerIndex];
        this.playersData[this.activePlayer].turn = true; // Es el turno del jugador activo

        // Lógica para elegir un personaje aleatorio
        if (this.activePlayer === 'Jugador Humano') {
            // Si es el turno del jugador humano, le dejamos elegir
            console.log(`Es el turno de ${this.activePlayer}. Elige un personaje.`);
        } else {
            // Los jugadores IA eligen un personaje aleatorio
            this.playersData[this.activePlayer].characterChoice = this.characters[Math.floor(Math.random() * this.characters.length)];
            console.log(`${this.activePlayer} ha elegido el personaje: ${this.playersData[this.activePlayer].characterChoice}.`);
            this.nextPlayer(); // La IA se mueve automáticamente al siguiente jugador
        }

        // Si el jugador no actúa en 30 segundos, elige el personaje automáticamente
        setTimeout(() => {
            if (this.playersData[this.activePlayer].turn) {
                console.log(`El tiempo ha terminado para ${this.activePlayer}. Eligiendo personaje automáticamente.`);
                if (this.activePlayer !== 'Jugador Humano') {
                    this.playersData[this.activePlayer].characterChoice = this.characters[Math.floor(Math.random() * this.characters.length)];
                }
                this.playersData[this.activePlayer].turn = false;
                this.nextPlayer();
            }
        }, 30000); // 30 segundos de tiempo límite
    }

    // Cambiar al siguiente jugador
    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.startNextTurn();
    }

    // Crear un mazo de cartas de distrito
    generateDeck() {
        const districts = [
            { name: "Castillo", type: "Noble", value: 4 },
            { name: "Iglesia", type: "Religioso", value: 3 },
            { name: "Mercado", type: "Comercial", value: 2 },
            { name: "Fortaleza", type: "Militar", value: 6 },
            { name: "Torre", type: "Único", value: 5 }
        ];
        let deck = [];

        // Crear un deck con 10 cartas por cada distrito
        districts.forEach(district => {
            for (let i = 0; i < 10; i++) {
                deck.push({ ...district });
            }
        });

        // Mezclar el deck
        deck = deck.sort(() => Math.random() - 0.5);
        return deck;
    }

    // Realizar la acción de recolectar recursos
    collectResources(player) {
        if (player === 'Jugador Humano') {
            // Si el jugador es humano, él elige si recolectar oro o cartas
            const action = Math.random() > 0.5 ? 'gold' : 'card'; // La IA escoge aleatoriamente entre oro y carta
            if (action === 'gold') {
                this.playersData[player].gold += 2; // Gana dos de oro
                console.log(`${player} ha recolectado 2 de oro.`);
            } else {
                const card = this.cardsDeck.pop(); // Roba una carta
                this.playersData[player].hand.push(card);
                console.log(`${player} ha robado una carta: ${card.name}.`);
            }
        } else {
            // Si el jugador es IA, recolecta oro automáticamente
            this.playersData[player].gold += 2; // La IA siempre elige oro
            console.log(`${player} (IA) ha recolectado 2 de oro.`);
        }
    }

    // Realizar una acción de construcción
    buildDistrict(player, districtName) {
        if (player === 'Jugador Humano') {
            const districtIndex = this.playersData[player].hand.findIndex(card => card.name === districtName);

            if (districtIndex === -1) {
                console.log(`¡Error! ${player} no tiene la carta de distrito ${districtName} en su mano.`);
                return;
            }

            const district = this.playersData[player].hand.splice(districtIndex, 1)[0];
            if (district.value <= this.playersData[player].gold) {
                this.playersData[player].gold -= district.value;
                this.playersData[player].districts.push(district);
                console.log(`${player} ha construido el distrito ${districtName}.`);
            } else {
                console.log(`¡No tienes suficiente oro para construir el distrito ${districtName}!`);
            }
        } else {
            // Si es IA, la IA elige el primer distrito que puede pagar
            const affordableDistricts = this.playersData[player].hand.filter(card => card.value <= this.playersData[player].gold);
            if (affordableDistricts.length > 0) {
                const districtToBuild = affordableDistricts[0];
                this.playersData[player].gold -= districtToBuild.value;
                this.playersData[player].districts.push(districtToBuild);
                console.log(`${player} (IA) ha construido el distrito ${districtToBuild.name}.`);
            }
        }
    }
}

// Inicializar juego y jugadores
const players = ['Jugador Humano', 'Jugador IA 1', 'Jugador IA 2'];
const game = new Game(players);

// Simular inicio de juego
game.startGame();
