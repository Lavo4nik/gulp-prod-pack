import pkg from 'gulp';
const { task, src, dest, watch, series, parallel } = pkg;
import gulpSass from 'gulp-sass';
import * as darkSass from 'sass';
const sass = gulpSass(darkSass);
import clean from 'gulp-clean';
import fileinclude from 'gulp-file-include';
import GulpCleanCss from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import minify from 'gulp-js-minify';
import browserSync from 'browser-sync';



task ('clearDist', () => {
    return src('./dist/**/*', {read: false})
    .pipe(clean());
})

task('styleCSS', () => {
    return src('./src/styles/**/*.scss')
    .pipe(sourcemaps.init())
        .pipe(sass.sync({
            outputStyle: 'expanded'
        })
        .on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('./dist/css/'));
})

task('cleanCSS', () => {
 return src('./dist/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(GulpCleanCss())
    .pipe(sourcemaps.write('./min/'))
    .pipe(dest('./dist/css/'));
    
})


task('buildHTML', () => {
    return src('./src/*.html')
        .pipe(fileinclude())
        .pipe(dest('./dist'));

   })
task('buildJS', () => {
    src('./src/js/*.js')
        .pipe(minify())
    .pipe(dest('./dist/js'));
})


task ('server', () => {
    return browserSync.init({
        server: {
            baseDir:['dist']
        },
        port:9000,
        open:true
    })
})


task('watcher', () => {

    watch('./src/styles/**/*.scss', parallel('styleCSS')).on('change',browserSync.reload);
    watch('./src/**/*.html', parallel('buildHTML')).on('change',browserSync.reload);
    watch('./src/js/**/*.js', parallel('buildJS')).on('change',browserSync.reload);

})
task ('builder', series('clearDist','styleCSS','cleanCSS','buildHTML','buildJS'));

task ('start',parallel('server','watcher'));