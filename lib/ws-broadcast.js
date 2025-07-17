const sessions = {};

export const WebSocketServer = {
  addClient(sessionId, ws) {
    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }

    sessions[sessionId].push(ws);

    ws.on('close', () => {
      sessions[sessionId] = sessions[sessionId].filter(client => client !== ws);
      if (sessions[sessionId].length === 0) {
        delete sessions[sessionId];
      }
    });
  },

  sendToSession(sessionId, data) {
    const clients = sessions[sessionId] || [];

    for (const ws of clients) {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify(data));
      }
    }
  }
};