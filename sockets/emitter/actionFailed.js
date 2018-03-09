const emitterName = 'actionFailed';

function actionFailed(socket, { title, description }) {
  socket.emit(emitterName, { title, description });
}

module.exports = actionFailed;
