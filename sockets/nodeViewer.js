const nodeSchema = require('../models/Node');
const partSchema = require('../models/Part');
const workspaceSchema = require('../models/Workspace');
const nodeTypeEnum = require('../enum/NodeTypeEnum');
const fs = require('fs');
const path = require('path');
const PartFileSystem = require('../config/PartFileSystem')
const config = require('../config/server');
const log = require('../utils/log');

class File3DManager {
    constructor(socket) {
        this.socket = socket;
        this._loading = {
            start: "[Viewer] - Start Loading",
            pending: "[Viewer] - Stream",
            end: "[Viewer] - End Loading",
            error: "[Viewer] - Error Loading"
        }
    }

    async loadWorkspace(workspaceId) {
        let workspace = await workspaceSchema.findById(workspaceId);

        let start = await this.loadNode(workspace.node_master._id, workspace);
    }

    /**
     * 
     * 
     * @param {Number} nodeId 
     * @param {Object} parent 
     * @memberof File3DManager
     */
    async loadNode(nodeId, parent) {
        socket.emit(this._loading.start, node._id, node.name, node.content);

        let node = await nodeSchema.findById(nodeId);

        let content;

        if (node.type === nodeTypeEnum.assembly) {
            this.socket.emit("addAssembly", nodeId, node.matrix, parent._id);
            let promises = [];
            node.children.forEach(child => {
                promises.push(promiseNode(child._id, {
                    name: node.name,
                    _id: node._id
                }));
            });

            await Promise.all(promises).then(this.socket.emit(this._loading.end, node._id));

        } else if (node.type === nodeTypeEnum.part) content = await partSchema.findById(node.content);
    }

    async loadPart(partId) {
        let part = await partSchema.findById(partId);

        let chemin = path.join(config.files3D, part.path, PartFileSystem.data);
        
        let files = await promisifyReaddir(chemin);

        for (let i = 0; i < files.length; i++) {
            if (path.extname(files[i]) == '.json') {
                this.streamFile(chemin);
                break;
            }
        }
        read.on('data', (chunk) => {
            progress += chunk.length;
            console.log("J'ai lu " + Math.round(100 * progress / total))    
        });
        console.log(readStream);
    }

    streamFile(id, file) {
        fs.stat(file, (err, stat) => {
            let total = stat.size;
            let progress = 0;
            let read = fs.createReadStream(chemin);
            
            read.on('data', chunk => {
                this.socket.emit(this._loading.pending, id, chunk);
                progress += chunk.length;
                log.info("J'ai lu " + Math.round(100 * progress / total) + "%");
            });

            read.on('end', socket.emit(this._loading.end, id));

            read.on('error', (err) => {
                log.error(err);
                this.socket.emit(this._loading.error, id);
            })
        });
    }
};

module.exports = socket => {
    
    const file3DManager = new File3DManager(socket);

    socket.on()
    
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
