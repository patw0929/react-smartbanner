/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

var webpack = require('webpack');
    path = require('path');
var eslintrcPath = path.resolve(__dirname, '.eslintrc');

module.exports = {

  output: {
    publicPath: './assets/',
    path: 'example/assets/',
    filename: '[name].js'
  },

  debug: false,
  devtool: false,
  entry: {
    example: ['./src/example.js']
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },

  stats: {
    colors: true,
    reasons: false
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.NormalModuleReplacementPlugin(
      /^react-smartbanner$/,
      __dirname + '/dist/main.js'
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^\.\/main\.css$/,
      __dirname + '/dist/main.css'
    ),
  ],

  resolve: {
    extensions: ['', '.js'],
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }]
  },

  eslint: {
    configFile: eslintrcPath
  }
};
