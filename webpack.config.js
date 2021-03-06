const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJs = require('uglifyjs-webpack-plugin');
const dev = process.env.NODE_ENV === "dev";

const config = {
  entry: {
    threejs: './viewer/src/three.js - viewer/main.js'
  },
  watch: dev,
  node: { fs: 'empty' },
  devtool: dev ? 'cheap-module-eval-source-map' : false,
  target: 'web',
  output: {
    filename: '[name].js',
    path: path.resolve('./public/js/viewer/bocket'),
  },
  plugins: [
    new CleanWebpackPlugin(['bocket'], { root: path.resolve('./public/js/viewer/') }),
  ],
};

if (!dev) {
  config.plugins.push(new UglifyJs({
    sourceMap: true
  }));
}

module.exports = config;
