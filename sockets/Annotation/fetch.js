const Workspace = require('../../models/Workspace');

module.exports = (io, socket) => {
    socket.on('[Annotation] - fetch', (annotation) => {
        Workspace
            .findById(socket.handshake.session.currentWorkspace)
            .populate('Annotations.creator', '')
            .then(({ Annotations }) => {
                socket.emit('[Annotation] - fetch', Annotations, annotation ? false : true)
            });
    });
    socket.on('[Annotation] - fetchByName', (annotation = null) => {
        Workspace
            .findById(socket.handshake.session.currentWorkspace)
            .then(({ Annotations }) => {
                let result = Annotations;
                if (annotation) {
                    result = Annotations
                        .filter(nestedAnnotation => nestedAnnotation.name === annotation.name);
                }
                socket.emit('[Annotation] - fetchByName', result);
            });
    });
};
