let sqlPromise = require('./promiseSQL');

module.exports = (nodeId, cb) => {
    let ret = {
        state: undefined,
        error: undefined
    };

    sqlPromise.getNodeById(nodeId)
        .then(node => {
            console.log(node);
            ret.state = node.state_of_maturity;
        })
        .catch(err => {
            console.log(err);
            ret.error = err;
        })
        .done(() => {
            console.log('state = ', ret.state);
            cb(ret.state, ret.error);
        });
};