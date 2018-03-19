const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
  entry: {
    threejs: './viewer/src/three.js - viewer/main.js',
    webgl: './viewer/src/webgl - viewer/main.js',
    babylon: './viewer/src/babylon.js - viewer/main.js',
  },
  watch: false,
  devtool: 'eval-source-map',
  target: 'web',
  output: {
    filename: '[name].js',
    path: path.resolve('./public/js/viewer/bocket'),
  },
  module: {
    /*
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: ['babel-loader'],
    }],
    */
  },
  plugins: [
    new CleanWebpackPlugin(['bocket'], { root: path.resolve('./public/js/viewer/') }),
  ],
};

module.exports = config;
