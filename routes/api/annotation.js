const connection = require('../../database/index'),
    express = require("express"),
    router = express.Router();

var uuid = {
    /**
     * We get the annotations from a 3D file
     */
    get: (req, res, next) => {
        let id_files3d = req.params.files3d;

        connection.query("SELECT * FROM annotation WHERE id_files3d = ?", [id_files3d],
            (error, result, fields) => {
                if (error)
                    res.status(500).send(new Error("Intern Error")).end();
                else if (result.length == 0)
                    res.status(404).send(new Error("Nothing Found")).end();
                else
                    res.status(200).send(result).end();
            });
    },
    /**
     * We post the annoation added on the front
     */
    post: (req, res, next) => {
        let id_files3d = req.params.files3d,
            content = req.body.data;

        connection.query("INSERT INTO annotation SET ?", {
                id_files3d: id_files3d,
                content: content,
            },
            (error, result, fields) => {
                if (error)
                    res.status(500).send("Intern Error").end();
                else
                    res.status(200).send({
                        id: result.insertId
                    }).end();
            });
    },
    /**
     * We update the annotation in the database
     */
    put: (req, res, next) => {
        let content = req.body.data;
        id_annotation = req.params.id_annotation,

            connection.query("UPDATE annotation SET ? WHERE id = ? ", [{
                    content: content
                }, id_annotation],
                (error, result, fields) => {
                    console.log(error);
                    if (error)
                        res.status(500).send(new Error("Intern Error")).end();
                    else if (result.length == 0)
                        res.status(404).send(new Error("Nothing Found")).end();
                    else
                        res.status(200).end();
                });
    },

    /**
     * We delete the annotation from the database
     */
    delete: (req, res, next) => {
        let id_annotation = req.params.id_annotation;

        connection.query("DELETE FROM annotation WHERE id = ?", [id_annotation],
            (error, result, fields) => {
                if (error)
                    res.status(500).send(new Error("Intern Error")).end();
                else
                    res.status(200).end();
            });
    }
};

router.post("/api/annotation/:files3d", [uuid.post]);
router.get("/api/annotation/:files3d", [uuid.get]);
router.put("/api/annotation/:id_annotation", [uuid.put]);
router.delete("/api/annotation/:id_annotation", [uuid.delete]);

module.exports = router;