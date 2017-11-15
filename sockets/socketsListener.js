let betaRegistrationListener = require("./betaRegistrationSListener");
let checkEmailIfAlreadyExistListener = require("./checkEmailIfAlreadyExist");

module.exports = function(io) {
    io.on('connection', function (socket) {
        betaRegistrationListener(socket);
        checkEmailIfAlreadyExistListener(socket);
    });
};