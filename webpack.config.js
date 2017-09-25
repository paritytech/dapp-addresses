const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry:{
    dist: './index.js'
  },
  output:{
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: '../dist.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: '../index.html',
      filename: 'index.html',
      chunks: ['dist']
    })
  ]
}
