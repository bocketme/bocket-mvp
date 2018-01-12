let invitePeople = "invitePeople";
const validateEmail = require("../../utils/validate/validateEmail");
const validateCompleteName = require("../../utils/validate/validateCompleteName");

/**
 * InvitePeopleListener
 * @param data : { { people : [{}] } }
 */
function invitePeopleListener(data) {
    if (!data.length) return ;
    let people = checkData(data);
    if (people.length && people > 0) {
        
    }
}

//* remove all index with invalid email or complete name
//* @param data : { { people : [{}] } }
function checkData(data) {
    let ret = [];
    for (let i = 0 ; data.length ; i++) {
        if (validateEmail(data.email) && (data.completeName === "" || validateCompleteName(data.completeName)))
            ret.push(data[i]);
    }
    return ret;
}

module.exports = (socket) => {
    socket.on(invitePeople, invitePeopleListener);
};
