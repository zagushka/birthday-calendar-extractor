const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {version} = require('./package.json');
const ejs = require('ejs');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    'background': './background.ts',
    // 'content': './content.ts',
    'popup/popup': './popup/popup.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      // {
      //   test: /\.css$/,
      //   use: [MiniCssExtractPlugin.loader, 'css-loader'],
      //   sideEffects: true,
      // },
      {
        test: /\.scss$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'style-loader', 'css-loader', 'sass-loader'],
        sideEffects: true,
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          outputPath: '/images/',
          emitFile: true,
          esModule: false,
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          outputPath: './fonts/',
          emitFile: true,
          esModule: false,
        },
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      global: 'window',
    }),
    // new MiniCssExtractPlugin({
    //   filename: '[name].css',
    // }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'), to: './',
          globOptions: {
            ignore: ['**/manifest.json'],
          },
        },
        // Append variables to popup.html
        {from: 'popup/popup.html', to: 'popup/popup.html', transform: transformHtml},
        // Update manifest version from package.json
        {
          from: '../public/manifest.json',
          to: 'manifest.json',
          transform: (content) => {
            const jsonContent = JSON.parse(content);
            jsonContent.version = version;
            return JSON.stringify(jsonContent, null, 2);
          },
        },
      ]
    }),
  ],
  mode: 'production'
};

function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env,
  });
}
