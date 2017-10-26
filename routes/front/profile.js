const express = require("express"),
    router = express.Router(),
    fs = require('fs'),
    path = require('path'),
    Promise = require('promise'),
    getRequest = require('./utils/getRequest'),
    isAuthentificated = require('./utils/isAuthentificated');

/**
 * User profile
 */
router.get('/profile/:id', isAuthentificated, (req, res) => {

    let userId = req.params.id;

    let firstname = null,
        lastname = null,
        username = null,
        email = null,
        company = null;

    getRequest('http://localhost:8080/api/users/' + userId)
        .then((body1) => {
            //Getting all the projects id and name for the current user connected
            JSON.parse(body1, (key, value) => {
                if (key === "username") {
                    username = value;
                }
                if (key === "firstname") {
                    firstname = value;
                }
                if (key === "lastname") {
                    lastname = value;
                }
                if (key === "email") {
                    email = value;
                }
                if (key === "company") {
                    company = value;
                }
            });

            return;
        })
        .done(() => {
            res.render("profile", {
                assets_name: "profile",
                page_name: "Profile - " + firstname + " " + lastname,
                username: username,
                firstname: firstname,
                lastname: lastname,
                email: email,
                company: company

            });

        });
});

module.exports = router;