var fileUploader = new SocketIOFileClient(socket);

console.log("l = ", l);

fileUploader.on('start', (fileInfo) => {
  console.log('Start uploading', fileInfo);
});
fileUploader.on('stream', (fileInfo) => {
  console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
});
fileUploader.on('complete', (fileInfo) => {
  console.log('Upload Complete', fileInfo);
});
fileUploader.on('error', (err) => {
  console.log('Error!', err);
});
fileUploader.on('abort', (fileInfo) => {
  console.log('Aborted: ', fileInfo);
});