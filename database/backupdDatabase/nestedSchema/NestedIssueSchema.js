const mongoose = require('mongoose');

const NestedCommentaireSchema = require('./NestedActivitySchema');

const Issue = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  Commentaires: { type: [NestedCommentaireSchema], default: [] },
});

module.export = Issue;
