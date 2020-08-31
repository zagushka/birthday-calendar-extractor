const ExtensionReloader = require('webpack-extension-reloader');
const {mergeWithCustomize, customizeArray} = require('webpack-merge');
const common = require('./webpack.common.js');

const plugins = [];
if (process.env.HMR) {
  plugins.push(new ExtensionReloader({
    // entries: {
    //   contentScript: 'content',
    //   background: 'background',
    //   popup: 'popup',
    // }
    reloadPage: true
  }))
}

module.exports = mergeWithCustomize({
  customizeArray: customizeArray({
    'plugins': 'prepend'
  }),
})
(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: plugins,
});
