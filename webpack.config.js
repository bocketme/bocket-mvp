const path = require('path');

module.exports = {
    entry: {
        three_js:"./webpack/src/three.js - viewer/main.js",
        webgl: "./webpack/src/webgl - viewer/main.js",
    },
    watch: true,
    devtool: "source-map",
    target: "web",
    output: {
        filename: '[name].js',
        path: path.resolve("./public/js/dist"),
    },
};
