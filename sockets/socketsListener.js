let betaRegistrationListener = require("./betaRegistrationSListener");
let checkUniqueField = require("./checkUniqueField");
let signinListener = require("./signinListener");
let importInsideNode = require("./importInsideNode");
let newNodeListener = require("./newNodeListener");
let NodeInformationListener = require("./nodeInformationListener");

module.exports = function(io) {
    io.on('connection', function (socket) {
        betaRegistrationListener(socket);
        checkUniqueField(socket);
        signinListener(socket);
        importInsideNode(socket);
        newNodeListener(socket);
        NodeInformationListener(socket);
    });
};