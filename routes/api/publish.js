const connection = require('../../database/index'),
    EventEmmiter = require('events'),
    express = require("express"),
    commit = require("../../bucketgit/git_commit"),
    router = express.Router();

/************************************************************/
/*                                                          */
/*                                                          */
/*                     Pulblish processus                   */
/*                                                          */
/*                                                          */
/************************************************************/


/************************************************************/
/*                                                          */
/*                        Main Process                      */
/*                                                          */
/************************************************************/

router.post("/api/publish/:uuid", (req, res) => {
    let uuid = req.params.uuid,
        data = req.body.data;

    connection.query("SELECT node.path as nodePath, files3d.name as filename, project.path as projectPath FROM node, project, branch, files3d WHERE (files3d.uuid = ?) AND (files3d.id = node.id_files3d) AND (node.id_branch = branch.id) AND (branch.id_project = project.id);", [uuid], (err, results, fields) => {
        if (err) {
            console.log(err.sqlMessage);
            res.status(500).end();
        } else if (!results)
            res.status(400).send("Not Found");
        else {
            commit(results[0].filename, ".obj", data, results[0].projectPath, results[0].nodePath, "New Publish", "Bon", "BonBOn@bonBON.de", (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500)
                } else res.status(200).end();
            });
        }
    });
});