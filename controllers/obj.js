var read_only = require('../bucketgit/git_read').read_only,
    write_file = require('../bucketgit/git_commit').write,
    Promise = require('promise'),
    connection = require('../database/index');

let promiseNodeName = (node_name) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT id FROM node WHERE (name = ?)", [node_name], (err, results, fields) => {
            if (err) {
                console.log("promiseNodeName : ", err.sqlMessage);
                reject(({
                    status: 500,
                    message: 'Internal Error'
                }));
            } else if (!results)
                reject(({
                    status: 400,
                    message: 'Not Found'
                }));
            else if (results.length == 0)
                reject(({
                    status: 400,
                    message: 'Not Found'
                }));
            else
                resolve(results);
        });
    });
};

var obj = {
    /**
     *
     */
    get: (req, res) => {
        var node = req.params.node,
            project = req.params.project,
            file = req.params.file,
            _id;

        promiseNodeName("keychain")
            .then(id => {
                _id = id[0].id;
                return new Promise((resolve, reject) => {
                    read_only(project, file, node,
                        (err, value) => {
                            if (err) {
                                console.log(err);
                                reject({
                                    status: 400,
                                    message: "Not Found"
                                });
                            } else {
                                if (value)
                                    resolve(value.toString());
                                else reject({
                                    status: 400,
                                    message: "Not Found"
                                });
                            }
                        });
                });
            })
            .then((result) => {
                res.send({
                    id: _id,
                    data: result
                }).end();
            })
            .catch(err => {
                console.log(err);
                if (typeof (err.status) == Number)
                    res.status(err.status).send(err.message);
                else res.status(500).send("Intern Error");
            })
            .done();
    },
    /**
     *
     */
    post: (req, res) => {
        var repo = req.params.project,
            node = req.params.node,
            obj = req.params.file,
            message = "[ADD] new version obj";
        write_file(repo, node, obj, (error) => {
            if (error) {
                res.status(500).end(error);
            } else
                res.status(200).end();
        });
    }
};

module.exports = obj;