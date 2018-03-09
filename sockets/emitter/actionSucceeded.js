const emitterName = 'actionSucceeded';

function actionSucceeded(socket, { title, description }) {
  console.log('actionSucceeded');
  socket.emit(emitterName, { title, description });
}

module.exports = actionSucceeded;
