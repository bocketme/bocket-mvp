const NodeModel = require('../../models/Node');
const Workspace = require('../../models/Workspace');
const config = require('../../config/server');
const escape = require('escape-html');
const ModelsMaker = require('../../models/utils/create/ModelsMaker')
const fs = require("fs");
const path = require("path");

let post = {
    new_node: createNewNode,
    insert: {
        part: insertNewPart,
        assembly: insertNewAssembly,
    },
}

/**
* Create a new node inside the database 
*      Used Models [Node, Workspace]
*      Required 
*/
function createNewNode(req, res){
    
    let nodeId = req.params.nodeId;
    let description = req.body.description;
    let specFiles = req.files;
    let name = req.body.name;
    let workspaceId = req.body.workspaceId;

    let nestedWorkspace;
    let types_mime = [];
    let createfiles = [];
    
    specFiles.forEach(file => {
        //Initialiser le types - MIME;
        types_mime.push(verifTypes(file.mimetype));
        //Initialiser des fichiers
        createfiles.push(addSpec(file, nodeId));
    });

    //Vérifications des types - MIME;    
    Promise.all(types_mime)
    .then(() => {
        
        //Trouver son workspace
        Workspace.findById({_id: workspaceId })
        .then((parent_workspace) => {
            console.log(parent_workspace);
            nestedWorkspace = {
                _id: parent_workspace._id,
                name: parent_workspace.name
            }
        })
        .catch(err => {
            
            throw (err);
        }) 

        //Créations des fichiers
        return Promise.all(createfiles);
    })
    .then((files_array) => {
        return ModelsMaker.CreateNode(name, description, files_array, nestedWorkspace);
    })
    .then((node) => {
        node.save()
            .then(() => {

            })
        .catch(err => {

            throw (err);            
        });
        console.log(node);
        res.send();        
    })
    .catch((err) => {
        deleteFiles(specFiles);
        res.send(err);
    });
    //TODO - User Verification
    // console.log("cookies", req.cookie);
}

/**
* Create a new node inside an empty Node 
*      Used Models [Node]
*      Required 
*/
function insertNewPart(req, res){
    
}

/**
* Create a new assembly inside an empty Node 
*      Used Models [Node]
*      Required 
*/
function insertNewAssembly(req, res){
    
}

/********************************************************/
/*                                                      */ 
/*                                                      */ 
/*                      Promises                        */ 
/*                                                      */ 
/*                                                      */ 
/********************************************************/

function verifTypes(type){
    return new Promise((resolve, reject) => {
        if (type !== null)
        resolve();
        reject("Nous n'acceptons pas ce type de fichier");
    })
}

function addSpec(file, nodeId){
    return new Promise((resolve, reject)=> {
        nodeId = "./" + nodeId
        file.originalname = "./" + file.originalname
        let chemin = config.specfiles
        fs.access(chemin, (err) => {
            if (err) reject(err);
            fs.access(path.resolve(chemin, nodeId), (err) => {
                if (err){
                    fs.mkdir(path.resolve(chemin, nodeId), (err) => { 
                        if(err)
                        reject(err);
                    })    
                }
                fs.writeFile(path.resolve(chemin, nodeId, file.originalname), file.buffer.toString, (err) => {
                    if (err)
                        reject(err);
                    else
                    {
                        console.log(file.originalname + " created in : " + path + nodeId + file.originalname )
                        resolve();  
                    } 
                })
            });
        })
    });
}

/********************************************************/
/*                                                      */ 
/*                                                      */ 
/*                      Function                        */ 
/*                                                      */ 
/*                                                      */ 
/********************************************************/

function deleteFiles(files){
    nodeId = "./" + nodeId
    files.forEach(file => {
        file.originalname = "./" + file.originalname
        let chemin = path.resolve(path , nodeId , file.originalname)
        fs.access(chemin, (err) => {
            if (!err){
                fs.unlink(path, (err) => {
                    if (err){
                        console.log('IMPOSSIBLE');
                        console.log(err);
                    }
                });
            }
        });
    });
}

module.exports = post;