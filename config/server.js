/**
 * Created by jean-adriendomage on 26/10/2017.
 * 
 * YOU MUST BUILD THE DIRECTORY 
 */

module.exports = {
    port: "8080",
    protocol: "http",
    mongoDB: "mongodb://localhost/bocketmemvp",
    saltRounds: 10,
    photo: require('path').resolve("../photo"),
    gitfiles: require('path').resolve("../bocket"),
    avatar: require('path').resolve("../avatar"),
    secretSession: "kdjqskdjkqsjdsjqdklqsjdkjziooajdiazjdskjdqklsjdjaziodjsqjdlj"
};