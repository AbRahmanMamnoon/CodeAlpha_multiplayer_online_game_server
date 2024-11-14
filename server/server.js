const { createServer } = require('http');
const { Server } = require('socket.io');
const handleSocketEvents = require('./socketHandlers');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' },
});

handleSocketEvents(io);

httpServer.listen(3000, () => {
  console.log('Server listening on port 3000');
});
