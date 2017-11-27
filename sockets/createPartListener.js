let escape = require('escape-html');
let internalErrorEmitter = require("./emitter/internalErrorEmitter");
let User = require("../models/User");
let Workspaces = require("../models/Workspace");

module.exports = (socket) => {

    socket.on("createPart", () => {

    });
};