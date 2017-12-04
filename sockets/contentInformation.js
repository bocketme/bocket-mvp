let Node = require("../models/Node");
let escape = require("escape-html");
let fs = require("fs");
let path = require("path");
let configServer = require("../config/server");

//Je pense que je vais le fusionner avec nodeInformation
module.exports = function (socket) {
    socket.on("contentInformation", (type, contentID) => {

    });
}