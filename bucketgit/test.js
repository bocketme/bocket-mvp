var git = require("./git_main");

var author = {
    name: "test",
    email: "test@gonnabeallright.truth",
};

var repo = {
    name: "test_env",
    node: [
        "parent_1",
        "child_1",
        "child_2",
        "child_3",
        "child_4",
        "child_5",
        "child_6",
        "child_7",
    ]
};
var i = 0;
var add_node_recursive = (callback) => {
    return git.node(repo.name, repo.node[++i], repo.node[i], author.email, author.name, (err, result) => {
        if (err) {
            return callback(err);
        } else {
            if (i == 8) {
                console.log(i);
                console.log("finish");
                return callback(null, result);
            }
            return add_node_recursive(callback);
        }
    });
};

var bucketgit_jeudedonnée = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    if (!req.app.get('env') === "development")
        res.status(200).end("Repository already initialised");
    git.ini(repo.name, repo.node[i], author.email, author.name, (err_1, result) => {
        if (err_1) res.status(500).send(err_1).end();
        add_node_recursive((err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err).end();
            }
            console.log(result);
            res.status(200).end();
        });
    });
};

module.exports = bucketgit_jeudedonnée;