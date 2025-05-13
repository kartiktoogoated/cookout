import { WebSocket, WebSocketServer } from 'ws';
import http from 'http';

const server = http.createServer();
const wss = new WebSocketServer({ server });


const peers: Set<WebSocket> = new Set();

wss.on('connection', (ws) => {
    peers.add(ws);
    console.log("New peer connected");

    ws.on('message', (message) => {
        for (const peer of peers) {
            if (peer !== ws && peer.readyState === WebSocket.OPEN) {
                peer.send(message.toString());
            }
        }
    });

    ws.on('close', () => {
        peers.delete(ws);
    });
});

server.listen(8080, () => {
    console.log("Signalling server running at ws://localhost:8080");
});