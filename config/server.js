/**
 * YOU MUST BUILD THE DIRECTORY
 */

module.exports = {
    port: "8080",
    protocol: "http",
    url: "localhost:" + this.port,
    mongoDB: "mongodb://localhost/bocketmemvp",
    saltRounds: 10,
    tpm: require('path').resolve("../tpm"),
    gitfiles: require('path').resolve("../bocket"),
    avatar: require('path').resolve("../avatar"),
    specfiles: require('path').resolve("../spec"),
    secretSession: "kdjqskdjkqsjdsjqdklqsjdkjziooajdiazjdskjdqklsjdjaziodjsqjdlj",
    secretKey: "Why you're always lying ? Why you're always lying ?",
};