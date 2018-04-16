const nodeSchema = require('../models/Node');
const partSchema = require('../models/Part');
const workspaceSchema = require('../models/Workspace');
const nodeTypeEnum = require('../enum/NodeTypeEnum');
const fs = require('fs');
const path = require('path');
const PartFileSystem = require('../config/PartFileSystem')
const config = require('../config/server');
const log = require('../utils/log');
const streamOptions = {
  flags: 'r',
  encoding: null,
  mode: 0o666,
  autoClose: true,
};

const loading = {
  on: {
    start: "[Viewer] - Start Workspace",
    save: "[Viewer] - Save",
    cancel: "[Viewer] - Cancel",
    file: "[Viewer] - File",
    update: "[Viewer] - Update",
    part: {
      get: "[Viewer] - Get Part",
      post: "[Viewer] - Post Part",
    }
  },
  emit: {
    updateMatrix: '[Viewer] - Update Matrix',
    cancel: "[Viewer] - Cancel",
    assembly: "[Viewer] - Add Assmbly",
    start: "[Viewer] - Start Loading",
    delete: '[Viewer] - Delete',
    pending: "[Viewer] - Stream",
    end: "[Viewer] - End Loading",
    use: "[Viewer] - Add Existing",
    error: "[Viewer] - Error Loading"
  }
};

function errLog(err) {
  log.error(err)
}

class File3DManager {
  constructor(socket) {
    this.socket = socket;
    this.callbacks = [];
    this.lock = false;
    this.read = null
  }

  /**
   * cancel a File
   * @param {any} workspaceId 
   * @memberof File3DManager
   */
  async cancel(workspaceId) {
    let nodes = await nodeSchema.find({
      'Workspaces._id': workspaceId
    });
    nodes.forEach(node => {
      this.socket.emit(loading.emit.updateMatrix, node._id, node.matrix);
    });
  }

  async update(nodeId) {
    let node = await nodeSchema.findOne({
      "children._id": nodeId
    });
    this.loadNode(nodeId, node);
  }

  async loadWorkspace(workspaceId) {
    let workspace = await workspaceSchema.findById(workspaceId).catch(errLog);
    let start = await this.loadNode(workspace.node_master._id, workspace).catch(errLog);
  }

  /**
   * load a Node
   * @param {Number} nodeId 
   * @param {Object} parent 
   * @memberof File3DManager
   */
  async loadNode(nodeId, parent) {
    const node = await nodeSchema.findById(nodeId);
    log.info("Chargement : " + nodeId);
    let content;
    console.log(node._id)

    if (node.type === nodeTypeEnum.assembly) {
      this.socket.emit(loading.emit.assembly, nodeId, node.matrix, parent._id);
      let promises = [];
      node.children.forEach((child)=> {
        promises.push(this.loadNode(child._id, {
          name: node.name,
          _id: node._id
        }));
      });

      await Promise.all(promises)
        .then(this.socket.emit(() => loading.emit.end, node._id))
        .catch(errLog);

    } else if (node.type === nodeTypeEnum.part) {
      this.askFiles(node._id, node.name, node.matrix, parent._id)
    }
  }

  /**
   * Load a file
   * @param {Object} node 
   * @memberof File3DManager
   */
  async loadPart(node, parent) {
    let part = await partSchema.findById(node.content).catch(errLog);
  }

  /**
   * Save a file
   * @param {String} workspaceId 
   * @param {String} nodeId 
   * @param {Array} matrix 
   * @memberof File3DManager
   */
  save(workspaceId, nodeId, matrix) {
    nodeSchema.findById(nodeId)
      .then(node => {
        node.matrix = matrix;
        node.save();
      });
  }

  /**
   * Stream a file
   * @param {any} node 
   * @param {any} file 
   * @memberof File3DManager
   */
  askFiles(nodeId, ...args) {
    log.info('askfiles')
    this.socket.emit(loading.emit.start, nodeId, ...args);
  }
}

module.exports = (io, socket) => {
  // Fonction de requête pour le chargement des fichiers
  const file3DManager = new File3DManager(socket);

  socket.on(loading.on.start, (workspaceId) => file3DManager.loadWorkspace(workspaceId))

  socket.on(loading.on.save, (workspaceId, nodeId, matrix) => file3DManager.save(workspaceId, nodeId, matrix));

  socket.on(loading.on.update, (nodeId, token) => {
    file3DManager.socket = io.to(socket.handshake.session.currentWorkspace);
    file3DManager.update(nodeId).then(() => file3DManager.socket = socket);
  });

  socket.on(loading.on.save, (workspaceId, nodeId, matrix) => {
    file3DManager.save(workspaceId, nodeId, matrix);
  });

  socket.on(loading.on.cancel, () => {
    file3DManager.cancel(socket.handshake.session.currentWorkspace);
  });
};

function promisifyReadFile(chemin) {
  return (new Promise((resolve, reject) => {
    fs.readFile(chemin, 'utf8', (err, data) => {
      if (err)
        reject(err);
      log.info("File found at : ", chemin);
      resolve(data);
    })
  }));
}

function promisifyReaddir(chemin) {
  return (new Promise((resolve, reject) => {
    fs.readdir(chemin, (err, files) => {
      if (err)
        reject(err);
      resolve(files);
    })
  }))
}
