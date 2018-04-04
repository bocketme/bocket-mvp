const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJs = require('uglifyjs-webpack-plugin');
const webpack = require('webpack')
const tsImportPluginFactory = require('ts-import-plugin')

const NODE_ENV = JSON.stringify(process.env.NODE_ENV)

const config = {
  entry: {
    app: './bocket-view/src/App.tsx',
    threejs: './viewer/src/three.js - viewer/main.js',
    //webgl: './viewer/src/webgl - viewer/main.js',
    //babylon: './viewer/src/babylon.js - viewer/main.js',
  },
  devtool: NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : false,
  target: 'web',
  mode: 'none',
  output: {
    filename: '[name].js',
    path: path.resolve('./public/js/viewer/bocket'),
  },
  module: {
    rules: [{
      test: /\.tsx?/,
      loader: 'tslint-loader',
      enforce: 'pre',
      exclude: [/node_modules/]
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.tsx?/,
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        compilerOptions: {
          module: 'es2015',
        }
      },
      exclude: [/node_modules/]
    },
    {
      test: /\.ts?/,
      loader: 'ts-loader',
      exclude: [/node_modules/]
    },]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV }
    }),
    new CleanWebpackPlugin(['bocket'], { root: path.resolve('./public/js/viewer/') }),
  ],
};

module.exports = config;
