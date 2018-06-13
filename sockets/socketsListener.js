const checkUniqueField = require('./checkUniqueField');
const Annotation = require('./Annotation');
const newNodeListener = require('./newNodeListener');
const NodeInformation = require('./NodeInformation');
const searchNodeChildren = require('./searchNodeChildren');
const NodeViewer = require('./NodeViewer');
const Organization = require('./Organization');
const newActivityComment = require('./newActivityCommentListener');
const getActivities = require('./getActivitiesListener');
const addCommentListener = require('./addCommentToActivityListener');
const joinWorkspaceListener = require('./joinWorkspaceListener');
const leaveWorkspaceListener = require('./leaveWorkspaceListener');
const fileUploaderListener = require('./fileUploaderListener');
const SocketIOFile = require('socket.io-file');
const getAllSpecListener = require('./getAllSpecListener');
const removeSpecListener = require('./removeSpecListener');
const renameSpecListener = require('./renameSpecListener');
const workspaceManagerListener = require('./workspaceListener');
const GetSelectedItemsToAdd = require('./GetSelectedItemsToAdd');
const createWorkspaceInSignIn = require('./createWorkspaceInSignIn');
const duplicateNodeListener = require('./duplicateNodeListener');
const changePassword = require('./changePasswordListener');
const reportIssueListener = require('./reportIssueListener');
const Tchat = require('./Tchat');
const getCurrentUser = require('./getCurrentUser');
const Invitation = require('./Invitation');
const Workspace = require('./Workspace');
const User = require('./User');

const FSconfig = require('../config/FileSystemConfig');

module.exports = function (io) {
  io.on('connection', (socket) => {
    const uploader = new SocketIOFile(socket, {
      uploadDir: FSconfig.appDirectory.tmp, // simple directory
      accepts: ['image/png', 'image/jpeg', 'application/pdf', 'application/vnd.oasis.opendocument.text', 'image/svg+xml'], // chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
      maxFileSize: 4194304, // 4 MB. default is undefined(no limit)
      chunkSize: 10240, // default is 10240(1KB)
      transmissionDelay: 0, // delay of each transmission
      overwrite: true, // overwrite file if exists, default is true.
    });


    socket.on('reload', (workspaceId) => socket.to(workspaceId).emit('reload'));

    Annotation(io, socket);
    Tchat(io, socket);
    duplicateNodeListener(socket);
    createWorkspaceInSignIn(io, socket);
    fileUploaderListener(socket, uploader);
    checkUniqueField(socket);
    newNodeListener(socket);
    NodeInformation(io, socket);
    searchNodeChildren(socket);
    NodeViewer(io, socket);
    newActivityComment(socket, io);
    getActivities(socket);
    addCommentListener(socket, io);
    joinWorkspaceListener(io, socket);
    leaveWorkspaceListener(io, socket);
    getAllSpecListener(socket);
    removeSpecListener(io, socket);
    renameSpecListener(io, socket);
    GetSelectedItemsToAdd(socket);
    changePassword(socket);
    User(io, socket);
    Organization(io, socket);
    workspaceManagerListener(socket);
    reportIssueListener(socket);
    getCurrentUser(io, socket);
    Invitation(io, socket);
    Workspace(io, socket);

  });
};
