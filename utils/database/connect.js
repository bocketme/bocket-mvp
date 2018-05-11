const mongoose = require('mongoose');
const config = require('../../config/server')
mongoose.Promise = Promise;
let mongoDB = config.mongoDB;
mongoose.connect(mongoDB);

let db = mongoose.connection;

db.on('error', 
console.error.bind(console, 'MongoDB connection error:')
);

module.exports = mongoose;
