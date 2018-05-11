const organizationSchema = require('../models/Organization');
const workspaceSchema = require('../models/Workspace');
const userSchema = require('../models/User');

module.exports = {
  index: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    renderOrganization(organizationId, userId)
    .then(params => res.render('organizationSettings/organization', params))
    .catch(err => console.error(err) && res.redirect('/'))
  },
  workspaces: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    renderWorkspaces(organizationId, userId)
    .then(params => res.render('organizationSettings/workspaces', params))
    .catch(err => console.error(err) && res.redirect('/'))
  },
  members: (req, res) => {
    const { organizationId } = req.params;
    const { userId } = req.session;
    renderMembers(organizationId, userId)
    .then(params => res.render('organizationSettings/members', params))
    .catch(err => console.error(err) && res.redirect('/'))
  }
};

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
    .exec();

  if(!user) throw new Error('[Organizaiton Manager] - Cannot find the user');

  console.log(organization.users);

  return {
    currentOrganization: organization,
    OrganizationUsers: organization.users,
    userOrganizations: user.Organization.filter(({_id}) => String(_id._id) !== organizationId),
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

  const rights = organization.findUserRights(userId);

  if (!organization) throw new Error('[Organization Manager] - Cannot Find the organization');

  const user = await userSchema
    .findById(userId)
    .populate('Organization._id')
    .populate('Organization.workspaces')
    .exec()
    .catch(err => {
      console.log(err);
    });

  if (!user) throw new Error('[Organizaiton Manager] - Cannot find the user');

  const managerOrganization = user.get('Organization');

  const index = managerOrganization.findIndex(orga => {
    const res = String(orga._id._id) === String(organizationId);
    return res;
  });

  return {
    currentOrganization: organization,
    OrganizationUsers: organization.users,
    userOrganizations: user.Organization,
    workspaces: rights > 4 ? organization.Workspaces : user.Organization[index].workspaces,
    user: {
      completeName: user.completeName,
      _id: user._id,
      email: user.email,
      rights: rights
    }
  }
}

async function renderMembers(OrganizationId, userId) {
  const organization = await organizationSchema
    .findById(OrganizationId)
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
    .exec();

  if(!user) throw new Error('[Organizaiton Manager] - Cannot find the user');


  return {
    currentOrganization: organization,
    OrganizationUsers: organization.users,
    userOrganizations: user.Organization,
    user: {
      completeName: user.completeName,
      _id: user._id,
      email: user.email,
      rights: rights
    }
  }
}