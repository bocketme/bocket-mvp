const UserSchema = require('../../models/User'),
    serverConfig = require('../../config/server'),
    fs = require('fs'),
    path = require('path');

let userImage = (req, res) => {
    UserSchema.findById(req.params.userId)
        .then((user) => {
            if(!user)
                res.status(404).send("Not Found");

            fs.readFile(path.join(serverConfig.avatar, user.photo), (err, image) => {
                if (err){
                    console.log(err);
                    res.status(500).send("Intern Error")
                }
                else {
                    res.type('image/png');
                    res.send(image);
                }

            });
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