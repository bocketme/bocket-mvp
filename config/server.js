/**
 * YOU MUST BUILD THE DIRECTORY
 */
let path = require('path');

module.exports = {
    port: "8080",
    protocol: "http",
    url: "localhost:" + this.port,
    mongoDB: "mongodb://localhost/bocketmemvp",
    saltRounds: 10,
    files3D: path.resolve("./data/files3D"),
    avatar: path.resolve("./data/avatar"),
    secretSession: "kdjqskdjkqsjdsjqdklqsjdkjziooajdiazjdskjdqklsjdjaziodjsqjdlj",
    secretKey: "Bocket make a new World of Possibilities",
};