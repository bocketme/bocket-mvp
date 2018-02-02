const luxon = require('luxon'),
    PartSchema = require('../../models/Part'),
    AssemblySchema = require('../../models/Assembly'),
    NodeSchema = require('../../models/Node'),
    _ = require('lodash'),
    TypeEnumNode = require('../../enum/NodeTypeEnum');

module.export = lastUpdates;

async function lastUpdates(workspaceId) {
    try {
        let nodes = await NodeSchema.find({"": workspaceId});

        nodes.forEach(node => {

        });

        
    } catch (err) {

    }
}



function lastUpdates(workspaceId) {
    Promise.all([PartFinder(workspaceId), AssemblyFinder(workspaceId), NodeFinder(workspaceId)])
        .then(results => {
            return _.uniq(results);
        });
}

function PartFinder(workspaceId){
    return new Promise((resolve, reject) => {
        PartSchema.find({"ownerOrganization": workspaceId})
            .then(parts => {
                let promises = [];
                _.each(parts, (part) => {
                    promises.push(limitTime(part));
                });
                Promise.all(promises);
            })
            .then((selectedParts) => {
                let promises = [];
                _.each(selectedParts, (part) => {
                    promises.push(promiseNode({ content: part._id, type: TypeEnumNode.part }));
                });
            })
            .then(nodes => {
                resolve(
                    _.uniq(
                        _.flattenDeep(
                            nodes.map(() => {

                            })
                        )
                    )
                );
            })
    })
}

function AssemblyFinder(workspaceId) {
    return new Promise((resolve, reject) => {
        AssemblySchema.find({"ownerOrganization": workspaceId})
            .then(assemblies => {
                let promises = [];
                _.each(assemblies, (assembly) => {
                    promises.push(limitTime(assembly));
                });
                Promise.all(promises);
            })
            .then(selectedAssemblies => {
                let promises = [];
                _.each(selectedAssemblies, assembly => {
                    promises.push(promiseNode({ content: assembly._id, type: TypeEnumNode.assembly }));
                });
            })
            .then(nodes => {
                resolve(_.uniq(_.flattenDeep(nodes)));
            })
    });
}

function promiseNode(query){
    return new Promise((resolve, reject) => {
        NodeSchema.find(query)
            .then(nodes => {
                nodes.forEach((node, i, nodes) => {
                    nodes[i] = node._id;
                });
                resolve(nodes)
            });
    });
}

function NodeFinder(workspaceId) {
    return new Promise((resolve,reject) => {
        NodeSchema.find({Workspaces: workspaceId})
            .then(nodes => {
                nodes.forEach((node, i, nodes) => {
                    nodes[i] = node._id;
                });
                resolve(_.uniq(_.flattenDeep(nodes)));
            })
    });
}

function limitTime(content) {
    return new Promise(resolve => {
        if (!content.modified)
            resolve();
        let local = luxon.DateTime().local();
        let timeLimit = luxon.Interval.after(local.minus({days: 10}), local);
        if(timeLimit.contains(luxon.DateTime.fromISO(content.modified)))
            resolve(content);
        else resolve();
    });
};