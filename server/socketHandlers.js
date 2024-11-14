const { setupGameSession, disconnectUser } = require('./gameManager');

const allUsers = {};
const allRooms = [];

function handleSocketEvents(io) {
  io.on('connection', (socket) => {
    allUsers[socket.id] = { socket, online: true };

    socket.on('request_to_play', (data) => {
      setupGameSession(socket, data, allUsers, allRooms);
    });

    socket.on('disconnect', () => {
      disconnectUser(socket, allUsers, allRooms);
    });
  });
}

module.exports = handleSocketEvents;
