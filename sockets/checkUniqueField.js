/* DEFAULT EMITTERS */
let internalErrorEmitter = require("./emitter/internalErrorEmitter");

/* MODELS */
let User = require("../models/User");

let listenerName = "checkUniqueField";

module.exports = function (socket) {
    socket.on(listenerName, (modelName, fieldName, value) => {
        console.log("LISTENER = ", modelName, fieldName, value);
        let model = require("../models/" + modelName);
        if (model === undefined)
        {
            internalErrorEmitter(socket);
            return ;
        }
        let query = {};
        query[fieldName] = value;
        model.findOne(query)
            .then(result => {
                console.log("Result = ", result);
                if (result !== null)
                    socket.emit("uniqueFieldAlreadyUsed");
                else
                    socket.emit("uniqueFieldNotUsed", );
            })
            .catch(err => {
                console.log("checkUniqueField :", err);
                internalErrorEmitter(socket);
            });
    });
};