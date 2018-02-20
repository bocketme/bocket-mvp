const betaRegistrationListener = require('./betaRegistrationSListener');
const checkUniqueField = require('./checkUniqueField');
const signinListener = require('./signinListener');
const newNodeListener = require('./newNodeListener');
const NodeInformationListener = require('./nodeInformationListener');
const contentInformationListener = require('./contentInformationListener');
const searchNodeChildren = require('./searchNodeChildren');
const nodeViewer = require('./nodeViewer');
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
let GetSearchCriteria = require("./GetSearchCriteria");
let GetSelectedItemsToAdd = require("./GetSelectedItemsToAdd");
let createWorkspaceInSignIn = require('./createWorkspaceInSignIn');
let createWorkspaceInHub = require('./createWorkspaceInHub');

module.exports = function (io) {
  io.on('connection', (socket) => {
    //TODO: How it works ?
    const uploader = new SocketIOFile(socket, {
      uploadDir: 'data', // simple directory
      accepts: ['image/png', 'image/jpeg', 'application/pdf', 'application/vnd.oasis.opendocument.text', 'image/svg+xml'], // chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
      maxFileSize: 4194304, // 4 MB. default is undefined(no limit)
      chunkSize: 10240, // default is 10240(1KB)
      transmissionDelay: 0, // delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
      overwrite: true, // overwrite file if exists, default is true.
    });

    createWorkspaceInHub(io, socket);
    createWorkspaceInSignIn(io, socket);
    fileUploaderListener(socket, uploader);
    betaRegistrationListener(socket);
    checkUniqueField(socket);
    signinListener(socket);
    newNodeListener(socket);
    NodeInformationListener(socket);
    contentInformationListener(socket);
    searchNodeChildren(socket);
    nodeViewer(socket);
    newActivityComment(socket);
    getActivities(socket);
    addCommentListener(socket);
    invitePeopleListener(socket);
    joinWorkspaceListener(io, socket);
    leaveWorkspaceListener(io, socket);
    getAllSpecListener(socket);
    removeSpecListener(io, socket);
    renameSpecListener(io, socket);
    GetSearchCriteria(socket);
    GetSelectedItemsToAdd(socket);

  });
};
