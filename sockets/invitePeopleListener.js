let invitePeople = "invitePeople";
const validateEmail = require("../utils/validate/validateEmail");
const validateCompleteName = require("../utils/validate/validateCompleteName");
const Invitation = require("../models/Invitation");

/**
 * InvitePeopleListener
 * @param workspaceId : {string}
 * @param data : { [{}] }
 */
function invitePeopleListener(workspaceId, data) {
    if (!data.length) return ;
    let people = checkData(data);
    if (people.length && people.length > 0) {
        console.log("workspaceid:", workspaceId)
        let invitation = new Invitation({workspaceId : workspaceId, people: people});
        invitation.save(invitation)
            .then(i => console.log("Invitation saved", i))
            .catch(err => console.log("error :", err));
    }
}

function checkData(data) {
    let ret = [];
    for (let i = 0 ; i < data.length ; i++) {
        console.log("data[i] = ", data[i]);
        if (!validateCompleteName(data[i].completeName))
            data[i].completeName = "";
        if (validateEmail(data[i].email))
            ret.push(data[i]);
    }
    return ret;
}

module.exports = (socket) => {
    socket.on(invitePeople, (data) => {
        console.log("data", data);
        invitePeopleListener(socket.handshake.session.currentWorkspace, data)
    });
};
