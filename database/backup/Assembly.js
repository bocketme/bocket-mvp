const mongoose = require('mongoose');
const TypeEnum = require('../../enum/NodeTypeEnum');
const NestedComment = require('./nestedSchema/NestedActivitySchema');
const NestedUser = require('./nestedSchema/NestedUserSchema');
const fs = require('fs');
const { Schema } = mongoose;

/**
 * Mongoose Schema for
 * @param {number} _id - The id of the nested organization
 * @param {string} name - The name of the organization
*/
const NestedOrganization = mongoose.Schema({
  _id: { type: mongoose.SchemaTypes.ObjectId, require: true },
  name: { type: String, require: true },
});

const AssemblyScheama = mongoose.Schema({
  name: { type: String, require: true, index: true },

  // TODO: Access To Assembly => Issue
  description: { type: String, default: 'No description aviable', index: true },
  path: { type: String },
  maturity: { type: String, default: TypeEnum.maturity[0] },
  ownerOrganization: { type: NestedOrganization },
  quality: { type: Number, default: 0 },
  //TODO: Script to fill the data
  Creator: { type: Schema.Types.ObjectId, ref: 'User' },
  creator: { type: NestedUser },

  // Update tags unused for the 1.0
  tags: { type: [], default: [] },

  activities: { type: [NestedComment], default: [] },
  Organization: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Organization' }
});

const Assembly = mongoose.model('Assembly', AssemblyScheama, 'Assemblies');

module.exports = Assembly;
