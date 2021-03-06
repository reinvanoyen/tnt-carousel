"use strict";

var Carousel = require( '../src/Carousel.js' );

var carousel = new Carousel( document.querySelector( '.carousel' ), {
	mouseSwipe: true
} );

carousel.on( 'goTo', function( e ) {

	console.log( e.index );
} );

setTimeout( function() {

	var li = document.getElementById('recalc');
	li.classList.add('changed');

	carousel.refresh();

}, 1000 );