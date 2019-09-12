/* ===========================================
// WEB STARTERKIT
// =========================================== */

const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const cacheBust = require('gulp-cache-bust');
const changed = require('gulp-changed');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const nunjucks = require('gulp-nunjucks-render');
const postcss = require('gulp-postcss');
const pxtorem = require('postcss-pxtorem');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const uglifyjs = require('gulp-uglify');
const watch = require('gulp-watch');
const webpack = require('webpack');
const gulpif = require('gulp-if');
const { argv } = require('yargs');
const webPackDevMiddleware = require('webpack-dev-middleware');

const app = require('./app.config.js');
const webpackConfig = require('./webpack.dev.js');

/* ===============================================
// TASKS
// ============================================= */

// SASS
gulp.task('sass', () => gulp.src(`${app.source}/styles/**/*.scss`)
  .pipe(sassGlob())
  .pipe(gulpif(argv.devel, sourcemaps.init()))
  .pipe(gulpif(argv.devel, sass({
    includePaths: app.external.styles,
    outputStyle: 'expanded',
  })).on('error', sass.logError))
  .pipe(gulpif(argv.production, sass({
    includePaths: app.external.styles,
    outputStyle: 'compressed',
  })).on('error', sass.logError))
  .pipe(gulpif(argv.devel, postcss([
    autoprefixer(),
  ])))
  .pipe(gulpif(argv.production, postcss([
    autoprefixer(),
    pxtorem({
      propList: ['*', '!line-height'],
    }),
  ])))
  .pipe(gulpif(argv.devel, sourcemaps.write('.')))
  .pipe(gulp.dest(`${app.static}/css`)));

// JS
gulp.task('js', () => gulp.src(`${app.webpack.exclude}`)
  .pipe(changed(`${app.static}/js`))
  .pipe(gulpif(argv.devel, sourcemaps.init()))
  .pipe(babel())
  .pipe(gulpif(argv.production, uglifyjs()))
  .pipe(gulpif(argv.devel, sourcemaps.write('.')))
  .pipe(gulp.dest(`${app.static}/js`)));

// NUNJUCKS
const dataJSON = `${app.source}/data/data.json`;

gulp.task('njk', () => gulp.src(`${app.source}/pages/**/*.njk`)
  .pipe(nunjucks({
    path: app.source,
    data: JSON.parse(fs.readFileSync(dataJSON)),
  }))
  .pipe(htmlmin({
    collapseWhitespace: true,
    preserveLineBreaks: true,
  }))
  .pipe(gulpif(argv.production, cacheBust({
    type: 'timestamp',
  })))
  .pipe(gulp.dest(`${app.public}/`)));

// COPY TASKS
gulp.task('copy:images', () => gulp.src(`${app.source}/images/**/*.{jpg,jpeg,png,gif,svg}`)
  .pipe(gulp.dest(`${app.static}/images`)));

gulp.task('copy:ico', () => gulp.src(`${app.source}/images/**/*.ico`)
  .pipe(gulp.dest(`${app.static}/images`)));

gulp.task('copy:fonts', () => gulp.src(`${app.source}/fonts/**/*.*`)
  .pipe(gulp.dest(`${app.static}/fonts`)));

gulp.task('copy:uploads', () => gulp.src(`${app.source}/uploads/**/*.*`)
  .pipe(gulp.dest(`${app.static}/uploads`)));

// COPY ALL
gulp.task('copy:all', gulp.parallel('copy:fonts', 'copy:ico', 'copy:uploads'));

// DELETE
gulp.task('delete:all', () => del(`${app.public}/`));

// IMAGEMIN
gulp.task('imagemin:all', () => gulp.src(`${app.source}/images/**/*.{jpg,jpeg,png,gif,svg}`)
  .pipe(gulpif(argv.production, imagemin([
    imageminJpegRecompress({
      progressive: true,
      max: 85,
      min: 70,
    }),
    imagemin.gifsicle({ interlaced: true }),
    imagemin.optipng({ optimizationLevel: 5 }),
    imagemin.svgo({
      plugins: [
        { removeViewBox: false },
        { cleanupIDs: false },
        { removeUselessDefs: false },
      ],
    }),
  ], { verbose: true })))
  .pipe(gulp.dest(`${app.static}/images`)));

/* ===============================================
// SERVER
// ============================================= */

const bundler = webpack(webpackConfig);

gulp.task('browsersync', (done) => {
  browserSync.init({
    port: 8080,
    ui: false,
    logPrefix: 'WS',
    server: {
      baseDir: `${app.public}/`,
    },
    notify: false,
    middleware: [
      webPackDevMiddleware(bundler, {
        publicPath: webpackConfig.output.publicPath,
        stats: 'none',
        logLevel: 'silent',
      }),
    ],
  });
  done();
});

bundler.plugin('done', () => browserSync.reload());

/* ===============================================
// WATCHERS
// ============================================= */

function reload(done) {
  browserSync.reload();
  done();
}

function reloadCSS(done) {
  browserSync.reload('*.css');
  done();
}

function reloadJS(done) {
  browserSync.reload('*.js');
  done();
}

function watchers(done) {
  gulp.watch(`${app.source}/**/*.scss`, {
    awaitWriteFinish: true,
  }).on('change', gulp.series('sass', reloadCSS));

  gulp.watch(app.webpack.exclude, {
    awaitWriteFinish: true,
  }).on('change', gulp.series('js', reloadJS));

  watch([`${app.source}/**/*.njk`, dataJSON], gulp.series('njk', reload));
  watch(`${app.source}/images/**/*.*`, gulp.series('copy:images', reload));
  done();
}

/* ===============================================
// GLOBAL TASKS
// ============================================= */

gulp.task('serve', gulp.series('delete:all', 'imagemin:all', 'copy:all', 'njk', 'sass', 'js', 'browsersync', watchers));
gulp.task('build', gulp.series('delete:all', 'imagemin:all', 'copy:all', 'njk', 'sass', 'js'));
