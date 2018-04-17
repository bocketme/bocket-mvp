const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const NestedAnnotation = mongoose.Schema({
  worldPosition: [],
  name: String,
  title: String,
  data: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  posLocalAnnotObject: [],
  relatedObjectId: Number
});

module.exports = NestedAnnotation;
