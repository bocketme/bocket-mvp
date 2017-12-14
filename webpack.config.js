const path = require('path');

module.exports = {
    entry: "./webpack/viewer/init.js",
    watch: true,
    output: {
        path: path.resolve("public/js/dist"),
        filename: "viewer.js"
    }
};
