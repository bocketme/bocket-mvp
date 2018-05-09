const mongoose = require('./connect');
const Workspace = require('../../models/Workspace');

async function changeWorkspaceTeam() {
  const workspaces = await Workspace.find({});

  console.log('Should find workspaces:', workspaces !== null)

  for (let i = 0; i < workspaces.length; i++) {
    let workspace = workspaces[i];
    console.log('Start reworking workspace:', workspace.name);

    console.log("Deleting unnecessary variable");
    workspace.owner = null
    workspace.users = null
    workspace.team = null
  }
  return 0
}

Promise.resolve(changeWorkspaceTeam())
  .then((res) => process.exit(res))

async function nodeMaster(workspace) {
  if (!workspace.node_master)
    return console.log("Workspace : No node Master")
  const nodeMaster = await nodeSchema.findById(workspace.node_master._id)
  if (!nodeMaster)
    return console.log("Workspace : Node Master Incorrect - Skipping attachement");
  workspace.nodeMaster = nodeMaster._id
  console.log("Node Master: done changing the node");
  return workspace;
}
