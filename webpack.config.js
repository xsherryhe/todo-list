const path = require('path'),
      HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/scripts/index.js',
  devtool: 'inline-source-map',
  plugins: [new HtmlWebpackPlugin({ title: 'To-Do List', template: './src/index.html' })],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [{ test: /\.html$/i, use: ['html-loader'] },
            { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
            { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset/resource' },
            { test: /\.(ttf|woff|woff2|eot|otf)$/i, type: 'asset/resource' }]
  }
}
