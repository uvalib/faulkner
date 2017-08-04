'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import access from 'gulp-accessibility';
import swPrecache from 'sw-precache';
import rename from 'gulp-rename';

const $ = gulpLoadPlugins();

// Test our website accessibility
gulp.task('accessibility', function() {
  return gulp.src('./_site/**/*.html')
    .pipe(access({
      force: true,
      verbose: false, // true: to output error to console; false: output report files only
      options: {
          accessibilityLevel: 'WCAG2AA',
          reportLocation: 'accessibility-reports',
          reportLevels: {
              notice: true,
              warning: true,
              error: true
          }
      }
    }))
    .on('error', console.log)
    .pipe(access.report({reportType: 'txt'}))
    .pipe(rename({extname: '.txt'}))
    .pipe(gulp.dest('reports/json'));
});

// Minify the HTML.
gulp.task('minify-html', () => {
  return gulp.src('_site/**/*.html')
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    }))
    .pipe(gulp.dest('_site'));
});

// Optimize images.
gulp.task('minify-images', () => {
  gulp.src('images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('_site/images'));
});

// Concatenate, transpiles ES2015 code to ES5 and minify JavaScript.
gulp.task('scripts', () => {
  gulp.src([
    // Note: You need to explicitly list your scripts here in the right order
    // to be correctly concatenated
    './_scripts/vendor/medium-lightbox.js',
    './_scripts/vendor/anime.js',
    './_scripts/vendor/headroom.js',
    './_scripts/main.js'
  ])
    // .pipe($.babel())
    .pipe($.concat('main.min.js'))
    .pipe($.uglify({preserveComments: 'some'}))
    .pipe(gulp.dest('scripts'));
});

// Minify and add prefix to css.
gulp.task('css', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src('css/main.css')
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.cssnano())
    .pipe(gulp.dest('_site/css'));
});

// Compile scss to css.
gulp.task('scss', () => {
    return gulp.src('scss/main.scss')
        .pipe($.sass({
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(gulp.dest('css'));
});

// Watch change in files.
gulp.task('serve', ['jekyll-build-dev'], () => {
  browserSync.init({
    notify: false,
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: '_site',
    port: 3000
  });

  // Watch html changes.
  gulp.watch([
    'css/**/*.css',
    'scripts/**/*.js',
    '_includes/**/*.html',
    '_layouts/**/*.html',
    '_posts/**/*.md',
    '*.md',
    '*.html',
    '_config.yml'
  ], ['jekyll-build-dev', browserSync.reload]);

  // Watch scss changes.
  gulp.watch('scss/**/*.scss', ['scss']);

  // Watch JavaScript changes.
  gulp.watch('_scripts/**/*.js', ['scripts']);
});

// Generate service worker on faulkner2017.lib.virginia.edu
gulp.task('generate-service-worker-production', function(callback) {
  var path = require('path');
  var rootDir = '_site';

  swPrecache.write(path.join(rootDir, 'sw.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,json}'],
    stripPrefix: rootDir,
    replacePrefix: ''
  }, callback);
});

// Generate service worker on uvalib.github.io/faulkner
gulp.task('generate-service-worker-gh-pages', function(callback) {
  var path = require('path');
  var rootDir = '_site';

  swPrecache.write(path.join(rootDir, 'sw.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,json}'],
    stripPrefix: rootDir,
    replacePrefix: '/faulkner'
  }, callback);
});

gulp.task('jekyll-build-prod', ['scripts', 'scss'], $.shell.task([ 'jekyll build --config _config.yml' ]));
gulp.task('jekyll-build-test', ['scripts', 'scss'], $.shell.task([ 'jekyll build --config _config-test.yml' ]));
gulp.task('jekyll-build-dev', ['scripts', 'scss'], $.shell.task([ 'bundle exec jekyll build --config _config.yml,_config-dev.yml' ]));

// Default local task.
gulp.task('default', () =>
  runSequence(
    'scss',
    'jekyll-build-dev',
    'minify-html',
    'css',
    'generate-service-worker-production',
    'minify-images'
  )
);

// Deploy website to static01.
gulp.task('deploy-to-prod', () => {
  runSequence(
    'scss',
    'jekyll-build-prod',
    'minify-html',
    'css',
    'generate-service-worker-production',
    'minify-images'
  )
});

// Deploy website to gh-pages.
gulp.task('gh-pages', () => {
  return gulp.src('./_site/**/*')
    .pipe($.ghPages());
});

gulp.task('deploy-to-test', () => {
  runSequence(
    'scss',
    'jekyll-build-test',
    'minify-html',
    'css',
    'generate-service-worker-gh-pages',
    'minify-images',
    'gh-pages'
  )
});
