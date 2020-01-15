var gulp = require('gulp');
var del = require('del');

function performCleanAndCopy(config) {
    del([config.destination + '/**/*'])
    gulp.src(config.source + '/**/*', {base: config.source}).pipe(gulp.dest(config.destination));
    startWatching(config)
}

function startWatching(config) {
    var watcher = gulp.watch(config.source + '/**/*')
    watcher.on('change', function(path, stats) {
        watcher.close()
        performCleanAndCopy(config)
    })
    watcher.on('unlink', function(path, stats) {
        watcher.close()
        performCleanAndCopy(config)
    })
}

gulp.task('watch', function() {
    performCleanAndCopy({
        source: './src/front/dist',
        destination: './public/assets/scripts',
    })
});
