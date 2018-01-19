let invitePeople = "invitePeople";
const validateEmail = require("../utils/validate/validateEmail");
const validateCompleteName = require("../utils/validate/validateCompleteName");
const Invitation = require("../models/Invitation");
const Workspace = require("../models/Workspace");

/**
 * InvitePeopleListener
 * @param workspaceId : {string}
 * @param data : { [{}] }
 */
function invitePeopleListener(workspaceId, author, data) {
    if (!data.length) return ;

    console.log("WorkspaceId :", workspaceId);
    Workspace.findById(workspaceId)
        .then(workspace => {
            let people = checkData(data);
            if (people.length && people.length > 0) {
                for (let i = 0 ; i < people.length ; i++) {
                    console.log("people = ", people);
                    let invitation = new Invitation({workspace : {id: workspaceId, name: workspace.name}, organization: {id : workspace.organization._id, name: workspace.organization.name}, people: people[i], author: author});
                    invitation.save(invitation)
                        .then(i => console.log("Invitation saved", i))
                        .catch(err => console.log("error :", err));
                }
            }
        })
        .catch(err => console.log(invitePeople, "error:", err));
}

function checkData(data) {
    let ret = [];
    for (let i = 0 ; i < data.length ; i++) {
        console.log("data[i] = ", data[i]);
        if (validateEmail(data[i].email))
            ret.push(data[i]);
    }
    return ret;
}

module.exports = (socket) => {
    socket.on(invitePeople, (data) => {
        console.log("data", data);
        invitePeopleListener(socket.handshake.session.currentWorkspace, socket.handshake.session.completeName, data)
    });
};
