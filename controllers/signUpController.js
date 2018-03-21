const escape = require('escape-html');
const ModelsMaker = require('../models/utils/create/ModelsMaker');
const nodeMasterConfig = require('../config/nodeMaster');
const log = require('../utils/log');
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
const asyncForEach = require('../utils/asyncForeach');

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
    createAccount(req, res)
      .catch(() => {return res.status(400).send('Bad Request')});
  }
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
  const { completeName } = body;
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

async function errorIncreationAccount(err, documentsToDelete) {
  log.error(err);
  asyncForEach(documentsToDelete, async (document) => {
    await document.remove().catch((error) => { log.fatal('Document not Existing \n', error); });
  });
}
async function createAccount(req, res) {
  const documents = [];
  try {
    const user = await UserSchema.create({
      completeName: req.body.completeName,
      password: req.body.password,
      email: req.body.email,
      workspaces: [],
      organizations: [],
    });

    await user.save();
    documents.push(user);

    const nestedUser = {
      _id: user._id,
      completeName: user.completeName,
      email: user.email,
    };

    const organization = await OrganizationSchema.create({
      owner: nestedUser,
      members: [nestedUser],
      name: req.body.organizationName,
    });

    await organization.save();
    documents.push(organization);

    const team = await TeamSchema.create({
      owners: [nestedUser],
      members: [nestedUser],
    });

    await team.save();
    documents.push(team);

    const workspace = await WorkspaceSchema.create({
      name: req.body.workspaceName,
      owner: nestedUser,
      organization: {
        _id: organization._id,
        name: organization.name,
      },
      team: {
        _id: team._id,
        owners: team.owners,
        members: team.members,
        consults: team.consults,
      },
    });

    await workspace.save();
    documents.push();

    if (req.body.invitationUid) {
      const invitationInfo = await acceptInvitation(req.body.invitationUid, user);
      req.session = signInUserSession(req.session, {
        email: user.email,
      });
      req.session.completeName = user.completeName;
      req.session.currentWorkspace = invitationInfo.workspaceId;
      return res.redirect(`/project/${invitationInfo.workspaceId}`);
    }
    // Normal Signin desactivated.
    if (!req.body.admin)
      throw new Error('Sign In - Desactivated');

    user.workspaces.push({
      _id: workspace._id,
      name: workspace.name,
    });

    await user.save();

    const assembly = await AssemblySchema.create({
      name: req.body.workspaceName,
      description: nodeMasterConfig.description,
      ownerOrganization: {
        _id: organization._id,
        name: organization.name,
      },
      creator: nestedUser,
    });

    await assembly.save();
    documents.push(assembly);

    const node = await NodeSchema.create({
      name: req.body.workspaceName,
      description: nodeMasterConfig.description,
      type: NodeTypeEnum.assembly,
      content: assembly._id,
      Users: [nestedUser],
      owners: [nestedUser],
      team: {
        _id: team._id,
        owners: team.owners,
        members: team.members,
        consults: team.consults,
      },
      Workspaces: [{
        _id: workspace._id,
        name: workspace.name,
      }],
    });

    await node.save();
    documents.push(node);

    workspace.node_master = node;
    await workspace.save();

    organization.workspaces.push({
      _id: workspace._id,
      name: workspace.name,
    });
    await organization.save();

    assembly.whereUsed.push(node._id);
    await assembly.save();

    req.session = signInUserSession(req.session, { email: user.email });
    req.session.completeName = user.completeName;
    req.session.currentWorkspace = workspace._id;
    return res.redirect(`/project/${workspace._id}`);
  } catch (err) {
    errorIncreationAccount(err, documents);
    throw err;
  }
}

module.exports = signUpController;
