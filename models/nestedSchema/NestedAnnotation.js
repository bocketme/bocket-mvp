const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const NestedAnnotation = mongoose.Schema({
  title: String,
  data: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  position: [],
});

module.exports = NestedAnnotation;
