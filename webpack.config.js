const path = require('path');
const webpack = require('webpack')

module.exports = {
    entry: {
        threejs:"./webpack/src/three.js - viewer/main.js",
        webgl: "./webpack/src/webgl - viewer/main.js",
    },
    watch: true,
    devtool: "eval-source-map",
    target: "web",
    output: {
        filename: '[name].js',
        path: path.resolve("./public/js/dist"),
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
          debug: true
        })
      ]
};
