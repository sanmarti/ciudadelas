const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const Game = require('./gameLogic'); // Importamos la lógica del juego

let game;
let clients = [];

// Configuración del servidor Express
app.use(express.static('public')); // Sirve los archivos estáticos (HTML, JS, CSS)

wss.on('connection', (ws) => {
    console.log('Nuevo jugador conectado.');
    clients.push(ws);

    // Asignar un nombre de jugador
    const playerName = `Jugador ${clients.length}`;
    ws.send(JSON.stringify({ type: 'welcome', message: `Bienvenido, ${playerName}!` }));

    // Crear un juego cuando haya suficientes jugadores
    if (clients.length === 3) { // Aquí se puede ajustar la cantidad de jugadores
        game = new Game(['Jugador 1', 'Jugador 2', 'Jugador 3']);
        game.startGame();
    }

    ws.on('message', (message) => {
        console.log(`Mensaje recibido: ${message}`);
        // Lógica para gestionar los mensajes de los jugadores
    });

    ws.on('close', () => {
        console.log('Un jugador se desconectó');
        clients = clients.filter(client => client !== ws);
    });
});

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
