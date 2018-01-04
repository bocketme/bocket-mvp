let betaRegistrationListener = require("./betaRegistrationSListener");
let checkUniqueField = require("./checkUniqueField");
let signinListener = require("./signinListener");
let importInsideNode = require("./importInsideNode");
let newNodeListener = require("./newNodeListener");
let NodeInformationListener = require("./nodeInformationListener");
let contentInformationListener = require('./contentInformationListener');
let searchNodeChildren = require('./searchNodeChildren');
let nodeViewer = require('./nodeViewer');
let newActivityComment = require('./newActivityCommentListener');
let getActivities = require("./getActivitiesListener");
let addCommentListener = require("./addCommentToActivityListener");

module.exports = function(io) {
    io.on('connection', function (socket) {
        betaRegistrationListener(socket);
        checkUniqueField(socket);
        signinListener(socket);
        importInsideNode(socket);
        newNodeListener(socket);
        NodeInformationListener(socket);
        searchNodeChildren(socket);
        nodeViewer(socket);
        newActivityComment(socket);
        getActivities(socket);
        addCommentListener(socket);
    });
};