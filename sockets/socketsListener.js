const betaRegistrationListener = require("./betaRegistrationSListener");
const checkUniqueField = require("./checkUniqueField");
const signinListener = require("./signinListener");
const newNodeListener = require("./newNodeListener");
const NodeInformationListener = require("./nodeInformationListener");
const contentInformationListener = require('./contentInformationListener');
const searchNodeChildren = require('./searchNodeChildren');
const nodeViewer = require('./nodeViewer');
const newActivityComment = require('./newActivityCommentListener');
const getActivities = require("./getActivitiesListener");
const addCommentListener = require("./addCommentToActivityListener");
const joinWorkspaceListener = require("./joinWorkspaceListener");
const leaveWorkspaceListener = require("./leaveWorkspaceListener");
const invitePeopleListener = require("./invitePeopleListener");
const deleteNodeListener = require("./deleteNodeListener");

module.exports = function(io) {
    io.on('connection', function (socket) {
        betaRegistrationListener(socket);
        checkUniqueField(socket);
        signinListener(socket);
        newNodeListener(socket);
        NodeInformationListener(socket);
        contentInformationListener(socket);
        searchNodeChildren(socket);
        nodeViewer(socket);
        newActivityComment(socket, io);
        getActivities(socket);
        addCommentListener(socket, io);
        invitePeopleListener(socket);
        joinWorkspaceListener(io, socket);
        leaveWorkspaceListener(io, socket);
        deleteNodeListener(socket);
    });
};