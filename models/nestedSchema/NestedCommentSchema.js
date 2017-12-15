const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const NestedFile = require("./NestedFile");

let Commentaire = new mongoose.Schema({
    type: {type: String, required: true},
    content: { type: String, required: true },
    date: { type: Date, default: new Date() },
    author: {type: String, required: true },
    files: {type: [NestedFile], default:[]}
});

Commentaire.plugin(uniqueValidator);

module.exports = Commentaire;