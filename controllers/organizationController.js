const organizationSchema = require('../models/Organization');
const workspaceSchema = require('../models/Workspace');
const userSchema = require('../models/User');
const assemblySchema = require('../models/Assembly');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const nodeSchema = require('../models/Node');
const querystring = require('querystring');

module.exports = {
  index: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    renderOrganization(organizationId, userId)
      .then(params => res.render('organizationSettings/organization', params))
      .catch(err => {
        console.error(err);
        res.redirect('/');
      })
  },
  workspaces: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    renderWorkspaces(organizationId, userId)
      .then(params => res.render('organizationSettings/workspaces', params))
      .catch(err => {
        console.error(err);
        res.redirect('/');
      })
  },
  members: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    renderMembers(organizationId, userId)
      .then(params => res.render('organizationSettings/members', params))
      .catch(err => {
        console.error(err);
        res.redirect('/');
      })
  },
  deleteOrganization: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    organizationSchema.findById(organizationId)
      .then((organization) => {
        if (!organization)
          throw new Error('Cannot find the Organization');

        const owner = String(organization.Owner);
        const user = String(userId);
        if (owner === user)
          return organization.remove();
      })
      .then(() => {
        res.redirect('/');
      })
      .catch(err => {
        console.error(err);
        res.redirect('/');
      });
  },
  createWorkspace: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    createNewWorkspace(organizationId, req.body, userId)
      .then(() => {
        res.redirect(`/organization/${organizationId}/workspaces`);
      }).catch((err) => {
        console.error(err);
        res.redirect('');
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

  const productManager = await userSchema.findById(userId);
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
    ProductManagers: [productManager._id],
    Organization: organizationId,
    nodeMaster: nodeMaster._id,
  });
  await workspace.save();

  nodeMaster.Workspace = workspace._id;
  await nodeMaster.save();

  productManager.addWorkspace(organizationId, workspace._id);
  await productManager.save();

  organization.Workspaces.push(workspace._id);
  await organization.save();
}

async function renderOrganization(organizationId, userId) {
  const organization = await organizationSchema
    .findById(organizationId)
    .populate('Workspaces')
    .populate('Owner', 'completeName')
    .populate('Admins', 'completeName')
    .populate('Members', 'completeName')
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

  let listOrganizations = user.Manager.map(({Organization}) => Organization);
  listOrganizations = listOrganizations.filter(({_id}) => !_id.equals(organizationId));
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
      path: 'Manager.workspaces',
      populate: { path: 'ProductManagers', select: 'completeName' }
    })
    .populate({
      path: 'Manager.workspaces',
      populate: { path: 'Teammates', select: 'completeName' }
    })
    .populate({
      path: 'Manager.workspaces',
      populate: { path: 'Observers', select: 'completeName' }
    })
    .exec()
    .catch(err => console.error(err));

  if (!user) throw new Error('[Organizaiton Manager] - Cannot find the user');

  const managerOrganization = user.get('Manager');

  const index = user.Manager.findIndex(manager => {
    const res = String(manager.Organization._id) === String(organizationId);
    return res
  });

  if (index === -1) throw new Error('Cannot find the organization');

  const workspaces = rights > 4 ? organization.Workspaces : user.Manager[index].Workspaces;

  let listOrganizations = user.Manager.map(({Organization}) => Organization);
  listOrganizations = listOrganizations.filter(({_id}) => !_id.equals(organizationId));

  return {
    currentOrganization: organization,
    OrganizationUsers: organization.users,
    userOrganizations: listOrganizations,
    workspaces: workspaces,
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

  let listOrganizations = user.Manager.map(({Organization}) => Organization);
  listOrganizations = listOrganizations.filter(({_id}) => !_id.equals(organizationId));

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
