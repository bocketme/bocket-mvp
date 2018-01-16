const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        threejs:"./webpack/src/three.js - viewer/main.js",
        webgl: "./webpack/src/webgl - viewer/main.js",
        babylon:"./webpack/src/babylon.js - viewer/main.js",
    },
    watch: true,
    devtool: "eval-source-map",
    target: "web",
    output: {
        filename: '[name].js',
        path: path.resolve("./public/js/dist"),
    },
    plugins: [
        new CleanWebpackPlugin(
            ['dist'], {root: path.resolve("./public/js")}
        ),
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ],
    module: {
        rules: [{
                test: /\.worker\.js$/,
                use: {
                    loader: 'worker-loader',
                    options: {
                    publicPath: '/js/dist/'
                    }
                }
            }]
    }
};