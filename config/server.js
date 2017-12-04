/**
 * YOU MUST BUILD THE DIRECTORY
 */

module.exports = {
    port: "8080",
    protocol: "http",
    mongoDB: "mongodb://localhost/bocketmemvp",
    saltRounds: 10,
    gitfiles: require('path').resolve("../bocket"),
    avatar: require('path').resolve("../avatar"),
    specfiles: require('path').resolve("../spec"),
    secretSession: "kdjqskdjkqsjdsjqdklqsjdkjziooajdiazjdskjdqklsjdjaziodjsqjdlj"
};