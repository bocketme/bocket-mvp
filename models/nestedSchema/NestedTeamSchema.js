const mongoose = require('mongoose');
const NestedUser = require('./NestedUserSchema');

const NestedTeamSchema = new mongoose.Schema({
  _id: { type: mongoose.SchemaTypes.ObjectId, required: true },
  owners: { type: [NestedUser], default: [] },
  members: { type: [NestedUser], default: [] },
  consults: { type: [NestedUser], default: [] },
});


module.exports = NestedTeamSchema;
