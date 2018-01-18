let project = require('../../models/project'),
Workspace = require("../../models/Workspace"),
User = require("../../models/User");

let get = {
    index : (req, res) => {
        let workspaceId = req.params.workspaceId;
        getRenderInformation(workspaceId, req.session.userMail, "Last Updates")
        .then(context => res.render("hub", context))
        .catch(err => {
            if (err == 400 || err == 500)
                res.sendStatus(err);
            else
                res.redirect(err);
        });
    },
    last_updates : (req, res) => {
        let workspaceId = req.params.workspaceId;
        getRenderInformation(workspaceId, req.session.userMail, "Last Updates")
        .then(context => res.render("hub", context))
        .catch(err => {
            if (err == 400 || err == 500)
                res.sendStatus(err);
            else
                res.redirect(err);
        });
    },
    duplicates : (req, res) => {
        let workspaceId = req.params.workspaceId;
        getRenderInformation(workspaceId, req.session.userMail, "Last Updates")
        .then(context => res.render("hub", context))
        .catch(err => {
            if (err == 400 || err == 500)
                res.sendStatus(err);
            else
                res.redirect(err);
        });
    },
    indexredirect : (req, res) => {
         console.log(req.body);
        if (!req.body.email || !req.body.password || !req.body.workspaceId) {
            console.log("Nice try");
            res.redirect("/");
            return ;
        }
        if (!req.session.userMail) {
            console.log("User n'a pas de session");
            User.findOne({email: req.body.email})
                .then(result => {
                    result.comparePassword(req.body.password, (err, isMatch) => {
                        if (err) {
                            console.log("[projectController.indexPOST] :", err);
                            res.sendStatus(500);
                        }
                        else if (!isMatch) {
                            console.log("result not matches !");
                            res.redirect("/sigin");
                        }
                        else {
                            req.session.userMail = result.email;
                            res.redirect(req.originalUrl + "/" + req.body.workspaceId);
                        }
                    });
                })
                .catch(err => {
                    console.log("[projectController.indexPOST] : ", err);
                });
        }
        else {
            console.log("User a une session");
            res.redirect(req.originalUrl + "/" + req.body.workspaceId);
        }
    }
}

function getRenderInformation(workspaceId, userMail, title) {
    //console.log("getRenderInformation", workspaceId, userMail);
    return new Promise((resolve, reject) => {
        Workspace.findById({_id: workspaceId})
            .then(workspace => {
                if (workspace !== null)
                {
                    User.findOne({email: userMail})
                        .then(user => {
                            if (user !== null)
                            {
                                console.log("RESOLVE");
                                resolve({
                                    title: workspace.name + ' - ' + title,
                                    in_use: {name: workspace.name, id: workspace._id},
                                    data_header: 'All Parts',
                                    user: user.completeName,
                                    workspaces: user.workspaces,
                                    node: JSON.stringify(workspace.node_master),
                                    all_parts: 100,
                                    last_updates: 10,
                                    duplicates: 35
                                });
                            }
                            else
                                console.log("[projectController.indexPOST] : ", "User not found");
                                reject("/signin")
                        })
                        .catch(err => {
                            console.log("[projectController.indexPOST] :", err);
                            reject(500);
                        });
                }
                else {
                    console.log("[projectController.indexPOST] : ", "Workspace not found1");
                    reject(404);
                }
            })
            .catch(err => {
                if (err.name === "CastError") // Workspace not found
                {
                    console.log("[projectController.indexPOST] : ", "Workspace not found2");
                    reject(404);
                }
                else {
                    console.log("[projectController.indexPOST] : ", err);
                    reject(500);
                }
            });
    });
}

function countNode(node_master) {

}

module.exports = get;
