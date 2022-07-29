const path = require('path');
const ExtensionReloader = require('webpack-ext-reloader');
const { mergeWithCustomize, customizeArray } = require('webpack-merge');
const common = require('./webpack.common');

const plugins = [];
if (process.env.HMR) {
  plugins.push(new ExtensionReloader({
    manifest: path.resolve(__dirname, 'public/manifest.json'),
    // entries: {
    //   contentScript: 'content',
    //   background: 'background',
    //   popup: 'popup',
    // }
    // reloadPage: true,
  }));
}

module.exports = mergeWithCustomize({
  customizeArray: customizeArray({
    plugins: 'prepend',
  }),
})(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins,
});
