/*

TNT CAROUSEL
------------

Author: Rein Van Oyen <rein@tnt.be>
Website: http://www.tnt.be
Repo: http://github.com/ReinVO/tnt-carousel
Issues: http://github.com/ReinVO/tnt-carousel/issues

*/

"use strict";

var $ = require( 'jquery' );
var utils = require( './utils.js' );

var Carousel = function( $element, options ) {

	var that = this;

	this.options = {
		autoplay: false,
		playInterval: 4000,
		touchEvents: true,
		arrowButtons: true,
		thresshold: .1
	};

	$.extend( this.options, options );

	this.$element = $element;
	this.$slides = this.$element.children();
	this.$images = this.$element.find( 'img' );

	this.amountOfSlides = this.$slides.length;
	this.activeIndex = 0;
	this.translateX = 0;
	this.dragDistance = 0;
	this.dragDuration = 0;

	utils.loadImages( this.$images, function() {
		that.build();
	} );
};

Carousel.prototype.build = function() {

	this.$wrap = this.$element.wrap( '<div>' ).parent();

	this.$element.addClass( 'loaded' );

	this.$firstSlide = this.$slides.eq( 0 );

	if( this.options.arrowButtons ) {

		this.$prevButton = $( '<button>' )
			.addClass( 'carousel-prev-button' )
			.appendTo( this.$wrap )
		;

		this.$nextButton = $( '<button>' )
			.addClass( 'carousel-next-button' )
			.appendTo( this.$wrap )
		;
	}

	this.refresh();
	this.bindEvents();

	if( this.options.autoplay ) {
		this.play();
	}
};

Carousel.prototype.destroy = function() {

	this.$element.unwrap();
	this.$element.removeClass( 'loaded' );

	this.$slides.attr( 'style', '' );
	this.$element.attr( 'style', '' );

	if( this.options.arrowButtons ) {

		this.$prevButton.remove();
		this.$nextButton.remove();
	}

	this.pause();
	this.unbindEvents();
};

Carousel.prototype.bindEvents = function() {

	var that = this;

	$( window ).resize( function() {
		that.refresh();
	} );

	if( this.options.arrowButtons ) {

		this.$prevButton.click( function() {
			that.goToPrevious();
			that.pause();
		} );

		this.$nextButton.click( function() {
			that.goToNext();
			that.pause();
		} );
	}

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
			startPosX,
			startTime
		;

		this.$wrap.bind( 'touchstart', function( e ) {
			var event = e.originalEvent.changedTouches[ 0 ];
			originalTranslateX = that.translateX;
			startPosX = event.clientX;
			startTime = Date.now();
			that.setTransitionTimingFunction( 'linear' );
		} );

		this.$wrap.bind( 'touchmove', function( e ) {
			var event = e.originalEvent.changedTouches[ 0 ];
			that.dragDistance = event.clientX - startPosX;
			that.setTranslateX( originalTranslateX + ( that.dragDistance ) );
			e.preventDefault();
		} );

		this.$wrap.bind( 'touchend', function( e ) {
			that.setTransitionTimingFunction( '' );
			that.dragDuration = ( Date.now() - startTime );
			that.adjustScrollPosition();
			that.dragDistance = 0;
			that.dragDuration = 0;
		} );
	}
};

Carousel.prototype.unbindEvents = function() {

	$( window ).unbind( 'resize' );
	$( document ).unbind( 'keydown' );

};

Carousel.prototype.setTransitionTimingFunction = function( easing ) {
	this.$element.css( {
		'transition-timing-function': easing,
		'-moz-transition-timing-function': easing,
		'-webkit-transition-timing-function': easing
	} );
};

Carousel.prototype.setTransitionDuration = function( n ) {

	this.$element.css( {
		'transition-duration': n + 'ms',
		'-moz-transition-duration': n + 'ms',
		'-webkit-transition-duration': n + 'ms'
	} );
};

Carousel.prototype.setTranslateX = function( n ) {

	this.translateX = n;
	this.$element.css( {
		'transform': 'translate3d( ' + this.translateX + 'px, 0, 0 )',
		'-moz-transform': 'translate3d( ' + this.translateX + 'px, 0, 0 )',
		'-webkit-transform': 'translate3d( ' + this.translateX + 'px, 0, 0 )'
	} );
};

Carousel.prototype.adjustScrollPosition = function() {

	var absoluteDistance = Math.abs( this.dragDistance )

	if( absoluteDistance >  ( this.slideWidth * this.options.thresshold ) ) {

		var speed = ( this.dragDuration / absoluteDistance );
	
		this.setTransitionDuration( speed * 300 );

		var amountOfSlidesDragged = Math.ceil( absoluteDistance / this.slideWidth );

		if( this.dragDistance < 0 ) {
			if( this.isOnRightEdge ) {
				this.goTo( this.amountOfSlides - this.amountVisible );
			}
			else {
				this.goTo( this.activeIndex + amountOfSlidesDragged );
			}
		}

		if( this.dragDistance > 0 ) {
			if( this.isOnLeftEdge ) {
				this.goTo( 0 );
			}
			else {
				this.goTo( this.activeIndex - amountOfSlidesDragged );
			}
		}
	}
	else {
		this.goTo( this.activeIndex );
	}
};

Carousel.prototype.refresh = function() {

	var that = this;

	this.activeIndex = 0;

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

	this.refreshState();
	this.refreshButtons();
};

Carousel.prototype.refreshState = function() {
	this.isOnLeftEdge = ( this.activeIndex === 0 );

	var restSlides = this.amountOfSlides - this.activeIndex;
	this.isOnRightEdge = ( restSlides <= this.amountVisible );
};

Carousel.prototype.refreshButtons = function() {

	if( this.options.arrowButtons ) {

		this.$prevButton.removeClass( 'hide' );
		this.$nextButton.removeClass( 'hide' );

		if( this.isOnLeftEdge ) {
			this.$prevButton.addClass( 'hide' );
		}

		if( this.isOnRightEdge ) {
			this.$nextButton.addClass( 'hide' );
		}
	}
};

Carousel.prototype.goToNext = function() {

	this.goTo( this.activeIndex + 1 );

};

Carousel.prototype.goToPrevious = function() {

	this.goTo( this.activeIndex - 1 );

};

Carousel.prototype.goTo = function( n ) {

	if( n < 0 ) {
		this.goTo( 0 );
	}
	else if( n > ( this.amountOfSlides -this.amountVisible ) ) {
		this.goTo( this.amountOfSlides - this.amountVisible )
	}
	else {
		var restSlides = this.amountOfSlides - n;

		if( restSlides >= this.amountVisible && n >= 0 ) {
			this.activeIndex = n;
			this.setTranslateX( -( this.activeIndex * this.slideWidth ) );
			this.refreshState();
			this.refreshButtons();
		}
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