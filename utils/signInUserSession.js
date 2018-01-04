/**
 * Save all important data in the user's session
 * @param session
 * @param data : { email : String }
 * @returns {session}
 */
function signInUserSession(session, data) {
    console.log("signInUserSession1 : ", session, data);
    session.userMail = data.email;
    console.log("signInUserSession2 : ", session);
    console.log("__________________________________");
    return session;
}

module.exports = signInUserSession;
