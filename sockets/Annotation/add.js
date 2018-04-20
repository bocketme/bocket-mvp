const Workspace = require('../../models/Workspace');
const UserSchema = require('../../models/User');

module.exports = (io, socket) => {
    socket.on('[Annotation] - add', (annotation) => {
        const { currentWorkspace, userMail } = socket.handshake.session;
        Workspace
            .findById(currentWorkspace)
            .then(workspace => {
                workspace.Annotations.push({...annotation, creator: userMail });
                return workspace.save();
            })
            .then(({ Annotations }) => socket.emit('[Annotation] - getTheLastAnnotation', Annotations[Annotations.length - 1]))
            .catch(err => {
                console.error(err);
                socket.emit('Error', 'The annotation was not created');
            })
    });
}