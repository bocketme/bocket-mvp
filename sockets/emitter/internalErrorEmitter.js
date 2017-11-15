const emitterName = "internalError";

module.exports = function (socket) {
    let internalError = {
        title: "Internal error !",
        desc: "Please, try again."
    };
    socket.emit(emitterName, internalError);
};