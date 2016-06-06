var util = {};

util.proxy = function( c, f ) {
	
	var args = Array.prototype.slice.call( arguments, 2 );

	return function() {

		return f.apply( c, args.concat( Array.prototype.slice.call( arguments ) ) );
	};
};

util.extend = function( defaults, options ) {

	var extended = {};
	var prop;

	for( prop in defaults ) {

		if( Object.prototype.hasOwnProperty.call( defaults, prop ) ) {
			extended[ prop ] = defaults[ prop ];
		}
	}

	for( prop in options ) {

		if( Object.prototype.hasOwnProperty.call( options, prop ) ) {
			extended[ prop ] = options[ prop ];
		}
	}

	return extended;
};

util.removeElement = function( element ) {

	element && element.parentNode && element.parentNode.removeChild( element );
};

util.loadImages = function( _images, callback ) {

	var amountLoaded = 0,
		amountToLoad = _images.length
		;

	if( amountToLoad === 0 ) {
		callback();
	}

	for( var i = 0; i < _images.length; i++ ) {

		var image = new Image();

		image.onload = function() {

			amountLoaded++;

			if( amountLoaded === amountToLoad ) {

				callback();
			}
		};

		image.src = _images[ i ].getAttribute( 'src' );
	}
};

module.exports = util;