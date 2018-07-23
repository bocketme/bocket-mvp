/**
 * YOU MUST BUILD THE DIRECTORY
 */
const path =              require('path');
const data =              path.resolve("./.data");
const files3D =           path.join(data, "files");
const avatar =            path.join(data, "avatar");
const tmp =               path.join(data, "tmp");

module.exports = {
  port: "8080",
  protocol: "http",
  url: "bocket.me" + this.port,
  mongoDB: "mongodb://localhost:27017/bocketmemvp",
  saltRounds: 10,
  data: data,
  files3D: files3D,
  avatar: avatar,
  tmp: tmp,
  secretSession: "kdjqskdjkqsjdsjqdklqsjdkjziooajdiazjdskjdqklsjdjaziodjsqjdlj",
  secretKey: "Bocket make a new World of Possibilities",
  fullUrl: 'https://bocket.me',
};
