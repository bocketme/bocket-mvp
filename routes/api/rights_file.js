const express = require("express"),
    right_file = require("../../controllers/rights_file"),
    right = require("../../controllers/rights");

/* ************************************************************************** */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                           Rights_file API FOR file's node                  */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/* ************************************************************************** */

var router = express.Router();


router.get("/api/rights_file/specfile/:node/:id_doc");

/**
 * Create a right for a 3dfile
 */
router.post("/api/rights_file/new_3dright/:node", right_file.create_file3d);
/**
 * Create a right for a specFile
 */
router.post("/api/rights_file/new_specright/:node", right_file.create_specfile);
/**
 * Alter a right for a specFile
 */
router.post("/api/rights_file/alter_spec_right/:node", right_file.update_specfile);
/**
 * Alter a right for a file3d
 */
router.post("/api/rights_file/alter_files3d_right/:node", right_file.update_file3d);
/**
 * Delete a right for a specFile
 */
router.delete("/api/rights_file/delete_files3d_right/:node", [right.admin_verification, right_file.remove_specfile]);
/**
 * Delete a right for a file3d
 */
router.delete("/api/rights_file/delete_files3d_right/:node", [right.admin_verification, right_file.remove_file3d]);

/**
 * Get all the spec files of the node
 */
router.get("/api/files/:id_node", (req, res) => {

});

module.exports = router;