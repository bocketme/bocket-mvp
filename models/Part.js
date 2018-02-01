const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const uniqueValidator = require('mongoose-unique-validator');

const configServer = require('../config/server');
const TypeEnum = require('../enum/NodeTypeEnum');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const NestedComment = require("./nestedSchema/NestedActivitySchema");
const PartFileSystem = require('../config/PartFileSystem');

let NestedOrganization = mongoose.Schema({
    _id: { type: mongoose.SchemaTypes.ObjectId, require: true },
    name: { type: String, require: true }
});

let PartSchema = mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String, default: "No description aviable" },

    path: String,
    maturity: { type: String, default: TypeEnum.maturity[0] },
    ownerOrganization: { type: NestedOrganization, require: true },
    quality: { type: Number, default: 0 },
    tags: { type: [], default: [] },
    annotation: { type: [NestedAnnotation], default: [] },
    activities: { type: [NestedComment], default: [] },

    //Date
    created: { type: Date, default: Date.now() },
    modified: { type: Date, default: Date.now() },
});

function createDirectories(partPath, lastPath) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path.join(partPath, lastPath), (err) => {
            if (err)
                reject(err);
            resolve();
        })
    })
}

PartSchema.post('save', function (next) {

});

PartSchema.pre('validate', function (next) {
    if (!this.path) {
        this.path = '/' + this.ownerOrganization.name + '/' + this.name + ' - ' + this._id;
        let partPath = path.join(configServer.files3D, this.path);
        fs.access(partPath, err => {
            if (!err)
                return next();
            fs.mkdir(partPath, (err) => {
                if (err)
                    return next(err);
                let i = 0,
                    directories = Object.values(PartFileSystem);
                let promises = [];
                directories.forEach(lastPath => {
                    promises.push(createDirectories(partPath, lastPath));
                });
                Promise.all(promises)
                    .then(() => {
                        return next();
                    })
                    .catch(err => {
                        return next(err);
                    })
            })
        })
    }
    return next();
});

PartSchema.pre('remove', function (next) {
    if (!this.path)
        next(new Error("The Part contains no path for the information"));

    let partPath = path.join(configServer.files3D, this.path);

    deleteDirPromise(partPath)
    .then(() => next());
});

async function deleteDirPromise(path) {
    try {
        let stat = await fs.stat(path);

        if (stat.isDirectory()) {
        
            let files = await fs.readdir(path);
        
            files.forEach(file => {
                deleteDirPromise(path.join(path, file))
                .catch(err => { throw err });
            });
        
            let deleteDir = await fs.rmdir(path);
            
            if (deleteDir instanceof Error)
                throw deleteDir;

        } else {
            let file = await fs.unlink(path);
            
            if (file instanceof Error)
                throw file;
        }

    } catch (err) {
        throw err
    }
}

PartSchema.statics.newDocument = (partInformation) => {
    return new Part(partInformation);
};

PartSchema.plugin(uniqueValidator);

let Part = mongoose.model("Part", PartSchema, "Parts");

module.exports = Part;