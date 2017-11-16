let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");
let bcrypt = require("bcrypt");

let NestedWorkspaceSchema = require("./nestedSchema/NesttedWorkspaceSchema");
let NestedUserSchema = require('./nestedSchema/NestedUserSchema');
let NestedOrganizationSchema = require('./nestedSchema/NestedOrganizationSchema');

let UserSchema = new mongoose.Schema({
    completeName: {type: String, required: true},
    email: {type: String, required: true, index: { unique: true }},
    password: {type: String, required: true},
    active: Boolean,
    createDate: Date,
    workspaces: { type : [NestedWorkspaceSchema]},
    organizations: {type: [NestedOrganizationSchema]}
});

UserSchema.pre('save', function(next) {
    let user = this;

    user.active = true;
    user.createDate = new Date();
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(serverConfiguration.saltRounds, function(err, salt) {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

let User = mongoose.model("User", UserSchema, "Users");

module.exports = User;
