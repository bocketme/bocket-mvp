const mongoose = require('mongoose');

let Commentaire = new mongoose.Schema({
    content: { type: String, required: true },
    published: { type: Date, default: new Date() },
    author: {
        _id: { type: mongoose.SchemaTypes.ObjectId, required: true },
        name: { type: String, required: true },
    }
});

module.exports = Commentaire;