const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'content': './src/content.ts',
    'popup': './src/popup.ts',
    'background': './src/background.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name]/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyPlugin([
      { from: './public', to: './' },
    ]),
  ],
  mode: 'production'
};
