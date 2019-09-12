module.exports = {
  source: './source',
  public: './public',
  static: './public/static',
  external: {
    styles: [
      './node_modules/foundation-sites/scss',
    ],
  },
  webpack: {
    exclude: './source/js/wp-exclude/**/*.js', // exclude files from webpack bundle
  },
};
