const connection = require('../../database/index'),
    EventEmmiter = require('events'),
    express = require("express"),
    git_read = require('../../bucketgit/git_read').read,
    Promise = require('promise'),
    router = express.Router(),
    THREE = require("three"),
    promiseSQL = require('./utils/promiseSQL'),
    OBJLoader = require("three-obj-loader"),
    OBJExporter = require("three-obj-exporter");

OBJLoader(THREE);
OBJExporter(THREE);

/************************************************************/
/*                                                          */
/*                                                          */
/*                        Build processus                   */
/*                                                          */
/*                                                          */
/************************************************************/

/************************************************************/
/*                                                          */
/*                        Event Emmiter                     */
/*                                                          */
/************************************************************/


let compileData = new EventEmmiter();

/************************************************************/
/*                                                          */
/*                        Build Process                     */
/*                                                          */
/************************************************************/
/**
 * @desc Recursively traverse THREE.Groups to tag return the meshes
 * @param {THREE.Group} object THREE.Group to be traversed
 * @return {THREE.Mesh} Tagged mesh to be assembled
 */
let build_asm = (object) => {
    var group = [];

    if (!(object instanceof THREE.Group))
        console.error(new Error("Bad parameter"));
    object.children.forEach((element) => {
        element.name = object.name + "_" + element.name;
        if (element instanceof THREE.Group)
            group.concat(build_asm(element));
        else if (element instanceof THREE.Mesh)
            group.push(element);
    });
    return (group);
};

/**
 * @desc Asynchronously builds all sub-nodes and write it to the current one.
 * @param {THREE.Scene} scene An empty THREE.Scene to be filled with the object to be joined.
 */
let build = (scene) => {
    return (new Promise((resolve, reject) => {
        var groupToSend = new THREE.Group();

        if (!(scene instanceof THREE.Scene))
            reject(new Error("Bad scene parameter"));

        scene.children.forEach((element) => {
            if (element instanceof THREE.Group || element instanceof THREE.Mesh) {
                if (element instanceof THREE.Group)
                    build_asm(element).forEach(function (element) {
                        groupToSend.add(element.clone());
                    });
                else if (element instanceof THREE.Mesh)
                    groupToSend.add(element.clone());
                else
                    reject(new Error("Something happened", "build.js", 46));
            }
        });
        resolve(new OBJExporter().parse(groupToSend));
    }));
};

/************************************************************/
/*                                                          */
/*                        Main Process                      */
/*                                                          */
/************************************************************/


let buildRequest = (req, res) => {
    let id_node = req.params.node,
        value = [],
        i = 1;

    compileData.on('add', () => {
        ++i;
    });

    compileData.on('data', (data) => {
        value.push(data);
    });

    compileData.on('error', (err) => {
        res.status(err.status).send(err.message);
    });

    compileData.on('end', () => {
        if (--i == 0) {
            let tab = [],
                scene = new THREE.Scene();

            for (let key in value) {
                if (value[key].data !== "" && value[key].data !== null && value[key].data !== undefined) {
                    tab.push(new THREE.OBJLoader().parse(value[key].data));
                    tab[tab.length - 1].name = value[key].uuid;
                    tab[tab.length - 1].userData.uuid = value[key].uuid;
                }
            }

            tab.forEach((element) => {
                scene.add(element);
            });

            //Pour écrire la nouvelle scene sur un fichier il faudra que tu utiises la fonction
            // commitBrowser(nameFile, typefile, dataFile, nameRepo, nameNode, message, nameAuthor, mailAuthor, callback)
            // Où nameAuthor and mail Author seront le système vu que c'est nous qui écrivont le nouveau fichier.

            build(scene)
                .then((success) => {
                    res.send("Node successfully built").end();
                })
                .catch((error) => {
                    if (error instanceof Error)
                        console.error(error);
                    else
                        console.error(new Error("Error: error is not an error"));
                    res.status(500).send("Failed to build current node").end();
                });

            compileData.removeAllListeners();
        }
    });

    recursive(id_node);
};

/************************************************************/
/*                                                          */
/*                   Recursive Process                      */
/*                                                          */
/************************************************************/

let recursive = (id_node) => {
    let _uuid;

    promiseGetNodeAndOBJ(id_node)
        .then((data) => {
            _uuid = data[0].filesuuid;
            return new Promise((resolve, reject) => {
                git_read(data[0].path, data[0].filename + ".obj", data[0].nodename, (err, data) => {
                    if (err)
                        return (reject(err));
                    else
                        return (resolve(data));
                });
            });
        })
        .then((data) => {
            compileData.emit('data', {
                uuid: _uuid,
                data: data.toString()
            });
        })
        .then(() => {
            return (promiseSQL.getNodeChildByNodeId(id_node));
        })
        .then((node) => {
            if (node instanceof Array) {
                node.forEach(function (child) {
                    compileData.emit('add');
                    recursive(child.id);
                });
            }
        })
        .catch((err) => {
            console.error(err);
        })
        .done(() => {
            // console.log("Requête fini : ", id_node)
            compileData.emit('end');
        });
};

/************************************************************/
/*                                                          */
/*                   Recursive Process                      */
/*                                                          */
/************************************************************/

let promiseGetNodeAndOBJ = (id_node) => {
    return new Promise((resolve, reject) => {
        connection.query("Select files3d.name as filename, files3d.uuid as filesuuid, node.name as nodename, project.path FROM files3d, node, project WHERE (node.id = ?) AND (node.id_files3d = files3d.id) AND (node.id_project = project.id)", [id_node], (err, results, fields) => {
            if (err)
                reject({
                    status: 500,
                    message: 'Internal Error'
                });
            else if (!results)
                reject({
                    status: 404,
                    message: 'Not Found'
                });
            else if (results.length == 0)
                reject({
                    status: 404,
                    message: 'Not Found'
                });
            else
                resolve(results);
        });
    });
};

router.get("/api/build/:node", [buildRequest]);


module.exports = router;