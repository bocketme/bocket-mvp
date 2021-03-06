const mongoose = require('mongoose');
const { Schema } = mongoose;

const NestedMessage = mongoose.Schema({
  content: { type: String, require: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: new Date() },
});

module.exports = NestedMessage;