const express = require("express"),
    rights = require('../../controllers/rights'),
    router = express.Router();

/* ************************************************************************** */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                           Rights API FOR PROJECT NODE                      */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/*                                                                            */
/* ************************************************************************** */

/**
 * search all the rights for a specific node
 */
router.get("/api/rights/search_node/:node", rights.all_by_node);

/**
 * create a right for a specific project
 */
router.post("/api/rights/new_rights/:node", rights.create_for_node);

/**
 * alter a right for an existing project
 */
router.post("/api/rights/alter_rights/:node", rights.alter);

/**
 * remove a right for an existing project
 */
router.delete("/api/rights/remove/:id_rights", rights.admin_verification, rights.remove);

module.exports = router;