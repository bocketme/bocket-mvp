/* DEFAULT EMITTERS */
let internalErrorEmitter = require("./emitter/internalErrorEmitter");

/* MODELS */
let User = require("../models/User");

let listenerName = "checkIfEmailAlreadyExist";

module.exports = function (socket) {
    socket.on(listenerName, (email) => {
        console.log("Email = " + email);
        User.findOne({"email" : email})
            .then(result => {
                if (result !== null)
                {
                    console.log("EMAIL DEJA PRIS");
                    socket.emit("takenEmail");
                }
                else
                {
                    console.log("EMAIL PAS PRIS");
                    socket.emit("emailNotTaken");
                }
            })
            .catch(err => {
                internalErrorEmitter(socket);
            });
        /*Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
            if (err) return handleError(err);
            console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
        })*/
    });
};