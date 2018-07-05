const mongoose = require('mongoose');

const NestWorkspaceSchema = new mongoose.Schema({
  _id: { type: mongoose.SchemaTypes.ObjectId, required: true },
  name: { type: String, required: true },
});

module.exports = NestWorkspaceSchema;
