var
	gulp = require('gulp'),
	browserify = require('browserify'),
	watch = require('gulp-watch'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	del = require( 'del'),
	uglify = require('gulp-uglify')
;

gulp.task( 'watch', function()
{
	watch( 'example/example.js', function()
	{
		gulp.start( 'build-example' );
	} );

	watch( 'src/**/*.js', function()
	{
		gulp.start( 'build-example' );
	} );
} );

gulp.task( 'build-example', function()
{
	return browserify( 'example/example.js')
		.bundle()
		.pipe( source( 'example-build.js' ) )
		.pipe( gulp.dest( 'example' ) )
		.pipe( buffer() )
		.pipe( uglify() )
	;
} );

gulp.task( 'default', [ 'watch' ] );