const mongoose = require('mongoose');

const NestedOrganizationSchema = new mongoose.Schema({
  _id: { type: mongoose.SchemaTypes.ObjectId, required: true },
  name: { type: String, required: true },
});

module.exports = NestedOrganizationSchema;
