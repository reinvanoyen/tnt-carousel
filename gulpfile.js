var
	gulp = require('gulp'),
	browserify = require('browserify'),
	watch = require('gulp-watch'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	del = require( 'del')
;

gulp.task( 'watch', function()
{
	watch( 'sass/**/*.scss', function()
	{
		gulp.start( 'sass' );
	} );

	watch( 'js/app.js', function()
	{
		gulp.start( 'build-site' );
	} );

	watch( 'src/**/*.js', function()
	{
		gulp.start( 'build-site' );
	} );
} );

gulp.task( 'sass', function() {
	return gulp.src( 'sass/**/*.scss' )
		.pipe( sass() )
		.pipe( autoprefixer( 'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1' ) )
		.pipe( gulp.dest( 'style' ) )
	;
} );

gulp.task( 'build-site', function() {

	return browserify( 'js/app.js')
		.transform( 'babelify', { presets: ['es2015'] } )
		.bundle()
		.pipe( source( 'build.js' ) )
		.pipe( gulp.dest( 'js' ) )
		.pipe( buffer() )
		.pipe( gulp.dest( 'js' ) )
	;
} );

gulp.task( 'default', [ 'watch' ] );