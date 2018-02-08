let betaRegistrationListener = require("./betaRegistrationSListener");
let checkUniqueField = require("./checkUniqueField");
let signinListener = require("./signinListener");
let newNodeListener = require("./newNodeListener");
let NodeInformationListener = require("./nodeInformationListener");
let contentInformationListener = require('./contentInformationListener');
let searchNodeChildren = require('./searchNodeChildren');
let nodeViewer = require('./nodeViewer');
let newActivityComment = require('./newActivityCommentListener');
let getActivities = require("./getActivitiesListener");
let addCommentListener = require("./addCommentToActivityListener");
let joinWorkspaceListener = require("./joinWorkspaceListener");
let leaveWorkspaceListener = require("./leaveWorkspaceListener");
let invitePeopleListener = require("./invitePeopleListener");
let fileUploaderListener = require('./fileUploaderListener');

module.exports = function(io) {
  io.on('connection', function (socket) {
    fileUploaderListener(socket);
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
  });
};