var $ = require( 'jquery' );
var utils = {};

utils.loadImages = function( $images, callback ) {

	var amountLoaded = 0,
		amountToLoad = $images.length
	;

	if( amountToLoad === 0 ) {
		callback();
	}

	$images.each( function() {
		var image = new Image();

		image.onload = function() {

			amountLoaded++;

			if( amountLoaded === amountToLoad )
			{
				callback();
			}
		}

		image.src = $( this ).attr( 'src' );
	} );
};

module.exports = utils;