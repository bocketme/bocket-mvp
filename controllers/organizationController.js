const organizationSchema = require('../models/Organization');
const workspaceSchema = require('../models/Workspace');
const userSchema = require('../models/User');

module.exports = {
  index: (req, res) => {
    const { organizationId } = req.params;
    const { userMail } = req.session;
    renderOrganization(organizationId, userMail)
    .then(params => res.render('organizationSettings/organization', params))
    .catch(err => console.error(err) && res.redirect('/'))
  },
  workspaces: (req, res) => {
    const { organizationId } = req.params
    const { userMail } = req.session;
    renderOrganization(organizationId, userMail)
    .then(params => res.render('organizationSettings', params))
    .catch(err => console.error(err) && res.redirect('/'))
  },
  members: (req, res) => {
    const { organizationId } = req.params
    const { userMail } = req.session;
    renderOrganization(organizationId, userMail)
    .then(params => res.render('organizationSettings', params))
    .catch(err => console.error(err) && res.redirect('/'))
  }
}

async function renderOrganization(organizationId, userMail) {
  const organization = await organizationSchema.findOne({ _id:organizationId });

  if (!organization) throw new Error('Cannot Find the user inside the organization chosen');

  const user = await userSchema.findOne({email:userMail})

  const organizations = await organizationSchema.find({ "users.email": userMail })

  return {
    currentOrganization: organization,
    organizations: organizations.filter(({_id}) => String(_id) === String(organizationId)),
    user: {
      completeName: user.completeName,
      _id: user._id,
      email: user.email
    }
  }
}
