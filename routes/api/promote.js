let express = require('express');
let router = express.Router();
let connection = require('../../database/index');
let getStatus = require('./utils/getStatus');

const MAX_STATE = 3;

function promote(nodeId, state) {
    return new Promise((resolve, reject) => {
        console.log('PROMOTE : ', nodeId, state);
        if (state >= MAX_STATE)
        {
            reject({code : 406, message : "Cannot promote the node anymore."});
        }
        else
        {
            state += 1;
            connection.query('UPDATE node SET state_of_maturity = ? WHERE id = ?', [state, nodeId], (err) => {
                if (err)
                    reject({code: 500, message: "Internal error, please retry later."});
                resolve();
            });
        }
    });
}

router.get('/api/promote/:nodeId', (req, res) => {
    if (req.params === undefined || req.params.nodeId === undefined)
        res.status(404).send('Cannot GET /api/promote');

    let nodeId = req.params.nodeId;

    getStatus(nodeId, (state, error) => {
        if (error !==  undefined)
            res.status(404).send('Node not found');
        else
        {
            promote(nodeId, state)
                .then(() => res.send('OK !'))
                .catch((err) => {
                    res.status(err.code).send(err.message)
                })
        }
    });
});

module.exports = router;
