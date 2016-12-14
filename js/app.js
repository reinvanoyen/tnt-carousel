"use strict";

var Carousel = require( '../src/Carousel.js' );

var carousel;

setTimeout( function() {

	carousel = new Carousel( document.querySelector( '.carousel' ), {
		mouseSwipe: true
	} );

}, 5000 );

window.addEventListener( 'resize', function() {
	console.log('resizing');
} );

setTimeout( function() {
	carousel.destroy();
}, 10000 );