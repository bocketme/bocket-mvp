const nodeSchema = require('../models/Node');
const partSchema = require('../models/Part');
const workspaceSchema = require('../models/Workspace');
const nodeTypeEnum = require('../enum/NodeTypeEnum');
const fs = require('fs');
const path = require('path');
const PartFileSystem = require('../config/PartFileSystem')
const config = require('../config/server');
const log = require('../utils/log');
const defaults = {
    flags: 'r',
    encoding: null,
    fd: null,
    mode: 0o666,
    autoClose: true,
    highWaterMark: 64 * 1024
};

const loading = {
    on: {
        start: "[Viewer] - Start Workspace",
        save: "[Viewer] - Save",
        cancel: "[Viewer] - Cancel",
        update: "[Viewer] - Update",
    },
    emit: {
        assembly: "[Viewer] - Add Assmbly",
        start: "[Viewer] - Start Loading",
        pending: "[Viewer] - Stream",
        end: "[Viewer] - End Loading",
        error: "[Viewer] - Error Loading"
    }
}

function errLog(err) {
    log.error(err)
}

class File3DManager {
    constructor(socket) {
        this.socket = socket;
    }

    async update(nodeId) {
        let node = await nodeSchema.findOne({"children._id": nodeId});
        this.loadNode(nodeId, node);
    }

    async loadWorkspace(workspaceId) {
        let workspace = await workspaceSchema.findById(workspaceId).catch(errLog);
        let start = await this.loadNode(workspace.node_master._id, workspace).catch(errLog);
    }

    /**
     * 
     * 
     * @param {Number} nodeId 
     * @param {Object} parent 
     * @memberof File3DManager
     */
    async loadNode(nodeId, parent) {
        let node = await nodeSchema.findById(nodeId);
        log.info("Chargement : " + nodeId)
        let content;

        if (node.type === nodeTypeEnum.assembly) {
            this.socket.emit(loading.emit.assembly, nodeId, node.matrix, parent._id);
            let promises = [];
            node.children.forEach(child => {
                promises.push(this.loadNode(child._id, {
                    name: node.name,
                    _id: node._id
                }));
            });

            await Promise.all(promises).then(this.socket.emit(() => loading.emit.end, node._id)).catch(errLog);

        } else if (node.type === nodeTypeEnum.part) {
            await this.loadPart(node, parent).catch(errLog);
        }
    }

    /**
     * 
     * 
     * @param {Object} node 
     * @memberof File3DManager
     */
    async loadPart(node, parent) {
        let part = await partSchema.findById(node.content).catch(errLog);

        let chemin = path.join(config.files3D, part.path, PartFileSystem.data);

        let files = await promisifyReaddir(chemin).catch(errLog);

        for (let i = 0; i < files.length; i++) {
            if (path.extname(files[i]) == '.json') {
                this.streamFile(node, parent, path.join(chemin, files[i]));
                break;
            }
        }
    }

    /**
     * 
     * 
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
     * 
     * 
     * @param {any} node 
     * @param {any} file 
     * @memberof File3DManager
     */
    streamFile(node, parent, file) {
        fs.stat(file, (err, stat) => {
            let total = stat.size;
            let chunkNumber = 0;

            this.socket.emit(loading.emit.start, node._id, stat.size);

            let read = fs.createReadStream(file, {autoClose: true, encoding: 'utf8' });
                        
            read.on('data', chunk => {
                this.socket.emit(loading.emit.pending, node._id, chunkNumber, chunk);
                chunkNumber++
            });

            read.on('end', () => this.socket.emit(loading.emit.end, node._id, node.matrix, parent._id));

            read.on('error', (err) => {
                log.error(err);
                this.socket.emit(loading.emit.error, node._id);
            })
        });
    }
};

module.exports = (io, socket)=> {

    const file3DManager = new File3DManager(socket);

    socket.on(loading.on.start, (workspaceId) => file3DManager.loadWorkspace(workspaceId))

    socket.on(loading.on.save, (workspaceId, nodeId, matrix) => file3DManager.save(workspaceId, nodeId, matrix));

    socket.on(loading.on.update, (nodeId, token) => {
        file3DManager.socket = io.to(socket.handshake.session.currentWorkspace);

        file3DManager.update(nodeId);

        file3DManager.socket = socket;
    });

    socket.on(loading.on.save, (workspaceId, nodeId, matrix) => {
        file3DManager.save(workspaceId, nodeId, matrix);
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
