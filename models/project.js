const mongoose = require("mongoose");
const NestedIssueSchema = require('./nestedSchema/NestedIssueSchema');

/**
 * Warning
 */


let ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    createdate: { type: Date, default: new Date() },
    Issue: [NestedIssueSchema],
});

module.exports = mongoose.model("Project", ProjectSchema, "Projects");;