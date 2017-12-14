const path = require('path');

module.exports = {
    entry: "./webpack/viewer/init.js",
    watch: true,
    devtool: "source-map",
    target: "web",
    output: {
        path: path.resolve("public/js/dist"),
        filename: "viewer.js"
    },
};
