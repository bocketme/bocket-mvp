let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");

const userSchema = require('./User');
const nodeSchema = require('./Node');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const Schema = mongoose.Schema
let WorkspaceSchema = new mongoose.Schema({
  name: { type: String, require: true },
  description: String,
  // TODO: Script to fill the nodeMaster
  //node_master: { type: NestedNode },
  nodeMaster: { type: Schema.Types.ObjectId, ref: 'Node' },
  // TODO: Script to fill the Teamates //Tomorow
  ProductManagers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  Teammates: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  Observers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  // users: { type: [User], required: false, default: [] },
  // team: { type: NestedTeam, required: true },

  Organization: { type: Schema.Types.ObjectId, required: true, ref: 'Organization' },
  //organization: { type: Organization, required: true }, // /!\ WITHOUT END VARIABLE /!\

  creation: { type: Date, default: new Date() },
  Annotations: { type: [NestedAnnotation], required: true, default: [] }
});

// TODO: DELETE ALL users attribute (workspace.users)

WorkspaceSchema.pre('save', async function () {
  let observers = this.observers.filter(observer => {
    let users = [...this.Teammates, ...this.ProductManagers];
    for (let i = 0; i < users.length; i++) {
      if (String(observer._id) === String(users[i]._id)) return false
    }
    return true;
  });
  this.observers = observers;

  let Teammates = this.Teammates.filter(observer => {
    let users = [...this.ProductManagers];
    for (let i = 0; i < users.length; i++) {
      if (String(observer._id) === String(users[i]._id)) return false
    }
    return true;
  });

  this.Teammates = Teammates;
});

WorkspaceSchema.pre('remove', async function () {
  //Delete the user inside the workspace
  const users = [...this.observers, this.Teammates, this.ProductManagers];

  for (let i = 0; i < users.length; i++) {
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
