var $ = require( 'jquery' );
var Carousel = require( '../src/index.js' );

$( document ).ready( function() {
	var carousel1 = new Carousel( $( 'ul.no-images' ) );
	var carousel2 = new Carousel( $( 'ul.images' ) );
	var carousel3 = new Carousel( $( 'ul.padding' ) );
} );