const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const NestedFile = new mongoose.Schema({
  path: { type: String, required: true },
  name: { type: String, required: true },
  format: { type: String, required: true },
});

NestedFile.plugin(uniqueValidator);

module.exports = NestedFile;
