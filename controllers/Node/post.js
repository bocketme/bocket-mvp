// const NodeModel = require('../../models/Node');
const Workspaces = require('../../models/Workspace');
const Node = require('../../models/Node');
const config = require('../../config/server');
const escape = require('escape-html');
const ModelsMaker = require('../../models/utils/create/ModelsMaker');
const fs = require('fs');
const path = require('path');

const post = {
  new_node: createNewNode,
  insert: {
    part: insertNewPart,
    assembly: insertNewAssembly,
  },
  verif: {
    write: {
      workspace: verificationWriteInWorkspace,
    },
  },
};

/**
 * Create a new node inside the database
 *      Used Models [Node, Workspaces]
 *      Required
 */
function createNewNode(req, res) {
  // Initialisation des variables
  const nodeParent = escape(req.params.nodeParent);
  const description = escape(req.body.description);
  const specFiles = escape(req.files);
  const name = escape(req.body.name);

  // let node;
  const { workspace } = req.session;
  const types_mime = [];
  const createFiles = [];

  // TODO - Vérifier les droits de l'utilisateur -- Fonction bis

  // Créer le noeud
  Node.newDocument({
    name,
    description,
    parent: nodeParent,
    Workspaces: {
      _id: workspace._id,
      name: workspace.name,
    },
  })
    .then((node) => {
      // Vérifier le type-Mime des fichiers
      // Ecrire les fichiers de specs -- DRIVE ???

      specFiles.forEach((file) => {
        // Initialiser le types - MIME;
        types_mime.push(verifyTypes(file.mimetype));
        // Initialiser des fichiers
        createFiles.push(addSpec(file, node._id));
      });

      Promise.all(types_mime)
        .then(() => Promise.all(createFiles))
        .then((paths) => {
          node.specpath = paths;
          return addNodetoWorkspace(workspace, nodeParent, { _id: node._id, title: node.name, children: [] });
        })
        .then((workspace) => {
          workspace.save().catch((err) => { throw err; });
        })
        .catch((err) => {
          node.remove();
          throw (err);
        });
    })
    .then(() => {
      res.send();
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
}

/**
 * Create a new node inside an empty Node
 *      Used Models [Node]
 *      Required
 */
function insertNewPart(req, res) {
  let nom;
  let description;
  let file3D;
  let specfiles;
  let tags;

  res.send();
}

/**
 * Create a new assembly inside an empty Node
 *      Used Models [Node]
 *      Required
 */
function insertNewAssembly(req, res) {
  res.send();
}


/******************************************************* */
/*                                                      */
/*                                                      */
/*                      Verification                    */
/*                                                      */
/*                                                      */
/******************************************************* */

function verificationWriteInWorkspace(req, res, next) {
  const userMail = req.session.userMail;
  const workspaceId = req.body.workspaceId;

  if (!userMail)
    {next("Error : User Not Found");}

  Workspaces.findById({ _id: workspaceId })
    .then((workspace) => new Promise((resolve, reject) => {
          if (workspace.User.email == userMail)
            resolve();
          else {
            if(workspace.users && workspace.users.length !== 0){
              workspace.users.forEach(worker => {
                if (worker.email == userMail){
                  resolve();
                }
              });
            }
          }
          reject("No rights");
        }))
  // En cas de succès passe à la fonction suivante de la route spécifié.
    .thne(() => next())
  // En cas de succès passe à la fonction de gestion d'erreur de la route spécifié.
    .catch(err => next(err));
}

/** ******************************************************/
/*                                                      */
/*                                                      */
/*                      Promises                        */
/*                                                      */
/*                                                      */
/** ******************************************************/

function verifyTypes(type) {
  return new Promise((resolve, reject) => {
    if (type !== null)
      {resolve();}
    else
      {reject("Nous n'acceptons pas ce type de fichier");}
  });
}

function addSpec(file, nodeId) {
  return new Promise((resolve, reject) => {
    const relativePath = './' + nodeId + '/' + file.originalname;
    nodeId = './' + nodeId;
    file.originalname = './' + file.originalname;
    const chemin = config.specfiles;
    fs.access(chemin, (err) => {
      if (err) reject(err);
      fs.access(path.resolve(chemin, nodeId), (err) => {
        if (err) {
          fs.mkdir(path.resolve(chemin, nodeId), (err) => {
            if (err)
              {reject(err);}
          });
        }
        fs.writeFile(path.resolve(chemin, nodeId, file.originalname), file.buffer.toString, (err) => {
          if (err)
            {reject(err);}
          else {
            console.log(`${file.originalname  } created in : ${  path  }${nodeId  }${file.originalname}`);
            resolve();
          }
        });
      });
    });
  });
}

/******************************************************* */
/*                                                      */
/*                                                      */
/*                      Function                        */
/*                                                      */
/*                                                      */
/** ******************************************************/

function deleteFiles(paths) {
  paths.forEach((chemin) => {
    fs.open(path.resolve(chemin), (err) => {
      if (!err) {
        fs.unlink(path, (err) => {
          if (err) {
            console.log('IMPOSSIBLE : ', err);
          }
        });
      }
    });
  });
}

function addNodetoWorkspace(workspace, cible, data) {
  function createNode(node) {
    node.children.forEach((child) => {
      node.children = createNode(node);
    });
    if (node.title == cible) {
      node.children.push(data);
    }
    return node;
  }

  workspace.node_master = createNode(workspace.node_master);

  return workspace;
}

module.exports = post;
