const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const NestedAnnotation = mongoose.Schema({
  worldPosition: [],
  name: { type: String, require: true },
  title: { type: String, require: true },
  content: { type: String, require: true },
  creator: { type: String, ref: 'User.email' },
  date: { type: Date, default: new Date() },
  posLocalAnnotObject: [],
  relatedObjectid: { type: String, require: true },
  isImportant: Boolean
});

module.exports = NestedAnnotation;
