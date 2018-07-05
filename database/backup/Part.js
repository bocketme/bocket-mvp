const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TypeEnum = require('../../enum/NodeTypeEnum');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const NestedComment = require('./nestedSchema/NestedActivitySchema');

const NestedOrganization = mongoose.Schema({
  _id: { type: Schema.Types.ObjectId, require: true },
  name: { type: String, require: true },
});

const PartSchema = mongoose.Schema({
  name: { type: String, require: true },
  description: { type: String, default: 'No description aviable' },

  path: String,
  pathVersion: { type: Number, default: 1 },
  maturity: { type: String, default: TypeEnum.maturity[0] },
  quality: { type: Number, default: 0 },
  tags: { type: [], default: [] },
  ownerOrganization: { type: NestedOrganization },
  //TODO: Script to fill the data
  Creator: { type: Schema.Types.ObjectId, ref: 'User' },
  creator: { type: NestedUser },

  annotation: { type: [NestedAnnotation], default: [] },
  activities: { type: [NestedComment], default: [] },

  optionViewer: {
    activateCellShading: { type: Boolean, default: false },
  },

  Organization: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Organization' }
});

let Part = mongoose.model('Part', PartSchema, 'Parts');

module.exports = Part;
