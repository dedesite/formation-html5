const express = require('express');
const app = express();
const WebSocketServer = require('websocket').server;

const SERVER_PORT = 3000;


app.use(express.static('public'));


app.listen(SERVER_PORT, () => {
	console.log(`Start server on port ${SERVER_PORT}`);
});

const wsServer = new WebSocketServer({httpServer: app});