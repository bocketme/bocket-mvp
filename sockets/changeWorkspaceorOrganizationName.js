const listenerName = 'changeWorkspaceOrOrganizationName';
const User = require('../models/User');
const Organization = require('../modals/Organization');
const Workspace = require('../modals/Workspace');

async function changeInformation(session, { type, id = null, newName }) {
  const user = await User.findOne({ email: session.userMail });

  if (!user) return { error: 'Unknown user' };

  let dataToCHange;
  switch(type) {
    case 'workspace':
    const dataToCHange = await Organization.findOne({'workspaces._id': session.currentWorkspace});
    dataToCHange.name = newName;

    await dataToCHange.save();
    break;

    case 'organization':
    const dataToCHange = await Workspace.findById(session.currentWorkspace);
    dataToCHange.name = newName;
    
    await dataToCHange.save();
    break;
    
    default :
    return null
    break;
  }
  if (type == 'workspace'){

  } else if(type == '') {

  }


  return { };
}

module.exports = (socket) => {
  socket.on(listenerName, (data) => {
    changeInformation(socket.handshake.session, data)
      .then(result => socket.emit(listenerName, result))
      .catch((err) => {
        socket.emit(listenerName, { error: 'Internal Server Error, please try again' });
        console.log('changePassword error:', err);
      });
  });
};
