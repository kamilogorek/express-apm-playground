const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    mode: 'development',
    devtool: 'source-map',
    entry: './frontend.js',
    target: 'web',
    plugins: [
      new HtmlWebpackPlugin(),
    ],
  },
];
