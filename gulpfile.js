// Required dependencies

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sassLint = require('gulp-sass-lint');
    
// Gulp task to minify CSS files
gulp.task('styles', function () {
  return gulp.src('public/styles/sass/**/*.scss')
    // Sass-Lint
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    // Compile SASS files
    .pipe(sass())
    // Auto-prefix CSS styles
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    // Minify the file
    .pipe(csso())
    //Rename
    .pipe(rename({
            suffix: '.min'
        }))
    // Output
    .pipe(gulp.dest('public/styles/'));
});

// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
  return gulp.src('public/scripts/js/**/*.js')
    // Minify the file
    .pipe(uglify())
    //Rename
    .pipe(rename({
            suffix: '.min'
        }))
    // Output
    .pipe(gulp.dest('public/scripts'))
});

gulp.task('default', function() {
   gulp.run('styles');
   gulp.run('scripts');
});