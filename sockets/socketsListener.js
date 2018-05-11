const betaRegistrationListener = require('./betaRegistrationSListener');
const checkUniqueField = require('./checkUniqueField');
const Annotation = require('./Annotation/main');
const newNodeListener = require('./newNodeListener');
const NodeInformationListener = require('./nodeInformationListener');
const searchNodeChildren = require('./searchNodeChildren');
const NodeViewer = require('./NodeViewer/main');
const newActivityComment = require('./newActivityCommentListener');
const getActivities = require('./getActivitiesListener');
const addCommentListener = require('./addCommentToActivityListener');
const joinWorkspaceListener = require('./joinWorkspaceListener');
const leaveWorkspaceListener = require('./leaveWorkspaceListener');
const invitePeopleListener = require('./invitePeopleListener');
const fileUploaderListener = require('./fileUploaderListener');
const SocketIOFile = require('socket.io-file');
const getAllSpecListener = require('./getAllSpecListener');
const removeSpecListener = require('./removeSpecListener');
const renameSpecListener = require('./renameSpecListener');
const workspaceManagerListener = require('./workspaceListener');
const removeUserFromOW = require('./removeUserFromOW');
const GetSearchCriteria = require('./GetSearchCriteria');
const GetSelectedItemsToAdd = require('./GetSelectedItemsToAdd');
const createWorkspaceInSignIn = require('./createWorkspaceInSignIn');
const createWorkspaceInHub = require('./createWorkspaceInHub');
const deleteNodeListener = require('./deleteNodeListener');
const duplicateNodeListener = require('./duplicateNodeListener');
const changePassword = require('./changePasswordListener');
const reportIssueListener = require('./reportIssueListener');
const changeWorkspaceorOrganizationName = require('./changeWorkspaceorOrganizationName.js');
const Tchat = require('./Tchat/main');
const getCurrentUser = require('./getCurrentUser');
const getUsers = reqUseruire('./getUsers');

const User = require('./User/main');

const FSconfig = require('../config/FileSystemConfig');

module.exports = function (io) {
  io.on('connection', (socket) => {
    const uploader = new SocketIOFile(socket, {
      uploadDir: FSconfig.appDirectory.tmp, // simple directory
      accepts: ['image/png', 'image/jpeg', 'application/pdf', 'application/vnd.oasis.opendocument.text', 'image/svg+xml'], // chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
      maxFileSize: 4194304, // 4 MB. default is undefined(no limit)
      chunkSize: 10240, // default is 10240(1KB)
      transmissionDelay: 0, // delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
      overwrite: true, // overwrite file if exists, default is true.
    });

    const { userMail, currentWorkspace } = socket.handshake.session;

    socket.join(currentWorkspace, () => {
      const rooms = Object.keys(socket.rooms);
      console.log(userMail, 'join', rooms.find(room => room === socket.handshake.session.currentWorkspace));

      Annotation(io, socket);
      Tchat(io, socket);
      changeWorkspaceorOrganizationName(socket);
      duplicateNodeListener(socket);
      deleteNodeListener(io, socket);
      createWorkspaceInHub(io, socket);
      createWorkspaceInSignIn(io, socket);
      fileUploaderListener(socket, uploader);
      betaRegistrationListener(socket);
      checkUniqueField(socket);
      newNodeListener(socket);
      NodeInformationListener(socket);
      searchNodeChildren(socket);
      NodeViewer(io, socket);
      newActivityComment(socket, io);
      getActivities(socket);
      addCommentListener(socket, io);
      invitePeopleListener(socket);
      joinWorkspaceListener(io, socket);
      leaveWorkspaceListener(io, socket);
      getAllSpecListener(socket);
      removeSpecListener(io, socket);
      renameSpecListener(io, socket);
      GetSearchCriteria(socket);
      GetSelectedItemsToAdd(socket);
      changePassword(socket);
      User(io, socket);
      workspaceManagerListener(socket);
      removeUserFromOW(socket);
      reportIssueListener(socket);
      getCurrentUser(io, socket);
      getUsers(io, socket);
    });
  });
};
