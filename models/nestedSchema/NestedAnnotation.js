const mongoose = require('mongoose');
const {Schema} = mongoose;

const NestedAnnotation = mongoose.Schema({
  worldPosition: [],
  name: { type: String, require: true },
  title: { type: String, require: true },
  content: { type: String, require: true },
  // creator: { type: String, ref: 'User.email' },
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: new Date() },
  posLocalAnnotObject: [],
  relatedObjectid: { type: String, require: true },
  isImportant: Boolean,
});

module.exports = NestedAnnotation;
