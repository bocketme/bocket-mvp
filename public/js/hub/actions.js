socket.on('actionFailed', ({ title, description }) => {
  Materialize.toast(title + '-' + description, 4000);
});

socket.on('actionSucceeded', ({ title, description }) => {
  console.log('SUCCEEEEED', title, description);
  Materialize.toast(title + '-' + description, 4000);
});
