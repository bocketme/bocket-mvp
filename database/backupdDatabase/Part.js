const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const uniqueValidator = require('mongoose-unique-validator');

const configServer = require('../config/server');
const TypeEnum = require('../enum/NodeTypeEnum');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const NestedComment = require('./nestedSchema/NestedActivitySchema');
const NestedUser = require('./nestedSchema/NestedUserSchema');
const PartFileSystem = require('../config/PartFileSystem');

const log = require('../utils/log');

const NestedOrganization = mongoose.Schema({
  _id: { type: mongoose.SchemaTypes.ObjectId, require: true },
  name: { type: String, require: true },
});

const PartSchema = mongoose.Schema({
  name: { type: String, require: true },
  description: { type: String, default: 'No description aviable' },

  path: String,
  pathVersion: { type: Number, default: 1 },
  maturity: { type: String, default: TypeEnum.maturity[0] },
  ownerOrganization: { type: NestedOrganization, require: true },
  quality: { type: Number, default: 0 },
  tags: { type: [], default: [] },
  creator: { type: NestedUser, require: true },
  annotation: { type: [NestedAnnotation], default: [] },
  activities: { type: [NestedComment], default: [] },

  optionViewer: {
    activateCellShading: { type: Boolean, default: false },
  }

  // owners: {type: [nestedOwners], default: []}
});

let Part = mongoose.model('Part', PartSchema, 'Parts');

module.exports = Part;
