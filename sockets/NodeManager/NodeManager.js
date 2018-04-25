const nodeSchema = require('../../models/Node');
const partSchema = require('../../models/Part');
const workspaceSchema = require('../../models/Workspace');
const nodeTypeEnum = require('../../enum/NodeTypeEnum');
const fs = require('fs');
const path = require('path');
const PartFileSystem = require('../../config/PartFileSystem');
const config = require('../../config/server');
const log = require('../../utils/log');
const EventEmitter = require('events')
const loading = require('./Interface');
const errLog = (err) => log.error(err)

/**
 * 
 */
module.exports = class NodeManager {
  /**
   * Creates an instance of NodeManager.
   */
  constructor () {
    this.nodeEmitter = new EventEmitter();
  }

  emitPartForEveryOne(cb) {
    this.nodeEmitter.on('emitPartForEveryOne', cb);
  }

  emitAssemblyForEveryOne(cb) {
    this.nodeEmitter.on('emitAssemblyForEveryOne', cb);
  }

  emitAssembly(cb) {
    this.nodeEmitter.on(loading.emit.assembly, cb)
  }

  emitPart(cb) {
    this.nodeEmitter.on(loading.emit.part, cb)
  }

  emitUpdateMatrix(cb) {
    this.nodeEmitter.on(loading.emit.updateMatrix, cb)
  }

  async cancel(workspaceId) {
    let nodes = await nodeSchema.find({ 'Workspaces._id': workspaceId });
    nodes.forEach(node => this.nodeEmitter.emit(loading.emit.updateMatrix, node._id, node.matrix));
  }

  async save(workspaceId, nodeId, matrix) {
    const node = await nodeSchema.findById(nodeId);
    node.matrix = matrix;
    await node.save();
  }

  async update(nodeId) {
    let node = await nodeSchema.findOne({
      "children._id": nodeId
    }).catch(errLog);
    await this.loadNode(nodeId, node, true);
    return null
  }

  async loadWorkspace(workspaceId) {
    const { _id, name, node_master } = await workspaceSchema.findById(workspaceId).catch(errLog);
    const start = await this.loadNode(node_master._id, _id).catch(errLog);
    return start
  }

  async loadNode(nodeId, parent, everyone) {

    const emitPart = everyone ? 'emitPartForEveryOne' : loading.emit.part 
    const emitAssembly = everyone ? 'emitAssemblyForEveryOne' : loading.emit.assembly 

    const { _id, type, children, name, matrix } = await nodeSchema.findById(nodeId);

    if (type === nodeTypeEnum.part)
      return this.nodeEmitter.emit(emitPart, _id, name, matrix, parent._id)
    else if (type === nodeTypeEnum.assembly) {
      this.nodeEmitter.emit(emitAssembly, _id, matrix, parent._id);
      let promises = [];
      children.forEach(child => {
        promises.push(this.loadNode(child._id, { name, _id }))
      })
      return Promise.all(promises);
    } else return log.error('The node is a ' + type)
  }
}
