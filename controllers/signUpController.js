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
const asyncForEach = require('../utils/asyncForeach');

const signUpController = {

  //TODO: FAILLE XSS

  index (req, res) {
    const tasks = [
      checkEmail,
      checkPassword,
      checkCompleteName,
      checkOrganizationName,
      checkWorkspaceName,
    ];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i](req.body) === false) {
        log.error(`Error occured on signing up user on task[${i}]`);
        return res.redirect('/');
      }
    }
    createAccount(req, res)
      .catch(() => { return res.status(400).send('Bad Request') });
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

function checkOrganizationName (body) {
  body.organizationName = escape(body.organizationName);
  return basicCheck(body.organizationName, organizationNameInfo);
}

function checkCompleteName (body) {
  const regex = /[A-Za-z/-]+ [A-Za-z/-]+/;
  const { completeName } = body;
  body.completeName = escape(body.completeName);
  return basicCheck(completeName, completeNameInfo) && regex.test(completeName);
}

function checkWorkspaceName (body) {
  if (!body.workspaceName) return true;
  body.workspaceName = escape(body.workspaceName);
  return basicCheck(body.workspaceName, workspaceNameInfo);
}

function checkPassword (body) {
  body.password = escape(body.password);
  return basicCheck(body.password, passwordInfo);
}

function checkEmail (body) {
  body.email = escape(body.email);
  return basicCheck(body.email, emailInfo);
}

function basicCheck (parameter, parameterInfo) {
  return parameter !== undefined && parameter !== '' && parameter.length >= parameterInfo.minlength;
}

async function errorIncreationAccount (err, documentsToDelete) {
  log.error(err);
  asyncForEach(documentsToDelete, async (document) => {
    await document.remove().catch((error) => { log.fatal('Document not Existing \n', error); });
  });
}
async function createAccount (req, res) {
  const documents = [];
  try {
    // Normal Signin desactivated.
    if (!req.body.admin && !req.body.invitationUid)
      throw new Error('Sign In - Desactivated');

    const user = await UserSchema.create({
      completeName: req.body.completeName,
      password: req.body.password,
      email: req.body.email,
    });

    await user.save();
    documents.push(user);

    const organization = await OrganizationSchema.create({
      Owner: user._id,
      name: req.body.organizationName,
    });

    await organization.save();
    documents.push(organization);

    console.log(organization);



    if (req.body.invitationUid) {
      user.Manager.push({
        Organization: organization._id,
        Workspaces: []
      });

      await user.save();

      const invitationInfo = await acceptInvitation(req.body.invitationUid, user);
      req.session.email = user.email;
      req.session.completeName = user.completeName;
      req.session.currentWorkspace = invitationInfo.workspaceId;
      req.session.currentOrganization = invitationInfo.organizationId;
      return res.redirect(invitationInfo.url);
    }


    const workspace = await WorkspaceSchema.create({
      name: req.body.workspaceName,
      Organization: organization._id,
      ProductManagers: [user._id],
    });

    await workspace.save();
    documents.push(workspace);

    user.Manager.push({
      Organization: organization._id,
      Workspaces: [workspace._id]
    });

    await user.save();


    const assembly = await AssemblySchema.create({
      name: req.body.workspaceName,
      description: nodeMasterConfig.description,
      Organization: organization._id,
    });

    await assembly.save();
    documents.push(assembly);

    const node = await NodeSchema.create({
      name: req.body.workspaceName,
      description: nodeMasterConfig.description,
      type: NodeTypeEnum.assembly,
      content: assembly._id,
      Workspace: workspace._id
    });

    await node.save();
    documents.push(node);

    workspace.nodeMaster = node._id;
    await workspace.save();

    organization.Workspaces.push(workspace._id);
    await organization.save();

    await assembly.save();

    req.session.email = user.email;
    req.session.completeName = user.completeName;
    req.session.currentWorkspace = workspace._id;
    return res.redirect(`/workspace/${workspace._id}`);
  } catch (err) {
    log.error(err);
    await errorIncreationAccount(err, documents);
    throw err;
  }
}

module.exports = signUpController;
