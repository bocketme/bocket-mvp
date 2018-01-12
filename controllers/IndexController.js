let Invitation = require('../models/Invitation');

let indexController = {

    index : function(req, res) {
        return res.render("index", {
        });
    },
    invitation : (req, res) => {
        Invitation.findOne({uid: req.params.invitationUid})
            .then(i => {
                console.log(i);
                if (!i || i === null) res.redirect("/");
                return res.render("index", {
                    invitation : true,
                    workspaceName : i.workspace.name,
                    completeName : i.people.completeName,
                });
            })
            .catch(() => res.send("Internal server error", 500));
    }
};

module.exports = indexController;