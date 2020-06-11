const ExtensionReloader = require('webpack-extension-reloader');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge.strategy({
  plugins: 'prepend'
})
(common, {
  mode: 'development',
  watch: true,
  devtool: 'inline-source-map',
  plugins: [
    new ExtensionReloader({
      entries: {
        contentScript: 'content',
        background: 'background',
        popup: 'popup',
      }
    }),
  ],
});
