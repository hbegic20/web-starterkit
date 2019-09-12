const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const app = require('./app.config.js');

module.exports = {
  entry: {
    'common.bundle': `${app.source}/js/common.js`,
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, `${app.static}/js`),
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin({
      clearConsole: false,
    }),
    new WriteFilePlugin({
      test: /\.js$/,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disable',
      logLevel: 'silent',
      generateStatsFile: true,
      statsOptions: { source: false },
    }),
  ],
};
