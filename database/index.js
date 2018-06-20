const mongoose = require('mongoose');
const { mongoDB } = require('../config/server'); // SERVER CONFIGURATION
const log = require('../utils/log');

mongoose.Promise = Promise;
// Set up default mongoose connection
mongoose.connect(mongoDB);

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', log.error.bind(console, 'MongoDB connection error:'));


const corrector = require('./corrector');
const co = require('co');
co(corrector())
  .then(() => mongoose.connection.close())
.catch(err => {
  log.error(err);
  mongoose.connection.close()
});
