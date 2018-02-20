/**
 * YOU MUST BUILD THE DIRECTORY
 */
const path =              require('path');
const data =              path.resolve("./.data");
const files3D =           path.join(data, "files");
const avatar =            path.join(data, "avatar");

module.exports = {
  port: "8080",
  protocol: "http",
  url: "localhost:" + this.port,
  mongoDB: "mongodb://localhost/bocketmemvp",
  saltRounds: 10,
  data: data,
  files3D: files3D,
  avatar: avatar,
  secretSession: "kdjqskdjkqsjdsjqdklqsjdkjziooajdiazjdskjdqklsjdjaziodjsqjdlj",
  secretKey: "Bocket make a new World of Possibilities",
};