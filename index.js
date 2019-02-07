const express = require('express');
const app = express();
const WebSocket = require('ws');

const SERVER_PORT = 3000;


app.use(express.static('public'));


const server = app.listen(SERVER_PORT, () => {
	console.log(`Start server on port ${SERVER_PORT}`);
});

const wsServer = new WebSocket.Server({server, path: "/ws"});

wsServer.on("connection", ws => {
    console.log((new Date()) + ' Connection accepted.');

    ws.on('message', (data) => {
        // Broadcast to everyone else.
        wsServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});