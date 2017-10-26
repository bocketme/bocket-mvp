/**
 * Here you can drop all the tables of the database (dev env only);
 */
const connection = require("./index");

var foreign_keys = [{
        table: "FK_owneraffectation",
        foreign_key: "team",
    }, {
        table: "FK_usernotifications",
        foreign_key: "notifications"
    },
    {
        table: "FK_usercomment",
        foreign_key: "comment"
    }, {
        table: "FK_projectnode",
        foreign_key: "node"
    }, {
        table: "FK_teamproject",
        foreign_key: "project"
    }, {
        table: "FK_files3dcomment",
        foreign_key: "comment"
    }, {
        table: "FK_specfilecomment",
        foreign_key: "comment"
    }, {
        table: "FK_orgnanizationproject",
        foreign_key: "project"
    }, {
        table: "FK_issuecomment",
        foreign_key: "comment"
    }, {
        table: "FK_nodeparentnode",
        foreign_key: "node"
    }, {
        table: "FK_branchnode",
        foreign_key: "node"
    }, {
        table: "FK_nodespecfile",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_teamaffectation",
        foreign_key: "affectation"
    }, {
        table: "FK_nodetag",
        foreign_key: "tag"
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }, {
        table: "FK_",
        foreign_key: ""
    }
];

var table = [
    'user',
    'node',
    'branch',
    'pull_request',
    'comments',
    'specfile',
    'files3d',
    'project',
    'team',
    'notifications',
    'rights',
    'rights_file',
    'affectation',
    'tag',
    'ssh_key',
    'organization',
    'stripe',
    'issue',
    'annotation',
    'commit'
];

var drop = () => {
    table.forEach(table_name => {
        connection.query("drop table ".concat(table_name), err => {
            if (err) console.log(err.sqlMessage);
            else console.log("Table ", table_name, " dropped");
        });
    });
};
drop();
module.exports = drop;