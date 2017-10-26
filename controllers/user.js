const connection = require('../database/index'),
    Promise = require('promise');



/************************************************************/
/*                                                          */
/*                                                          */
/*                             Signin                       */
/*                                                          */
/*                                                          */
/************************************************************/
var signin = {
    get: (req, res) => {

        res.render("signin", {
            assets_name: "signin",
            page_name: "Sign in"
        });
    },
    post: (req, res, next) => {
        var email = req.body.email,
            password = req.body.password;
        connection.query("SELECT * FROM user WHERE email = ? AND password = ?", [email, password], (err, result, fields) => {
            if (err) {
                next("Intern Error");
            } else if (!result || result.length == 0)
                next("User Not Found");
            else {
                req.session.user = result[0];
                res.redirect('/home');
            }
        });
    },
    error_handler: (err, req, res, next) => {
        res.render("signin", {
            error: err,
            assets_name: "signin",
            page_name: "Sign in"
        });
    }
};
/************************************************************/
/*                                                          */
/*                                                          */
/*                             Signup                       */
/*                                                          */
/*                                                          */
/************************************************************/
var signup = {
    get: (req, res) => {
        //here we can make our queries

        res.render("signup", {
            assets_name: "signup",
            page_name: "Sign Up"
        });
    },
    post_sendMySQL: (req, res, next) => {
        let username = req.body.username,
            password = req.body.password,
            firstname = req.body.firstname,
            lastname = req.body.lastname,
            email = req.body.email,
            _user,
            _team;

        let insert = () => {
            return new Promise((resolve, reject) => {
                connection.query("INSERT INTO user SET ?", {
                        username: username,
                        password: password,
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        createdat: new Date()
                    },
                    (err, results, fields) => {
                        if (err) {
                            console.log(err.sqlMessage);
                            reject("Intern Error, Please retry later");
                        } else
                            resolve(results.insertId);
                    });
            });
        };
        insert()
            .then(user => {
                _user = user;
                return new Promise((resolve, reject) => {
                    connection.query("INSERT INTO team SET ?", {
                        name: "Personal Project : " + username
                    }, (err, results, fields) => {
                        if (err) {
                            console.log(err.sqlMessage);
                            reject("Intern Error, Please retry later");
                        } else
                            resolve(results.insertId);
                    });
                });
            })
            .then(team => {
                _team = team;
                return new Promise((resolve, reject) => {
                    connection.query("INSERT INTO affectation SET ?", {
                        id_user: _user,
                        id_team: team,
                        owner_team: true
                    }, (err, results, fields) => {
                        if (err) {
                            console.log(err.sqlMessage);
                            reject("Intern Error, Please retry later");
                        } else
                            resolve(results.insertId);
                    });
                });
            })
            .then(() => res.redirect('/signin'))
            .catch(err => next(err))
            .done();

    },
    post_verifyEmail: (req, res, next) => {
        var email = req.body.email;

        connection.query("SELECT email FROM user where email = ?", [email], (err, result, fields) => {
            if (err) {
                console.log(err.sqlMessage);
                next("Intern Error, Please retry later");
            } else if (result.length == 0 || !result)
                next();
            else if (result)
                next("Email already used");
        });
    },
    post_verifyUsername: (req, res, next) => {
        var username = req.body.username;

        connection.query("SELECT username FROM user where username = ?", [username], (err, result, fields) => {
            if (err) {
                console.log(err.sqlMessage);
                next("Intern Error, Please retry later");
            } else if (result.length == 0 || !result)
                next();
            else if (result)
                next("Username already used");
        });
    },
    error_handler: (err, req, res, next) => {
        console.log(err);
        res.render("signup", {
            error: err,
            assets_name: "signup",
            page_name: "Sign Up"
        });
    }
};

module.exports = {
    signin: signin,
    signup: signup
};