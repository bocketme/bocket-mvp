const mongoose = require('mongoose');

const Node = new mongoose.Schema({
  _id: { type: mongoose.SchemaTypes.ObjectId, require: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
});

module.exports = Node;
