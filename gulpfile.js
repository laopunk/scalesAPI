var   gulp = require('gulp')
	, browserify = require('browserify')
    , uglify = require('gulp-uglify')
    , source = require('vinyl-source-stream')
    , buffer = require('vinyl-buffer')
    , shell = require('gulp-shell')
;

var src = 'src/main.js'

gulp.task('build', function(){
    browserify(src)
        .bundle()
        .on('error', function(err){ console.log(err.message); })
        .pipe(source('scalesAPI.js'))  //output stream
        .pipe(gulp.dest('lib/'))
        ;
});

gulp.task('compress', function(){
    browserify(src)
        .bundle()
        .on('error', function(err){ console.log(err.message); })
        .pipe(source('scalesAPI.min.js'))  //output stream
        .pipe(buffer())
        .pipe(uglify())
        .on('error', function(err){ console.log(err); })
        .pipe(gulp.dest('lib/'))
        ;
});


gulp.task( 'doc', shell.task( [
  './node_modules/jsdoc/jsdoc.js src/scalesAPI.js -d doc/ -P package.json -R README.md '
] ) );


gulp.task('watch', function() {
    gulp.watch([src,'src/scalesAPI.js'], ['build','compress','doc']);
});

gulp.task('default', ['build','compress','doc','watch']);

