const escape = require('escape-html');
const ModelsMaker = require('../models/utils/create/ModelsMaker');
const nodeMasterConfig = require('../config/nodeMaster');
const NodeSchema = require('../models/Node');
const Invitation = require('../models/Invitation');
const Workspace = require('../models/Workspace');
const AssemblySchema = require('../models/Assembly');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const OrganizationSchema = require('../models/Organization');
const UserSchema = require('../models/User');
const WorkspaceSchema = require('../models/Workspace');
const acceptInvitation = require('../utils/Invitations/acceptInvitation');
const signInUserSession = require('../utils/signInUserSession');
const TeamSchema = require('../models/Team');

const signUpController = {

  // TODO: FAILLE XSS

  index(req, res) {
    const tasks = [
      checkEmail,
      checkPassword,
      checkCompleteName,
      checkOrganizationName,
      checkWorkspaceName,
    ];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i](req.body) === false) {
        console.log(`Error occured on signing up user on task[${i}]`);
        return res.redirect('/');
      }
    }
    const Documents = {};

    const user = UserSchema.newDocument({
      completeName: req.body.completeName,
      password: req.body.password,
      email: req.body.email,
      workspaces: [],
      organizations: [],
    });

    user.save()
      .then((newUser) => {
        console.log(Documents.user);
        Documents.user = newUser;
        const organization = OrganizationSchema.newDocument({
          owner: {
            _id: Documents.user._id,
            completeName: Documents.user.completeName,
            email: Documents.user.email,
          },
          members: [{
            _id: Documents.user._id,
            completeName: Documents.user.completeName,
            email: Documents.user.email,
          }],
          name: req.body.organizationName,
        });
        return organization.save();
      })
      .then((newOrga) => {
        console.log('new Organization is created', newOrga);
        Documents.organization = newOrga;
        console.log('Orga a ecrire dans user', `${Documents.organization._id}-${Documents.organization.name}`);
        Documents.user.organizations.push({
          _id: Documents.organization._id,
          name: Documents.organization.name
        });
        return Documents.user.save();
      })
      .then((UserUpdate) => {
        Documents.user = UserUpdate;
        console.log('user courant :', Documents.user);
        const team = TeamSchema.newDocument({
          owners: [{
            _id: Documents.user._id,
            completeName: Documents.user.completeName,
            email: Documents.user.email,
          }],
          members: [{
            _id: Documents.user._id,
            completeName: Documents.user.completeName,
            email: Documents.user.email,
          }],
          //   consults: [{}],
        });
        return team.save();
      })

      .then((newTeam) => {
        console.log('\n\nnew team has been add', newTeam);
        Documents.team = newTeam;
        const workspace = WorkspaceSchema.newDocument({
          name: req.body.workspaceName,
          owner: {
            _id: Documents.user._id,
            completeName: Documents.user.completeName,
            email: Documents.user.email,
          },
          organization: {
            _id: Documents.organization._id,
            name: Documents.organization.name,
          },
          team: {
            _id: Documents.team._id,
            owners: Documents.team.owners,
            members: Documents.team.members,
            consults: Documents.team.consults,
          },
        });


        if (req.body.invitationUid) {
          console.log('INVITATION');
          acceptInvitation(req.body.invitationUid, Documents.user)
            .then((invitationInfo) => {
              req.session = signInUserSession(req.session, {
                email: user.email
              });
              req.session.completeName = Documents.user.completeName;
              req.session.currentWorkspace = invitationInfo.workspaceId;
              res.redirect(`/project/${invitationInfo.workspaceId}`);
            })
            .catch((err) => {
              console.log(err);
              newOrga.remove();
              newUser.remove();
            });
          return Promise.reject('Invitation');
        }
        return workspace.save();
      })
      .then((newWorkspace) => {
        console.log('\n\nnew workspace has been add \n', newWorkspace);
        Documents.workspace = newWorkspace;
        Documents.user.workspaces.push({
          _id: Documents.workspace._id,
          name: Documents.workspace.name
        });
        // TODO: Documents.user.organizations
        return Documents.user.save();
      })
      .then(() => {
        const assembly = AssemblySchema.newDocument({
          name: req.body.workspaceName,

          description: nodeMasterConfig.description,
          ownerOrganization: {
            _id: Documents.organization._id,
            name: Documents.organization.name,
          },
          creator: {
            _id: Documents.user._id,
            completeName: Documents.user.completeName,
            email: Documents.user.email,
          },
        });
        return assembly.save();
      })
      .then((newAssembly) => {
        Documents.assembly = newAssembly;
        console.log('\n\nnew assembly has been add \n', Documents.assembly);
        const node = NodeSchema.newDocument({
          name: req.body.workspaceName,
          description: nodeMasterConfig.description,
          type: NodeTypeEnum.assembly,
          content: Documents.assembly._id,
          Users: [{
            _id: Documents.user._id,
            completeName: Documents.user.completeName,
            email: Documents.user.email,
          }],
          owners: [{
            _id: Documents.user._id,
            completeName: Documents.user.completeName,
            email: Documents.user.email,
          }],
          team: {
            _id: Documents.team._id,
            owners: Documents.team.owners,
            members: Documents.team.members,
            consults: Documents.team.consults,
          },
          Workspaces: [{
            "_id": Documents.workspace._id,
            "name": Documents.workspace.name
          }],
        });
        return node.save();
      })
      .then((nodeMaster) => {
        console.log('\n\nnew node has been add \n', nodeMaster);
        Documents.node = nodeMaster;
        Documents.workspace.node_master = nodeMaster;
        return Documents.workspace.save();
      })
      .then(() => {
        Documents.organization.workspaces.push({
          _id: Documents.workspace._id,
          name: Documents.workspace.name,
        });
        return Documents.organization.save();
      })
      .then(() => {
        Documents.assembly.whereUsed.push(Documents.node._id);
        return Documents.assembly.save();
      })
      .then(() => {
        req.session = signInUserSession(req.session, {
          email: Documents.user.email
        });
        req.session.completeName = Documents.user.completeName;
        req.session.currentWorkspace = Documents.workspace._id;
        res.redirect(`/project/${Documents.workspace._id}`);
      })
      .catch((err) => {
        if (err === 'Invitation') return;
        console.error(new Error(`[Sign up Controller] -  erreur \n${err}`));
        Object.values(Documents).forEach((Documents) => {
          if (Documents) {
            Documents.remove();
          }
        });
        res.status(400).send('Bad request');
      });
  },
};

const passwordInfo = {
  minlength: 6,
};

const emailInfo = {
  minlength: 4,
};

const organizationNameInfo = {
  minlength: 1,
};

const completeNameInfo = {
  minlength: 3,
};

const workspaceNameInfo = {
  minlength: 1,
};

function checkOrganizationName(body) {
  body.organizationName = escape(body.organizationName);
  return basicCheck(body.organizationName, organizationNameInfo);
}

function checkCompleteName(body) {
  const regex = /[A-Za-z/-]+ [A-Za-z/-]+/;
  const completeName = body.completeName;
  console.log('COMPLETENAME =', completeName);
  body.completeName = escape(body.completeName);
  return basicCheck(completeName, completeNameInfo) && regex.test(completeName);
}

function checkWorkspaceName(body) {
  body.workspaceName = escape(body.workspaceName);
  return basicCheck(body.workspaceName, workspaceNameInfo);
}

function checkPassword(body) {
  body.password = escape(body.password);
  return basicCheck(body.password, passwordInfo);
}

function checkEmail(body) {
  console.log('Email:', body.email);
  body.email = escape(body.email);
  return basicCheck(body.email, emailInfo);
}

function basicCheck(parameter, parameterInfo) {
  return parameter !== undefined && parameter !== '' && parameter.length >= parameterInfo.minlength;
}

module.exports = signUpController;