let mongoose = require("mongoose");

let BetaEmailSchema = new mongoose.Schema({
    email : {type: String, required: true}
});

let BetaEmail = mongoose.model("BetaEmail", BetaEmailSchema, "BetaEmails");

module.exports = BetaEmail;