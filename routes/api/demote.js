let express = require('express');
let router = express.Router();
let connection = require('../../database/index');
let getStatus = require('./utils/getStatus');

const MIN_STATE = 0;

function promote(nodeId, state) {
    return new Promise((resolve, reject) => {
        console.log('DEMOTE : ', nodeId, state);
        if (state <= MIN_STATE)
        {
            reject({code : 406, message : "Cannot demote the node anymore."});
        }
        else
        {
            state -= 1;
            connection.query('UPDATE node SET state_of_maturity = ? WHERE id = ?', [state, nodeId], (err) => {
                if (err)
                    reject({code: 500, message: "Internal error, please retry later."});
                resolve();
            });
        }
    });
}

router.get('/api/demote/:nodeId', (req, res) => {
    if (req.params === undefined || req.params.nodeId === undefined)
        res.status(404).send('Cannot GET /api/demote');

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
