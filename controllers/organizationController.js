const organizationSchema = require('../models/Organization');
const workspaceSchema = require('../models/Workspace');
const userSchema = require('../models/User');
const assemblySchema = require('../models/Assembly');
const NodeTypeEnum = require('../enum/NodeTypeEnum');
const nodeSchema = require('../models/Node');

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
    createWorkspace(organizationId, req.body, userId)
      .then(() => {
        res.redirect(`organization/${organizationId}/workspaces`);
      }).catch((err) => {
        console.error(err);
        res.redirect('');
      })
  }
};

async function createWorkspace(organizationId, body, userId) {
  const organization = await organizationSchema.findById(organizationId);
  if (!organization) throw new Error('Cannot find the organization');

  const productManager = await userSchema.findById(body.workspaceManager);
  if (!productManager) throw new Error('Cannot find the user')

  const organizationManager = productManager.get('Organization');
  console.log(organizationManager);
  const index = organizationManager.findIndex(orga => {
    const id = String(orga._id);
    return id === organizationId;
  });

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

  if (!index && index !== -1) {
    productManager.Organization[index].workspaces.push(workspace._id);
  } else {
    productManager.Organization.push({
      _id: organizationId,
      workspaces: [workspace._id]
    });
  }
  console.log(productManager.Organization);
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

  const rights = organization.findUserRights(userId);

  if (!organization) throw new Error('[Organization Manager] - Cannot Find the organization');

  const user = await userSchema
    .findById(userId)
    .populate('Organization._id')
    .populate('Organization.workspaces')
    .exec();

  if (!user) throw new Error('[Organizaiton Manager] - Cannot find the user');

  const managerOrganization = user.get('Organization');

  const index = managerOrganization.findIndex(orga => {
    const res = String(orga._id._id) === String(organizationId);
    return res;
  });

  return {
    currentOrganization: organization,
    OrganizationUsers: organization.users,
    userWorkspaces: user.Organization[index].workspaces,
    userOrganizations: user.Organization.filter(({ _id }) => String(_id._id) !== organizationId),
    user: {
      completeName: user.completeName,
      _id: user._id,
      email: user.email,
      rights: rights
    }
  }
}

async function renderWorkspaces(organizationId, userId) {
  const organization = await organizationSchema
    .findById(organizationId)
    .populate('Owner')
    .populate('Workspaces')
    .populate('Admins')
    .populate('Members')
    .exec();

  if (!organization) throw new Error('[Organization Manager] - Cannot Find the organization');
  const rights = organization.findUserRights(userId);

  const user = await userSchema
    .findById(userId)
    .populate('Organization._id')
    .populate('Organization.workspaces')
    .exec()
    .catch(err => console.error(err));

  if (!user) throw new Error('[Organizaiton Manager] - Cannot find the user');

  const managerOrganization = user.get('Organization');

  const index = managerOrganization.findIndex(orga => {
    const res = String(orga._id._id) === String(organizationId);
    return res;
  });

  const workspaces = rights > 4 ? organization.Workspaces : user.Organization[index].workspaces;

  console.log(workspaces);

  return {
    currentOrganization: organization,
    OrganizationUsers: organization.users,
    userWorkspaces: user.Organization[index].workspaces,
    userOrganizations: user.Organization,
    workspaces: workspaces,
    user: {
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

  const rights = organization.findUserRights(userId);

  if (!organization) throw new Error('[Organization Manager] - Cannot Find the organization');

  const user = await userSchema
    .findById(userId)
    .populate('Organization._id')
    .populate('Organization.workspaces')
    .exec();

  if (!user) throw new Error('[Organizaiton Manager] - Cannot find the user');

  const managerOrganization = user.get('Organization');

  const index = managerOrganization.findIndex(orga => {
    const res = String(orga._id._id) === String(organizationId);
    return res;
  });


  return {
    currentOrganization: organization,
    OrganizationUsers: organization.users,
    userWorkspaces: user.Organization[index].workspaces,  
    userOrganizations: user.Organization,
    user: {
      completeName: user.completeName,
      _id: user._id,
      email: user.email,
      rights: rights
    }
  }
}
