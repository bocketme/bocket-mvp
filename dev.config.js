const merge = require('webpack-merge');
const baseConfig = require('./webpack.config');

module.exports = merge (baseConfig, {
    devtool: 'eval-source-map',
    watch: true,
});