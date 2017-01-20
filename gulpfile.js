const gulp = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const eslint = require('gulp-eslint');
const watch = require('gulp-watch');

const lint = (file) =>
  gulp.src(file)
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('error', notify.onError('Error: <%= error.message %>'));

gulp.task('lint', () => lint('src/*.js'));
gulp.task('lint-gulp', () => lint('gulpfile.js'));

gulp.task('default', ['lint', 'lint-gulp'], () => {
  watch('gulpfile.js', () => gulp.run(['lint-gulp']));
  watch('src/*.js', () => gulp.run(['lint']));
});
