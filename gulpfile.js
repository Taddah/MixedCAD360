var gulp = require('gulp'),
    jscs = require('gulp-jscs'),
    babel = require('gulp-babel'),
    inject = require('gulp-inject'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    del = require('del'),
    rimraf = require("gulp-rimraf"),
    nodemon = require('gulp-nodemon'),
    ignore = require('gulp-ignore'),
    browserSync = require('browser-sync');

var onError = function (err) {
    console.log('An error occurred:', err.message);
    this.emit('end');
};

gulp.task('check-js-style', function () {
    gulp.src('src/**/*.js')
        .pipe(jscs({fix: true}))
        .pipe(jscs.reporter())
        .pipe(jscs.reporter('fail'))
        .pipe(gulp.dest('src'));
});

gulp.task('serve', ['default', 'watch'], function () {
    var files = [
        './dist/*.pug',
        './dist/public/css/**/*.css',
        './dist/public/js/**/*.js'
    ];

    browserSync.init(files, {
        server: {
            baseDir: './dist'
        }
    });
});

gulp.task('start', ['build'], function (done) {
    nodemon({
      script: './dist/bin/www/www'
    , ext: 'js pug css scss'
    , env: { 'NODE_ENV': 'development' }
    , done: done
    });
  })

gulp.task('scss', function () {
    return gulp.src('./src/public/css/application.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass())
        .pipe(gulp.dest('./dist/public/css'));
});

gulp.task('babel', ['scss'], function () {
    return gulp.src('src/public/**/*.js')
        .pipe(plumber({errorHandler: onError}))
        .pipe(babel())
        .pipe(gulp.dest('./dist/public/js'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.scss', ['default']);
    gulp.watch('./src/**/*.js', ['default']);
    gulp.watch('./src/**/*.pug', ['default']);
});

gulp.task('jshint', ['babel', 'scss'], function () {
    return gulp.src('src/public/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('default', ['cleanDist', 'jshint', 'babel', 'copyJsLib', 'copyCssLib'], function () {

    gulp.src('src/public/images/**/*')
        .pipe(gulp.dest('dist/public/images'));

    gulp.src('src/routes/**/*')
        .pipe(gulp.dest('dist/routes'));

    gulp.src('src/views/**/*')
        .pipe(gulp.dest('dist/views'));

    gulp.src('src/app.js')
        .pipe(gulp.dest('dist/'));

    gulp.src('src/bin/www')
        .pipe(gulp.dest('dist/bin/www'));

    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(inject(gulp.src(['dist/public/js/**/*.js', 'dist/public/css/lib/*.css', 'dist/public/css/*.css'], {read: false}), {relative: true}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('copyJsLib', ['cleanDist'], function () {
    return gulp.src(['bower_components/material-design-lite/material.js', 'bower_components/d3/d3.js',
        'bower_components/nvd3/build/nv.d3.js', 'bower_components/getmdl-select/getmdl-select.min.js'])
        .pipe(gulp.dest('dist/public/js'));
});

gulp.task('copyMinJsLib', ['cleanDist'], function () {
    return gulp.src(['bower_components/material-design-lite/material.min.js', 'bower_components/d3/d3.min.js',
        'bower_components/nvd3/build/nv.d3.min.js', 'bower_components/getmdl-select/getmdl-select.min.js'])
        .pipe(gulp.dest('dist/public/js'));
});

gulp.task('copyCssLib', ['cleanDist'], function () {
    return gulp.src(['bower_components/nvd3/build/nv.d3.css', 'bower_components/getmdl-select/getmdl-select.min.css'])
        .pipe(gulp.dest('dist/public/css/lib'));
});

gulp.task('copyMinCssLib', ['cleanDist'], function () {
    return gulp.src(['bower_components/nvd3/build/nv.d3.min.css', 'bower_components/getmdl-select/getmdl-select.min.css'])
        .pipe(gulp.dest('dist/public/css/lib'));
});


gulp.task('cleanDist', function () {
    return del(['dist/**/*','!dist/public', '!dist/public/uploads', '!dist/public/uploads/**'], 
    {force: true});
});

gulp.task('minifyJs', ['cleanDist'], function () {
    return gulp.src('src/public/**/*.js')
        .pipe(rename({suffix: '.min'}))
        .pipe(plumber({errorHandler: onError}))
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('dist/public'));
});

gulp.task('minifyCss', ['cleanDist'], function () {
    return gulp.src('src/public/css/application.scss')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sass())
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/public/css'));
});

gulp.task('build', ['minifyJs', 'minifyCss', 'copyMinCssLib', 'copyMinJsLib'], function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist/public/'))
        .pipe(inject(gulp.src(['dist/public/js/**/*.js', 'dist/public/css/lib/*.css',
            'dist/public/css/*.css'], {read: false}), {relative: true}))
        .pipe(gulp.dest('dist/'));

    gulp.src('src/public/images/**/*')
        .pipe(gulp.dest('dist/public/images'));

    gulp.src('src/public/uploads/**/*')
        .pipe(gulp.dest('dist/public/uploads'));    
    
    gulp.src('src/routes/**/*')
        .pipe(gulp.dest('dist/routes'));

    gulp.src('src/views/**/*')
        .pipe(gulp.dest('dist/views'));

    gulp.src('src/controllers/**/*')
        .pipe(gulp.dest('dist/controllers'));

    gulp.src('src/models/**/*')
        .pipe(gulp.dest('dist/models'));

    gulp.src('src/bin/www')
        .pipe(gulp.dest('dist/bin/www'));

    gulp.src('src/app.js')
        .pipe(gulp.dest('dist/'));

    gulp.src('*.*', {read: false})
        .pipe(gulp.dest('./dist/public/uploads'))
});