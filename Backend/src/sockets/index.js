import WebSocket, { WebSocketServer } from "ws";

export default function initWebSocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        ws.send("Connected to WebSocket server!");

        ws.on("message", (msg) => {
            console.log("Received:", msg);
            ws.send(`Echo: ${msg}`);
        });
    });
}
