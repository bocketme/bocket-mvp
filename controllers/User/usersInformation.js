const UserSchema = require('../../models/User'),
    serverConfig = require('../../config/server'),
    fs = require('fs'),
    path = require('path');

let userImage = (req, res) => {
    UserSchema.findById(req.params.userId)
        .then(userSelect => {
            if(!userSelect)
                res.status(404).send("Not Found");
            else
                res.sendFile(path.join(serverConfig.avatar, userSelect.photo));
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Intern Error")
        })
};

let get = {
    userImage: userImage,
};

module.exports= get;