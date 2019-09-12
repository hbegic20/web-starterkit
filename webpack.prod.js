const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  stats: {
    entrypoints: false,
    colors: true,
    modules: false,
    children: false,
  },
});
