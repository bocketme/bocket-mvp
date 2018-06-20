const organizationSchema = require('../models/Organization');
const workspaceSchema = require('../models/Workspace');
const userSchema = require('../models/User');
const assemblySchema = require('../models/Assembly');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const nodeSchema = require('../models/Node');
const querystring = require('querystring');
const log = require('../utils/log');

module.exports = {
  index: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    req.session.currentWorkspace = null;
    log.info(req.session)
    renderOrganization(organizationId, userId)
      .then(params => res.render('organizationSettings/organization', params))
      .catch(err => {
        log.error(err);
        res.redirect('/');
      });
  },
  workspaces: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    req.session.currentWorkspace = null;

    renderWorkspaces(organizationId, userId)
      .then(params => res.render('organizationSettings/workspaces', params))
      .catch(err => {
        log.error(err);
        res.redirect('/');
      })
  },
  members: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    req.session.currentWorkspace = null;

    renderMembers(organizationId, userId)
      .then(params => res.render('organizationSettings/members', params))
      .catch(err => {
        log.error(err);
        res.redirect('/');
      })
  },
  deleteOrganization: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    organizationSchema.findById(organizationId)
      .then(async (organization) => {
        if (!organization)
          throw new Error('Cannot find the Organization');

        const owner = String(organization.Owner);
        const userid = String(userId);
        if (owner === userid)
          await organization.remove();

        return '/'
      })
      .then(link => {
        res.status(200).send();
      })
      .catch(err => {
        log.error(err);
        res.status(500).send(err);
      });
  },
  leaveOrganization: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
  },
  createWorkspace: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    createNewWorkspace(organizationId, req.body, userId)
      .then(() => {
        res.redirect(`/organization/${organizationId}/workspaces`);
      }).catch((err) => {
        log.error(err);
        res.redirect(`/organization/${organizationId}/workspaces`);
      })
  },
  changeInformation: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    const { organizationName } = req.body;
    changeNameOrganization(organizationId, userId, organizationName)
      .then(() => {
        res.redirect(`/organization/${organizationId}`);
      })
      .catch(() => {
        res.redirect(`/organization/${organizationId}`);
      });
  },
};

async function createNewWorkspace(organizationId, body, userId) {
  const organization = await organizationSchema.findById(organizationId);
  if (!organization) throw new Error('Cannot find the organization');

  const userAsking = await userSchema.findById(userId)
  if (!userAsking) throw new Error('Cannot find the user');

  if (!(organization.isAdmin(userAsking._id) || organization.isOwner(userAsking._id)))
    throw new Error('The user has no right');

  const productManager = await userSchema.findById(body.productManager);
  if (!productManager) throw new Error('Cannot find the user');

  const assembly = await assemblySchema.create({
    name: body.workspaceName,
    Organization: organization._id,
  });

  const nodeMaster = await nodeSchema.create({
    name: body.workspaceName,
    Organization: organization._id,
    type: NodeTypeEnum.assembly,
    content: assembly._id,
  });

  const workspace = await workspaceSchema.create({
    name: body.workspaceName,
    Organization: organizationId,
    nodeMaster: nodeMaster._id,
  });
  await workspace.save();

  await workspace.addProductManager(productManager._id);

  nodeMaster.Workspace = workspace._id;
  await nodeMaster.save();

  organization.Workspaces.push(workspace._id);
  await organization.save();
}

async function renderOrganization(organizationId, userId) {

  const user = await userSchema
    .findById(userId)
    .populate('Manager.Organization')
    .populate('Manager.Workspaces')
    .exec();

  if (!user) throw new Error('[Organizaiton Manager] - Cannot find the user');

  const organization = await organizationSchema
    .findById(organizationId)
    .populate('Workspaces')
    .populate('Owner', 'completeName')
    .populate('Admins', 'completeName')
    .populate('Members', 'completeName')
    .exec();

  if (!organization) throw new Error('[Organization Manager] - Cannot Find the organization');

  const rights = organization.userRights(userId);

  const index = user.Manager.findIndex(manager => {
    const res = String(manager.Organization._id) === String(organizationId);
    return res
  });

  if (index === -1) throw new Error('Cannot find the organization');

  let listOrganizations = user.Manager.map(({ Organization }) => Organization);
  listOrganizations = listOrganizations.filter(({ _id }) => !_id.equals(organizationId));
  return {
    currentOrganization: organization,
    OrganizationUsers: organization.users,
    userWorkspaces: user.Manager[index].Workspaces,
    userOrganizations: listOrganizations,
    currentUser: {
      completeName: user.completeName,
      _id: user._id,
      email: user.email,
      rights: rights
    },
  }
}

async function renderWorkspaces(organizationId, userId) {

  const organization = await organizationSchema
    .findById(organizationId)
    .populate('Owner')
    .populate('Admins')
    .populate('Members')
    .populate('Workspaces')
    .populate({
      path: 'Workspaces',
      populate: { path: 'ProductManagers', select: 'completeName' }
    })
    .populate({
      path: 'Workspaces',
      populate: { path: 'Observers', select: 'completeName' }
    })
    .populate({
      path: 'Workspaces',
      populate: { path: 'Teammates', select: 'completeName' }
    })
    .exec();

  if (!organization) throw new Error('[Organization Manager] - Cannot Find the organization');
  const rights = organization.userRights(userId);

  const user = await userSchema
    .findById(userId)
    .populate('Manager.Organization')
    .populate('Manager.Workspaces')
    .populate({
      path: 'Manager.Workspaces',
      populate: { path: 'ProductManagers', select: 'completeName' }
    })
    .populate({
      path: 'Manager.Workspaces',
      populate: { path: 'Teammates', select: 'completeName' }
    })
    .populate({
      path: 'Manager.Workspaces',
      populate: { path: 'Observers', select: 'completeName' }
    })
    .exec()
    .catch(err => log.error(err));

  if (!user) throw new Error('[Organizaiton Manager] - Cannot find the user');

  const managerOrganization = user.get('Manager');

  const index = user.Manager.findIndex(manager => {
    const res = String(manager.Organization._id) === String(organizationId);
    return res
  });

  if (index === -1) throw new Error('Cannot find the organization');

  let workspaces = rights > 4 ? organization.Workspaces : user.Manager[index].Workspaces;
  function isWorkspaceManager(workspace) {
    function even(manager) {
      return manager._id.equals(user._id)
    }
    workspace.isProductManager = workspace.ProductManagers.some(even);
    return workspace;
  }

  workspaces = workspaces.map(isWorkspaceManager);

  let listOrganizations = user.Manager.map(({ Organization }) => Organization);
  listOrganizations = listOrganizations.filter(({ _id }) => !_id.equals(organizationId));

  return {
    currentOrganization: organization,
    OrganizationUsers: organization.users,
    userOrganizations: listOrganizations,
    userWorkspaces: user.Manager[index].Workspaces,
    workspaces: workspaces,
    workspace: workspaces[0],
    currentUser: {
      completeName: user.completeName,
      _id: user._id,
      email: user.email,
      rights: rights
    }
  }
}

async function renderMembers(organizationId, userId) {
  const organization = await organizationSchema
    .findById(organizationId)
    .populate('Owner')
    .populate('Admins')
    .populate('Workspaces')
    .populate('Members')
    .exec();

  const rights = organization.userRights(userId);

  if (!organization) throw new Error('[Organization Manager] - Cannot Find the organization');

  const user = await userSchema
    .findById(userId)
    .populate('Manager.Organization')
    .populate('Manager.Workspaces')
    .exec();

  if (!user) throw new Error('[Organizaiton Manager] - Cannot find the user');

  const index = user.Manager.findIndex(manager => {
    const res = String(manager.Organization._id) === String(organizationId);
    return res
  });

  if (index === -1) throw new Error('Cannot find the organization');

  let listOrganizations = user.Manager.map(({ Organization }) => Organization);
  listOrganizations = listOrganizations.filter(({ _id }) => !_id.equals(organizationId));

  return {
    currentOrganization: organization,
    OrganizationUsers: organization.users,
    userWorkspaces: user.Manager[index].Workspaces,
    userOrganizations: listOrganizations,
    currentUser: {
      completeName: user.completeName,
      _id: user._id,
      email: user.email,
      rights: rights
    }
  }
}

async function changeNameOrganization(organizationId, userId, newName) {
  const organization = await organizationSchema.findById(organizationId);

  const isOwner = organization.isOwner(userId)
  const isAdmin = organization.isAdmin(userId)

  if (isOwner || isAdmin) {
    organization.name = newName;
    await organization.save();
  } else throw new Error('You have no rights');
}
