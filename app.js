const express = require("express"),
    path = require("path"),
    http = require('http'),
    favicon = require("serve-favicon"),
    logger = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    routes = require("./routes/index"),
    app = express(),
    session = require("express-session"),
    Twig = require("twig"),
    connection = require('./database/index'),
    MySQLStore = require('express-mysql-session')(session),
    appPath = path.join(__dirname, '..', 'app'),
    debug = require("debug")("back-end:server"),
    server = http.Server(app),
    io = require('socket.io')(server),
    sessionMiddleWare = session({
        name: "bocket",
        secret: "back",
        resave: false,
        saveUnintinilized: true,
        store: new MySQLStore(require('./database_config')),
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 15 * 24 * 3600000
        }
    });
    request = require('request');

    /**
 * Socket.io connections
 */

io.use(function(socket, next) {
    //console.log(socket);
    sessionMiddleWare(socket.request, socket.request.res, next);
});


io.on("connection", (socket) => {

    /**
     * New pull request from socket.io client
     */
    socket.on('newPullRequest', (data) => {
        connection.query("INSERT INTO pull_request (title, content, branch_source, branch_destination, id_project) VALUES (?, ?, ?, ?, ?)", [data.prTitle, data.prDescription, data.sourceBranch, data.destinationBranch, data.projectId],
            err => {
                if (err) {
                    console.log("Database error : " + err.sqlMessage);
                } else {
                    console.log("Insert done");
                }
            });
    });

    /**
     * New Issue request from socket.io client
     */
    socket.on('newIssue', (data) => {

        connection.query("INSERT INTO issue (title, content, is_resolved, id_project) VALUES (?, ?, ?, ?)", [data.issueTitle, data.issueDescription, 0, data.projectId],
            err => {
                if (err) {
                    console.log("Database error : " + err.sqlMessage);
                } else {
                    console.log("Insert done");
                }
            });
    });

    socket.on('newPullRequestComment', (data) => {

        connection.query("INSERT INTO comments (content, date_of_publish, id_author, id_pull_request) VALUES (?, ?, ?, ?)", [data.commentContent, data.commentDateOfPublish, data.commentAuthor, data.commentElementId],
            err => {
                if (err) {
                    console.log("Database error : " + err.sqlMessage);
                } else {
                    console.log("Insert done");
                }
            });
    });

    socket.on('newIssueComment', (data) => {
        console.log('socket onNewIssueComment');
        connection.query("INSERT INTO comments (content, date_of_publish, id_author, id_issue) VALUES (?, ?, ?, ?)", [data.commentContent, data.commentDateOfPublish, data.commentAuthor, data.commentElementId],
            err => {
                if (err) {
                    console.log("Database error : " + err.sqlMessage);
                } else {
                    console.log("Insert done");
                }
            });
    });

    /**
     * New node comment
     */
    socket.on('newNodeComment', (data) => {
        if (data.commentContent === '')
            return ;
        console.log('socket =', socket.request.session);

        socket.emit('addComment', {username: socket.request.session.user.username, comment: data.commentContent});

        let comment = {
            content: data.commentContent,
            date_of_publish: data.commentDateOfPublish,
            id_author: socket.request.session.user.id,
            id_issue: null,
            id_files3d: null,
            id_specfile: null,
            id_branch: null,
            id_pull_request: null,
            id_node: data.commentElementId
        };
        connection.query("INSERT INTO comments SET ?", comment,
            err => {
                if (err) {
                    console.log("Database errorz : " + err.sqlMessage);
                } else {
                    console.log("Insert done");
                }
            });
    });

    socket.on('newProject', (data) => {
        let title = data.projectTitle;

        //TODO: Add function to create a new project in the back-end
    });

    socket.on('updateProfile', (data) => {
        console.log(data);
        connection.query("UPDATE user SET lastname = ?, firstname = ?, username = ?, email = ?, company = ? WHERE id = ?", [data.name, data.firstname, data.username, data.email, data.company, data.userId],
            err => {
                if (err) {
                    console.log("Database error : " + err.sqlMessage);
                } else {
                    console.log("Update done");
                }
            });
    });

    socket.on('updateProfileNoCompany', (data) => {
        connection.query("UPDATE user SET lastname = ?, firstname = ?, username = ?, email = ? ", [data.name, data.firstname, data.username, data.email],
            err => {
                if (err) {
                    console.log("Database error : " + err.sqlMessage);
                } else {
                    console.log("Update done");
                }
            });

    });

    socket.on('newNode', (data) => {
        console.log(data);
        connection.query("INSERT INTO node SET name = ?, state_of_maturity = 1, node_parent = ?, id_branch = ? ", [data.nodeName, data.parentNode, data.branchId],
            err => {
                if (err) {
                    console.log("Database error : " + err.sqlMessage);
                } else {
                    console.log("insert done");
                    request.post("http://localhost:8080/api/node/node_child/" + data.parentNode + "/" + data.nodeName);
                }
            });
    });

    socket.on('newBranch', (data) => {
        //TODO: voir avec hervé pour le back
    });
});


/************************************************************************************************************************************************
 ************************************ * APP PARAMETERS
 *************************************************************************************************************************************************/
/**
 * Listen on provided port, on all network interfaces.
 */
var port = normalizePort(process.env.PORT || "8080");
app.set("port", port);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
console.log("Running on http://localhost:" + port);


app.enable("view cache");
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'twig');

app.set('twig options', {
    strict_variables: false
});
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', "FAVICON.png")));
app.use('/', express.static(__dirname + '/public/'));

app.use(logger("dev"));
app.use(bodyParser.json({
    type: 'application/json'
}));
app.use(bodyParser.urlencoded({
    limit: 134217728,
    extended: false
}));

app.use(cookieParser());

app.use(sessionMiddleWare);

// Routes Manager
app.use('/', routes);

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});


/* ************************************************************************** */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port === "string" ?
        "Pipe " + port :
        "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}


function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ?
        "pipe " + addr :
        "port " + addr.port;
    debug("Listening on " + bind);
}