/*

tnt-carousel
------------

Author: Rein Van Oyen <rein@tnt.be>
Website: http://www.tnt.be
Repo: http://github.com/ReinVO/tnt-carousel
Issues: http://github.com/ReinVO/tnt-carousel/issues

*/

"use strict";

var utils = require( './utils.js' );

var Carousel = function( element, options ) {

	options = options || {};

	this.options = {};
	this.options.autoplay = options.autoplay || false;
	this.options.playInterval = options.playinterval || 4000;
	this.options.touchEvents = options.touchEvents || true;
	this.options.arrowButtons = options.arrowButtons || true;
	this.options.previousArrowClass = options.previousArrowClass || 'carousel-prev-button';
	this.options.nextArrowClass = options.nextArrowClass || 'carousel-next-button';
	this.options.loadedClass = options.loadedClass || 'loaded';
	this.options.activeSlideClass = options.activeSlideClass || 'active';
	this.options.thresshold = options.thresshold || 'thresshold';

	this._element = element;
	this._slides = this._element.children;

	this.amountOfSlides = this._slides.length;

	this.activeSlideIndex = 0;
	this.translateX = 0;
	this.dragDistance = 0;
	this.dragDuration = 0;
	this.isBuilt = false;

	this.build();
	/*
	var that = this;

	utils.loadImages( this.$element.find( 'img' ), function() {
		that.build();
	} );
	*/
};

Carousel.prototype.build = function() {

	if( ! this.isBuilt ) {

		this._wrap = document.createElement( 'div' );
		this._element.parentElement.appendChild( this._wrap );
		this._wrap.appendChild( this._element );

		this._element.classList.add( this.options.loadedClass );
		this._firstSlide = this._slides[ 0 ];

		if( this.options.arrowButtons ) {

			this._prevButton = document.createElement( 'button' );
			this._prevButton.classList.add( this.options.previousArrowClass );
			
			this._nextButton = document.createElement( 'button' );
			this._nextButton.classList.add( this.options.nextArrowClass );

			this._wrap.appendChild( this._prevButton );
			this._wrap.appendChild( this._nextButton );
		}

		this.refresh();
		this.bindEvents();

		if( this.options.autoplay ) {
			this.play();
		}

		this.isBuilt = true;
	}

};

Carousel.prototype.destroy = function() {

	if( this.isBuilt ) {
		
		/*
		this.$element.unwrap();
		this.$element.removeClass( this.options.loadedClass );

		this.$slides.removeAttr( 'style' );
		this.$element.removeAttr( 'style' );

		if( this.options.arrowButtons ) {

			this.$prevButton.remove();
			this.$nextButton.remove();
		}

		this.$slides.removeClass( this.options.activeSlideClass );

		this.pause();
		this.unbindEvents();

		this.isBuilt = false;
		*/
	}
};

Carousel.prototype.bindEvents = function() {

	var that = this;

	var refresh = this.refresh;

	window.addEventListener( 'refresh', refresh );

	if( this.options.arrowButtons ) {

		this._prevButton.addEventListener( 'click', function() {
			that.goToPrevious();
			that.pause();
		} );

		this._nextButton.addEventListener( 'click', function() {
			that.goToNext();
			that.pause();
		} );
	}

	document.addEventListener( 'keydown', function( e ) {
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

		this._wrap.addEventListener( 'touchstart', function( e ) {
			var event = e.changedTouches[ 0 ];
			originalTranslateX = that.translateX;
			startPosX = event.clientX;
			startTime = Date.now();
			that.setTransitionTimingFunction( 'ease' );
		} );

		this._wrap.addEventListener( 'touchmove', function( e ) {
			var event = e.changedTouches[ 0 ];
			that.dragDistance = event.clientX - startPosX;
			that.setTranslateX( originalTranslateX + ( that.dragDistance ) );
			e.preventDefault();
		} );

		this._wrap.addEventListener( 'touchend', function( e ) {
			that.setTransitionTimingFunction( '' );
			that.dragDuration = ( Date.now() - startTime );
			that.adjustScrollPosition();
			that.dragDistance = 0;
			that.dragDuration = 0;
		} );
	}
};

Carousel.prototype.unbindEvents = function() {
	/*
	$( window ).unbind( 'resize' );
	$( document ).unbind( 'keydown' );
	*/
};

Carousel.prototype.setTransitionTimingFunction = function( easing ) {

	this._element.style.transitionTimingFunction = easing;
	this._element.style.mozTransitionTimingFunction = easing;
	this._element.style.webkitTransitionTimingFunction = easing;
};

Carousel.prototype.setTransitionDuration = function( n ) {

	this._element.style.transitionDuration = n + 'ms';
	this._element.style.mozTransitionDuration = n + 'ms';
	this._element.style.webkitTransitionDuration = n + 'ms';
};

Carousel.prototype.setTranslateX = function( n ) {

	this.translateX = n;

	this._element.style.transform = 'translate3d('+this.translateX+'px, 0, 0)';
	this._element.style.mozTransform = 'translate3d('+this.translateX+'px, 0, 0)';
	this._element.style.webkitTransform = 'translate3d('+this.translateX+'px, 0, 0)';
};

Carousel.prototype.adjustScrollPosition = function() {

	var absoluteDistance = Math.abs( this.dragDistance );

	if( absoluteDistance >  ( this.slideWidth * this.options.thresshold ) ) {

		var speed = ( this.dragDuration / absoluteDistance );
	
		this.setTransitionDuration( speed * 1000 );

		var amountOfSlidesDragged = Math.ceil( absoluteDistance / this.slideWidth );

		if( this.dragDistance < 0 ) {
			if( this.isOnRightEdge ) {
				this.goTo( this.amountOfSlides - 1 );
			}
			else {
				this.goTo( this.activeSlideIndex + amountOfSlidesDragged );
			}
		}

		if( this.dragDistance > 0 ) {
			if( this.isOnLeftEdge ) {
				this.goTo( 0 );
			}
			else {
				this.goTo( this.activeSlideIndex - amountOfSlidesDragged );
			}
		}
	}
	else {
		this.goTo( this.activeSlideIndex );
	}
};

Carousel.prototype.refresh = function() {

	this.activeSlideIndex = 0;

	for( var i = 0; i < this._slides.length; i++ ) {
		this._slides[ i ].removeAttribute( 'style' );
	}

	this._wrap.removeAttribute( 'style' );
	this._element.removeAttribute( 'style' );

	this.elementWidth = this._element.offsetWidth;
	this.slideWidth = this._firstSlide.offsetWidth;
	this.slideHeight = this._firstSlide.offsetHeight;
	this.amountVisible = Math.ceil( this.elementWidth / this.slideWidth );
	this.totalWidth = ( this.amountOfSlides * this.slideWidth );

	/*
	this.$wrap.css( {
		position: 'relative',
		overflow: 'hidden',
		height: this.slideHeight
	} );

	this.$element.css( {
		width: this.totalWidth
	} );

	this.$slides.css( {
		float: 'left',
		width: this.slideWidth
	} );

	this.$wrap.css( {
		width: this.elementWidth
	} );
	*/

	this._wrap.style.width = this.elementWidth + 'px';
	this._wrap.style.position = 'relative';
	this._wrap.style.overflow = 'hidden';
	this._wrap.style.height = this.slideHeight + 'px';
	this._wrap.style.width = this.elementWidth + 'px';

	this._element.style.width = this.totalWidth;

	for( var i = 0; i < this._slides.length; i++ ) {
		this._slides[ i ].style.float = 'left';
		this._slides[ i ].style.width = this.slideWidth + 'px';
	}

	this.refreshState();
};

Carousel.prototype.refreshState = function() {

	for( var i = 0; i < this._slides.length; i++ ) {
		this._slides[ i ].classList.remove( this.options.activeSlideClass );
	}

	this._slides[ this.activeSlideIndex ].classList.add( this.options.activeSlideClass );

	this.isOnLeftEdge = ( this.activeSlideIndex === 0 );

	var restSlides = this.amountOfSlides - this.activeSlideIndex;
	this.isOnRightEdge = ( restSlides <= this.amountVisible );

	this.refreshButtons();
};

Carousel.prototype.refreshButtons = function() {

	if( this.options.arrowButtons ) {

		this._prevButton.classList.remove( 'hide' );
		this._nextButton.classList.remove( 'hide' );

		if( this.isOnLeftEdge ) {
			this._prevButton.classList.add( 'hide' );
		}

		if( this.isOnRightEdge ) {
			this._nextButton.classList.add( 'hide' );
		}
	}
};

Carousel.prototype.goToNext = function() {

	this.goTo( this.activeSlideIndex + 1 );
};

Carousel.prototype.goToPrevious = function() {

	this.goTo( this.activeSlideIndex - 1 );
};

Carousel.prototype.goTo = function( n ) {

	if( n >= 0 && n < this.amountOfSlides ) {

		this.activeSlideIndex = n;

		var translateX = Math.max( -( this.activeSlideIndex * this.slideWidth ), -( this.totalWidth - this.elementWidth ) );
		translateX = Math.min( 0, translateX );

		this.setTranslateX( translateX );
		this.refreshState();
	}

	if( n < 0 ) {
		this.goTo( 0 );
	}

	if( n >= this.amountOfSlides ) {
		this.goTo( this.amountOfSlides - 1 );
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
