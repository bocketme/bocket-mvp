let betaRegistrationListener = require("./betaRegistrationSListener");
let checkUniqueField = require("./checkUniqueField");
let signinListener = require("./signinListener");
let createPartListener = require("./createPartListener");
let newNodeListener = require("./newNodeListener");

module.exports = function(io) {
    io.on('connection', function (socket) {
        betaRegistrationListener(socket);
        checkUniqueField(socket);
        signinListener(socket);
        createPartListener(socket);
        newNodeListener(socket);
    });
};