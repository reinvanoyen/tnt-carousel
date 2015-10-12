var $ = require( 'jquery' );
var Carousel = require( '../src/index.js' );

$( document ).ready( function() {

	$( '.carousel' ).each( function() {
		var carousel = new Carousel( $( this ) );
	} );
} );