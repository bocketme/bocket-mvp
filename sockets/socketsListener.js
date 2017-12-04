let betaRegistrationListener = require("./betaRegistrationSListener");
let checkUniqueField = require("./checkUniqueField");
let signinListener = require("./signinListener");
let createPartListener = require("./createPartListener");
let newNodeListener = require("./newNodeListener");
let NodeInformationListener = require("./nodeInformationListener");

module.exports = function(io) {
    io.on('connection', function (socket) {
        betaRegistrationListener(socket);
        checkUniqueField(socket);
        signinListener(socket);
        createPartListener(socket);
        newNodeListener(socket);
        NodeInformationListener(socket);
    });
};