let betaRegistrationListener = require("./betaRegistrationSListener");
let checkUniqueField = require("./checkUniqueField");
let signinListener = require("./signinListener");
let newNodeListener = require("./newNodeListener");
let NodeInformationListener = require("./nodeInformationListener");
let contentInformationListener = require('./contentInformationListener');
let searchNodeChildren = require('./searchNodeChildren');
let nodeViewer = require('./nodeViewer');
let converter = require('./converter');
let newActivityComment = require('./newActivityCommentListener');
let getActivities = require("./getActivitiesListener");
let addCommentListener = require("./addCommentToActivityListener");
let joinWorkspaceListener = require("./joinWorkspaceListener");
let leaveWorkspaceListener = require("./leaveWorkspaceListener");
let invitePeopleListener = require("./invitePeopleListener");

module.exports = function(io) {
    io.on('connection', function (socket) {
        // Signin / Signup
        betaRegistrationListener(socket);
        checkUniqueField(socket);
        signinListener(socket);
        
        // Get/Add informatoin
        contentInformationListener(socket);
        getActivities(socket);
        newActivityComment(socket);
        addCommentListener(socket);

        // Node Information
        NodeInformationListener(socket);
        searchNodeChildren(socket);
        converter(io, socket);
        nodeViewer(socket);        
        newNodeListener(socket);        
        
        // Socket Management
        invitePeopleListener(socket);
        joinWorkspaceListener(io, socket);
        leaveWorkspaceListener(io, socket);
    });
};