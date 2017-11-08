let mongoose = require("mongoose");

let CommentaireSchema = new mongoose.Schema({
    content: { type: String, required: true },
    published: { type: Date, default: new Date() },
    author: {
        _id: { type: mongoose.SchemaTypes.ObjectId, required: true },
        name: { type: String, required: true },
    }
});

let IssueSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    resolved: { type: Boolean, default: false },
    Commentaire: CommentaireSchema
});

let ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    createdate: { type: Date, default: new Date() },
    Issue: [IssueSchema],
    // Catalogue:
    /*
    Stripe: {
        id_transaction: String
        value: number,
        validite: Boolean,
        name: { type: String, required: true },
    }
    */
});

module.exports = mongoose.model("Project", ProjectSchema, "Projects");;