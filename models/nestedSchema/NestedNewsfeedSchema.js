const mongoose = require('mongoose');
const { Schema } = mongoose;

const NestedNewsfeed = mongoose.Schema({
  content: { type: Object, require: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: new Date() },
  type: { type: String, require: true }, // This is to define which newsfeed to show [UPDATE, MOVE, ANNOTATION, USER]
});

module.exports = NestedNewsfeed;