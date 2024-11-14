function setupGameSession(socket, data, allUsers, allRooms) {
  const currentUser = allUsers[socket.id];
  currentUser.playerName = data.playerName;

  let opponentPlayer;
  for (const key in allUsers) {
    const user = allUsers[key];
    if (user.online && !user.playing && socket.id !== key) {
      opponentPlayer = user;
      break;
    }
  }

  if (opponentPlayer) {
    allRooms.push({ player1: opponentPlayer, player2: currentUser });

    currentUser.socket.emit('OpponentFound', {
      opponentName: opponentPlayer.playerName,
      playingAs: 'circle',
    });

    opponentPlayer.socket.emit('OpponentFound', {
      opponentName: currentUser.playerName,
      playingAs: 'cross',
    });

    setupMoveListeners(currentUser, opponentPlayer);
    setupMoveListeners(opponentPlayer, currentUser);
  } else {
    currentUser.socket.emit('OpponentNotFound');
  }
}

function setupMoveListeners(player, opponent) {
  player.socket.on('playerMoveFromClient', (data) => {
    opponent.socket.emit('playerMoveFromServer', data);
  });
}

function disconnectUser(socket, allUsers, allRooms) {
  const currentUser = allUsers[socket.id];
  if (currentUser) {
    currentUser.online = false;
    currentUser.playing = false;

    for (let i = 0; i < allRooms.length; i++) {
      const { player1, player2 } = allRooms[i];
      if (player1.socket.id === socket.id) {
        player2.socket.emit('opponentLeftMatch');
        break;
      }
      if (player2.socket.id === socket.id) {
        player1.socket.emit('opponentLeftMatch');
        break;
      }
    }
  }
}

module.exports = { setupGameSession, disconnectUser };
