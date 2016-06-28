/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */

var webpack = require('webpack'),
    path = require('path');
var eslintrcPath = path.resolve(__dirname, '.eslintrc');

module.exports = {
  devtool: 'eval',
  watch: true,
  output: {
    filename: '[name].js',
    publicPath: '/assets/'
  },
  entry: {
    main: [
      'webpack/hot/only-dev-server',
      './src/components/SmartBanner.js'
    ],
    example: [
      'webpack/hot/only-dev-server',
      './src/example.js'
    ]
  },

  stats: {
    colors: true,
    reasons: true
  },

  resolve: {
    extensions: ['', '.js'],
    alias: {
      'styles': __dirname + '/src/styles',
      'mixins': __dirname + '/src/mixins',
      'components': __dirname + '/src/components/',
      'react-smartbanner': './components/SmartBanner.js'
    }
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel'
    }, {
      test: /\.scss/,
      loader: 'style!css!sass?outputStyle=expanded'
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.(png|jpg|woff|woff2)$/,
      loader: 'url?limit=8192'
    }]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  eslint: {
    configFile: eslintrcPath
  }
};
