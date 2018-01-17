/**
 * YOU MUST BUILD THE DIRECTORY
 */
let path = require('path');

module.exports = {
    port: "8080",
    protocol: "http",
    mongoDB: "mongodb://localhost/bocketmemvp",
    saltRounds: 10,
    files3D: path.resolve("./data/files3D"),
    avatar: path.resolve("./data/avatar"),
    //TODO Change the specFile path - Waiting Meeting
    specfiles: path.resolve("../spec"),
    secretSession: "kdjqskdjkqsjdsjqdklqsjdkjziooajdiazjdskjdqklsjdjaziodjsqjdlj",
    secretKey: "Why you're always lying ? Why you're always lying ?",
};