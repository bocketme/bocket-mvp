const path = require('path');

module.exports = {
    entry: "./public/js/viewer_v2/init.js",
    watch: true,
    output: {
        path: path.resolve("public/js/dist"),
        filename: "viewer.js"
    }
};
