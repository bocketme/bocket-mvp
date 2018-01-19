let Invitation = require("../../models/Invitation");
let Organisation = require("../../models/Organization");
let Workspace = require("../../models/Workspace");

let invitationError = { code: 1, message: "Invalid Invitation"};
let internalError = {code: 2, message: "Internal Error"};

/**
 * Accept the Invitation
 * @param invitationUid : {String}
 * @param user : {Mongoose}
 * @return {Promise}
 */
function acceptInvitation(invitationUid, user) {
    return new Promise((resolve, rej) => {
        let invitation = null;
        Invitation.findOne({uid: invitationUid})
            .then(inv => {
                if (inv === null) rej();
                invitation = inv;
                return updateUser(inv, user)
            })
            .then(res => updateWorkspace(res.workspace, res.user))
            .then((workspaceId) => {
                resolve({workspaceId: workspaceId});
                invitation.remove();
            })
            .catch(err => {
                rej(err);
            });
    });
}

function updateUser(inv, user) {
    return new Promise((res, rej) => {
        if (inv === null) rej(invitationError);
        user.workspaces.push({_id: inv.workspace.id, name: inv.workspace.name});
        user.organizations.push({_id: inv.organization.id, name: inv.organization.name});
        user.save()
            .then(() => {
                Workspace.findOne({_id: inv.workspace.id})
                    .then(w => {
                        console.log("w =", w);
                        res({workspace: w, user})
                    })
                    .catch(err => rej(err));
            })
            .catch(err => rej(err));
    });
}

function updateWorkspace(workspace, user) {
    return new Promise((res, rej) => {
        console.log("workspace = ", workspace);
        workspace.users.push({_id: user._id, completeName: user.completeName, email: user.email});
        workspace.save()
            .then((w) => res(w._id))
            .catch(err => rej(err));
    });
}

module.exports = acceptInvitation;