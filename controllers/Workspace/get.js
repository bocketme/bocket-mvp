let workspaceSchema = require('../../models/Workspace');
let userSchema = require('../../models/User');
let nodeSchema = require('../../models/Node');
let Organization = require('../../models/Organization');
let fs = require('fs');
let NodeTypeEnum = require('../../enum/NodeTypeEnum');
let ViewTypeEnum = require('../../enum/ViewTypeEnum');
let path = require('path');
const log = require('../../utils/log');

const index = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { userMail } = req.session;

    const user = await userSchema.findOne({ email: userMail });

    await user.populate('Manager.Organization').populate('Manager.Workspaces', 'name').execPopulate();
    if (!user) throw new Error('[Workspace Controller] - Workspace not Found');

    const workspace = await workspaceSchema.findById(workspaceId);

    if (!workspace) throw new Error('[Workspace Controller] - Workspace not Found');

    const nodeMaster = await nodeSchema.findById(workspace.nodeMaster);
    if (!nodeMaster) throw new Error('[Workspace Controller] - Node Master Not Found');

    function findWorkspace({ Workspaces }) {
      function even({ _id }) {
        return _id.equals(workspaceId);
      }
      return Workspaces.some(even);
    }

    const Manager = user.Manager.find(findWorkspace);
    req.session.currentWorkspace = workspaceId;
    req.session.currentOrganization = workspace.Organization._id;

    const options = {
      currentOrganization: Manager.Organization,
      title: workspace.name,
      in_use: { name: workspace.name, id: workspace._id },
      user: user.completeName,
      workspaces: Manager.Workspaces,
      node: nodeMaster,
      optionViewer: user.options,

      /* Const for front end */
      NodeTypeEnum: JSON.stringify(NodeTypeEnum),
      ViewTypeEnum: JSON.stringify(ViewTypeEnum)
    };

    return res.render('hub', options);
  } catch (err) {
    log.error(err);
    if (req.session.currentOrganization) {
      res.redirect(`/organization/${req.session.currentOrganization}`);
    } else res.redirect('/signOut');
  }
};

const listOrganization = async function (req, res, next) {
  try {
    const organization = await Organization
      .findById(req.session.currentOrganization)
      .populate({ path: 'Owner', select: 'completeName' })
      .populate({ path: 'Admins', select: 'completeName' })
      .populate({ path: 'Members', select: 'completeName' });
    if (!organization) throw new Error('Cannot find the organization');
    const workspace = await workspaceSchema
      .findById(req.params.workspaceId);
    if (!organization) throw new Error('Cannot find the workspace');

    const organizationUsers = organization.users;
    const workspaceUsers = workspace.users;

    function filterOrganization({ _id }) {
      function someinWorkspace(id) {
        return _id.equals(id);
      }
      return !workspaceUsers.some(someinWorkspace)
    }
    const users = organizationUsers.filter(filterOrganization);
    res.render('socket/addOrganizationMember.twig', { users, workspaceId: req.params.workspaceId });
  } catch (e) {
    log.error(e);
    next(e);
  }
}

module.exports = { index, listOrganization }
