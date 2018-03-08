const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');
const webpack = require('webpack');
module.exports = merge (baseConfig, {
  devtool: 'eval-source-map',
  watch: true,
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ]
});