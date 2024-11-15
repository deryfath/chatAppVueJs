const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
    ws.on('message', (message) => {
      // Broadcast the message to all connected clients
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // Forward the message with the clientId
          client.send(message);
        }
      });
    });
  });

console.log('WebSocket server started on ws://localhost:8080');