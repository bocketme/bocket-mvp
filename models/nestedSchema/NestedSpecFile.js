const mongoose = require('mongoose');

const NestedSpecFiles = mongoose.Schema({
  name: { type: String, require: true },
  format: { type: String, require: true },
  path: { type: String, require: true },
  created: { type: Date, default: new Date() },
  modified: { type: Date, default: new Date() },
});

module.exports = NestedSpecFiles;
