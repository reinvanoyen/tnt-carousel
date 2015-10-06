/*

TNT CAROUSEL
------------

Author: Rein Van Oyen <rein@tnt.be>
Website: http://www.tnt.be
Repo: http://github.com/ReinVO/tnt-carousel
Issues: http://github.com/ReinVO/tnt-carousel/issues

*/

var $ = require( 'jquery' );
var utils = require( './utils.js' );

var Carousel = function( $element, options ) {

	var that = this;

	this.options = {
		autoplay: false,
		playInterval: 1000,
		touchEvents: true
	};

	$.extend( this.options, options );

	this.$element = $element;
	this.$slides = this.$element.children();
	this.$images = this.$element.find( 'img' );

	this.amountOfSlides = this.$slides.length;
	this.activeIndex = 0;
	this.translateX = 0;
	this.dragDistance = 0;

	utils.loadImages( this.$images, function() {
		that.build();
	} );
};

Carousel.prototype.build = function() {

	this.$wrap = this.$element.wrap( '<div>' ).parent();

	this.$prevButton = $( '<button>' )
		.addClass( 'carousel-prev-button' )
		.appendTo( this.$wrap )
	;

	this.$nextButton = $( '<button>' )
		.addClass( 'carousel-next-button' )
		.appendTo( this.$wrap )
	;

	this.$element.addClass( 'loaded' );

	this.$firstSlide = this.$slides.eq( 0 );

	this.refresh();
	this.bindEvents();

	if( this.options.autoplay ) {
		this.play();
	}
};

Carousel.prototype.destroy = function() {
	// destroy
};

Carousel.prototype.bindEvents = function() {

	var that = this;

	$( window ).resize( function() {
		that.refresh();
	} );

	this.$prevButton.click( function() {
		that.goToPrevious();
		that.pause();
	} );

	this.$nextButton.click( function() {
		that.goToNext();
		that.pause();
	} );

	$( document ).keydown( function( e ) {
		if( e.keyCode === 37 ) {
			that.goToPrevious();
			that.pause();
		}
		else if( e.keyCode === 39 ) {
			that.goToNext();
			that.pause();
		}
	} );

	if( this.options.touchEvents ) {

		var originalTranslateX,
			startPosX
		;

		this.$wrap.bind( 'touchstart', function( e ) {
			var event = e.originalEvent.changedTouches[ 0 ];
			originalTranslateX = that.translateX;
			startPosX = event.clientX;
		} );

		this.$wrap.bind( 'touchmove', function( e ) {
			var event = e.originalEvent.changedTouches[ 0 ];
			that.dragDistance = event.clientX - startPosX;
			that.setTranslateX( originalTranslateX + ( that.dragDistance ) );
			e.preventDefault();
		} );

		this.$wrap.bind( 'touchend', function( e ) {
			that.adjustScrollPosition();
			that.dragDistance = 0;
		} );
	}
};

Carousel.prototype.setTranslateX = function( n ) {

	this.translateX = n;
	this.$element.css( {
		'transform': 'translateX( ' + this.translateX + 'px )',
		'-moz-transform': 'translateX( ' + this.translateX + 'px )',
		'-webkit-transform': 'translateX( ' + this.translateX + 'px )'
	} );
};

Carousel.prototype.adjustScrollPosition = function() {

	if( this.dragDistance < 0 ) {
		this.goToNext();
	}

	if( this.dragDistance > 0 ) {
		this.goToPrevious();
	}
};

Carousel.prototype.refresh = function() {

	var that = this;

	this.activeIndex = 0;

	clearTimeout( this.timeout );

	this.$wrap.attr( 'style', '' );
	this.$slides.attr( 'style', '' );
	this.$element.attr( 'style', '' );

	this.elementWidth = this.$element[0].getBoundingClientRect().width;
	this.slideWidth = this.$firstSlide[0].getBoundingClientRect().width;
	this.slideHeight = this.$firstSlide[0].getBoundingClientRect().height;

	this.$wrap.css( {
		position: 'relative',
		overflow: 'hidden',
		height: this.slideHeight
	} );

	this.amountVisible = Math.ceil( this.elementWidth / this.slideWidth );

	this.totalWidth = ( this.amountOfSlides * this.slideWidth );

	this.timeout = setTimeout( function() {
		that.$element.css( {
			width: that.totalWidth
		} );

		that.$slides.css( {
			float: 'left',
			width: that.slideWidth
		} );

		that.$wrap.css( {
			width: that.elementWidth
		} );

	}, 500 );

	this.refreshButtons();
};

Carousel.prototype.refreshButtons = function() {

	var restSlides = this.amountOfSlides - this.activeIndex;

	this.$prevButton.removeClass( 'hide' );
	this.$nextButton.removeClass( 'hide' );

	if( this.activeIndex === 0 ) {
		this.$prevButton.addClass( 'hide' );
	}

	if( restSlides <= this.amountVisible ) {
		this.$nextButton.addClass( 'hide' );
	}
};

Carousel.prototype.goToNext = function() {

	this.goTo( this.activeIndex + 1 );

};

Carousel.prototype.goToPrevious = function() {

	this.goTo( this.activeIndex - 1 );

};

Carousel.prototype.goTo = function( n ) {

	var restSlides = this.amountOfSlides - n;

	if( restSlides >= this.amountVisible && n >= 0 ) {

		this.activeIndex = n;
		this.setTranslateX( -( this.activeIndex * this.slideWidth ) );
		this.refreshButtons();
	}
};

Carousel.prototype.play = function() {

	var that = this;

	this.playInterval = setInterval( function() {

		that.goToNext();

	}, this.options.playInterval );

};

Carousel.prototype.pause = function() {

	clearInterval( this.playInterval );

};

module.exports = Carousel;