let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");

const userSchema = require('./User');
const nodeSchema = require('./Node');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const Schema = mongoose.Schema
const co = require('co');
let WorkspaceSchema = new mongoose.Schema({
  //General Information
  name: { type: String, require: true },
  description: String,

  //Node Master of the product
  nodeMaster: { type: Schema.Types.ObjectId, ref: 'Node' },

  //Team
  ProductManagers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  Teammates: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  Observers: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  //Organization who own the workspace
  Organization: { type: Schema.Types.ObjectId, required: true, ref: 'Organization' },

  //Creation
  creation: { type: Date, default: new Date() },

  //Annotation
  Annotations: { type: [NestedAnnotation], required: true, default: [] }
});

// TODO: DELETE ALL users attribute (workspace.users)

/*
WorkspaceSchema.virtual('users').get(() => co(yield function() {
  const {Owner, Admin} = organizationSchema.findById()
  return [Owner, ...Admin, ...this.owner, ...this.ProductManagers, ...this.Teammates, ...this.Observers]
}))
*/
WorkspaceSchema.pre('remove', async function () {
  //Delete the user inside the workspace
  const users = [...this.observers, this.Teammates, this.ProductManagers];

  for (let i = 0; i < users.length; i++) {
    const userId = users[i];
    const user = await userSchema.findById(userId);

    const indice = user.OrganizationManager.find(({ _id }) => String(_id) === String(this.Organization));
    const workpsaces = user.OrganizationManager[indice].workspaces.filter(workspaceId => String(workspaceId) !== String(this._id));
    user.OrganizationManager[indice].workspaces = workpsaces;
    await user.save();
  }

  //Delete the nodeMaster
  const nodeMaster = await nodeSchema.findById(this.nodeMaster);
  nodeMaster.remove();

});

/**
 *
 *
 * @param {any} WorkspaceInformation
 */
WorkspaceSchema.statics.newDocument = (WorkspaceInformation) => {
  return new Workspace(WorkspaceInformation);
};

let Workspace = mongoose.model("Workspace", WorkspaceSchema, "Workspaces");

module.exports = Workspace;
