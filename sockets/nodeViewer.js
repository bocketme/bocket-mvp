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

    async update(workspaceId, nodeId) {
        this.loadNode(nodeId);
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
            this.socket.emit("addAssembly", nodeId, node.matrix, parent._id);
            let promises = [];
            node.children.forEach(child => {
                promises.push(this.loadNode(child._id, {
                    name: node.name,
                    _id: node._id
                }));
            });

            await Promise.all(promises).then(this.socket.emit(() => loading.emit.end, node._id)).catch(errLog);

        } else if (node.type === nodeTypeEnum.part) {
            this.socket.emit(loading.emit.start, node._id);
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
        Node.findById(nodeId)
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
            let progress = 0;

            let read = fs.createReadStream(file, {autoClose: true, encoding: 'utf8' });

            read.on('data', chunk => {
                progress += chunk.length;
                log.info("["+node._id+"] " + "J'ai lu " + Math.round(100 * progress / total) + "%");
                this.socket.emit(loading.emit.pending, node._id, chunk);
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

    socket.on(loading.on.update, (workspaceId, nodeId) => {
        file3DManager.socket = io.to(socket.handshake.session.currentWorkspace);

        file3DManager.update(workspaceId, nodeId);

        file3DManager.socket = socket;
        /*
        file3DManager.update(workspaceId, nodeId);
        */
    })

    /*
    socket.on("start viewer", (workspaceId) => {
        Workspace.findById(workspaceId)
            .then((workspace) => {
                return promiseNode(workspace.node_master._id, workspace._id);
            })
            .catch(err => {
                console.error(err)
            });
    });


    socket.on("[OBJECT 3D] - save", (workspaceId, nodeId, matrix) => {
        //Verificate the rights of the user for this workspace
        console.log("sauvegarde du node ", nodeId, matrix);
        Node.findById(nodeId)
            .then(node => {
                node.matrix = matrix;
                node.save()
            })
    });

    function promiseNode(nodeId, parent) {
        return new Promise((resolve, reject) => {
            Node.findById(nodeId)
                .then(node => {
                    socket.emit('[viewer] -> start chargement', node._id, node.name);
                    if (TypeEnum.assembly == node.type) {
                        socket.emit("addAssembly", nodeId, node.matrix, parent._id);
                        let promises = [];
                        node.children.forEach(child => {
                            promises.push(promiseNode(child._id, {
                                name: node.name,
                                _id: node._id
                            }))
                        });
                        Promise.all(promises)
                            .then(() => {
                                socket.emit('[viewer] -> end chargement', node._id, node.name);
                                resolve();
                            });
                    } else {
                        Part.findById(node.content)
                            .then((part) => {
                                let chemin = path.join(config.files3D, part.path, PartFileSystem.data);
                                promisifyReaddir(chemin)
                                    .then(files => {
                                        log.info(files);
                                        for (let i = 0; i < files.length; i++) {
                                            //TODO: EXTERNALIZE FOR A VARIABLE
                                            if (path.extname(files[i]) == '.json')
                                                return promisifyReadFile(path.join(chemin, files[i]));
                                        }
                                        return Promise.reject("There is no 3D files");
                                    })
                                    .then((data) => {
                                        socket.emit("addPart", data, node._id, node.matrix, parent._id);
                                        socket.emit('[viewer] -> end chargement', node._id, node.name);
                                        resolve();
                                    })
                                    .catch((err) => {
                                        socket.emit('[viewer] -> error chargement', node._id, node.name, err);
                                        resolve();
                                    })
                            });
                    }
                })
                .catch(err => {
                    console.error(err);
                    reject();
                });
        })
    }
    */
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
