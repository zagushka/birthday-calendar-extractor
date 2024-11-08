const ZipPlugin = require('zip-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new ZipPlugin({
      path: '../',
      filename: 'birthday-calendar-exporter.zip',
    }),
  ],
});
