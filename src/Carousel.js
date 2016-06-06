/*

tnt-carousel
------------

Author: Rein Van Oyen <rein@tnt.be>
Website: http://www.tnt.be
Repo: http://github.com/reinvanoyen/tnt-carousel
Issues: http://github.com/reinvanoyen/tnt-carousel/issues

*/

"use strict";

let tnt = require('tnt-dom');
let util = require('./util');
let defaultOptions = require('./defaults');

class Carousel {

	constructor( element, options ) {

		this.el = element;
		this.options = util.extend( defaultOptions, options );

		this.setup();
	}

	setup() {

		this.children = new tnt( this.el.children );
		this.slideCount = this.children.length();

		this.refresh();
		this.build();
		this.refreshBuild();

		this.slideTo( 0 );
	}

	refresh() {

		let firstSlide = this.children.get( 0 );

		this.slideHeight = firstSlide.offsetHeight;
		this.slideWidth = firstSlide.offsetWidth;

		//
		this.visibleSlideCount = Math.floor( this.el.offsetWidth / this.slideWidth );

		// Wrap width
		this.wrapWidth = this.slideWidth * this.slideCount;

		// Resize each child
		this.children.css( 'height', this.slideHeight + 'px' );
		this.children.css( 'width', this.slideWidth + 'px' );
	}

	build() {

		this.wrap = new tnt( '<div class="tnt-carousel-wrap">' );
		this.children.wrap( this.wrap );
	}

	refreshBuild() {

		this.wrap.css( 'width', this.wrapWidth + 'px' );
		this.wrap.css( 'height', this.slideHeight + 'px' );
		this.wrap.css( 'overflow', 'hidden' );
	}

	slideTo( index ) {

		let offset = this.slideWidth * index;
		this.wrap.css( 'transform', 'translateX(-' + offset + 'px)' );
	}
}

module.exports = Carousel;