const NodeViewer = require('./NodeViewer');
const loading = require('./Interface');

module.exports = (io, socket) => {
  const manager = new NodeViewer();

  manager.emitAssembly((id, matrix, parentId) => {
    socket.emit(loading.emit.assembly, id, matrix, parentId);
  });

  manager.emitPart((id, name, matrix, parentId) => {
    socket.emit(loading.emit.part, id, name, matrix, parentId)
  });

  manager.emitUpdateMatrix((id, matrix) => {
    socket.emit(loading.emit.updateMatrix, id, matrix);
  });

  manager.emitAssemblyForEveryOne((id, matrix, parentId) => {
    const { currentWorkspace } = socket.handshake.session;
    io.in(currentWorkspace).emit(loading.emit.assembly, id, matrix, parentId);
  });
  manager.emitPartForEveryOne((id, name, matrix, parentId) => {
    const { currentWorkspace } = socket.handshake.session;
    io.in(currentWorkspace).emit(loading.emit.part, id, name, matrix, parentId);
  });

  socket.on(loading.on.start, (workspaceId) => {
    const { currentWorkspace } = socket.handshake.session;
    manager.loadWorkspace(workspaceId);
  });

  socket.on(loading.on.save, (nodeId, matrix) => {
    const { currentWorkspace } = socket.handshake.session;
    manager.save(currentWorkspace, nodeId, matrix);
    socket.to(currentWorkspace).emit(loading.emit.updateMatrix, nodeId, [matrix]);
  });

  socket.on(loading.on.cancel, () => {
    const { currentWorkspace } = socket.handshake.session;
    manager.cancel(currentWorkspace)
  });

  socket.on(loading.on.update, (nodeId, token) => {
    manager.update(nodeId)
  });
};
