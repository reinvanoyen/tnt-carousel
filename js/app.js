"use strict";

var Carousel = require( '../src/carousel.js' );

var carousel = new Carousel( document.querySelector( '.carousel' ), {
	autoplay: false,
	mouseSwipe: false,
	arrowButtonsContainer: document.querySelector( 'body' )
} );