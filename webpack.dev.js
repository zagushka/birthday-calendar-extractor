const ExtensionReloader = require('webpack-extension-reloader');
const {merge, mergeWithCustomize, customizeArray} = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = mergeWithCustomize({
  customizeArray: customizeArray({
    'plugins': 'prepend'
  }),
})
(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new ExtensionReloader({
      // entries: {
      //   contentScript: 'content',
      //   background: 'background',
      //   popup: 'popup',
      // }
      reloadPage: true
    }),
  ],
});
