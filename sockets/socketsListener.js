let betaRegistrationListener = require("./betaRegistrationSListener");

module.exports = function(io) {
    io.on('connection', function (socket) {
        betaRegistrationListener(socket);
    });
};